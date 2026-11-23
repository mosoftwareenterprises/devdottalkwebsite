import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('speaker-session.css triple layout', () => {
    const css = readFileSync('src/speaker-session.css', 'utf8');

    it('uses 30rem max columns for the triple grid', () => {
        expect(css).toMatch(/\.speaker-session-speakers--triple\s*{[^}]*repeat\(3, minmax\(0, 30rem\)\)/);
    });

    it('lays out reusable speaker cards in a centered wrapping row', () => {
        expect(css).toMatch(/\.speaker-session-cards\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center;/s);
        expect(css).toMatch(/\.speaker-session-cards\s*>\s*p:empty\s*\{[^}]*display:\s*none;/s);
    });

    it('lays paired and triple speaker cards out in matching columns', () => {
        expect(css).toMatch(/\.speaker-session-cards--paired\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/s);
        expect(css).toMatch(/\.speaker-session-cards--triple\s*\{[^}]*repeat\(3, minmax\(0, 1fr\)\)/s);
        expect(css).toMatch(/\.speaker-session-cards--triple\s*\{[^}]*gap:\s*1\.5rem;/s);
    });

    it('left-aligns speaker details to the card panels', () => {
        expect(css).toMatch(/\.speaker-session-copy-speakers\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;[^}]*margin:\s*0 0 0\.75rem;[^}]*text-align:\s*left;/s);
        expect(css).toMatch(/\.speaker-session-copy-speaker\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;[^}]*margin:\s*0;/s);
        expect(css).toMatch(/\.speaker-session-copy-speakers--paired\s*\{[^}]*gap:\s*1rem;/s);
        expect(css).toMatch(/\.speaker-session-copy-speakers--triple\s*\{[^}]*gap:\s*1\.5rem;/s);
    });

    it('left-aligns the session title', () => {
        expect(css).toMatch(/\.speaker-session-copy h4\s*\{[^}]*text-align:\s*left;/s);
        expect(css).toMatch(/\.speaker-session-copy h4\s*\{[^}]*color:\s*#1b9aa5;[^}]*font-size:\s*1\.5rem;[^}]*font-weight:\s*800;/s);
    });

    it('hides empty Markdown paragraphs inside speaker detail grids', () => {
        expect(css).toMatch(/\.speaker-session-copy-speakers\s*>\s*p:empty,\s*\.speaker-session-copy-speaker\s*>\s*p:empty\s*\{[^}]*display:\s*none;/s);
        expect(css).toMatch(/\.speaker-session-copy-speaker\s*>\s*p\s*\{[^}]*margin:\s*0;/s);
    });

    it('stacks triple speaker cards on small screens', () => {
        expect(css).toMatch(/max-width:\s*700px\)[\s\S]*\.speaker-session-cards--triple\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
    });

    it('crops triple headshots to the middle third', () => {
        expect(css).toMatch(/\.speaker-session-speakers--triple \.speaker-headshot\s*{[^}]*margin:\s*0 0 0 -50%[^}]*width:\s*200%/);
        expect(css).toMatch(/\.speaker-session-speakers--triple \.speaker-session-image-link\s*{[^}]*overflow:\s*hidden/);
    });

    it('keeps a single 12rem column on small screens', () => {
        expect(css).toMatch(/max-width: 700px\)\s*{\s*\.speaker-session-speakers--triple\s*{[^}]*minmax\(0, 12rem\)/);
    });
});
