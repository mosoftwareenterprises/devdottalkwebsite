import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderMacro } from '../helpers/nunjucks.js';
import { mockSessions, mockEvents } from '../fixtures/data.js';

describe('featured-speaker-promo component', () => {
    const templatePath = '_includes/featured-speaker-promo.njk';
    const macroName = 'featuredSpeakerPromo';

    it('renders speaker, session, and metadata content', () => {
        const session = mockSessions[0];
        const html = renderMacro(
            templatePath,
            macroName,
            [session],
            { events: { all: mockEvents } }
        );

        expect(html).toContain(session.title);
        expect(html).toContain(session.firstSpeakerName);
        expect(html).toContain(session.firstSpeakerJobTitle);
        expect(html).toContain('Session Description');
        expect(html).toContain('Speaker Bio');
        expect(html).toContain('View speaker profile');
        expect(html).toContain('15 March');
    });

    it('keeps promo body inside the article container', () => {
        const session = mockSessions[0];
        const html = renderMacro(
            templatePath,
            macroName,
            [session],
            { events: { all: mockEvents } }
        );

        const dom = new JSDOM(html);
        const article = dom.window.document.querySelector('article.featured-speaker-promo');
        const body = dom.window.document.querySelector('.featured-speaker-promo-body');

        expect(article).not.toBeNull();
        expect(body).not.toBeNull();
        expect(body.closest('article.featured-speaker-promo')).toBe(article);
    });

    it('renders speaker image when available', () => {
        const sessionWithImage = {
            ...mockSessions[0],
            firstSpeakerBioPicUrl: '/images/test/alice-headshot.png'
        };

        const html = renderMacro(
            templatePath,
            macroName,
            [sessionWithImage],
            { events: { all: mockEvents } }
        );

        expect(html).toContain('class="featured-speaker-promo-image"');
        expect(html).toContain('src="/images/test/alice-headshot.png"');
        expect(html).not.toContain('featured-speaker-promo-image-placeholder');
    });

    it('omits description/bio/actions block when optional content is missing', () => {
        const minimalSession = {
            ...mockSessions[0],
            description: '',
            firstSpeakerBio: '',
            firstSpeakerUrl: ''
        };

        const html = renderMacro(
            templatePath,
            macroName,
            [minimalSession],
            { events: { all: mockEvents } }
        );

        expect(html).not.toContain('featured-speaker-promo-body');
        expect(html).not.toContain('Session Description');
        expect(html).not.toContain('Speaker Bio');
        expect(html).not.toContain('View speaker profile');
    });

    it('renders canvas elements in the correct vertical order: brand, date, title, image, meta', () => {
        const session = mockSessions[0];
        const html = renderMacro(
            templatePath,
            macroName,
            [session],
            { events: { all: mockEvents } }
        );

        const dom = new JSDOM(html);
        const canvas = dom.window.document.querySelector('.featured-speaker-promo-canvas');
        const children = Array.from(canvas.children);

        const brandIdx = children.findIndex(el => el.classList.contains('featured-speaker-promo-brand'));
        const dateIdx = children.findIndex(el => el.classList.contains('featured-speaker-promo-date'));
        const titleIdx = children.findIndex(el => el.classList.contains('featured-speaker-promo-panel-title'));
        const frameIdx = children.findIndex(el => el.classList.contains('featured-speaker-promo-frame'));
        const metaIdx = children.findIndex(el => el.classList.contains('featured-speaker-promo-panel-meta'));

        expect(brandIdx).toBeGreaterThanOrEqual(0);
        expect(dateIdx).toBeGreaterThan(brandIdx);
        expect(titleIdx).toBeGreaterThan(dateIdx);
        expect(frameIdx).toBeGreaterThan(titleIdx);
        expect(metaIdx).toBeGreaterThan(frameIdx);
    });

    it('does not render the kicker element', () => {
        const session = mockSessions[0];
        const html = renderMacro(templatePath, macroName, [session], { events: { all: mockEvents } });
        expect(html).not.toContain('featured-speaker-promo-kicker');
    });
});
