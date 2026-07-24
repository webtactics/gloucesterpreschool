---
title: "Members Logout"
slug: members-logout
content_alias: members-logout
type: mams_protected_logoutlink
parent: members
menu_text: Members Logout
show_in_menu: true
active: true
protected: true
create_date: 2022-03-25
modified_date: 2022-08-18

permalink: /members/members-logout/
eleventyNavigation:
  parent: Members
  key: Members Logout
  order: 1

---

<p>Logging you out&hellip;</p>
<p><button class="button" data-identity-action="logout">Log Out</button></p>

<script>
  // The Netlify Identity widget script loads further down the page, so it
  // isn't ready yet if we try to call it immediately here. Wait for the
  // window "load" event (fires after all scripts have run) to attempt an
  // automatic logout; the button above is a guaranteed fallback either way.
  window.addEventListener("load", function () {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  });
</script>
