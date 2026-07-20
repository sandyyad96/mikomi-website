/* ============================================================
   MIKOMI INSTITUTE OF JAPANESE LANGUAGE — script.js
   Vanilla JS. No dependencies. GitHub Pages friendly.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Single source of truth: WhatsApp link ---------- */
  var WHATSAPP_URL =
    "https://wa.me/918178795615?text=Hi%20Mikomi!%20My%20name%20is%20____________.%0A%0AI%20am%20interested%20in:%0A%E2%98%90%20JLPT%20N5%0A%E2%98%90%20JLPT%20N4%0A%E2%98%90%20JLPT%20N3%0A%E2%98%90%20JLPT%20N2%0A%0AI%20I%20am%20a:%0A%E2%98%90%20Student%0A%E2%98%90%20Working%20Professional%0A%0APlease%20share%20the%20next%20available%20batch%20details.";

  function wireWhatsApp() {
    var links = document.querySelectorAll(".wa-link");
    links.forEach(function (el) {
      el.setAttribute("href", WHATSAPP_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Loader ---------- */
  function initLoader() {
    var loader = document.getElementById("loader");
    if (!loader) return;
    window.addEventListener("load", function () {
      setTimeout(function () { loader.classList.add("hidden"); }, 650);
    });
    // Safety: never trap the user behind the loader
    setTimeout(function () { loader.classList.add("hidden"); }, 4000);
  }

  /* ---------- Header scroll state + scroll progress ---------- */
  function initScroll() {
    var header = document.getElementById("header");
    var progress = document.getElementById("scrollProgress");
    var backTop = document.getElementById("backTop");

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle("scrolled", y > 20);

      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

      if (backTop) backTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // subtle stagger for siblings
          var delay = Math.min(i * 60, 240);
          setTimeout(function () { el.classList.add("in"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Counter animation ---------- */
  function initCounters() {
    var counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var dur = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + (target >= 100 ? "+" : "");
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Cherry blossom petals ---------- */
  function initPetals() {
    var layer = document.getElementById("petalLayer");
    if (!layer) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var COUNT = window.innerWidth < 760 ? 8 : 16;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var left = (i / COUNT) * 100 + (i * 7) % 9;   // deterministic spread, no Math.random dependence
      var size = 8 + (i % 4) * 3;
      var dur = 7 + (i % 5) * 2;
      var delay = (i % 6) * 1.4;
      p.style.left = left + "%";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = delay + "s";
      p.style.opacity = 0.4 + (i % 4) * 0.15;
      layer.appendChild(p);
    }
  }

  /* ---------- Testimonials carousel ---------- */
  function initCarousel() {
    var track = document.getElementById("carouselTrack");
    var dotsWrap = document.getElementById("carouselDots");
    var prev = document.getElementById("prevBtn");
    var next = document.getElementById("nextBtn");
    if (!track) return;

    var slides = track.children.length;
    var index = 0;
    var timer = null;

    for (var i = 0; i < slides; i++) {
      (function (n) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Go to testimonial " + (n + 1));
        b.addEventListener("click", function () { go(n); reset(); });
        dotsWrap.appendChild(b);
      })(i);
    }
    var dots = dotsWrap.children;

    function go(n) {
      index = (n + slides) % slides;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("active", d === index);
    }
    function auto() { timer = setInterval(function () { go(index + 1); }, 6000); }
    function reset() { clearInterval(timer); auto(); }

    if (next) next.addEventListener("click", function () { go(index + 1); reset(); });
    if (prev) prev.addEventListener("click", function () { go(index - 1); reset(); });

    // Swipe support
    var startX = 0;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { go(dx < 0 ? index + 1 : index - 1); reset(); }
    });

    go(0);
    auto();
  }

  /* ---------- Popup: timed (20s) + exit intent ---------- */
  function initPopup() {
    var overlay = document.getElementById("popupOverlay");
    var popup = document.getElementById("popup");
    var closeBtn = document.getElementById("popupClose");
    if (!popup) return;

    var shown = false;

    function open(asModal) {
      if (shown) return;
      shown = true;
      if (asModal) { popup.classList.add("center-modal"); overlay.classList.add("show"); overlay.setAttribute("aria-hidden", "false"); }
      popup.classList.add("show");
      popup.setAttribute("aria-hidden", "false");
    }
    function close() {
      popup.classList.remove("show");
      overlay.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");
    }

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    // Timed floating popup after 20s (bottom-left, non-blocking)
    setTimeout(function () { open(false); }, 20000);

    // Exit intent (desktop): mouse leaves viewport top -> modal
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 0) { open(true); }
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* Exposed so pages that inject cards after load (e.g. Learning Center)
     can re-run the reveal observer over the new elements. */
  window.MikomiReveal = initReveal;
  window.MikomiWhatsApp = wireWhatsApp;

  /* ---------- Init all ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    wireWhatsApp();
    initLoader();
    initScroll();
    initNav();
    initReveal();
    initCounters();
    initPetals();
    initCarousel();
    initPopup();
    initYear();
  });
})();
