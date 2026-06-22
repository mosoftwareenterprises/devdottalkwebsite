import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const locationPagesFromMay2026 = [
    '2026-may-location-info.md',
    '2026-june-location-info.md',
    '2026-july-location-info.md',
    '2027-january-location-info.md',
    '2027-february-location-info.md',
    '2027-march-location-info.md',
    '2027-april-location-info.md',
    '2027-may-location-info.md',
    '2027-june-location-info.md',
    '2027-july-location-info.md',
    '2027-september-location-info.md',
    '2027-october-location-info.md',
    '2027-november-location-info.md',
    '2027-december-location-info.md'
];

describe('location pages from May 2026 onward', () => {
    it('support rendering at least two speaker sessions', () => {
        for (const pageFile of locationPagesFromMay2026) {
            const pagePath = join(__dirname, '..', '..', 'src', pageFile);
            const content = readFileSync(pagePath, 'utf8');

            const speakerSessionCallCount = (content.match(/\{\{\s*speakerSession\(/g) || []).length;
            const usesSessionLoop = content.includes('{% for sessionId in currentEvent.sessionIDs %}');

            expect(
                speakerSessionCallCount >= 2 || usesSessionLoop,
                `${pageFile} should include at least two speakerSession blocks or loop over sessionIDs`
            ).toBe(true);
        }
    });
});
