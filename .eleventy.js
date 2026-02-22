import markdownItAnchor from "markdown-it-anchor";
import { JSDOM } from 'jsdom';

// Map to store image attributes from markdown extended syntax
const imageAttributesMap = new Map();

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/bluesky.css");
  eleventyConfig.addPassthroughCopy("src/bluesky.js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/*.jpg");
  eleventyConfig.addPassthroughCopy("src/*.png");
  eleventyConfig.addPassthroughCopy("src/*.svg");
  eleventyConfig.addPassthroughCopy("src/*.ico");
  eleventyConfig.addPassthroughCopy("src/staticwebapp.config.json");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");

  eleventyConfig.amendLibrary("md", (mdLib) => {
    // Plugin to encode spaces and extract attributes from markdown image syntax
    function imageProcessingPlugin(md) {
      const originalParse = md.parse.bind(md);
      md.parse = function (src, env) {
        // Extract image extended attributes: ![alt](url){attr=value ...}
        // Store them and replace with a placeholder
        const attrRegex = /!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/g;
        src = src.replace(attrRegex, (match, alt, url, attrString) => {
          // Encode spaces in URL
          const encodedUrl = url.replace(/ /g, '%20');

          // Parse attributes from the string (e.g., "loading=lazy width=100%")
          const attrs = {};
          const attrPairs = attrString.split(/\s+/);
          attrPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
              attrs[key.trim()] = value ? value.trim() : true;
            }
          });

          // Create a unique key for this image
          const attrKey = `${alt}|${encodedUrl}`;
          imageAttributesMap.set(attrKey, attrs);

          // Return normal markdown image syntax
          return `![${alt}](${encodedUrl})`;
        });

        // Encode spaces in image URLs without extended attributes
        src = src.replace(/!\[([^\]]*)\]\(([^)]*\s[^)]*)\)/g, (match, alt, url) => {
          return `![${alt}](${url.replace(/ /g, '%20')})`;
        });

        return originalParse(src, env);
      };
    }

    mdLib.use(imageProcessingPlugin);
    mdLib.use(markdownItAnchor);
  });

  // Transform to apply stored attributes to img tags
  eleventyConfig.addTransform(
    'apply-image-attributes',
    (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        const dom = new JSDOM(content);
        const document = dom.window.document;

        const [...images] = document.getElementsByTagName('img');

        images.forEach((image) => {
          const alt = image.getAttribute('alt');
          const src = image.getAttribute('src');
          const attrKey = `${alt}|${src}`;

          // Check if we have stored attributes for this image
          if (imageAttributesMap.has(attrKey)) {
            const attrs = imageAttributesMap.get(attrKey);

            // Apply each attribute to the img tag
            Object.entries(attrs).forEach(([key, value]) => {
              if (value === true) {
                image.setAttribute(key, '');
              } else {
                image.setAttribute(key, value);
              }
            });
          } else {
            // Default: add lazy loading if no attributes specified
            if (!image.hasAttribute('loading')) {
              image.setAttribute('loading', 'lazy');
            }
          }
        });

        return document.documentElement.outerHTML;
      } else {
        return content;
      }
    }
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
}
