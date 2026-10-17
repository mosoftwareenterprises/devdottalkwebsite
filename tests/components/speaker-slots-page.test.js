import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// The browser script is plain JS; evaluate it with a fake CommonJS module to reach its exports.
const scriptSource = readFileSync(join(__dirname, '..', '..', 'src', 'speaker-slots.js'), 'utf8');
const fakeModule = { exports: {} };
new Function('module', scriptSource)(fakeModule);
const { buildMailto } = fakeModule.exports;

describe('speaker slots page', () => {
  const content = readFileSync(join(__dirname, '..', '..', 'src', 'speaker-slots.njk'), 'utf8');

  it('is hidden from collections and has a slot button', () => {
    expect(content).toContain('eleventyExcludeFromCollections: true');
    expect(content).toContain('permalink: speaker-slots.html');
    expect(content).toContain('- I want this date');
    expect(content).toContain('openSpeakerSlots');
    expect(content).toContain('mailto:speaker@devdottalk.uk');
      expect(content).toContain('data-speaker-name');
      expect(content).toContain('data-speaker-session');
    expect(content).toContain('/code-of-conduct.html');
    expect(content).toContain('/previous-events.html');
    expect(content).toContain('/attending.html');
  });

  it('renders a single slot button per event regardless of open slot count', () => {
    expect(content).not.toMatch(/range\(/);
    expect(content.match(/class="speaker-slots-button"/g)).toHaveLength(1);
  });

  it('builds a mailto with date, name and session', () => {
    const url = buildMailto('Thursday, 5th November 2026', 'Jane Doe', 'Cool Talk');
    expect(url.startsWith('mailto:speaker@devdottalk.uk?subject=')).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('Thursday, 5th November 2026');
    expect(decoded).toContain('Jane Doe');
    expect(decoded).toContain('Cool Talk');
  });
});
