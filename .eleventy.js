// import { full as anchor } from "markdown-it-anchor";
const anchor = require('markdown-it-anchor')


module.exports = function (eleventyConfig) {
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

  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(anchor));
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
