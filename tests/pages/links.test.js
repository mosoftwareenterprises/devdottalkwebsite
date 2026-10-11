import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { existsSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createNunjucksEnv } from '../helpers/nunjucks.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('links page', () => {
    it('renders exactly the requested destinations', () => {
        const templatePath = join(projectRoot, 'src', 'links.njk');

        if (!existsSync(templatePath)) {
            expect(existsSync(templatePath)).toBe(true);
            return;
        }

        const template = readFileSync(templatePath, 'utf8')
            .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
        const html = createNunjucksEnv().renderString(template);
        const { document } = new JSDOM(html).window;
        const actualLinks = Array.from(document.querySelectorAll('ul a')).map(anchor => [
            anchor.textContent.trim(),
            anchor.getAttribute('href')
        ]);

        expect(document.querySelector('h1')?.textContent.trim()).toBe('Links');
        expect(actualLinks).toEqual([
            ['Events Calendar', '/calendar'],
            ['YouTube', '/youtube'],
            ['Discord', '/discord'],
            ['LinkedIn', '/linkedin'],
            ['Bluesky', '/bluesky'],
            ['Ko-fi', '/support-us']
        ]);
    });

    it('rewrites the short route to the generated page', () => {
        const configPath = join(projectRoot, 'src', 'staticwebapp.config.json');
        const config = JSON.parse(readFileSync(configPath, 'utf8'));
        const linksRoute = config.routes.find(route => route.route === '/links');

        expect(linksRoute).toMatchObject({ route: '/links', rewrite: '/links.html' });
    });
});