import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const CARD_WIDTH = 527;
const CARD_HEIGHT = 764;
const HORIZONTAL_PADDING = 28;
const VERTICAL_PADDING = 14;
const EXPORT_WIDTH = CARD_WIDTH + HORIZONTAL_PADDING * 2;
const EXPORT_HEIGHT = CARD_HEIGHT + VERTICAL_PADDING * 2;
const CARD_CSS_PATH = 'speaker-card.css';

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
  const eventsById = new Map(events.map(event => [Number(event.id), event]));
  const records = [];

  for (const session of sessions) {
    if (session.title === 'Lean Coffee Session') continue;
    const event = eventsById.get(Number(session.eventID));
    const date = event?.displayDate ? event.displayDate.replace(/\s+\d{4}$/, '') : '';
    const speakers = [
      ['firstSpeakerName', 'firstSpeakerJobTitle', 'firstSpeakerBioPicUrl', 'firstSpeakerTileImageLocation'],
      ['secondSpeakerName', 'secondSpeakerJobTitle', 'secondSpeakerBioPicUrl', 'secondSpeakerTileImageLocation'],
      ['thirdSpeakerName', 'thirdSpeakerJobTitle', 'thirdSpeakerBioPicUrl', 'thirdSpeakerTileImageLocation']
    ];

    for (const [nameKey, roleKey, portraitKey, tileKey] of speakers) {
      if (session[nameKey] && !isPlaceholderSpeaker(session[nameKey])) {
        records.push({
          sessionId: session.id,
          date,
          title: session.title,
          name: session[nameKey],
          role: session[roleKey],
          image: session[portraitKey] || session[tileKey]
        });
      }
    }
  }

  return records;
}

export async function speakerCardHtml(record, sourceRoot, cardCss = '') {
  const image = await imageDataUri(record.image, sourceRoot);
  const imageMarkup = image
    ? `<img src="${image}" alt="${escapeHtml(record.name)}" class="speaker-card-portrait">`
    : '<div class="speaker-card-image speaker-card-image-placeholder" aria-hidden="true"></div>';

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
* { font-family: Arial, Helvetica, sans-serif; box-sizing: border-box; }
html, body { margin: 0; padding: 0; width: ${EXPORT_WIDTH}px; height: ${EXPORT_HEIGHT}px; overflow: hidden; background: #fff; }
${cardCss}
.speaker-card-export { width: ${EXPORT_WIDTH}px; height: ${EXPORT_HEIGHT}px; padding: ${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px; box-sizing: border-box; background: #fff; }
.speaker-card { width: ${CARD_WIDTH}px; max-width: none; height: ${CARD_HEIGHT}px; margin: 0; }
</style></head><body>
<div class="speaker-card-export">
<figure class="speaker-card">
  <div class="speaker-card-logo" role="img" aria-label="{dev.talk}">
    <span class="speaker-card-brace" aria-hidden="true">{</span>
    <span class="speaker-card-logo-dev" aria-hidden="true">dev</span>
    <span class="speaker-card-logo-dot" aria-hidden="true">.</span>
    <span class="speaker-card-logo-talk" aria-hidden="true">talk</span>
    <span class="speaker-card-brace" aria-hidden="true">}</span>
  </div>
  <p class="speaker-card-date">${escapeHtml(record.date)} Speaker</p>
  <p class="speaker-card-title">${escapeHtml(record.title)}</p>
  <div class="speaker-card-photo">${imageMarkup}</div>
  <div class="speaker-card-meta">
    <p class="speaker-card-name">${escapeHtml(record.name)}</p>
    <p class="speaker-card-role">${escapeHtml(record.role)}</p>
  </div>
</figure>
</div>
</body></html>`;
}

export async function generateSpeakerCardImages({ sessions, events, sourceRoot, outputRoot }) {
  const records = getSpeakerCardRecords(sessions, events);
  const outputDirectory = path.join(outputRoot, 'images', 'speaker-cards');
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
  await fs.rm(outputDirectory, { recursive: true, force: true });
  await fs.mkdir(outputDirectory, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: EXPORT_WIDTH, height: EXPORT_HEIGHT }, deviceScaleFactor: 1 });
    for (const record of records) {
      const filename = `session-${record.sessionId}-${slugify(record.name)}.png`;
      await page.setContent(await speakerCardHtml(record, sourceRoot, cardCss), { waitUntil: 'load' });
      await page.locator('.speaker-card-export').screenshot({ path: path.join(outputDirectory, filename) });
    }
  } finally {
    await browser.close();
  }

  return records.map(record => `images/speaker-cards/session-${record.sessionId}-${slugify(record.name)}.png`);
}
