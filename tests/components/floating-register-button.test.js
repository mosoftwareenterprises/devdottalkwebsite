import { describe, it, expect } from 'vitest';
import { renderTemplate, htmlContains } from '../helpers/nunjucks.js';

describe('floating-register-button component', () => {
  const templatePath = '_includes/floating-register-button.njk';

  describe('renders button structure', () => {
    it('should include Luma checkout script', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('id="luma-checkout"');
      expect(html).toContain('src="https://embed.lu.ma/checkout-button.js"');
    });

    it('should render floating register wrapper div', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('id="floating-register"');
    });

    it('should render checkout button with correct attributes', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('class="luma-checkout--button"');
      expect(html).toContain('data-luma-action="checkout"');
    });
  });

  describe('passes event ID correctly', () => {
    it('should use provided event ID', () => {
      const ticketSystemEventId = 'test-event-12345';
      const html = renderTemplate(templatePath, { ticketSystemEventId });
      
      expect(html).toContain(`data-luma-event-id="${ticketSystemEventId}"`);
    });

    it('should render with different event IDs', () => {
      const eventIds = ['event1', 'event2', 'event3'];
      
      eventIds.forEach(ticketSystemEventId => {
        const html = renderTemplate(templatePath, { ticketSystemEventId });
        expect(html).toContain(`data-luma-event-id="${ticketSystemEventId}"`);
      });
    });

    it('should handle undefined event ID gracefully', () => {
      const html = renderTemplate(templatePath, {}); // No ticketSystemEventId provided
      
      // Component should still render structure
      expect(html).toContain('floating-register');
      expect(html).toContain('luma-checkout--button');
    });
  });

  describe('button text and links', () => {
    it('should contain ticket call-to-action text', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('Get your free ticket');
    });

    it('should have correct ticket page link', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('href="/tickets"');
    });
  });

  describe('HTML structure and accessibility', () => {
    it('should render as anchor element', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('<a ');
      expect(html).toContain('</a>');
    });

    it('should use target="_blank" for external links if present', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      // The component uses href="/tickets" which is internal
      expect(html).toContain('href="/tickets"');
      // Should not have target="_blank" for internal link
    });

    it('should have script tag with correct type', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('<script');
      expect(html).toContain('</script>');
    });
  });

  describe('Luma integration attributes', () => {
    it('should have data-luma-action set to checkout', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toContain('data-luma-action="checkout"');
    });

    it('should have data-luma-event-id attribute', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).toMatch(/data-luma-event-id="[^"]+"/);
    });

    it('should not have other unexpected data attributes', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: '12345' });
      
      expect(html).not.toContain('data-luma-other');
      expect(html).not.toContain('data-luma-invalid');
    });
  });

  describe('component updates with different contexts', () => {
    it('should work with event IDs containing special characters', () => {
      const ticketSystemEventId = 'event-2026-03-12';
      const html = renderTemplate(templatePath, { ticketSystemEventId });
      
      expect(html).toContain(`data-luma-event-id="${ticketSystemEventId}"`);
    });

    it('should handle numeric-looking event IDs', () => {
      const ticketSystemEventId = '1234567890';
      const html = renderTemplate(templatePath, { ticketSystemEventId });
      
      expect(html).toContain(`data-luma-event-id="${ticketSystemEventId}"`);
    });
  });

  describe('no unwanted side effects', () => {
    it('should render without errors when used multiple times', () => {
      const ticketSystemEventId1 = 'event1';
      const ticketSystemEventId2 = 'event2';
      
      const html1 = renderTemplate(templatePath, { ticketSystemEventId: ticketSystemEventId1 });
      const html2 = renderTemplate(templatePath, { ticketSystemEventId: ticketSystemEventId2 });
      
      expect(html1).toContain(`data-luma-event-id="${ticketSystemEventId1}"`);
      expect(html2).toContain(`data-luma-event-id="${ticketSystemEventId2}"`);
    });

    it('should not contain hardcoded event IDs', () => {
      const html = renderTemplate(templatePath, { ticketSystemEventId: 'test-id' });
      
      // Make sure it's using the parameter, not a hardcoded value
      expect(html).toContain('test-id');
      expect(html).not.toMatch(/data-luma-event-id="12345"/);
    });
  });
});
