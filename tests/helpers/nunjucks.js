import nunjucks from 'nunjucks';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(join(__dirname, '..', '..'));

/**
 * Creates a Nunjucks environment configured for testing components
 * @param {Object} data - Data to pass to templates
 * @returns {nunjucks.Environment} Configured Nunjucks environment
 */
export function createNunjucksEnv(data = {}) {
  const srcPath = join(projectRoot, 'src');
  const includesPath = join(srcPath, '_includes');
  const env = nunjucks.configure([srcPath, includesPath], {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true,
    noCache: true
  });

  // Register custom filters that Eleventy might provide
    // selectattr filter mimics Jinja2's selectattr(attr, test, value) format
    // When called as: arr | selectattr("id", "equalto", 31)
    // The Nunjucks runtime passes it as: selectattr(arr, "id", "equalto", 31)
    env.addFilter('selectattr', (arr, attr, testName, value) => {
    if (!Array.isArray(arr)) return [];

      // If only 3 args passed, assume simple equality check (backwards compat)
      if (value === undefined) {
          value = testName;
          testName = 'equalto';
      }

    return arr.filter(item => {
        const itemValue = item[attr];

        if (testName === 'equalto') {
            // Use == for loose comparison to handle numeric/string comparisons
            return itemValue == value; // eslint-disable-line eqeqeq
        } else if (testName === 'ne' || testName === 'notequalto') {
            return itemValue != value; // eslint-disable-line eqeqeq
        } else if (testName === 'gt' || testName === 'greaterthan') {
            return itemValue > value;
        } else if (testName === 'lt' || testName === 'lessthan') {
            return itemValue < value;
        } else if (testName === 'ge' || testName === 'greaterthanorequalto') {
            return itemValue >= value;
        } else if (testName === 'le' || testName === 'lessthanorequalto') {
            return itemValue <= value;
        } else if (testName === 'in') {
            return String(itemValue).includes(String(value));
        } else if (testName === 'string') {
            return typeof itemValue === 'string';
        } else {
            // Default to equality
            return itemValue == value; // eslint-disable-line eqeqeq
        }
    });
  });

  env.addFilter('first', (arr) => {
    return arr ? arr[0] : null;
  });

  env.addFilter('merge', (obj, updates) => {
    return { ...obj, ...updates };
  });

  // Add global data
  Object.assign(env.globals, data);

  return env;
}

/**
 * Renders a Nunjucks macro from a file
 * @param {string} templatePath - Path to template file relative to src/
 * @param {string} macroName - Name of the macro to render
 * @param {Array} args - Arguments to pass to the macro
 * @param {Object} data - Global data for template context
 * @returns {string} Rendered HTML
 */
export function renderMacro(templatePath, macroName, args = [], data = {}) {
  const env = createNunjucksEnv(data);
  
  // Read the template file from src/ directory
  const fullPath = join(projectRoot, 'src', templatePath);
  const templateContent = readFileSync(fullPath, 'utf8');
  
  // Create a wrapper template that imports and calls the macro
  const argsStr = args
    .map(arg => {
      if (typeof arg === 'string') {
        return `"${arg}"`;
      } else if (arg === null || arg === undefined) {
        return 'none';
      } else {
        return JSON.stringify(arg);
      }
    })
    .join(', ');

  const wrapperTemplate = `
${templateContent}

{{ ${macroName}(${argsStr}) }}
`;

  return env.renderString(wrapperTemplate);
}

/**
 * Renders a Nunjucks template with data
 * @param {string} templatePath - Path to template file relative to src/
 * @param {Object} data - Data to pass to template
 * @returns {string} Rendered HTML
 */
export function renderTemplate(templatePath, data = {}) {
  const env = createNunjucksEnv(data);
  
  const fullPath = join(projectRoot, 'src', templatePath);
  const templateContent = readFileSync(fullPath, 'utf8');
  
  return env.renderString(templateContent);
}

/**
 * Extracts text content from HTML string
 * @param {string} html - HTML string
 * @returns {string} Text content
 */
export function extractText(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Checks if HTML contains a specific string (case-insensitive)
 * @param {string} html - HTML string
 * @param {string} text - Text to search for
 * @returns {boolean}
 */
export function htmlContains(html, text) {
  return html.toLowerCase().includes(text.toLowerCase());
}

/**
 * Extracts all text nodes matching a selector pattern
 * @param {string} html - HTML string
 * @param {string} selector - CSS-like selector pattern (e.g., 'h3', 'a[href]')
 * @returns {Array<string>} Array of matched text content
 */
export function extractElements(html, selector) {
  const matches = [];
  const pattern = selector.match(/^([a-z]+)/i)?.[1] || selector;
  const regex = new RegExp(`<${pattern}[^>]*>([^<]*)</${pattern}>`, 'gi');
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}
