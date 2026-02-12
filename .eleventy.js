module.exports = function(eleventyConfig) {
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
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
