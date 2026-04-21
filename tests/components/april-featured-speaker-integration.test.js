import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(join(__dirname, '..', '..'));
const aprilPagePath = join(projectRoot, '_site', '2026-april-location-info.html');

describe('april featured speaker integration', () => {
  beforeAll(() => {
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'pipe'
    });
  }, 60000);

  it('renders two featured speaker promos in main flow and keeps subsequent sections after them', () => {
    const html = readFileSync(aprilPagePath, 'utf8');
    const dom = new JSDOM(html);
    const { document, Node } = dom.window;

    const main = document.querySelector('main.main-content');
    expect(main).not.toBeNull();

    const promos = main.querySelectorAll('article.featured-speaker-promo');
    expect(promos.length).toBe(2);

    const firstPromo = promos[0];
    const secondPromo = promos[1];

    expect(firstPromo.querySelector('.featured-speaker-promo-body')).not.toBeNull();
    expect(secondPromo.querySelector('.featured-speaker-promo-body')).not.toBeNull();

    expect(firstPromo.textContent).toContain('Liam Westley');
    expect(secondPromo.textContent).toContain('George Buckingham');

    const whatToExpectHeading = document.querySelector('#what-to-expect');
    expect(whatToExpectHeading).not.toBeNull();
    expect(main.contains(whatToExpectHeading)).toBe(true);

    const orderFlag = secondPromo.compareDocumentPosition(whatToExpectHeading);
    expect(orderFlag & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(html).not.toContain('</article></main></div>');
  });
});
