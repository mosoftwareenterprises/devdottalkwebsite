import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderTemplate } from '../helpers/nunjucks.js';

describe('site footer', () => {
  it('includes the events calendar link in footer links', () => {
    const html = renderTemplate('_includes/site-footer.njk', {
      build: {
        currentYear: 2026
      }
    });
    const dom = new JSDOM(html);
    const { document } = dom.window;
    const calendarLink = document.querySelector('.site-footer-meta a[href="/calendar"]');

    expect(calendarLink).not.toBeNull();
    expect(calendarLink?.textContent?.trim()).toBe('Events Calendar');
  });
});
