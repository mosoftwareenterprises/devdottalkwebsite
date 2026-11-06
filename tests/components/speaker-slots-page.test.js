import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// The browser script is plain JS; evaluate it with a fake CommonJS module to reach its exports.
const scriptSource = readFileSync(join(__dirname, '..', '..', 'src', 'speaker-slots.js'), 'utf8');
const fakeModule = { exports: {} };
new Function('module', scriptSource)(fakeModule);
const { buildMailto, buildEmailDraft, buildGmailComposeUrl, buildOutlookComposeUrl, init } = fakeModule.exports;

describe('speaker slots page', () => {
  const content = readFileSync(join(__dirname, '..', '..', 'src', 'speaker-slots.njk'), 'utf8');
  const styles = readFileSync(join(__dirname, '..', '..', 'src', 'speaker-slots.css'), 'utf8');

  it('is hidden from collections and has a slot button', () => {
    expect(content).toContain('eleventyExcludeFromCollections: true');
    expect(content).toContain('permalink: speaker-slots.html');
    expect(content).toContain('openSpeakerSlots');
    expect(content).toContain('data-email-action="gmail"');
    expect(content).toContain('data-email-action="outlook"');
    expect(content).toContain('data-copy-slot-date');
      expect(content).toContain('data-speaker-name');
      expect(content).toContain('data-speaker-session');
    expect(content).toContain('/code-of-conduct.html');
    expect(content).toContain('/previous-events.html');
    expect(content).toContain('/attending.html');
  });

  it('renders a single slot button per event regardless of open slot count', () => {
    expect(content).not.toMatch(/range\(/);
    expect(content.match(/data-email-action=/g)).toHaveLength(3);
    expect(content.match(/data-copy-slot-date=/g)).toHaveLength(1);
  });

  it('explains that email buttons send a request and the team confirms the date', () => {
    expect(content).toContain("Thanks so much for your time and for your interest in speaking at {dev.talk}. We really appreciate you being willing to share your experience with our community. When you're ready, choose an available date and select your preferred email option. A pre-filled email will open for you to review and send. Your date isn't confirmed until we reply.");
  });

  it('shows decorative icons alongside accessible button labels', () => {
    expect(content.match(/data-button-icon=/g)).toHaveLength(4);
    expect(content).toContain('data-button-icon="gmail"');
    expect(content).toContain('data-button-icon="outlook"');
    expect(content).toContain('data-button-icon="email"');
    expect(content).toContain('data-button-icon="copy"');
    expect(content.match(/aria-hidden="true" focusable="false"/g)).toHaveLength(4);
    expect(content).toContain('>Gmail</span>');
    expect(content).toContain('>Outlook</span>');
    expect(content).toContain('>Other email app</span>');
    expect(content).toContain('>Copy details</span>');
    expect(styles).toMatch(/\.speaker-slots-icon\s*{[^}]*height:\s*1\.2rem[^}]*width:\s*1\.2rem/);
  });

  it('gives each open date a clear panel and action hierarchy', () => {
    expect(styles).toMatch(/\.speaker-slots-item\s*{[^}]*background:[^}]*border:[^}]*border-left:[^}]*border-radius:/);
    expect(styles).toMatch(/\.speaker-slots-item\s*>\s*h2\s*{[^}]*color:/);
    expect(styles).toMatch(/\.speaker-slots-item\s*>\s*p:not\(\.speaker-slots-copy-status\)\s*{[^}]*background:/);
    expect(styles).toMatch(/\.speaker-slots-button\s*{[^}]*background:/);
    expect(styles).toMatch(/\.speaker-slots-button--copy\s*{[^}]*background:/);
  });

  it('lays out email actions in two columns on narrow screens', () => {
    expect(styles).toMatch(/@media\s*\(max-width:\s*600px\)[\s\S]*?\.speaker-slots-actions\s*{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  });

  it('builds a mailto with date, name and session', () => {
    const url = buildMailto('Thursday, 5th November 2026', 'Jane Doe', 'Cool Talk');
    expect(url.startsWith('mailto:speaker@devdottalk.uk?subject=')).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('Thursday, 5th November 2026');
    expect(decoded).toContain('Jane Doe');
    expect(decoded).toContain('Cool Talk');
  });

  it('builds one subject and body for all email actions', () => {
    const draft = buildEmailDraft('Thursday, 5th November 2026', 'Jane Doe', 'Cool Talk');

    expect(draft.subject).toBe('Speaker slot request: Thursday, 5th November 2026 - Jane Doe');
    expect(draft.body).toContain('Speaker: Jane Doe');
    expect(draft.body).toContain('Session: Cool Talk');
  });

  it('builds Gmail and Outlook web compose links with the prepared draft', () => {
    const gmail = new URL(buildGmailComposeUrl('Thursday, 5th November 2026', 'Jane Doe', 'Cool Talk'));
    const outlook = new URL(buildOutlookComposeUrl('Thursday, 5th November 2026', 'Jane Doe', 'Cool Talk'));

    expect(gmail.origin).toBe('https://mail.google.com');
    expect(gmail.searchParams.get('to')).toBe('speaker@devdottalk.uk');
    expect(gmail.searchParams.get('su')).toContain('Jane Doe');
    expect(gmail.searchParams.get('body')).toContain('Thursday, 5th November 2026');
    expect(outlook.origin).toBe('https://outlook.office.com');
    expect(outlook.searchParams.get('to')).toBe('speaker@devdottalk.uk');
    expect(outlook.searchParams.get('subject')).toContain('Jane Doe');
    expect(outlook.searchParams.get('body')).toContain('Cool Talk');
  });

  it('copies the prepared draft and announces success', async () => {
    let copyHandler;
    let copiedText;
    const status = { textContent: '' };
    const button = {
      getAttribute: () => 'Thursday, 5th November 2026',
      addEventListener: (eventName, handler) => {
        if (eventName === 'click') copyHandler = handler;
      },
      closest: () => ({
        querySelector: selector => selector === '[data-copy-status]' ? status : null
      })
    };
    const doc = {
      querySelectorAll: selector => selector === '[data-copy-slot-date]' ? [button] : [],
      querySelector: () => null
    };

    init(doc, '?name=Jane%20Doe&session=Cool%20Talk', {
      writeText: async text => { copiedText = text; }
    });
    await copyHandler();

    expect(copiedText).toContain('Subject: Speaker slot request: Thursday, 5th November 2026 - Jane Doe');
    expect(copiedText).toContain('Session: Cool Talk');
    expect(status.textContent).toBe('Email details copied.');
  });

  it('reveals selectable email details when clipboard access is unavailable', async () => {
    let copyHandler;
    const status = { textContent: '' };
    const fallback = {
      value: '',
      hidden: true,
      focus: () => { },
      select: () => { }
    };
    const button = {
      getAttribute: () => 'Thursday, 5th November 2026',
      addEventListener: (eventName, handler) => {
        if (eventName === 'click') copyHandler = handler;
      },
      closest: () => ({
        querySelector: selector => selector === '[data-copy-status]' ? status : fallback
      })
    };
    const doc = {
      querySelectorAll: selector => selector === '[data-copy-slot-date]' ? [button] : [],
      querySelector: () => null
    };

    init(doc, '?name=Jane%20Doe&session=Cool%20Talk', {});
    await copyHandler();

    expect(fallback.hidden).toBe(false);
    expect(fallback.value).toContain('Subject: Speaker slot request: Thursday, 5th November 2026 - Jane Doe');
    expect(status.textContent).toContain('Select and copy');
  });
});
