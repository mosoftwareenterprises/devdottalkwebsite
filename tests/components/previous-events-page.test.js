import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../helpers/nunjucks.js';
import { mockEvents } from '../fixtures/data.js';

describe('previous events page', () => {
  const templatePath = 'previous-events.njk';

  it('does not render cancelled events', () => {
    const html = renderTemplate(templatePath, {
      page: {
        eventScope: 'past'
      },
      events: {
        past: [
          { ...mockEvents[0], year: 2026 },
          { ...mockEvents[1], year: 2026, isCancelled: true },
          { ...mockEvents[2], year: 2026 }
        ]
      },
      sessions: {
        pastEvents: []
      },
      icons: {
        youtube: ''
      }
    });

    expect(html).toContain('Mock Testing Mock Workshop');
    expect(html).toContain('Test Data Deep Dive');
    expect(html).not.toContain('Fictional Meetup Experience');
  });
});
