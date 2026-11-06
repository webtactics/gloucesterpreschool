import Post from "/admin/preview-templates/post.js";
import Page from "/admin/preview-templates/page.js";

// Register the Post component as the preview for entries in the blog collection
CMS.registerPreviewTemplate("blog", Post);

// Every "pages_*" collection (pages/, pages/about, pages/contact, etc.) shares the same Page preview
["pages", "pages_about", "pages_contact", "pages_learning_environments", "pages_members", "pages_parents_information"]
  .forEach(name => CMS.registerPreviewTemplate(name, Page));

// The site inlines its CSS into <style> blocks (there is no standalone
// stylesheet URL), so pull both linked stylesheets and inline <style> blocks
// off the home page and hand them to the preview pane.
fetch("/")
  .then(response => response.text())
  .then(html => {
    const f = document.createElement("html");
    f.innerHTML = html;
    Array.from(f.getElementsByTagName("link")).forEach(tag => {
      if (tag.rel == "stylesheet" && !tag.media) {
        CMS.registerPreviewStyle(tag.href);
      }
    });
    Array.from(f.getElementsByTagName("style")).forEach(tag => {
      if (tag.textContent.trim()) {
        CMS.registerPreviewStyle(tag.textContent, { raw: true });
      }
    });
  });
