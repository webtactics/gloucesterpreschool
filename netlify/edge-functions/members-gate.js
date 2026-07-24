// Real edge-level protection for the /members/ section.
//
// Netlify's classic `Role=` condition in _redirects only works on Enterprise
// plans (confirmed: on this site's plan it silently serves the page to
// everyone, logged in or not). This Edge Function replaces it: it reads the
// nf_jwt cookie Identity already sets in the browser, verifies it via
// @netlify/identity, and only lets the request through if the user has the
// "guardian" or "staff" role. Otherwise it returns the site's own /401.html
// with a real 401 status.
import { getUser } from "npm:@netlify/identity@2";

const ALLOWED_ROLES = ["guardian", "staff"];

export default async (request, context) => {
  const user = await getUser();
  const roles = (user && (user.roles || (user.app_metadata && user.app_metadata.roles))) || [];
  const authorized = !!user && roles.some((role) => ALLOWED_ROLES.includes(role));

  if (authorized) {
    return context.next();
  }

  const unauthorizedPage = await fetch(new URL("/401.html", request.url));
  return new Response(await unauthorizedPage.text(), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

export const config = {
  path: [
    "/members/*",
    "/static/pdf/policies/*",
    "/static/pdf/risk/*",
    "/static/pdf/qip/*",
    "/static/pdf/newsletters/*",
    "/uploads/pdf/policies/*",
  ],
  excludedPath: ["/members/forgot-password/", "/members/members-logout/"],
};
