import { DateTime } from "luxon";
import CleanCSS from "clean-css";
import pluginNavigation from "@11ty/eleventy-navigation";
import UglifyJS from "uglify-js";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export default function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginNavigation);


  // Shortcodes / Filters
  eleventyConfig.addFilter("readableDate", (dateObj, format = "yyyy LLL dd") => {
    if (!dateObj) return "";
    // Accepts JS Date, Luxon DateTime, or ISO string
    try {
      const dt = (dateObj instanceof Date)
        ? DateTime.fromJSDate(dateObj)
        : (typeof dateObj === "string")
          ? DateTime.fromISO(dateObj)
          : (DateTime.isDateTime && DateTime.isDateTime(dateObj))
            ? dateObj
            : DateTime.fromJSDate(new Date(dateObj));

      return dt.isValid ? dt.toFormat(format) : "";
    } catch (e) {
      return "";
    }
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return "";
    try {
      const dt = (dateObj instanceof Date) ? DateTime.fromJSDate(dateObj) : DateTime.fromISO(dateObj);
      return dt.isValid ? dt.toUTC().toISO({ suppressMilliseconds: true }) : "";
    } catch (e) {
      return "";
    }
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    if (!code || typeof code !== "string") return code;
    try {
      return new CleanCSS({}).minify(code).styles;
    } catch (err) {
      // If CleanCSS fails, return original so build doesn't crash
      console.warn("cssmin failed:", err);
      return code;
    }
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

        // limit filter for arrays
eleventyConfig.addFilter("limit", function (arr, limit) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.slice(0, limit);
});


eleventyConfig.addFilter("exclude", (arr, exclude) => arr.filter(el => el !== exclude));

  // Collections
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/posts/**/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagsObject = {};
    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        tagsObject[tag] = (tagsObject[tag] || 0) + 1;
      });
    });
    return Object.keys(tagsObject).sort();
  });

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Watch targets (does not compile Sass — see note)
  eleventyConfig.addWatchTarget("./src/js/");

  // Markdown configuration
  const md = markdownIt({ html: true, breaks: true, linkify: true }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
  });
  eleventyConfig.setLibrary("md", md);

  // Template formats and engines
  eleventyConfig.setTemplateFormats(["html", "md", "njk", "11ty.js"]);

  // Opt-out / notes about deep merge:
  // Eleventy does deep data merging by default in modern versions.
  // If you want to opt-out you can call:
  // eleventyConfig.setDataDeepMerge(false);

  // Enable more permissive passthrough for assets in _includes or data folders if needed
  eleventyConfig.setServerOptions && eleventyConfig.setServerOptions({ liveReload: true });

  // Return config
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    passthroughFileCopy: true,
    // You can set useGitIgnore: false if you want Eleventy to watch files ignored by git
    // useGitIgnore: false,
  };
}
