import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', '..', 'src');
const sessions = JSON.parse(readFileSync(join(srcDir, '_data', 'sessions.json'), 'utf8'));

const imageFields = ['BioPicUrl', 'TileImageLocation'];
const roles = ['first', 'second', 'third'];

const references = [];
for (const session of sessions) {
    for (const role of roles) {
        for (const field of imageFields) {
            const key = `${role}Speaker${field}`;
            const value = (session[key] || '').trim();
            if (value) {
                references.push({ id: session.id, key, value });
            }
        }
    }
}

describe('sessions image files', () => {
    it('references at least one image', () => {
        expect(references.length).toBeGreaterThan(0);
    });

    it('has every referenced bio pic and tile image on disk', () => {
        const missing = references
            .filter(({ value }) => !existsSync(join(srcDir, decodeURI(value.replace(/^\//, '')))))
            .map(({ id, key, value }) => `session ${id} ${key}: ${value}`);

        expect(missing).toEqual([]);
    });
});
