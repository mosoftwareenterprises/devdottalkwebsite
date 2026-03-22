import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { createNunjucksEnv } from '../helpers/nunjucks.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createLayoutDom() {
  const env = createNunjucksEnv({
    content: '<p>Test content</p>',
    hideNextEventBanner: true,
    hideMainLogo: false,
    includeBlueskyPosts: false,
    title: 'Test page'
  });
  const templatePath = join(__dirname, '..', '..', 'src', '_includes', 'layout.njk');
  const templateContent = readFileSync(templatePath, 'utf8').replace(/{%\s*include\s+"[^"]+"\s*%}/g, '');
  const html = env.renderString(templateContent);

  const scriptMatch = html.match(/<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);\s*<\/script>/);

  if (!scriptMatch) {
    throw new Error('Could not find navigation script in layout template.');
  }

  const scriptContent = scriptMatch[0]
    .replace(/^<script>/, '')
    .replace(/<\/script>$/, '');

  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  dom.window.eval(scriptContent);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));

  return dom;
}

describe('layout navigation menu', () => {
  it('closes the menu when clicking outside the nav bar', () => {
    const dom = createLayoutDom();
    const { document } = dom.window;
    const navBar = document.getElementById('site-nav-bar');
    const navToggle = document.querySelector('.site-nav-toggle');

    navToggle.click();

    expect(navBar.classList.contains('is-open')).toBe(true);
    expect(navToggle.getAttribute('aria-expanded')).toBe('true');

    document.body.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(navBar.classList.contains('is-open')).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
  });
});