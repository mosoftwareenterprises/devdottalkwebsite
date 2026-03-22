import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../helpers/nunjucks.js';
import { mockSessions } from '../fixtures/data.js';

describe('index upcoming sessions section', () => {
    const templatePath = '_includes/index/section-upcoming-sessions.njk';

    it('should render title, duration, and speaker in the visible summary line', () => {
        const html = renderTemplate(templatePath, {
            sessions: {
                upcomingEvents: [mockSessions[0]]
            }
        });

        expect(html).toContain('Testing Quantum Debugging Techniques');
        expect(html).toContain('(45 mins)');
        expect(html).toContain('Alice Fictional Developer');
    });

    it('should render description inside collapsed details content', () => {
        const html = renderTemplate(templatePath, {
            sessions: {
                upcomingEvents: [mockSessions[0]]
            }
        });

        expect(html).toContain('<details>');
        expect(html).toContain('<summary>Session description</summary>');
        expect(html).toContain('<p class="formatted-description">');
        expect(html).toContain('Discover advanced techniques for debugging quantum-inspired testing frameworks');
        expect(html).toContain('</details>');
    });

    it('should not render details block when description is empty', () => {
        const html = renderTemplate(templatePath, {
            sessions: {
                upcomingEvents: [{ ...mockSessions[0], description: '' }]
            }
        });

        expect(html).not.toContain('<details>');
        expect(html).not.toContain('Session description');
    });

    it('should support dual-speaker formatting in summary line', () => {
        const html = renderTemplate(templatePath, {
            sessions: {
                upcomingEvents: [
                    {
                        ...mockSessions[0],
                        secondSpeakerName: 'John Doe',
                        secondSpeakerUrl: 'https://linkedin.com/in/johndoe'
                    }
                ]
            }
        });

        expect(html).toContain('Alice Fictional Developer');
        expect(html).toContain('John Doe');
        expect(html).toContain('&amp;');
    });
});
