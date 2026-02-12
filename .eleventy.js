module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/bluesky.css");
  eleventyConfig.addPassthroughCopy("src/bluesky.js");
  eleventyConfig.addPassthroughCopy("src/images");
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
