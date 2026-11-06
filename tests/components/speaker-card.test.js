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
        expect(layout).toContain('/speaker-card.css');
    });
});
