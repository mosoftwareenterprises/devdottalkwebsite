import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { createNunjucksEnv } from '../helpers/nunjucks.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createLayoutDom(overrides = {}) {
  const env = createNunjucksEnv({
    content: '<p>Test content</p>',
    hideNextEventBanner: true,
    hideMainLogo: false,
    includeBlueskyPosts: false,
    title: 'Test page',
    ...overrides
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
  it('includes the events calendar link in the primary navigation', () => {
    const dom = createLayoutDom();
    const { document } = dom.window;
    const calendarLink = document.querySelector('#primary-nav a[href="/calendar"]');

    expect(calendarLink).not.toBeNull();
    expect(calendarLink?.textContent?.trim()).toBe('Events Calendar');
  });

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

  it('shows cancelled badge over logo when current event is cancelled', () => {
    const dom = createLayoutDom({
      eventId: 19,
      events: {
        findById: () => ({ id: 19, isCancelled: true })
      }
    });
    const { document } = dom.window;

    const cancelledBadge = document.querySelector('.site-logo-cancelled-badge');
    expect(cancelledBadge).not.toBeNull();
    expect(cancelledBadge?.textContent?.trim()).toBe('Cancelled');
  });

  it('does not show cancelled badge when event is not cancelled', () => {
    const dom = createLayoutDom({
      eventId: 21,
      events: {
        findById: () => ({ id: 21, isCancelled: false })
      }
    });
    const { document } = dom.window;

    const cancelledBadge = document.querySelector('.site-logo-cancelled-badge');
    expect(cancelledBadge).toBeNull();
  });
});