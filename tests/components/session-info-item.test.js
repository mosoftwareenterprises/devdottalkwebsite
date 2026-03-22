import { describe, it, expect } from 'vitest';
import { renderMacro, extractElements } from '../helpers/nunjucks.js';
import { mockSessions } from '../fixtures/data.js';

describe('session-info-item component', () => {
  const templatePath = '_includes/session-info-item.njk';
  const macroName = 'sessionInfoItem';

  describe('renders session information (new object style)', () => {
    it('should render session title', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
        expect(html).toContain('Testing Quantum Debugging Techniques');
    });

    it('should render session duration', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
      expect(html).toContain('45 mins');
    });

    it('should render speaker name', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
      expect(html).toContain('Alice Fictional Developer');
    });

    it('should render session description', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
      expect(html).toContain('Discover advanced techniques for debugging quantum-inspired testing frameworks');
    });

    it('should render plain description by default', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);

      expect(html).toContain('<p class="formatted-description">');
      expect(html).not.toContain('<details>');
    });

    it('should render collapsible description when enabled', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0], true]);

      expect(html).toContain('<details>');
      expect(html).toContain('<summary>Session description</summary>');
      expect(html).toContain('<p class="formatted-description">');
      expect(html).toContain('</details>');
    });

    it('should render in list item', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
      expect(html).toContain('<li class="session-info-item">');
      expect(html).toContain('</li>');
    });
  });

  describe('renders video link', () => {
    it('should link to video when URL exists', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[1]]);
      
      // Should have video link for Bob Test Sample (id 998)
      expect(html).toContain('href="https://www.youtube.com/watch?v=test-video-999"');
      expect(html).toContain('target="_blank"');
    });

    it('should render title as text when no video', () => {
      const sessionWithoutVideo = { ...mockSessions[0], videoUrl: '' };
      const html = renderMacro(templatePath, macroName, [sessionWithoutVideo]);
      
      expect(html).toContain('Testing Quantum Debugging Techniques');
      // Should not have a link wrapping the title
      expect(html).not.toContain('video');
    });
  });

  describe('renders speaker links', () => {
    it('should link to single speaker', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
        expect(html).toContain('href="https://www.linkedin.com/in/alice-fictional-test/"');
      expect(html).toContain('target="_blank"');
        expect(html).toContain('Alice Fictional Developer');
    });

    it('should show both speakers when available', () => {
      const dualSpeakerSession = {
        ...mockSessions[0],
        secondSpeakerName: 'John Doe',
        secondSpeakerUrl: 'https://linkedin.com/in/johndoe'
      };

      const html = renderMacro(templatePath, macroName, [dualSpeakerSession]);
      
        expect(html).toContain('Alice Fictional Developer');
      expect(html).toContain('John Doe');
      expect(html).toContain('&amp;');
    });

    it('should not show second speaker link if only name exists', () => {
      const partialSecondSpeaker = {
        ...mockSessions[0],
        secondSpeakerName: 'Jane Doe'
        // No secondSpeakerUrl
      };

      const html = renderMacro(templatePath, macroName, [partialSecondSpeaker]);
      
      // Should only have href for first speaker
      const hrefMatches = (html.match(/href=/g) || []).length;
      expect(hrefMatches).toBeLessThan(3); // Not counting the ampersand or extra links
    });
  });

  describe('renders slides link', () => {
    it('should link to slides when URL exists', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[1]]);
      
        expect(html).toContain('href="https://slides.test.local/bob-slides"');
      expect(html).toContain('Slides');
      expect(html).toContain('target="_blank"');
    });

    it('should not show slides link when empty', () => {
      const sessionWithoutSlides = { ...mockSessions[0], slidesUrl: '' };
      const html = renderMacro(templatePath, macroName, [sessionWithoutSlides]);
      
      expect(html).not.toContain('Slides');
    });
  });

  describe('backward compatibility (legacy parameter style)', () => {
    it('should work with legacy 7-parameter format', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [
          'Legacy Talk Title',
          '30 mins',
          'Speaker Name',
          'https://linkedin.com/speaker',
          'Talk description here',
          'https://youtube.com/video',
          'https://slides.com/slides'
        ]
      );

      expect(html).toContain('Legacy Talk Title');
      expect(html).toContain('30 mins');
      expect(html).toContain('Speaker Name');
      expect(html).toContain('Talk description here');
    });

    it('should handle empty URL values in legacy format', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [
          'Talk Title',
          '45 mins',
          'Speaker Name',
          'https://linkedin.com/speaker',
          'Description',
          '', // No video
          '' // No slides
        ]
      );

      expect(html).toContain('Talk Title');
      expect(html).not.toContain('Slides');
      
      // Title should render as plain text, not linked
      const titleAsLink = html.includes('<a href=""');
      expect(titleAsLink).toBe(false);
    });

    it('should handle partial legacy parameters', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [
          'Talk Title',
          '45 mins',
          'Speaker Name',
          'https://linkedin.com/speaker',
          'Description'
          // Missing video and slides parameters
        ]
      );

      expect(html).toContain('Talk Title');
      expect(html).toContain('Speaker Name');
    });
  });

  describe('HTML structure', () => {
    it('should render bold title', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
      expect(html).toContain('<b>');
      expect(html).toContain('</b>');
    });

    it('should render paragraphs', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);
      
      const pTags = (html.match(/<p[\s>]/g) || []).length;
      expect(pTags).toBeGreaterThanOrEqual(2);
    });

    it('should add formatted-description class to description paragraph', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[0]]);

      expect(html).toContain('<p class="formatted-description">');
    });

    it('should render multiple list items for different sessions', () => {
      const html1 = renderMacro(templatePath, macroName, [mockSessions[0]]);
      const html2 = renderMacro(templatePath, macroName, [mockSessions[1]]);
      
        expect(html1).toContain('Alice Fictional Developer');
        expect(html2).toContain('Bob Test Sample');
      expect(html1 !== html2).toBe(true);
    });
  });

  describe('handles different sessions', () => {
    it('should render session with full details (id 997)', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[2]]);
      
      expect(html).toContain('Charlie Testington');
      expect(html).toContain('Containerized Testing: Isolation Strategies');
      // Note: session-info-item component doesn't render job titles,
      // it only renders in speaker-session component
    });

    it('should render session with different speaker (id 996)', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[3]]);
      
      expect(html).toContain('Diana Mock Expert');
      expect(html).toContain('Mocking Module Redux: Advanced Patterns');
      // Note: session-info-item component doesn't render job titles
    });

    it('should render session with video links (id 998, Bob Test Sample)', () => {
      const html = renderMacro(templatePath, macroName, [mockSessions[1]]);
      
      expect(html).toContain('Bob Test Sample');
      expect(html).toContain('youtube.com');
      expect(html).toContain('slides.test.local/bob-slides');
    });
  });

  describe('edge cases', () => {
    it('should handle session without optional fields', () => {
      const minimalSession = {
        title: 'Minimal Talk',
        durationText: '30 mins',
        firstSpeakerName: 'Speaker',
        firstSpeakerUrl: 'https://linkedin.com/speaker',
        description: 'Description',
        videoUrl: '',
        slidesUrl: ''
      };

      const html = renderMacro(templatePath, macroName, [minimalSession]);
      
      expect(html).toContain('Minimal Talk');
      expect(html).toContain('30 mins');
    });

    it('should handle very long session title', () => {
      const longTitleSession = {
        ...mockSessions[0],
        title: 'A Very Long and Comprehensive Title That Discusses Multiple Complex Topics and Might Be Hard to Display Properly in Certain Contexts'
      };

      const html = renderMacro(templatePath, macroName, [longTitleSession]);
      
      expect(html).toContain('A Very Long and Comprehensive Title');
    });

    it('should render duration with proper formatting', () => {
      const sessions = [
        { ...mockSessions[0], durationText: '45 mins' },
        { ...mockSessions[0], durationText: '1 hour' },
        { ...mockSessions[0], durationText: '1.5 hours' }
      ];

      sessions.forEach(session => {
        const html = renderMacro(templatePath, macroName, [session]);
        expect(html).toContain(session.durationText);
      });
    });
  });
});
