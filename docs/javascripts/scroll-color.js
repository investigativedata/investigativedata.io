/* Scroll-based background color switching.
 * Ported from static/js/main.js. The drawer-toggle block is intentionally
 * omitted – mkdocs-material's #__drawer checkbox already drives the
 * right-side overlay nav (see docs/stylesheets/site.css).
 *
 * Convention: each <section class="screen ..."> wrapper carries a
 * data-background-color="white|black|green|orange|yellow|purple" attribute.
 * As the viewport midpoint crosses the section, this script applies a
 * `bg--<color>` class to <body> and `md-header--bg-<color>` to .md-header
 * so the page background and header tint match the current section.
 *
 * Wrapped in document$.subscribe so it re-runs on every instant-nav
 * page transition (mkdocs-material navigation.instant feature).
 *
 * IMPORTANT: the scroll/resize listeners live on `window`, which survives
 * instant navigation. Each route change must therefore tear down the previous
 * page's listeners and clear the leftover bg-- classes BEFORE wiring up the new
 * page — otherwise stale closures keep re-applying the old page's section
 * colors on scroll, mixing up backgrounds.
 */

(function () {
  var COLORS = ["white", "black", "green", "orange", "yellow", "purple"];

  // Removes the previously-attached page's listeners; reset on each route change.
  var teardown = null;

  function clearColors(body, header) {
    COLORS.forEach(function (c) {
      body.classList.remove("bg--" + c);
      if (header) header.classList.remove("md-header--bg-" + c);
    });
  }

  function attach() {
    // Route change: drop the previous page's scroll/resize listeners and clear
    // any leftover color classes so we start from a clean slate every time.
    if (teardown) {
      teardown();
      teardown = null;
    }

    var sections = document.querySelectorAll("[data-background-color]");
    var header = document.querySelector(".md-header");
    var body = document.body;

    clearColors(body, header);

    // No themed sections on this page – stay reset (classes already cleared).
    if (!sections.length) return;

    // Cache section offsets so each scroll event doesn't trigger N
    // getBoundingClientRect() calls (each one forces a layout reflow).
    var offsets = [];
    function recompute() {
      offsets = [];
      for (var i = 0; i < sections.length; i++) {
        offsets.push({
          top: sections[i].getBoundingClientRect().top + window.scrollY,
          color: sections[i].getAttribute("data-background-color"),
        });
      }
    }

    var lastColor = null;
    function apply() {
      var midpoint = window.scrollY + window.innerHeight / 2;
      var current = offsets[0].color;
      for (var i = offsets.length - 1; i >= 0; i--) {
        if (midpoint >= offsets[i].top) {
          current = offsets[i].color;
          break;
        }
      }
      // Bail early if the active color didn't change – avoids touching the
      // DOM and re-triggering the bg-color transition on every scroll tick.
      if (current === lastColor) return;
      lastColor = current;

      // Cheaper than `.toggle` × 6: remove all bg-- classes via className
      // rewrite, then add the one we want.
      var bodyCls = body.className.replace(/\bbg--\S+/g, "").trim();
      body.className = bodyCls + " bg--" + current;
      if (header) {
        var headerCls = header.className.replace(/\bmd-header--bg-\S+/g, "").trim();
        header.className = headerCls + " md-header--bg-" + current;
      }
    }

    // Throttle scroll handling to one rAF tick (~16ms instead of every event).
    var pending = false;
    function onScroll() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        apply();
      });
    }
    function onResize() {
      recompute();
      apply();
    }

    recompute();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Expose how to detach these exact handlers on the next route change.
    teardown = function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(attach);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }
})();
