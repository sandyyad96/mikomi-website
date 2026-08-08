/* ============================================================
   MIKOMI — LEARNING HUB
   Vanilla JS, no dependencies. Shared behaviour (loader, nav,
   reveal, WhatsApp links, popup, back-to-top, scroll progress)
   is handled by script.js.

   This file is the single source of truth for the article
   catalogue — the hub page renders from it, and each article's
   "Related" / breadcrumb data should stay in sync with it by hand
   (there is no build step on this site, so entries here are
   duplicated manually into each article's schema.org JSON-LD).
   ============================================================ */
(function () {
  "use strict";

  var CATEGORIES = [
    { id: "all",    icon: "📚", name: "All Guides",              note: "Everything" },
    { id: "jobs",   icon: "💼", name: "Jobs in Japan",            note: "Careers & hiring" },
    { id: "visa",   icon: "🛂", name: "Visa & Immigration",       note: "SSW, TITP, Engineer" },
    { id: "jlpt",   icon: "🎌", name: "JLPT & Language",          note: "Study roadmaps" },
    { id: "salary", icon: "💰", name: "Salary & Living Costs",    note: "Money matters" },
    { id: "career", icon: "🗣️", name: "Interview & Career Prep",  note: "Get hired" }
  ];

  /* `file` is null for guides not published yet — they render as
     "Coming Soon" cards so the roadmap is visible without linking
     to thin/empty pages (bad for SEO, bad for readers). */
  var ARTICLES = [
    {
      id: "job-in-japan-guide",
      title: "How to Get a Job in Japan from India: The Complete Guide",
      excerpt: "The full path from zero Japanese to a job offer in Japan — eligibility, visa routes, required JLPT level, realistic timelines, costs, and the mistakes that derail most applications.",
      category: "jobs",
      tags: ["jobs in japan", "ssw visa", "jlpt", "work visa", "career", "titp", "engineer visa"],
      readingTime: "15 min read",
      published: "28 Jul 2026",
      updated: "28 Jul 2026",
      glyph: "働",
      file: "blog/how-to-get-a-job-in-japan-from-india.html",
      trending: true
    },
    {
      id: "ssw-visa-explained",
      title: "SSW Visa Explained for Indians",
      excerpt: "Eligibility, industries, salary ranges, the language and skills exams, and how the Specified Skilled Worker visa compares with TITP.",
      category: "visa",
      tags: ["ssw visa", "specified skilled worker", "visa"],
      readingTime: "7 min read",
      published: "28 Jul 2026",
      updated: "28 Jul 2026",
      glyph: "査",
      file: "blog/ssw-visa-explained-for-indians.html",
      trending: true
    },
    {
      id: "engineer-vs-ssw-vs-titp",
      title: "Engineer Visa vs SSW vs TITP: Which Should You Choose?",
      excerpt: "A side-by-side comparison of career growth, salary, path to permanent residency, and Japanese language requirements across all three routes.",
      category: "visa",
      tags: ["engineer visa", "ssw", "titp", "comparison"],
      readingTime: "5 min read",
      published: "28 Jul 2026",
      updated: "28 Jul 2026",
      glyph: "比",
      file: "blog/engineer-vs-ssw-vs-titp.html",
      trending: false
    },
    {
      id: "jlpt-n5-roadmap",
      title: "JLPT N5 Complete Roadmap",
      excerpt: "A 6-month, week-by-week study plan covering hiragana, katakana, core vocabulary, grammar and kanji — with free downloadable resources.",
      category: "jlpt",
      tags: ["jlpt n5", "study plan", "hiragana", "katakana"],
      readingTime: "6 min read",
      published: "28 Jul 2026",
      updated: "28 Jul 2026",
      glyph: "学",
      file: "blog/jlpt-n5-complete-roadmap.html",
      trending: true
    },
    {
      id: "government-schemes-japan",
      title: "Government Schemes to Work in Japan",
      excerpt: "What 'government scheme' actually means for Japan-bound candidates, the real bilateral frameworks involved, and how to verify current details and avoid fraudulent agents.",
      category: "jobs",
      tags: ["government scheme", "overseas employment", "ssw"],
      readingTime: "5 min read",
      published: "29 Jul 2026",
      updated: "29 Jul 2026",
      glyph: "政",
      file: "blog/government-schemes-to-work-in-japan.html",
      trending: false
    },
    {
      id: "salary-in-japan-indians",
      title: "Salary in Japan for Indians (By Industry)",
      excerpt: "Engineer, IT, hotel, factory, caregiver, restaurant, construction and agriculture pay ranges, plus taxes, savings potential and cost of living.",
      category: "salary",
      tags: ["salary in japan", "wages", "savings"],
      readingTime: "5 min read",
      published: "29 Jul 2026",
      updated: "29 Jul 2026",
      glyph: "給",
      file: "blog/salary-in-japan-for-indians.html",
      trending: true
    },
    {
      id: "cost-of-living-japan",
      title: "Cost of Living in Japan: City-by-City Guide",
      excerpt: "Tokyo, Osaka, Nagoya and Fukuoka compared — rent, transport, food, internet, electricity and realistic monthly budgets.",
      category: "salary",
      tags: ["cost of living", "tokyo", "osaka", "budget"],
      readingTime: "4 min read",
      published: "29 Jul 2026",
      updated: "29 Jul 2026",
      glyph: "生",
      file: "blog/cost-of-living-in-japan.html",
      trending: false
    },
    {
      id: "japanese-levels-explained",
      title: "Japanese Language Levels Explained (N5–N1)",
      excerpt: "Difficulty, study hours, career opportunities and realistic timelines for every JLPT level, from complete beginner to fluent.",
      category: "jlpt",
      tags: ["jlpt levels", "n5", "n4", "n3", "n2", "n1"],
      readingTime: "10 min read",
      glyph: "級",
      file: null,
      trending: false
    },
    {
      id: "japanese-interview-questions",
      title: "Top Japanese Interview Questions (With Sample Answers)",
      excerpt: "Common interview questions in Japanese, romaji and English, with sample answers and Japanese business etiquette tips.",
      category: "career",
      tags: ["interview questions", "business etiquette", "keigo"],
      readingTime: "11 min read",
      published: "29 Jul 2026",
      updated: "29 Jul 2026",
      glyph: "話",
      file: "blog/top-japanese-interview-questions.html",
      trending: true
    },
    {
      id: "common-mistakes-learning-japanese",
      title: "20 Common Mistakes Indians Make While Learning Japanese",
      excerpt: "Practical, example-driven fixes for the pronunciation, grammar and study-habit mistakes that slow Indian learners down most.",
      category: "jlpt",
      tags: ["common mistakes", "learn japanese", "study tips"],
      readingTime: "9 min read",
      published: "29 Jul 2026",
      updated: "29 Jul 2026",
      glyph: "誤",
      file: "blog/20-common-mistakes-indians-make-learning-japanese.html",
      trending: true
    }
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
  function catName(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }

  /* ---------- Featured (the top live/trending article) ---------- */
  function renderFeatured() {
    var wrap = document.getElementById("hubFeatured");
    if (!wrap) return;
    var featured = ARTICLES.filter(function (a) { return a.file; })[0];
    if (!featured) { wrap.style.display = "none"; return; }

    wrap.innerHTML =
      '<div class="hub-featured-cover"><div class="hub-cover-glyph" style="font-size:5.5rem;color:#fff;opacity:.92;">' + featured.glyph + '</div></div>' +
      '<div class="hub-featured-copy">' +
        '<span class="hub-featured-tag">⭐ Editor’s Pick · ' + escapeHtml(catName(featured.category)) + '</span>' +
        '<h2>' + escapeHtml(featured.title) + '</h2>' +
        '<p>' + escapeHtml(featured.excerpt) + '</p>' +
        '<div class="hub-featured-meta"><span>⏱ ' + escapeHtml(featured.readingTime) + '</span><span>📅 Updated ' + escapeHtml(featured.updated) + '</span></div>' +
        '<a href="' + featured.file + '" class="btn btn-primary btn-lg">Read the Full Guide</a>' +
      '</div>';
  }

  /* ---------- Trending rail ---------- */
  function renderTrending() {
    var wrap = document.getElementById("hubTrending");
    if (!wrap) return;
    var items = ARTICLES.filter(function (a) { return a.trending; });

    items.forEach(function (a, i) {
      var card = el("article", "hub-trend-card reveal");
      var inner =
        '<span class="hub-trend-num">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<h4>' + escapeHtml(a.title) + '</h4>' +
        '<small>' + escapeHtml(catName(a.category)) + (a.file ? " · " + escapeHtml(a.readingTime) : " · Coming soon") + '</small>';
      if (a.file) {
        var link = el("a");
        link.href = a.file;
        link.innerHTML = inner;
        link.style.display = "block";
        card.appendChild(link);
      } else {
        card.innerHTML = inner;
        card.style.opacity = ".75";
      }
      wrap.appendChild(card);
    });
  }

  /* ---------- Category chips ---------- */
  function renderCategories() {
    var wrap = document.getElementById("hubCategories");
    if (!wrap) return;
    CATEGORIES.forEach(function (cat) {
      var btn = el("button", "hub-cat reveal");
      btn.type = "button";
      btn.setAttribute("data-cat", cat.id);
      btn.setAttribute("aria-pressed", cat.id === "all" ? "true" : "false");
      if (cat.id === "all") btn.classList.add("active");
      btn.innerHTML =
        '<div class="hub-cat-icon" aria-hidden="true">' + cat.icon + '</div>' +
        '<h3>' + escapeHtml(cat.name) + '</h3>' +
        '<p>' + escapeHtml(cat.note) + '</p>';
      btn.addEventListener("click", function () { setCategory(cat.id); });
      wrap.appendChild(btn);
    });
  }

  /* ---------- All-articles grid ---------- */
  function renderArticles() {
    var wrap = document.getElementById("hubArticles");
    if (!wrap) return;

    ARTICLES.forEach(function (a) {
      var card = el("article", "hub-card reveal");
      card.setAttribute("data-cat", a.category);
      card.setAttribute("data-search", (a.title + " " + a.excerpt + " " + a.tags.join(" ")).toLowerCase());
      if (!a.file) card.classList.add("is-soon");

      var cover =
        '<div class="hub-cover">' +
          '<span class="hub-badge-cat">' + escapeHtml(catName(a.category)) + '</span>' +
          (a.file ? '' : '<span class="hub-badge-soon">Coming Soon</span>') +
          '<div class="hub-cover-glyph">' + a.glyph + '</div>' +
        '</div>';

      var meta = a.file
        ? '<div class="hub-meta"><span>⏱ ' + escapeHtml(a.readingTime) + '</span><span>📅 ' + escapeHtml(a.updated) + '</span></div>'
        : '<div class="hub-meta"><span>🛠 In production</span></div>';

      var cta = a.file
        ? '<a href="' + a.file + '" class="hub-card-cta">Read Guide →</a>'
        : '<span class="hub-card-cta is-disabled">Coming Soon</span>';

      card.innerHTML =
        cover +
        '<div class="hub-card-body">' +
          '<h3>' + escapeHtml(a.title) + '</h3>' +
          '<p class="hub-card-desc">' + escapeHtml(a.excerpt) + '</p>' +
          meta +
          cta +
        '</div>';

      wrap.appendChild(card);
    });
  }

  /* ---------- Filtering (category + search combined) ---------- */
  var activeCat = "all";
  var activeQuery = "";

  function setCategory(catId) {
    activeCat = catId;
    document.querySelectorAll(".hub-cat").forEach(function (c) {
      var on = c.getAttribute("data-cat") === catId;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    applyFilters();
  }

  function applyFilters() {
    var shown = 0;
    document.querySelectorAll(".hub-card").forEach(function (card) {
      var matchesCat = activeCat === "all" || card.getAttribute("data-cat") === activeCat;
      var matchesQuery = !activeQuery || card.getAttribute("data-search").indexOf(activeQuery) !== -1;
      var match = matchesCat && matchesQuery;
      card.style.display = match ? "" : "none";
      if (match) shown++;
    });
    var empty = document.getElementById("hubEmpty");
    if (empty) empty.style.display = shown === 0 ? "" : "none";
  }

  function initSearch() {
    var input = document.getElementById("hubSearchInput");
    if (!input) return;
    input.addEventListener("input", function () {
      activeQuery = input.value.trim().toLowerCase();
      applyFilters();
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderFeatured();
    renderTrending();
    renderCategories();
    renderArticles();
    initSearch();

    if (window.MikomiReveal) window.MikomiReveal();
  });

  /* Exposed for potential reuse (e.g. related-article widgets on
     blog pages that want the same catalogue). */
  window.MikomiLearningHub = { ARTICLES: ARTICLES, CATEGORIES: CATEGORIES };
})();
