/* ============================================================
   MIKOMI — LEARNING CENTER
   Vanilla JS, no dependencies. Phase 1: no backend.
   Shared behaviour (loader, nav, reveal, WhatsApp links, popup,
   back-to-top, scroll progress) is handled by script.js.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Resource catalogue (single source of truth) ----------
     `file` is null for resources that are not published yet; those
     render as "Coming Soon" with the download button disabled.       */
  var RESOURCES = [
    {
      id: "hiragana",
      title: "Hiragana Practice Workbook",
      level: "JLPT N5",
      category: "n5",
      pages: 14,
      cover: "images/covers/hiragana.png",
      glyph: "あ",
      desc: "Master all 46 hiragana characters with guided stroke order and full writing practice.",
      file: "Resources/Mikomi_Hiragana_Practice_Workbook.pdf"
    },
    {
      id: "katakana",
      title: "Katakana Practice Workbook",
      level: "JLPT N5",
      category: "n5",
      pages: 14,
      cover: "images/covers/katakana.png",
      glyph: "ア",
      desc: "Learn katakana with the same proven stroke-by-stroke method used in our live classes.",
      file: "Resources/Mikomi_Katakana_Practice_Workbook.pdf"
    },
    {
      id: "vocabulary",
      title: "500 Essential JLPT N5 Vocabulary",
      level: "JLPT N5",
      category: "n5",
      pages: 75,
      cover: "images/covers/vocabulary.png",
      glyph: "語",
      desc: "500 must-know N5 words across 22 themed categories, with readings and meanings.",
      file: "Resources/Mikomi_500_JLPT_N5_Vocabulary.pdf"
    },
    {
      id: "kanji",
      title: "JLPT N5 Kanji Book",
      level: "JLPT N5",
      category: "n5",
      pages: 162,
      cover: null,
      glyph: "漢",
      desc: "Every kanji required for JLPT N5, with readings, meanings and practice grids.",
      file: "Resources/N5 Kanji Book (1).pdf"
    },
    {
      id: "grammar",
      title: "JLPT N5 Grammar Guide",
      level: "JLPT N5",
      category: "cheatsheets",
      pages: null,
      cover: null,
      glyph: "文",
      desc: "Every core N5 grammar pattern explained simply, with example sentences.",
      file: null
    },
    {
      id: "planner",
      title: "4-Month JLPT N5 Study Planner",
      level: "All Levels",
      category: "planners",
      pages: 11,
      cover: "images/covers/planner.png",
      glyph: "計",
      desc: "A week-by-week roadmap that takes you from absolute beginner to JLPT N5 ready.",
      file: "Resources/Mikomi_4-Month_JLPT_N5_Study_Planner.pdf"
    }
  ];

  var CATEGORIES = [
    { id: "all",         icon: "📚", name: "All Resources", note: "Everything free" },
    { id: "n5",          icon: "🌸", name: "JLPT N5",       note: "Beginner" },
    { id: "n4",          icon: "🎋", name: "JLPT N4",       note: "Elementary" },
    { id: "planners",    icon: "🗓️", name: "Study Planners", note: "Stay on track" },
    { id: "careers",     icon: "💼", name: "Career Guides",  note: "Jobs in Japanese" },
    { id: "cheatsheets", icon: "⚡", name: "Cheat Sheets",   note: "Quick revision" }
  ];

  /* ---------- Helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Render category cards ---------- */
  function renderCategories() {
    var wrap = document.getElementById("lcCategories");
    if (!wrap) return;

    CATEGORIES.forEach(function (cat) {
      var btn = el("button", "lc-cat reveal");
      btn.type = "button";
      btn.setAttribute("data-cat", cat.id);
      btn.setAttribute("aria-pressed", cat.id === "all" ? "true" : "false");
      if (cat.id === "all") btn.classList.add("active");
      btn.innerHTML =
        '<div class="lc-cat-icon" aria-hidden="true">' + cat.icon + "</div>" +
        "<h3>" + escapeHtml(cat.name) + "</h3>" +
        "<p>" + escapeHtml(cat.note) + "</p>";
      btn.addEventListener("click", function () { filterBy(cat.id); });
      wrap.appendChild(btn);
    });
  }

  /* ---------- Render resource cards ---------- */
  function renderResources() {
    var wrap = document.getElementById("lcResources");
    if (!wrap) return;

    RESOURCES.forEach(function (r) {
      var card = el("article", "lc-card reveal");
      card.setAttribute("data-cat", r.category);

      var isSoon = !r.file;
      if (isSoon) card.classList.add("is-soon");

      /* Cover: real PDF cover when available, branded glyph otherwise */
      var coverInner = r.cover
        ? '<img src="' + r.cover + '" alt="Cover of ' + escapeHtml(r.title) + '" loading="lazy" width="452" height="640" />'
        : '<div class="lc-cover-glyph" aria-hidden="true">' + r.glyph +
          "<small>" + escapeHtml(r.level) + "</small></div>";

      var pages = r.pages ? '<span>📄 ' + r.pages + " pages</span>" : "<span>📄 Coming soon</span>";

      var btn = isSoon
        ? '<button class="btn btn-primary btn-block is-disabled" disabled aria-disabled="true">Coming Soon</button>'
        : '<button class="btn btn-primary btn-block lc-dl" type="button" data-id="' + r.id + '">⬇ Download Free PDF</button>';

      card.innerHTML =
        '<div class="lc-cover">' +
          '<span class="lc-badge-free">Free</span>' +
          '<span class="lc-badge-level">' + escapeHtml(r.level) + "</span>" +
          coverInner +
        "</div>" +
        '<div class="lc-card-body">' +
          "<h3>" + escapeHtml(r.title) + "</h3>" +
          '<p class="lc-card-desc">' + escapeHtml(r.desc) + "</p>" +
          '<div class="lc-meta">' + pages + "<span>🎌 " + escapeHtml(r.level) + "</span></div>" +
          btn +
        "</div>";

      wrap.appendChild(card);
    });

    /* Wire download buttons */
    wrap.querySelectorAll(".lc-dl").forEach(function (b) {
      b.addEventListener("click", function () { openModal(b.getAttribute("data-id")); });
    });
  }

  /* ---------- Category filtering ---------- */
  function filterBy(catId) {
    document.querySelectorAll(".lc-cat").forEach(function (c) {
      var on = c.getAttribute("data-cat") === catId;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", String(on));
    });

    var shown = 0;
    document.querySelectorAll(".lc-card").forEach(function (card) {
      var match = catId === "all" || card.getAttribute("data-cat") === catId;
      card.style.display = match ? "" : "none";
      if (match) shown++;
    });

    var empty = document.getElementById("lcEmpty");
    if (empty) empty.style.display = shown === 0 ? "" : "none";
  }

  /* ---------- Download modal ---------- */
  var modal, overlay, form, current = null, lastFocus = null;

  function openModal(id) {
    current = RESOURCES.filter(function (r) { return r.id === id; })[0];
    if (!current || !current.file) return;

    lastFocus = document.activeElement;
    var t = document.getElementById("lcModalResource");
    if (t) t.textContent = current.title;

    overlay.classList.add("show");
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    var first = document.getElementById("lcName");
    if (first) setTimeout(function () { first.focus(); }, 120);
  }

  function closeModal() {
    overlay.classList.remove("show");
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearErrors();
    if (lastFocus) lastFocus.focus();
  }

  function clearErrors() {
    if (!form) return;
    form.querySelectorAll(".lc-field").forEach(function (f) { f.classList.remove("has-error"); });
    form.querySelectorAll("input").forEach(function (i) { i.removeAttribute("aria-invalid"); });
  }

  function setError(inputId, on) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var field = input.closest(".lc-field");
    if (field) field.classList.toggle("has-error", on);
    if (on) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  /* Triggers the actual file download without navigating away */
  function startDownload(res) {
    var a = document.createElement("a");
    a.href = encodeURI(res.file);
    a.download = res.file.split("/").pop();
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function initModal() {
    modal = document.getElementById("lcModal");
    overlay = document.getElementById("lcModalOverlay");
    form = document.getElementById("lcForm");
    if (!modal || !overlay || !form) return;

    var closeBtn = document.getElementById("lcModalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var name = document.getElementById("lcName").value.trim();
      var phone = document.getElementById("lcPhone").value.trim();
      var ok = true;

      if (name.length < 2) { setError("lcName", true); ok = false; }

      // Accept 10-digit Indian mobile numbers, with or without +91 / spaces / dashes
      var digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 10 || digits.length > 13) { setError("lcPhone", true); ok = false; }

      if (!ok) return;

      // Phase 1: no backend. Close the modal and start the download.
      var res = current;
      closeModal();
      form.reset();
      if (res) setTimeout(function () { startDownload(res); }, 220);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderCategories();
    renderResources();
    initModal();

    // Re-run the shared reveal observer over the freshly injected cards.
    if (window.MikomiReveal) window.MikomiReveal();
  });
})();
