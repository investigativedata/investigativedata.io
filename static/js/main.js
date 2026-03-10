// Drawer toggle
(function () {
  var burger = document.getElementById("burger-btn");
  var drawer = document.getElementById("drawer");
  var overlay = document.getElementById("drawer-overlay");
  var closeBtn = document.getElementById("drawer-close");
  if (!burger || !drawer) return;

  function open() {
    drawer.classList.add("drawer--open");
  }
  function close() {
    drawer.classList.remove("drawer--open");
  }
  burger.addEventListener("click", open);
  if (overlay) overlay.addEventListener("click", close);
  if (closeBtn) closeBtn.addEventListener("click", close);

  // Close on link click
  drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", close);
  });
})();

// Scroll-based background color switching
(function () {
  var wrapper = document.getElementById("page-wrapper");
  var header = document.getElementById("site-header");
  if (!wrapper) return;

  var sections = document.querySelectorAll("[data-background-color]");
  if (!sections.length) return;

  var colors = ["white", "black", "green", "orange", "yellow", "purple"];

  function update() {
    var scrollY = window.scrollY;
    var height = window.innerHeight;
    var midpoint = scrollY + height / 2;
    var currentColor = null;

    for (var i = sections.length - 1; i >= 0; i--) {
      var rect = sections[i].getBoundingClientRect();
      var top = rect.top + scrollY;
      if (midpoint >= top) {
        currentColor = sections[i].getAttribute("data-background-color");
        break;
      }
    }

    if (currentColor) {
      colors.forEach(function (c) {
        wrapper.classList.remove("bg--" + c);
        if (header) header.classList.remove("header--bg-" + c);
      });
      wrapper.classList.add("bg--" + currentColor);
      if (header) header.classList.add("header--bg-" + currentColor);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
