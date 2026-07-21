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
        expect(html).toContain('href="/calendar"');
        expect(html).not.toContain('href="https://test.meetup.local/test-events/example-mock"');
    });

    it('renders overview for upcoming events', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [mockEvents[0]]
            },
            sessions: {
                allEvents: [mockSessions[0], mockSessions[1]]
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

    it('renders compact speaker-wanted line when overview is empty', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [{ ...mockEvents[0], overview: '' }]
            },
            sessions: {
                allEvents: [mockSessions[0], mockSessions[1]]
            }
        });

        expect(html).not.toContain('class="event-overview"');
        expect(html).toContain('event-item--speaker-wanted');
        expect(html).toContain('15 March 2026');
        expect(html).not.toContain('Mock Testing Mock Workshop');
        expect(html).toContain('class="event-speaker-wanted-inline"');
        expect(html).toContain('/call-for-speakers.html');
        expect(html).toContain('/contact-us.html');
    });

    it('renders another-speaker prompt when exactly one speaker is assigned', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [{
                    ...mockEvents[0],
                    sessionIDs: [999, 123456]
                }]
            },
            sessions: {
                allEvents: [mockSessions[0]]
            }
        });

        expect(html).toContain('Another speaker wanted for this event');
        expect(html).toContain('come and join us');
        expect(html).toContain('event-speaker-wanted-inline--highlight');
        expect(html).toContain('/call-for-speakers.html');
    });

    it('does not render another-speaker prompt when two speakers are assigned', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [{
                    ...mockEvents[0],
                    sessionIDs: [999, 998]
                }]
            },
            sessions: {
                allEvents: [mockSessions[0], mockSessions[1]]
            }
        });

        expect(html).not.toContain('Another speaker wanted for this event');
    });

    it('renders another-speaker prompt when the second matched session is Lean Coffee', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [{
                    ...mockEvents[0],
                    sessionIDs: [999, 997]
                }]
            },
            sessions: {
                allEvents: [
                    mockSessions[0],
                    {
                        ...mockSessions[2],
                        id: 997,
                        title: 'Lean Coffee Session',
                        eventID: 'test-event-march-2026',
                        firstSpeakerName: 'Someone Placeholder'
                    }
                ]
            }
        });

        expect(html).toContain('Another speaker wanted for this event');
    });

    it('does not render cancelled events', () => {
        const html = renderTemplate(templatePath, {
            events: {
                upcoming: [
                    { ...mockEvents[0], isCancelled: true },
                    mockEvents[1]
                ]
            },
            sessions: {
                allEvents: [mockSessions[0], mockSessions[1]]
            }
        });

        expect(html).not.toContain('Mock Testing Mock Workshop');
        expect(html).toContain('Fictional Meetup Experience');
    });
});
