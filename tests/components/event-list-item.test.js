import { describe, it, expect } from 'vitest';
import { renderMacro, extractElements } from '../helpers/nunjucks.js';
import { mockEvents } from '../fixtures/data.js';

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
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      expect(html).toContain('Test Video One');
      expect(html).toContain('Test Q&A Session');
      expect(html).toContain('href="https://test-youtube.local/mock-video-1"');
      expect(html).toContain('href="https://test-youtube.local/mock-qa-1"');
    });

    it('should show video emoji', () => {
      const html = renderMacro(templatePath, macroName, [mockEvents[0]]);
      
      const videoLinks = html.match(/▶️/g);
      expect(videoLinks).toHaveLength(2); // Two videos
    });

    it('should not render video links when empty array', () => {
      const eventWithoutVideos = { ...mockEvents[0], videos: [] };
      const html = renderMacro(templatePath, macroName, [eventWithoutVideos]);
      
      expect(html).not.toContain('▶️');
    });

    it('should skip videos with TODO URLs', () => {
      const eventWithTodoVideo = {
        ...mockEvents[0],
        videos: [
          { title: 'Main Session', url: 'TODO' },
          { title: 'Valid Video', url: 'https://youtube.com/valid' }
        ]
      };
      const html = renderMacro(templatePath, macroName, [eventWithTodoVideo]);
      
      expect(html).not.toContain('Main Session'); // TODO should be skipped
      expect(html).toContain('Valid Video'); // Valid one should show
    });
  });

  describe('backward compatibility (legacy parameter style)', () => {
    it('should work with legacy 10-parameter format', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [
          '25 April 2026',
          'https://test.meetup.local/event',
          'Test Legacy Event',
          'https://test-photos.local/april',
          'Test Full Talk',
          'https://test-youtube.local/full',
          'Test Q&A',
          'https://test-youtube.local/qa',
          'Test Highlights',
          'https://test-youtube.local/highlights'
        ]
      );

      expect(html).toContain('25 April 2026');
      expect(html).toContain('Test Legacy Event');
      expect(html).toContain('📸 Photos');
      expect(html).toContain('Test Full Talk');
      expect(html).toContain('Test Q&A');
      expect(html).toContain('Test Highlights');
    });

    it('should handle TODO values in legacy format', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [
          '30 April 2026',
          'https://test.meetup.local/event',
          'Test Event Title',
          'TODO', // No photos
          'Test Video 1',
          'https://test-youtube.local/v1',
          'Test Video 2',
          'TODO', // No video 2 link
          'Test Video 3',
          'https://test-youtube.local/v3'
        ]
      );

      expect(html).not.toContain('📸 Photos');
      expect(html).toContain('Test Video 1');
      expect(html).not.toContain('Test Video 2');
      expect(html).toContain('Test Video 3');
    });

    it('should handle partial videos in legacy format', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [
          '28 April 2026',
          'https://test.meetup.local/event',
          'Test Partial Event',
          'https://test-photos.local/april',
          'Test Video 1',
          'https://test-youtube.local/v1'
          // No more parameters - should handle gracefully
        ]
      );

      expect(html).toContain('Test Video 1');
      expect(html).not.toContain('undefined');
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
      const html = renderMacro(templatePath, macroName, [mockEvents[2]]);
      
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
        photoUrl: '',
        videos: []
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
