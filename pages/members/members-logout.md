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
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.logout();
  }
</script>
<p>If you are not redirected automatically, <a href="/">return to the homepage</a>.</p>
