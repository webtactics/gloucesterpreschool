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


// 👇 The custom filter goes here 👇
    eleventyConfig.addFilter("intersection", (arr1, arr2) => {
        // Check if both arrays exist and are non-empty before trying to map/filter
        if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) {
            return [];
        }
        
        // 1. Get the URLs/IDs from the second array
        const arr2_ids = arr2.map(item => item.url);

        // 2. Filter the first array
        return arr1.filter(item => arr2_ids.includes(item.url));
    });


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


  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);



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


eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
  // Filters out current page
  const pageArr = arr.filter((page) => page.url !== currPage);

  // Randomizes remaining items
  pageArr.sort(() => {
    return 0.5 - Math.random();
  });

  // Returns array items up to limit
  return pageArr.slice(0, limit);
});


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

  // Shuffle / randomize array 
  eleventyConfig.addFilter("shuffle", function(array) {
      // Create a copy of the array to avoid modifying the original
      let shuffledArray = array.slice();

      // Fisher-Yates shuffle algorithm
      for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      return shuffledArray;
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
