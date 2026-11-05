import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('speaker-session.css triple layout', () => {
    const css = readFileSync('src/speaker-session.css', 'utf8');

    it('uses 30rem max columns for the triple grid', () => {
        expect(css).toMatch(/\.speaker-session-speakers--triple\s*{[^}]*repeat\(3, minmax\(0, 30rem\)\)/);
    });

    it('crops triple headshots to the middle third', () => {
        expect(css).toMatch(/\.speaker-session-speakers--triple \.speaker-headshot\s*{[^}]*margin:\s*0 0 0 -50%[^}]*width:\s*200%/);
        expect(css).toMatch(/\.speaker-session-speakers--triple \.speaker-session-image-link\s*{[^}]*overflow:\s*hidden/);
    });

    it('keeps a single 12rem column on small screens', () => {
        expect(css).toMatch(/max-width: 700px\)\s*{\s*\.speaker-session-speakers--triple\s*{[^}]*minmax\(0, 12rem\)/);
    });
});
