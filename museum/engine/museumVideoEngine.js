/*==================================================
  VOICES OF HUMANITY
  MUSEUM VIDEO ENGINE v1.0
==================================================*/

window.MuseumVideoEngine = {

  collection: [],
  publicContent: {},

  init() {
    this.collection = window.MuseumVideoCollection || [];
    this.publicContent = window.MuseumPublicContent || {};
    this.attachBuildingEvents();
    console.log("✓ Museum Video Engine loaded:", this.collection.length, "curated videos");
  },

  getForBuilding(buildingId) {
    return this.collection.filter(item => item.building === buildingId);
  },

  attachBuildingEvents() {
    const buildings = [
      "africaMuseum",
      "asiaMuseum",
      "europeMuseum",
      "americasMuseum",
      "oceaniaMuseum",
      "reflection-garden",
      "hall-humanity",
      "cinema",
      "visitor-centre",
      "lm247Building"
    ];

    buildings.forEach(id => {
      const el = id === "reflection-garden"
        ? document.querySelector('[data-garden-id="reflection-garden"]')
        : id === "visitor-centre"
          ? document.querySelector(".visitor-centre")
          : document.getElementById(id);
      if (!el) return;

      el.style.cursor = "pointer";
      el.addEventListener("click", event => {
        event.stopPropagation();
        this.openBuilding(id);
      });
    });
  },

  openBuilding(buildingId) {
    const items = this.getForBuilding(buildingId);
    const publicItems = this.publicContent[buildingId] || [];
    if (!items.length && !publicItems.length) return;

    const buildingNames = {
      africaMuseum: "African Languages Museum",
      asiaMuseum: "Asian Languages Museum",
      europeMuseum: "European Languages Museum",
      americasMuseum: "Americas Languages Museum",
      oceaniaMuseum: "Oceania Languages Museum",
      "reflection-garden": "Reflection Garden",
      "hall-humanity": "Hall of Humanity",
      "cinema": "Documentary Cinema",
      "visitor-centre": "Visitor Centre",
      "lm247Building": "LocalMedia247 Media Center"
    };

    this.close();

    const panel = document.createElement("div");
    panel.id = "museum-video-panel";

    panel.innerHTML = `
      <div class="mvp-backdrop">
        <div class="mvp-panel">
          <button class="mvp-close" aria-label="Close">×</button>

          <div class="mvp-heading">
            <span>VOICES OF HUMANITY</span>
            <h2>${buildingNames[buildingId] || "Museum Collection"}</h2>
            <p>Curated public videos selected for this museum.</p>
          </div>

          <div class="mvp-grid">
            ${items.map(item => this.card(item)).join("")}
          </div>

          ${publicItems.length ? `
            <div class="mvp-public-heading">
              <span>PUBLIC COLLECTION</span>
              <h3>Explore beyond the museum</h3>
              <p>Curated public resources selected to deepen your visit.</p>
            </div>
            <div class="mvp-grid mvp-public-grid">
              ${publicItems.map(item => this.publicCard(item)).join("")}
            </div>
          ` : ""}
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    panel.querySelector(".mvp-close").addEventListener("click", () => this.close());

    panel.querySelector(".mvp-backdrop").addEventListener("click", e => {
      if (e.target === e.currentTarget) this.close();
    });

    panel.querySelectorAll(".mvp-watch").forEach(button => {
      button.addEventListener("click", () => {
        const item = this.collection.find(v => v.id === button.dataset.id);
        if (item) this.openVideo(item);
      });
    });
  },

  card(item) {
    return `
      <article class="mvp-card">
        <div class="mvp-card-top">
          <span>${item.language}</span>
          <small>${item.source}</small>
        </div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <button class="mvp-watch" data-id="${item.id}" type="button">Watch Video →</button>
      </article>
    `;
  },

  publicCard(item) {
    return `
      <article class="mvp-card mvp-public-card">
        <div class="mvp-card-top">
          <span>${item.tag}</span>
          <small>${item.source}</small>
        </div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a class="mvp-watch mvp-public-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Explore Resource ↗</a>
      </article>
    `;
  },

  openVideo(item) {
    const existing = document.getElementById("museum-video-viewer");
    if (existing) existing.remove();

    const videoId = this.youtubeId(item.videoUrl);
    const isChannelOrSearch = item.videoUrl.includes("/@") || item.videoUrl.includes("/results?");

    const viewer = document.createElement("div");
    viewer.id = "museum-video-viewer";

    viewer.innerHTML = `
      <div class="mvv-backdrop">
        <div class="mvv-panel">
          <button class="mvv-close" aria-label="Close">×</button>
          <div class="mvv-video">
            ${isChannelOrSearch
              ? `<a class="mvv-external" href="${item.videoUrl}" target="_blank" rel="noopener">Open this public YouTube collection →</a>`
              : `<iframe src="https://www.youtube.com/embed/${videoId}" title="${item.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
            }
          </div>
          <div class="mvv-info">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <span>${item.source} · ${item.language}</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(viewer);

    viewer.querySelector(".mvv-close").addEventListener("click", () => viewer.remove());
    viewer.querySelector(".mvv-backdrop").addEventListener("click", e => {
      if (e.target === e.currentTarget) viewer.remove();
    });
  },

  youtubeId(url) {
    try {
      const parsed = new URL(url);
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const parts = parsed.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    } catch {
      return "";
    }
  },

  close() {
    const panel = document.getElementById("museum-video-panel");
    if (panel) panel.remove();

    const viewer = document.getElementById("museum-video-viewer");
    if (viewer) viewer.remove();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MuseumVideoEngine.init();
});