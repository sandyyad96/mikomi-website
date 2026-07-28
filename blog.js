/* ============================================================
   MIKOMI — BLOG / ARTICLE TEMPLATE
   Vanilla JS, no dependencies. Shared by every Learning Hub
   article. Reading time, published/updated dates, breadcrumbs,
   related posts and prev/next are hand-authored per article
   (there is no build step) — this file only handles interactive
   chrome: the reading progress bar, sticky-TOC scrollspy, the
   mobile TOC toggle, and share buttons.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Reading progress bar (scoped to <article>) ---------- */
  function initProgress() {
    var bar = document.getElementById("articleProgress");
    var article = document.querySelector(".article-content");
    if (!bar || !article) return;

    function onScroll() {
      var rect = article.getBoundingClientRect();
      var articleTop = rect.top + window.scrollY;
      var articleHeight = article.offsetHeight;
      var viewportH = window.innerHeight;
      var y = window.scrollY;

      var total = articleHeight - viewportH * 0.4;
      var done = y - articleTop + viewportH * 0.4;
      var pct = total > 0 ? Math.min(Math.max(done / total, 0), 1) : 0;
      bar.style.width = (pct * 100) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- Sticky TOC: scrollspy + mobile toggle ----------
     Position-based rather than IntersectionObserver-based: a
     narrow "active band" can miss a heading entirely when the
     scroll distance between headings exceeds the band in a single
     jump (fast trackpad flicks, Page Down, programmatic scrolls).
     Comparing scroll position against cached heading offsets is
     immune to that — it always resolves to *some* heading. */
  function initToc() {
    var toc = document.getElementById("articleToc");
    if (!toc) return;

    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    var targets = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    if (!targets.length) return;

    var positions = [];
    function measure() {
      positions = targets.map(function (t) { return t.getBoundingClientRect().top + window.scrollY; });
    }
    measure();

    function setActive(id) {
      links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
    }

    function onScroll() {
      var y = window.scrollY + 130;
      var idx = 0;
      for (var i = 0; i < positions.length; i++) {
        if (positions[i] <= y) idx = i; else break;
      }
      setActive(targets[idx].id);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { measure(); onScroll(); });
    onScroll();

    var toggle = toc.querySelector(".article-toc-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () { toc.classList.toggle("open"); });
    }
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.innerWidth <= 980) toc.classList.remove("open");
      });
    });
  }

  /* ---------- Share buttons ---------- */
  function initShare() {
    var bar = document.querySelector(".share-bar");
    if (!bar) return;

    var url = window.location.href;
    var title = document.title;

    var wa = bar.querySelector(".share-btn.wa");
    if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(title + " " + url);

    var tw = bar.querySelector(".share-btn.tw");
    if (tw) tw.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url);

    var li = bar.querySelector(".share-btn.li");
    if (li) li.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);

    var fb = bar.querySelector(".share-btn.fb");
    if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);

    var copyBtn = bar.querySelector(".share-btn.copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        function done() {
          var original = copyBtn.textContent;
          copyBtn.textContent = "✓";
          copyBtn.classList.add("copied");
          setTimeout(function () {
            copyBtn.textContent = original;
            copyBtn.classList.remove("copied");
          }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done).catch(function () {});
        } else {
          var tmp = document.createElement("textarea");
          tmp.value = url;
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(tmp);
          done();
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProgress();
    initToc();
    initShare();
  });
})();
