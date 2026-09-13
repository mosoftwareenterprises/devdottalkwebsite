import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('volunteer help page', () => {
  it('is hidden from collections and includes key volunteer sections', () => {
    const pagePath = join(__dirname, '..', '..', 'src', 'volunteer-help.md');
    const content = readFileSync(pagePath, 'utf8');

    expect(content).toContain('eleventyExcludeFromCollections: true');
    expect(content).toContain('permalink: volunteer-help.html');

    expect(content).toContain('https://help.luma.com/p/check-in-guests-for-in-person-events');
  });
});