import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderTemplate } from '../helpers/nunjucks.js';

describe('social links component', () => {
    it('renders the shared social links with all expected destinations', () => {
        const html = renderTemplate('_includes/social-links.njk', {
            socialLinksClass: 'test-social-links'
        });
        const dom = new JSDOM(html);
        const { document } = dom.window;
        const links = [...document.querySelectorAll('.site-social-link')];

        expect(document.querySelector('.site-social-links.test-social-links')).not.toBeNull();
        expect(links).toHaveLength(5);

        expect(document.querySelector('.site-social-link-youtube')?.getAttribute('href')).toBe('https://www.youtube.com/@devdottalk');
        expect(document.querySelector('.site-social-link-discord')?.getAttribute('href')).toBe('https://discord.gg/N4JGyRthDt');
        expect(document.querySelector('.site-social-link-linkedin')?.getAttribute('href')).toBe('https://www.linkedin.com/company/dev-talk');
        expect(document.querySelector('.site-social-link-bluesky')?.getAttribute('href')).toBe('https://bsky.app/profile/devdottalk.uk');
        expect(document.querySelector('.site-social-link-email')?.getAttribute('href')).toBe('mailto:contactus@devdottalk.uk');

        expect(document.querySelector('.site-social-link-email')?.getAttribute('target')).toBeNull();
        expect(document.querySelector('.site-social-link-youtube')?.getAttribute('aria-label')).toBe('Visit the devdottalk YouTube channel');
        expect(document.querySelector('.site-social-link-discord')?.getAttribute('aria-label')).toBe('Join the devdottalk Discord server');
        expect(document.querySelector('.site-social-link-linkedin')?.getAttribute('aria-label')).toBe('Visit the devdottalk LinkedIn page');
        expect(document.querySelector('.site-social-link-bluesky')?.getAttribute('aria-label')).toBe('Follow devdottalk on Bluesky');
        expect(document.querySelector('.site-social-link-email')?.getAttribute('aria-label')).toBe('Email the devdottalk team');
    });
});