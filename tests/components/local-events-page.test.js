import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../helpers/nunjucks.js';

describe('local events page', () => {
    it('displays the calculated number of local event entries', () => {
        const html = renderTemplate('local-events.njk');
        const eventCount = (html.match(/<li>/g) || []).length;

        expect(eventCount).toBeGreaterThanOrEqual(33);
        expect(html).toContain(`Other local tech based events (${eventCount})`);
        expect(html).toContain(
            `A list of ${eventCount} tech based events within 1 hour drive of Bournemouth:`
        );
    });
});
