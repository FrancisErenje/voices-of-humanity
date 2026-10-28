/* Voices of Humanity — focused continental museum click repair.
   Loaded before legacy interaction handlers so a successful museum click
   cannot be swallowed by a later camera/world handler. */
(function () {
  "use strict";

  if (window.__vohContinentalClickRepairInstalled) return;
  window.__vohContinentalClickRepairInstalled = true;

  function ignored(event) {
    var target = event && event.target;
    if (!target) return true;
    if (target.closest && target.closest(
      "#museumChat, #museumChatLauncher, .voh-continental-direct.open, " +
      ".continental-language-experience-overlay.open, " +
      ".african-languages-experience-overlay.open, " +
      ".lm247-experience-overlay, .lm247-news-reader"
    )) return true;
    if (window.__vohIsTawkInteraction &&
        window.__vohIsTawkInteraction(event)) return true;
    return false;
  }

  function openVisible(overlay, bodyClass) {
    if (!overlay) return;
    overlay.hidden = false;
    overlay.removeAttribute("hidden");
    overlay.setAttribute("aria-hidden", "false");
    overlay.style.display = "flex";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    overlay.style.zIndex = "2147483647";
    overlay.classList.add("open");
    if (bodyClass) document.body.classList.add(bodyClass);
  }

  function closeVisible(overlay, bodyClass) {
    overlay.classList.remove("open");
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.display = "none";
    overlay.style.visibility = "hidden";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "-1";
    if (bodyClass) document.body.classList.remove(bodyClass);
  }

  function ensureAfrica() {
    var overlay = document.querySelector(".african-languages-experience-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "african-languages-experience-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="african-languages-experience-card" role="dialog" aria-modal="true" aria-labelledby="vohAfricaRepairTitle">' +
        '<button class="african-languages-close-hit-zone" type="button" aria-label="Close African Languages Museum">×</button>' +
        '<div class="african-languages-experience-eyebrow">AFRICAN LANGUAGES MUSEUM</div>' +
        '<h2 id="vohAfricaRepairTitle">African Languages Museum</h2>' +
        '<p class="african-languages-experience-intro">Explore African languages, documentary records, cultural knowledge and living community voices.</p>' +
        '<div class="african-languages-experience-list">' +
          '<a class="african-language-feature featured" href="/museum/academy/igede.html"><span class="feature-number">01</span><span class="feature-content"><strong>Igede Language Series</strong><span>Explore Igede words, pronunciation and everyday expressions.</span><small>Igede Language Learning Centre</small></span><span class="feature-action">ENTER CENTRE →</span></a>' +
          '<div class="african-language-feature"><span class="feature-number">02</span><span class="feature-content"><strong>Explore African Language Voices</strong><span>Discover languages and documentary records from across Africa.</span></span></div>' +
          '<div class="african-language-feature"><span class="feature-number">03</span><span class="feature-content"><strong>Language, Culture &amp; Memory</strong><span>Stories connecting language with identity, history and heritage.</span></span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var close = overlay.querySelector(".african-languages-close-hit-zone");
    if (close) close.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeVisible(overlay, "african-languages-overlay-open");
      if (typeof window.returnToMuseumHomepage === "function") window.returnToMuseumHomepage();
    }, true);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeVisible(overlay, "african-languages-overlay-open");
        if (typeof window.returnToMuseumHomepage === "function") window.returnToMuseumHomepage();
      }
    }, true);
    overlay._open = function () { openVisible(overlay, "african-languages-overlay-open"); };
    return overlay;
  }

  function ensureAmericas() {
    var overlay = document.querySelector(
      '.voh-continental-direct[data-building="americasMuseum"]'
    ) || document.querySelector(
      '.continental-language-experience-overlay[data-building="americasMuseum"]'
    );
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "voh-continental-direct";
    overlay.dataset.building = "americasMuseum";
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="voh-continental-direct-card" role="dialog" aria-modal="true" aria-labelledby="vohAmericasRepairTitle">' +
        '<button type="button" class="voh-continental-direct-close" aria-label="Close Americas Languages Museum">×</button>' +
        '<div class="voh-continental-direct-kicker">VOICES OF HUMANITY · LIVING LANGUAGE ARCHIVE</div>' +
        '<h2 id="vohAmericasRepairTitle">Americas Languages Museum</h2>' +
        '<p>Explore the linguistic diversity of North, Central and South America and the Indigenous communities whose languages carry living histories, knowledge and identity.</p>' +
        '<div class="voh-continental-direct-grid">' +
          '<article><span>LANGUAGES</span><strong>Living Voices</strong><p>Discover languages and the communities that keep them alive.</p></article>' +
          '<article><span>CULTURE</span><strong>Language &amp; Identity</strong><p>Explore language as a carrier of memory and knowledge.</p></article>' +
          '<article><span>HERITAGE</span><strong>Stories That Endure</strong><p>Encounter linguistic histories preserved through living voices.</p></article>' +
        '</div></div>';
    document.body.appendChild(overlay);

    var close = overlay.querySelector(".voh-continental-direct-close");
    if (close) close.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeVisible(overlay, "continental-language-overlay-open");
      if (typeof window.returnToMuseumHomepage === "function") window.returnToMuseumHomepage();
    }, true);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeVisible(overlay, "continental-language-overlay-open");
        if (typeof window.returnToMuseumHomepage === "function") window.returnToMuseumHomepage();
      }
    }, true);
    overlay._open = function () { openVisible(overlay, "continental-language-overlay-open"); };
    return overlay;
  }

  function openMuseum(id) {
    if (id === "africaMuseum") {
      var africaOverlay = ensureAfrica();
      if (typeof africaOverlay._open === "function") africaOverlay._open();
      else openVisible(africaOverlay, "african-languages-overlay-open");
      return;
    }
    var americasOverlay = ensureAmericas();
    if (typeof americasOverlay._open === "function") americasOverlay._open();
    else openVisible(americasOverlay, "continental-language-overlay-open");
  }

  function pointInside(el, x, y) {
    if (!el || !el.getBoundingClientRect) return false;
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 &&
      x >= rect.left - 4 && x <= rect.right + 4 &&
      y >= rect.top - 72 && y <= rect.bottom + 8;
  }

  function handleClick(event) {
    if (event.type !== "click" || ignored(event)) return;

    var target = event.target;
    var id = null;
    if (target && target.closest) {
      if (target.closest("#africaMuseum, #africaComplex .full-building-hit-surface")) {
        id = "africaMuseum";
      } else if (target.closest("#americasMuseum, #americasComplex .full-building-hit-surface")) {
        id = "americasMuseum";
      }
    }

    /* If a scene/camera layer became the event target, recover by the actual
       on-screen building rectangle rather than adding more building handlers. */
    if (!id && typeof event.clientX === "number" && typeof event.clientY === "number") {
      if (pointInside(document.getElementById("africaMuseum"), event.clientX, event.clientY)) {
        id = "africaMuseum";
      } else if (pointInside(document.getElementById("americasMuseum"), event.clientX, event.clientY)) {
        id = "americasMuseum";
      }
    }
    if (!id) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    openMuseum(id);
  }

  /* This file is included in the document head, ahead of legacy world handlers. */
  window.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var target = event.target;
    if (!target || !target.closest) return;
    var building = target.closest("#africaMuseum, #americasMuseum");
    if (!building) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openMuseum(building.id);
  }, true);
})();