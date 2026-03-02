import { describe, it, expect } from 'vitest';
import { renderMacro, htmlContains, extractElements } from '../helpers/nunjucks.js';
import { mockSessions } from '../fixtures/data.js';

describe('speaker-session component', () => {
  const templatePath = '_includes/speaker-session.njk';
  const macroName = 'speakerSession';

  describe('renders speaker information correctly', () => {
    it('should render speaker name', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Alice Fictional Developer');
    });

    it('should render speaker job title', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Test Framework Architect');
    });

    it('should render session title', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Testing Quantum Debugging Techniques');
    });

    it('should render session description', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Discover advanced techniques for debugging quantum-inspired testing frameworks');
    });

    it('should render speaker bio', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Speaker Bio');
      expect(html).toContain('Alice specializes in testing methodologies and mock data generation');
    });
  });

  describe('renders HTML structure correctly', () => {
    it('should contain speaker headshot image', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/2026/march/kevin.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('img src="/images/2026/march/kevin.png"');
      expect(html).toContain('loading="lazy"');
    });

    it('should link to speaker LinkedIn profile', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('href="https://www.linkedin.com/in/alice-fictional-test/"');
    });

    it('should render h3 for speaker name', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('<h3>Alice Fictional Developer</h3>');
    });

    it('should render h4 for session title', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('<h4>Testing Quantum Debugging Techniques</h4>');
    });

    it('should render h5 for Speaker Bio header', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('<h5>Speaker Bio</h5>');
    });
  });

  describe('handles missing sessions gracefully', () => {
    it('should show "Session not found" for invalid session ID', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [555, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Session not found');
    });

    it('should not render speaker details when session not found', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [555, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).not.toContain('LinkedIn Profile');
      expect(html).not.toContain('Speaker headshot');
    });
  });

  describe('supports multiple sessions', () => {
    it('should render different speaker for ID 998', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [998, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Bob Test Sample');
      expect(html).toContain('Mock Data Specialist');
      expect(html).not.toContain('Alice Fictional Developer');
    });

    it('should render speaker 997 correctly', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [997, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Charlie Testington');
      expect(html).toContain('Containerized Testing: Isolation Strategies');
    });

    it('should render speaker 996 correctly', () => {
      const html = renderMacro(
        templatePath,
        macroName,
        [996, '/images/test.png', mockSessions],
        { sessions: { all: mockSessions } }
      );

      expect(html).toContain('Diana Mock Expert');
      expect(html).toContain('Mocking Module Redux: Advanced Patterns');
    });
  });

  describe('handles optional fields', () => {
    it('should not show job title if not present', () => {
      const sessionsWithoutTitle = [
        { ...mockSessions[0], firstSpeakerJobTitle: null }
      ];

      const html = renderMacro(
        templatePath,
        macroName,
        [999, '/images/test.png', sessionsWithoutTitle],
        { sessions: { all: sessionsWithoutTitle } }
      );

      // Speaker name should still be there
      expect(html).toContain('Alice Fictional Developer');
      // But not wrapped in <strong>
      expect(html).not.toContain('<strong>null</strong>');
    });

    it('should not show bio if not present', () => {
      const sessionsWithoutBio = [
        { ...mockSessions[0], firstSpeakerBio: null }
      ];

      const html = renderMacro(
        templatePath,
        macroName,
        [31, '/images/test.png', sessionsWithoutBio],
        { sessions: { all: sessionsWithoutBio } }
      );

      expect(html).not.toContain('Speaker Bio');
    });
  });

  describe('parameter passing', () => {
    it('should use explicitly passed sessions list over global', () => {
      const customSessions = [
        {
          id: 31,
          title: 'Custom Title',
          firstSpeakerName: 'Custom Name',
          firstSpeakerUrl: 'https://custom.url',
          firstSpeakerJobTitle: 'Custom Job',
          description: 'Custom description',
          firstSpeakerBio: 'Custom bio'
        }
      ];

      const html = renderMacro(
        templatePath,
        macroName,
        [31, '/images/test.png', customSessions],
        { sessions: { all: mockSessions } } // Different global data
      );

      expect(html).toContain('Custom Title');
      expect(html).toContain('Custom Name');
    });
  });
});
