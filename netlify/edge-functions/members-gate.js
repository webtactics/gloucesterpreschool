// Real edge-level protection for the /members/ section.
//
// Netlify's classic `Role=` condition in _redirects only works on Enterprise
// plans (confirmed: on this site's plan it silently serves the page to
// everyone, logged in or not). The obvious replacement, importing
// @netlify/identity's getUser(), doesn't work either — it wraps gotrue-js,
// a browser-oriented library that expects `window` and fails to bundle in
// the Deno edge runtime.
//
// So instead of verifying the JWT ourselves, this asks Netlify's own
// Identity service to do it: it reads the nf_jwt cookie the widget already
// sets in the browser and passes it straight to GoTrue's own /user endpoint
// as a Bearer token. That endpoint returns the full user record (including
// app_metadata.roles) if the token is valid, or fails if it isn't — no
// crypto, no secrets, no npm dependency, plain Web APIs only.
const ALLOWED_ROLES = ["guardian", "staff"];

function getCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

async function getAuthorizedUser(request) {
  const token = getCookie(request, "nf_jwt");
  if (!token) return null;

  const response = await fetch(new URL("/.netlify/identity/user", request.url), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  return response.json();
}

export default async (request, context) => {
  const user = await getAuthorizedUser(request);
  const roles = (user && user.app_metadata && user.app_metadata.roles) || [];
  const authorized = roles.some((role) => ALLOWED_ROLES.includes(role));

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
