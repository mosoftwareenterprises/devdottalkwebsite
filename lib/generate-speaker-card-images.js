import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { isAllocatedSession } from './allocated-session.js';

const CARD_WIDTH = 527;
const CARD_HEIGHT = 764;
const HORIZONTAL_PADDING = 28;
const VERTICAL_PADDING = 14;
const EXPORT_WIDTH = CARD_WIDTH + HORIZONTAL_PADDING * 2;
const EXPORT_HEIGHT = CARD_HEIGHT + VERTICAL_PADDING * 2;
const CARD_CSS_PATH = 'speaker-card.css';
const SPEAKER_POSITIONS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];

function isPlaceholderSpeaker(name) {
  return String(name ?? '').trim().toLowerCase().replace(/[!?]+$/, '') === 'it could be you';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getEventLabels(event) {
    const parts = String(event?.displayDate ?? '').split(/\s+/);
    const month = parts[0] || 'Unknown';
    const year = parts[parts.length - 1] || 'Unknown';
    return { month, year, monthFolder: month.toLowerCase() };
}

async function imageDataUri(imagePath, sourceRoot) {
  if (!imagePath) return '';
  try {
    const absolutePath = path.join(sourceRoot, imagePath.replace(/^\//, ''));
    const buffer = await fs.readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();
    const mime = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    return '';
  }
}

export function getSpeakerCardRecords(sessions, events) {
    const sessionsById = new Map(sessions.map(session => [Number(session.id), session]));
  const records = [];

    for (const event of events) {
        const eventLabels = getEventLabels(event);
        let eventSpeakerNumber = 0;
        const eventSessions = (event.sessionIDs || [])
            .map(sessionId => sessionsById.get(Number(sessionId)))
            .filter(Boolean);

        for (const session of eventSessions) {
            if (session.title === 'Lean Coffee Session' || isAllocatedSession(session)) continue;
        const date = event.displayDate ? event.displayDate.replace(/\s+\d{4}$/, '') : '';
    const speakers = [
      ['firstSpeakerName', 'firstSpeakerJobTitle', 'firstSpeakerBioPicUrl', 'firstSpeakerTileImageLocation'],
      ['secondSpeakerName', 'secondSpeakerJobTitle', 'secondSpeakerBioPicUrl', 'secondSpeakerTileImageLocation'],
      ['thirdSpeakerName', 'thirdSpeakerJobTitle', 'thirdSpeakerBioPicUrl', 'thirdSpeakerTileImageLocation']
    ];

        for (const [speakerIndex, [nameKey, roleKey, portraitKey, tileKey]] of speakers.entries()) {
            if (session[nameKey] && !isPlaceholderSpeaker(session[nameKey])) {
            const speakerPosition = SPEAKER_POSITIONS[eventSpeakerNumber] || `Speaker ${eventSpeakerNumber + 1}`;
            eventSpeakerNumber += 1;
        records.push({
          sessionId: session.id,
            speakerPosition,
            ...eventLabels,
          date,
          title: session.title,
          name: session[nameKey],
          role: session[roleKey],
          image: session[portraitKey] || session[tileKey]
        });
      }
    }
  }
  }

  return records;
}

export async function speakerCardHtml(record, sourceRoot, cardCss = '') {
  const image = await imageDataUri(record.image, sourceRoot);
  const imageMarkup = image
    ? `<img src="${image}" alt="${escapeHtml(record.name)}" class="event-speaker-card-portrait">`
    : '<div class="event-speaker-card-image event-speaker-card-image-placeholder" aria-hidden="true"></div>';

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
* { font-family: Arial, Helvetica, sans-serif; box-sizing: border-box; }
html, body { margin: 0; padding: 0; width: ${EXPORT_WIDTH}px; height: ${EXPORT_HEIGHT}px; overflow: hidden; background: #fff; }
${cardCss}
.speaker-card-export { width: ${EXPORT_WIDTH}px; height: ${EXPORT_HEIGHT}px; padding: ${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px; box-sizing: border-box; background: #fff; }
.event-speaker-card { width: ${CARD_WIDTH}px; max-width: none; height: ${CARD_HEIGHT}px; margin: 0; }
</style></head><body>
<div class="speaker-card-export">
<figure class="event-speaker-card">
  <div class="event-speaker-card-logo" role="img" aria-label="{dev.talk}">
    <span class="event-speaker-card-brace" aria-hidden="true">{</span>
    <span class="event-speaker-card-logo-dev" aria-hidden="true">dev</span>
    <span class="event-speaker-card-logo-dot" aria-hidden="true">.</span>
    <span class="event-speaker-card-logo-talk" aria-hidden="true">talk</span>
    <span class="event-speaker-card-brace" aria-hidden="true">}</span>
  </div>
  <p class="event-speaker-card-date">${escapeHtml(record.date)} Speaker</p>
  <p class="event-speaker-card-title">${escapeHtml(record.title)}</p>
  <div class="event-speaker-card-photo">${imageMarkup}</div>
  <div class="event-speaker-card-meta">
    <p class="event-speaker-card-name">${escapeHtml(record.name)}</p>
    <p class="event-speaker-card-role">${escapeHtml(record.role)}</p>
  </div>
</figure>
</div>
</body></html>`;
}

export async function generateSpeakerCardImages({ sessions, events, sourceRoot, outputRoot }) {
    const records = getSpeakerCardRecords(sessions, events);
  const cssPaths = [
    path.join(sourceRoot, CARD_CSS_PATH),
    path.join(sourceRoot, 'src', CARD_CSS_PATH)
  ];
  let cardCss = '';
  for (const cssPath of cssPaths) {
    try {
      cardCss = await fs.readFile(cssPath, 'utf8');
      break;
    } catch {
      // Try the next supported source-root layout.
    }
  }
    if (!cardCss) throw new Error('Unable to locate src/speaker-card.css');

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: EXPORT_WIDTH, height: EXPORT_HEIGHT }, deviceScaleFactor: 1 });
    for (const record of records) {
        const outputDirectory = path.join(outputRoot, 'images', record.year, record.monthFolder);
        const filename = `${record.speakerPosition} Speaker image - ${record.month} ${record.year}.png`;
        await fs.mkdir(outputDirectory, { recursive: true });
      await page.setContent(await speakerCardHtml(record, sourceRoot, cardCss), { waitUntil: 'load' });
      const outputPath = path.join(outputDirectory, filename);
      const image = await page.locator('.speaker-card-export').screenshot();
      let existingImage;
      try {
        existingImage = await fs.readFile(outputPath);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      if (!existingImage || !image.equals(existingImage)) {
        await fs.writeFile(outputPath, image);
      }
    }
  } finally {
    await browser.close();
  }

    return records.map(record => `images/${record.year}/${record.monthFolder}/${record.speakerPosition} Speaker image - ${record.month} ${record.year}.png`);
}
