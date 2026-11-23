import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
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

    it('renders reusable card content with the real card markup', async () => {
        const html = await speakerCardHtml(getSpeakerCardRecords(sessions, events)[0], process.cwd());

        expect(html).toContain('A Talk About Local AI');
        expect(html).toContain('Alex Example');
        expect(html).toContain('November 25th Speaker');
        expect(html).toContain('class="speaker-card-logo"');
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
});