import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';
import {
    generateSpeakerCardImages,
    getSpeakerCardRecords,
    speakerCardHtml
} from '../../lib/generate-speaker-card-images.js';

const sessions = [{
    id: 47,
    eventID: 23,
    title: 'A Talk About Local AI',
    firstSpeakerName: 'Alex Example',
    firstSpeakerJobTitle: 'Principal Engineer',
    firstSpeakerBioPicUrl: '',
    firstSpeakerTileImageLocation: '',
    secondSpeakerName: 'Sam Example',
    secondSpeakerJobTitle: 'AI Engineer',
    secondSpeakerBioPicUrl: '',
    secondSpeakerTileImageLocation: ''
}];

const events = [{ id: 23, displayDate: 'November 25th 2026', sessionIDs: [47] }];

describe('speaker-card PNG generator', () => {
    it('installs dependencies and Chromium in CI before building and testing', async () => {
        const workflow = await fs.readFile('.github/workflows/azure-static-web-apps-yellow-plant-0da666103.yml', 'utf8');

        expect(workflow).toMatch(/mise exec -- npm ci[\s\S]*playwright install --with-deps chromium[\s\S]*mise run build[\s\S]*mise run test/);
    });

    it('creates one record per populated speaker with the event date', () => {
        const records = getSpeakerCardRecords(sessions, events);

        expect(records).toHaveLength(2);
        expect(records[0]).toMatchObject({
            sessionId: 47,
            date: 'November 25th',
            name: 'Alex Example',
            speakerPosition: 'First',
            monthFolder: 'november',
            year: '2026'
        });
        expect(records[1]).toMatchObject({
            name: 'Sam Example',
            speakerPosition: 'Second'
        });
    });

    it('ignores placeholder speakers', () => {
        const records = getSpeakerCardRecords([
            { ...sessions[0], firstSpeakerName: 'It could be you!' }
        ], events);

        expect(records).toHaveLength(1);
        expect(records[0].name).toBe('Sam Example');
    });

    it('ignores Lean Coffee sessions', () => {
        const records = getSpeakerCardRecords([
            { ...sessions[0], title: 'Lean Coffee Session' }
        ], events);

        expect(records).toHaveLength(0);
    });

    it('does not generate speaker cards for allocated sessions', () => {
        const records = getSpeakerCardRecords([
            { ...sessions[0], title: 'ALLOCATED - details to follow' }
        ], events);

        expect(records).toHaveLength(0);
    });

    it('renders reusable card content with the real card markup', async () => {
        const html = await speakerCardHtml(getSpeakerCardRecords(sessions, events)[0], process.cwd());

        expect(html).toContain('A Talk About Local AI');
        expect(html).toContain('Alex Example');
        expect(html).toContain('November 25th Speaker');
        expect(html).toContain('class="event-speaker-card-logo"');
    });

    it('applies the event card layout to generated image markup', async () => {
        const css = await fs.readFile('src/speaker-card.css', 'utf8');
        const html = await speakerCardHtml(getSpeakerCardRecords(sessions, events)[0], process.cwd(), css);
        const browser = await chromium.launch({ headless: true });
        try {
            const page = await browser.newPage();
            await page.setContent(html);
            const layout = await page.locator('figure').evaluate(card => ({
                containerType: getComputedStyle(card).containerType,
                logoPosition: getComputedStyle(card.querySelector('[role="img"]')).position
            }));
            expect(layout).toEqual({ containerType: 'inline-size', logoPosition: 'absolute' });
        } finally {
            await browser.close();
        }
    });

    it('writes padded PNG files that include the extended frame border', async () => {
        const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'speaker-cards-'));
        const files = await generateSpeakerCardImages({
            sessions,
            events,
            sourceRoot: process.cwd(),
            outputRoot
        });
        const metadata = await sharp(path.join(outputRoot, files[0])).metadata();

        expect(files).toHaveLength(2);
        expect(files[0]).toContain('images/2026/november/First Speaker image - November 2026.png');
        expect(files[1]).toContain('images/2026/november/Second Speaker image - November 2026.png');
        expect(metadata.width).toBe(583);
        expect(metadata.height).toBe(792);
    });

    it('does not rewrite unchanged images on subsequent builds', async () => {
        const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'speaker-cards-watch-'));
        try {
            const options = { sessions, events, sourceRoot: process.cwd(), outputRoot };
            const files = await generateSpeakerCardImages(options);
            const outputFile = path.join(outputRoot, files[0]);
            const oldTime = new Date('2020-01-01T00:00:00Z');
            await fs.utimes(outputFile, oldTime, oldTime);

            await generateSpeakerCardImages(options);

            expect((await fs.stat(outputFile)).mtimeMs).toBe(oldTime.getTime());

            const changedSessions = [{ ...sessions[0], firstSpeakerJobTitle: 'Updated Role' }];
            await generateSpeakerCardImages({ ...options, sessions: changedSessions });

            expect((await fs.stat(outputFile)).mtimeMs).toBeGreaterThan(oldTime.getTime());
        } finally {
            await fs.rm(outputRoot, { recursive: true, force: true });
        }
    });
});