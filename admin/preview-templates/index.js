import Post from "/admin/preview-templates/post.js";
import Page from "/admin/preview-templates/page.js";

// Register the Post component as the preview for entries in the blog collection
CMS.registerPreviewTemplate("blog", Post);

// Every "pages_*" collection (pages/, pages/about, pages/contact, etc.) shares the same Page preview
["pages", "pages_about", "pages_contact", "pages_learning_environments", "pages_members", "pages_parents_information"]
  .forEach(name => CMS.registerPreviewTemplate(name, Page));

CMS.registerPreviewStyle("/_includes/assets/css/inline.css");
// Register any CSS file on the home page as a preview style
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
  });
