import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../helpers/nunjucks.js';
import { mockEvents, mockSessions } from '../fixtures/data.js';

describe('index upcoming events section', () => {
    const templatePath = '_includes/index/section-upcoming-events.njk';

    it('renders date and title for upcoming events', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [mockEvents[0]]
            },
            sessions: {
                upcomingEvents: [mockSessions[0]]
            }
        });

        expect(html).toContain('15 March 2026: Mock Testing Mock Workshop');
        expect(html).not.toContain('href="https://test.meetup.local/test-events/example-mock"');
    });

    it('renders overview for upcoming events', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [mockEvents[0]]
            }
        });

        expect(html).toContain('A practical meetup focused on testing patterns and debugging workflows.');
        expect(html).toContain('class="event-overview"');
    });

    it('does not render photos or sessions sections', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [mockEvents[0]]
            },
            sessions: {
                upcomingEvents: [mockSessions[0]]
            }
        });

        expect(html).not.toContain('📸 Photos');
        expect(html).not.toContain('Sessions and speakers');
        expect(html).not.toContain('class="event-links"');
        expect(html).not.toContain('class="event-sessions"');
    });

    it('omits overview markup when overview is empty', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [{ ...mockEvents[0], overview: '' }]
            }
        });

        expect(html).not.toContain('class="event-overview"');
    });
});
