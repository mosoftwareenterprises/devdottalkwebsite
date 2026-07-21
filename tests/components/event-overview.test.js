import { describe, it, expect } from 'vitest';
import { renderMacro } from '../helpers/nunjucks.js';
import { mockEvents } from '../fixtures/data.js';

describe('event-overview component', () => {
    const templatePath = '_includes/event-overview.njk';
    const macroName = 'eventOverview';

    it('renders the event overview for active events', () => {
        const html = renderMacro(templatePath, macroName, [mockEvents[0].id, mockEvents]);

        expect(html).toContain('A practical meetup focused on testing patterns and debugging workflows.');
        expect(html).not.toContain('event-cancelled-notice');
    });

    it('renders a cancellation notice and hides the overview for cancelled events', () => {
        const cancelledEvent = {
            ...mockEvents[0],
            isCancelled: true,
            overview: 'This overview should not be shown for cancelled events.'
        };

        const html = renderMacro(templatePath, macroName, [cancelledEvent.id, [cancelledEvent]]);

        expect(html).toContain('event-cancelled-notice');
        expect(html).toContain('Event Cancelled');
        expect(html).toContain('Unfortunately, this event has been cancelled.');
        expect(html).not.toContain('This overview should not be shown for cancelled events.');
    });
});
