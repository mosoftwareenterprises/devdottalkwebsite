import { describe, it, expect } from 'vitest';
import { renderMacro } from '../helpers/nunjucks.js';
import { mockEvents, mockSessions } from '../fixtures/data.js';

describe('event-list-item component', () => {
  const templatePath = '_includes/event-list-item.njk';
  const macroName = 'eventItem';

  describe('renders event information (new object style)', () => {
    it('should render event title', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('Mock Testing Mock Workshop');
    });

    it('should render event display date', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('15 March 2026');
    });

    it('should render event in list item', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('<li>');
      expect(html).toContain('</li>');
    });

    it('should link to event URL', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('href="https://test.meetup.local/test-events/example-mock"');
      expect(html).toContain('target="_blank"');
    });

    it('should render related sessions when session collection is provided', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0], mockSessions]);

      expect(html).toContain('Sessions and speakers');
      expect(html).toContain('Fictional Frameworks: Not Your Regular Stack');
      expect(html).toContain('Alice Fictional Developer');
      expect(html).toContain('class="event-sessions"');
    });
  });

  describe('renders photos link', () => {
    it('should show photos link when photoUrl exists', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('📸 Photos');
      expect(html).toContain('href="https://test-photos.local/march-mock"');
    });

    it('should not show photos link when photoUrl is TODO', () => {
      const eventWithoutPhotos = { ...mockEvents[0], photoUrl: 'TODO' };
      const html = renderMacro(templatePath, macroName, [eventWithoutPhotos]);
      
      expect(html).not.toContain('📸 Photos');
    });

    it('should not show photos link when photoUrl is empty', () => {
      const eventWithoutPhotos = { ...mockEvents[0], photoUrl: '' };
      const html = renderMacro(templatePath, macroName, [eventWithoutPhotos]);
      
      expect(html).not.toContain('📸 Photos');
    });
  });

  describe('renders video links', () => {
    it('should render multiple video links', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0], mockSessions]);
      
      expect(html).toContain('Testing Quantum Debugging Techniques');
      expect(html).toContain('Fictional Frameworks: Not Your Regular Stack');
      expect(html).toContain('href="https://test-youtube.local/mock-video-1"');
      expect(html).toContain('href="https://test-youtube.local/mock-qa-1"');
    });

    it('should show video emoji', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0], mockSessions]);
      
      const videoLinks = html.match(/▶️/g);
      expect(videoLinks).toHaveLength(2); // Two videos
    });

    it('should not render video links when sessions have no video URLs', () => {
      const sessionsWithoutVideos = mockSessions.map((session) => ({
        ...session,
        videoUrl: session.eventID === mockEvents[0].id ? '' : session.videoUrl
      }));
      const html = renderMacro(templatePath, macroName, [mockEvents[0], sessionsWithoutVideos]);
      
      expect(html).not.toContain('▶️');
    });

    it('should skip session videos with TODO URLs', () => {
      const sessionsWithTodoVideo = [
        {
          ...mockSessions[0],
          title: 'Main Session',
          videoUrl: 'TODO'
        },
        {
          ...mockSessions[1],
          title: 'Valid Video',
          videoUrl: 'https://youtube.com/valid'
        }
      ];
      const html = renderMacro(templatePath, macroName, [mockEvents[0], sessionsWithTodoVideo]);
      
      expect(html).not.toContain('▶️ Main Session'); // TODO should be skipped in event links
      expect(html).toContain('▶️ Valid Video'); // Valid one should show in event links
    });
  });

  describe('HTML structure', () => {
    it('should have event-item div class', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('class="event-item"');
    });

    it('should add anchor id based on event id', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);

      expect(html).toContain('id="test-event-march-2026"');
    });

    it('should not add anchor id when event id is missing', () => {
      const eventWithoutId = {
        ...mockEvents[0]
      };
      delete eventWithoutId.id;

      const html = renderMacro(templatePath, macroName, [eventWithoutId]);

      expect(html).not.toContain('id="test-event-march-2026"');
    });

    it('should have event-title class on title link', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('class="event-title"');
    });

    it('should have event-link classes on video/photo links', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('class="event-link');
    });

    it('should render nested ul for links', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('class="event-links"');
    });
  });

  describe('handles different events', () => {
    it('should render January event', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[1]]);
      
      expect(html).toContain('20 January 2026');
      expect(html).toContain('Fictional Meetup Experience');
    });

    it('should render February event with single video', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[2], mockSessions]);
      
      expect(html).toContain('17 February 2026');
      expect(html).toContain('Test Data Deep Dive');
      expect(html).toContain('Test Framework Overview');
      
      // Should only have one video link
      const videoCount = (html.match(/▶️/g) || []).length;
      expect(videoCount).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle event with no videos or photos', () => {
      const minimalEvent = {
        displayDate: '25 April 2026',
        url: 'https://test.meetup.local/event',
        title: 'Test Minimal Event',
        photoUrl: ''
      };

      const html = renderMacro(templatePath, macroName, [minimalEvent]);
      
      expect(html).toContain('25 April 2026');
      expect(html).toContain('Test Minimal Event');
      expect(html).not.toContain('event-links'); // No links section
    });

    it('should handle very long event titles', () => {
      const longTitleEvent = {
        ...mockEvents[0],
        title: 'This is a very long test event title that discusses multiple testing topics and might wrap to multiple lines in the UI'
      };

      const html = renderMacro(templatePath, macroName, [longTitleEvent]);
      
      expect(html).toContain('This is a very long test event title');
    });
  });
});
