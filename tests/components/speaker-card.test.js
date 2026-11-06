import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { renderMacro } from '../helpers/nunjucks.js';

describe('speaker-card component', () => {
    const templatePath = '_includes/speaker-card.njk';
    const macroName = 'speakerCard';
    const args = ['November 25th', 'My Talk', 'Kevin Ocansey', 'AI Engineer', '/img/kevin.jpg'];

    it('renders date, title, name, role and image', () => {
        const html = renderMacro(templatePath, macroName, args);

        expect(html).toContain('November 25th Speaker');
        expect(html).toContain('My Talk');
        expect(html).toContain('Kevin Ocansey');
        expect(html).toContain('AI Engineer');
        expect(html).toContain('src="/img/kevin.jpg"');
        expect(html).toContain('class="speaker-card-portrait"');
    });

    it('renders a placeholder when no image is given', () => {
        const html = renderMacro(templatePath, macroName, [...args.slice(0, 4)]);

        expect(html).toContain('speaker-card-image-placeholder');
        expect(html).not.toContain('<img');
    });

    it('ships a stylesheet linked from the layout', () => {
        const css = readFileSync('src/speaker-card.css', 'utf8');
        const layout = readFileSync('src/_includes/layout.njk', 'utf8');

        expect(css).toContain('.speaker-card');
        expect(css).toMatch(/\.speaker-card\s*\{[^}]*overflow:\s*visible;/s);
        expect(css).toMatch(/\.speaker-card::before\s*\{[^}]*inset:\s*0 -2\.5cqw;/s);
        expect(css).toMatch(/\.speaker-card::before\s*\{[^}]*border:\s*1cqw solid/s);
        expect(css).toMatch(/\.speaker-card-brace\s*\{[^}]*font-weight:\s*700;/s);
        expect(css).toMatch(/\.speaker-card-brace\s*\{[^}]*transform:\s*scaleY\(0\.8\);/s);
        expect(css).toMatch(/\.speaker-card-photo\s*\{[^}]*border-radius:\s*50% 50% 0 50%;/s);
        expect(css).toMatch(/\.speaker-card-portrait\s*\{[^}]*border-radius:\s*50%;/s);
        expect(css).toMatch(/\.speaker-card-name,\s*\.speaker-card-role\s*\{[^}]*flex:\s*1;[^}]*font-weight:\s*800;/s);
        expect(css).toMatch(/\.speaker-card-title\s*\{[^}]*width:\s*93cqw;/s);
        expect(css).toMatch(/\.speaker-card-meta\s*\{[^}]*width:\s*93cqw;/s);
        expect(css).toContain('max-width: 370px');
        expect(layout).toContain('/speaker-card.css');
    });
});
