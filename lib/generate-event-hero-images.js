import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { isAllocatedSession } from "./allocated-session.js";
import {
  escapeHtml,
  getEventLabels,
  imageDataUri,
  isPlaceholderSpeaker,
  writeFileIfChanged,
} from "./generate-speaker-card-images.js";

// 16:9 at 1280x720, rendered at 2x for a 2560x1440 PNG.
const HERO_WIDTH = 1280;
const HERO_HEIGHT = 720;
const SCALE = 2;

const SPEAKER_FIELDS = [
  [
    "firstSpeakerName",
    "firstSpeakerJobTitle",
    "firstSpeakerBioPicUrl",
    "firstSpeakerTileImageLocation",
  ],
  [
    "secondSpeakerName",
    "secondSpeakerJobTitle",
    "secondSpeakerBioPicUrl",
    "secondSpeakerTileImageLocation",
  ],
  [
    "thirdSpeakerName",
    "thirdSpeakerJobTitle",
    "thirdSpeakerBioPicUrl",
    "thirdSpeakerTileImageLocation",
  ],
];

export function getEventHeroRecords(sessions, events) {
  const sessionsById = new Map(
    sessions.map((session) => [Number(session.id), session])
  );
  const records = [];

  for (const event of events) {
    const eventSessions = [];

    for (const sessionId of event.sessionIDs || []) {
      const session = sessionsById.get(Number(sessionId));
      if (
        !session ||
        session.title === "Lean Coffee Session" ||
        isAllocatedSession(session)
      )
        continue;

      const speakers = SPEAKER_FIELDS.filter(
        ([nameKey]) =>
          session[nameKey] && !isPlaceholderSpeaker(session[nameKey])
      ).map(([nameKey, roleKey, portraitKey, tileKey]) => ({
        name: session[nameKey],
        role: session[roleKey],
        image: session[portraitKey] || session[tileKey],
      }));

      if (speakers.length)
        eventSessions.push({ title: session.title, speakers });
    }

    if (!eventSessions.length) continue;
    records.push({
      ...getEventLabels(event),
      date: event.displayDate,
      sessions: eventSessions,
    });
  }

  return records;
}

export function eventHeroFileName(record) {
  return `Hero image - ${record.month} ${record.year}.png`;
}

const TEMPLATE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "event-hero"
);

async function readTemplate(name) {
  return fs.readFile(path.join(TEMPLATE_DIR, name), "utf8");
}

// Values must already be HTML-escaped; unknown placeholders are left untouched. Whitespace inside {{ }} is tolerated for formatters.
function render(template, values) {
  return template.replace(/\{\s*\{\s*(\w+)\s*\}\s*\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}

// Hyphenated words stay whole so names only wrap at spaces.
function nameMarkup(name) {
  return escapeHtml(name)
    .split(" ")
    .map((word) =>
      word.includes("-") ? `<span class="hero-nowrap">${word}</span>` : word
    )
    .join(" ");
}

async function speakerMarkup(template, speaker, image) {
  const portrait = image
    ? `<img class="hero-portrait" src="${image}" alt="${escapeHtml(speaker.name)}">`
    : '<div class="hero-portrait hero-portrait-placeholder" aria-hidden="true"></div>';
  return render(template, {
    portrait,
    name: nameMarkup(speaker.name),
    role: escapeHtml(speaker.role),
  });
}

// Largest shared portrait that fits every speaker column.
function portraitSize(record) {
  const sessionCount = record.sessions.length;
  const speakerCount = record.sessions.reduce(
    (total, session) => total + session.speakers.length,
    0
  );
  const columnWidth =
    (HERO_WIDTH -
      96 -
      24 * (sessionCount - 1) -
      16 * (speakerCount - sessionCount)) /
    speakerCount;
  return Math.min(270, Math.floor(columnWidth - 12));
}

// Runs in the page: shrinks portraits until the sessions fit the space under the header.
function fitPortraits() {
  const hero = document.querySelector(".hero");
  const area = document.querySelector(".hero-sessions");
  const row = document.querySelector(".hero-sessions-row");
  let size = parseFloat(hero.style.getPropertyValue("--pic"));
  while (row.offsetHeight > area.clientHeight && size > 120) {
    size -= 4;
    hero.style.setProperty("--pic", `${size}px`);
  }
}

export async function eventHeroHtml(record, sourceRoot) {
  const [pageTemplate, sessionTemplate, speakerTemplate, css] =
    await Promise.all([
      readTemplate("event-hero.html"),
      readTemplate("session.html"),
      readTemplate("speaker.html"),
      readTemplate("event-hero.css"),
    ]);

  const sessionMarkup = [];
  for (const session of record.sessions) {
    const speakers = [];
    for (const speaker of session.speakers) {
      speakers.push(
        await speakerMarkup(
          speakerTemplate,
          speaker,
          await imageDataUri(speaker.image, sourceRoot)
        )
      );
    }
    sessionMarkup.push(
      render(sessionTemplate, {
        title: escapeHtml(session.title),
        speakers: speakers.join(""),
      })
    );
  }

  return render(pageTemplate, {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
    css,
    portraitSize: portraitSize(record),
    columns: record.sessions
      .map((session) => `minmax(0, ${session.speakers.length}fr)`)
      .join(" "),
    date: escapeHtml(record.date),
    sessions: sessionMarkup.join("\n"),
  });
}

export async function generateEventHeroImages({
  sessions,
  events,
  sourceRoot,
  outputRoot,
}) {
  const records = getEventHeroRecords(sessions, events);
  const relativePaths = records.map(
    (record) =>
      `images/${record.year}/${record.monthFolder}/${eventHeroFileName(record)}`
  );
  if (!records.length) return relativePaths;

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: HERO_WIDTH, height: HERO_HEIGHT },
      deviceScaleFactor: SCALE,
    });
    for (const [index, record] of records.entries()) {
      const outputPath = path.join(outputRoot, relativePaths[index]);
      console.log(`Generating event hero image for ${outputPath}`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await page.setContent(await eventHeroHtml(record, sourceRoot), {
        waitUntil: "load",
      });
      await page.evaluate(fitPortraits);
      await writeFileIfChanged(
        outputPath,
        await page.locator(".hero").screenshot()
      );
    }
  } finally {
    await browser.close();
  }

  return relativePaths;
}
