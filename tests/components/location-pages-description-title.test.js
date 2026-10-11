import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', '..', 'src');
const events = JSON.parse(readFileSync(join(srcDir, '_data', 'events.json'), 'utf8'));

function getFrontmatterValue(content, key) {
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) return undefined;
    const line = frontmatter[1].split(/\r?\n/).find((l) => l.startsWith(`${key}:`));
    if (!line) return undefined;
    const raw = line.slice(key.length + 1).trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
        return JSON.parse(raw);
    }
    return raw.replace(/^'(.*)'$/, '$1');
}

const locationPages = readdirSync(srcDir)
    .filter((f) => /^\d{4}-[a-z]+-location-info\.md$/.test(f))
    .map((file) => {
        const content = readFileSync(join(srcDir, file), 'utf8');
        return {
            file,
            eventId: Number(getFrontmatterValue(content, 'eventId')),
            description: getFrontmatterValue(content, 'description')
        };
    })
    .filter((page) => Number.isFinite(page.eventId));

describe('location page descriptions', () => {
    it('finds location pages with an eventId', () => {
        expect(locationPages.length).toBeGreaterThan(0);
    });

    for (const page of locationPages) {
        it(`${page.file} description includes the title of event ${page.eventId}`, () => {
            const event = events.find((e) => e.id === page.eventId);

            expect(event, `event ${page.eventId} not found in events.json`).toBeDefined();
            const tagline = event.title.replace(/^\{dev\.talk\}\s*-\s*/, '');

            expect(page.description.toLowerCase()).toContain(tagline.toLowerCase());
        });
    }
});
