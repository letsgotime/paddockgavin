/**
 * Every door back to the console remembers where you were standing.
 *
 * The tool pages gate on a session and, when there is not one, offer a link
 * to /console/. Signing in there used to land you on HQ: the page you were
 * sent to sign in FOR was gone, with nothing on screen to say how to reach it
 * again. A vendor approval was lost that way, by somebody who signed in, saw
 * a dashboard, and reasonably assumed they had arrived.
 *
 * This stamps the current address onto those links as ?next=, which the
 * console honours after a password sign in, after a code, and as the callback
 * on a mailed link. Doing it here rather than in seven hand-edited hrefs means
 * a link added later is covered without anybody remembering this rule, and a
 * page can still opt out by writing its own next.
 *
 * Classic script, not a module: these pages call it from plain <script> scope
 * and several of them run their gate before any module has evaluated.
 */
(function () {
  "use strict";

  /* The two doors: signing in, and rescuing a password. Both end by sending
     somebody somewhere, and both used to send them to HQ. */
  var DOORS = ["/console", "/reset"];

  function isDoor(a) {
    /* href is resolved against the document, so this compares real URLs
       rather than the spelling in the markup. */
    if (a.origin !== location.origin) return false;
    for (var i = 0; i < DOORS.length; i++) {
      if (a.pathname === DOORS[i] || a.pathname.indexOf(DOORS[i] + "/") === 0) return true;
    }
    return false;
  }

  function stamp(a) {
    if (!isDoor(a)) return;
    /* A door does not send you back to itself. */
    if (location.pathname.indexOf("/console") === 0 || location.pathname.indexOf("/reset") === 0) return;
    var q = new URLSearchParams(a.search);
    /* A page that set its own next knows better than this does. */
    if (q.get("next")) return;
    q.set("next", location.pathname + location.search + location.hash);
    a.search = q.toString();
  }

  function sweep(root) {
    var links = (root || document).querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) stamp(links[i]);
  }

  /* Run now for markup already parsed, and again at DOMContentLoaded for the
     rest. Most of these gates are drawn by script after a session check, so
     also watch for nodes arriving later: a link created in response to
     "you are signed out" is exactly the one that matters, and it does not
     exist yet at either of the first two moments. */
  sweep();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      sweep();
    });
  }

  if (typeof MutationObserver === "function") {
    var pending = false;
    new MutationObserver(function () {
      /* Setting a.search mutates the DOM and would re-enter this callback.
         Coalescing to one pass per frame keeps that from becoming a loop. */
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        sweep();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
