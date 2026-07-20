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

  /* ---------- Lead capture (Supabase-backed) ----------
     Registration is remembered in localStorage so a visitor is
     only ever asked once per browser. ---------------------- */
  var LS_REGISTERED = "mikomi_registered";
  var LS_NAME = "mikomi_name";
  var LS_WHATSAPP = "mikomi_whatsapp";

  function isRegistered() {
    return localStorage.getItem(LS_REGISTERED) === "true";
  }

  /* Accepts 9876543210, +919876543210, 919876543210 (with any
     spaces/dashes). Returns the canonical 10-digit number, or
     null when the input isn't a valid Indian mobile number. */
  function normalizeIndianMobile(raw) {
    var digits = String(raw || "").replace(/\D/g, "");
    if (digits.length === 12 && digits.indexOf("91") === 0) digits = digits.slice(2);
    else if (digits.length === 11 && digits.indexOf("0") === 0) digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      b.addEventListener("click", function () { handleDownloadClick(b.getAttribute("data-id")); });
    });
  }

  /* Reusable entry point for every download button on the page:
     returning, registered visitors skip straight to the file;
     everyone else sees the lead-capture modal first. */
  function handleDownloadClick(id) {
    var res = RESOURCES.filter(function (r) { return r.id === id; })[0];
    if (!res || !res.file) return;

    if (isRegistered()) {
      startDownload(res);
    } else {
      openModal(id);
    }
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
    hideStatus();
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

  function showStatus(type, msg) {
    var status = document.getElementById("lcModalStatus");
    if (!status) return;
    status.textContent = msg;
    status.className = "lc-modal-status show " + (type === "error" ? "is-error" : "is-success");
  }

  function hideStatus() {
    var status = document.getElementById("lcModalStatus");
    if (!status) return;
    status.textContent = "";
    status.className = "lc-modal-status";
  }

  function setSubmitting(isSubmitting) {
    var btn = document.getElementById("lcSubmitBtn");
    if (!btn) return;
    btn.disabled = isSubmitting;
    btn.textContent = isSubmitting ? "Saving..." : "Get Free Access";
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
      hideStatus();

      var name = document.getElementById("lcName").value.trim();
      var phoneRaw = document.getElementById("lcPhone").value.trim();
      var email = document.getElementById("lcEmail").value.trim();
      var res = current;
      var ok = true;

      if (name.length < 2) { setError("lcName", true); ok = false; }

      var whatsapp = normalizeIndianMobile(phoneRaw);
      if (!whatsapp) { setError("lcPhone", true); ok = false; }

      if (email && !isValidEmail(email)) { setError("lcEmail", true); ok = false; }

      if (!ok || !res) return;

      setSubmitting(true);

      // Shared by both "new lead saved" and "whatsapp already registered"
      // (23505) outcomes — both are a successful registration from the
      // visitor's point of view.
      function completeRegistration(message) {
        localStorage.setItem(LS_REGISTERED, "true");
        localStorage.setItem(LS_NAME, name);
        localStorage.setItem(LS_WHATSAPP, whatsapp);

        showStatus("success", message);

        setTimeout(function () {
          closeModal();
          form.reset();
          startDownload(res);
        }, 1000);
      }

      window.MikomiSupabase.saveLead({
        name: name,
        whatsapp: whatsapp,
        email: email,
        resource: res.title
      }).then(function () {
        completeRegistration("🎉 Welcome to Mikomi Learning Center! Your resource is downloading...");
      }).catch(function (err) {
        // Same WhatsApp number already exists (unique constraint) —
        // treat as a returning visitor, not an error.
        if (err && err.code === "23505") {
          completeRegistration("Welcome back! Your resource is downloading.");
          return;
        }

        var offline = typeof navigator !== "undefined" && navigator.onLine === false;
        showStatus("error", offline
          ? "No internet connection. Please check your connection and try again."
          : "Unable to save your details right now. Please try again.");
        if (window.console) console.error("Mikomi lead save failed:", err);
      }).finally(function () {
        setSubmitting(false);
      });
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
