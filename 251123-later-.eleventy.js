const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const redirectsPlugin = require('eleventy-plugin-redirects');

module.exports = function (eleventyConfig) {
  // Eleventy Navigation Plugin
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Add support for maintenance-free post authors
  eleventyConfig.addCollection("authors", (collection) => {
    const blogs = collection.getFilteredByGlob("posts/*.md");
    return blogs.reduce((coll, post) => {
      const author = post.data.author;
      if (!author) {
        return coll;
      }
      if (!coll.hasOwnProperty(author)) {
        coll[author] = [];
      }
      coll[author].push(post.data);
      return coll;
    }, {});
  });

  // Date formatting filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });


  // Redirects
  eleventyConfig.addPlugin(redirectsPlugin, {
    template: 'netlify', // netlify, vercel or clientSide
  });

      // limit filter for arrays
eleventyConfig.addFilter("limit", function (arr, limit) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.slice(0, limit);
});


eleventyConfig.addFilter("exclude", (arr, exclude) => arr.filter(el => el !== exclude));




    // Minify HTML output
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
      if (outputPath.indexOf(".html") > -1) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });
        return minified;
      }
      return content;
    });

 


  // Layout aliases
  eleventyConfig.addLayoutAlias("default", "layouts/grid-default.njk");
  eleventyConfig.addWatchTarget("./_includes/");

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/fonts");
  eleventyConfig.addPassthroughCopy("static/assets");
  eleventyConfig.addPassthroughCopy("static/results");
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("admin/");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("_includes/assets/css/gtsc-grid.css");
  eleventyConfig.addPassthroughCopy("_includes/assets/js/script.js");
  eleventyConfig.addPassthroughCopy("lightbox.js");
  eleventyConfig.addPassthroughCopy("slick.min.js");
  eleventyConfig.addPassthroughCopy("assets/js/lightbox.js");
  eleventyConfig.addPassthroughCopy("assets/js/slick.min.js");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("**/*.jpg");



  // Copy any .pdf file to `_site`, via Glob pattern
  // Keeps the same directory structure.
  eleventyConfig.addPassthroughCopy("**/*.pdf");

  // Markdown plugins
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
  };
  let opts = {
    permalink: false,
  };

  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));

  return {
    templateFormats: ["md", "njk", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
