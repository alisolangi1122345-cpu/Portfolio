/**
 * project.js
 * ---------------------------------------------------------------------------
 * Reads window.PROJECTS (populated by projects.js, loaded before this file
 * as a plain <script> tag — not an ES module) and renders the matching
 * project into the page.
 *
 * Updated to match the real data in projects.js:
 *   - Some circuitDiagram / image paths in projects.js don't resolve to a
 *     real file yet (folders/case still need to match your assets folder).
 *     Rather than showing a broken-image icon, any image/video that fails
 *     to load is now hidden gracefully instead of breaking the layout.
 *   - githubLink is validated as a real http(s) URL before the "View on
 *     GitHub" button and the "Public/Private" meta chip are shown — a
 *     couple of entries in projects.js currently hold placeholder text
 *     instead of a URL (e.g. led-chaser), so those are treated as "no
 *     link" instead of rendering a broken button.
 * ---------------------------------------------------------------------------
 */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     0. THEME (dark/light) — read saved preference, wire up the toggle
     --------------------------------------------------------------------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem("portfolio-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    root.setAttribute("data-theme", saved || (prefersLight ? "light" : "dark"));

    const toggle = document.getElementById("themeToggle");
    toggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("portfolio-theme", next);
    });
  }

  /* ---------------------------------------------------------------------
     1. READ THE PROJECT ID FROM THE URL
     --------------------------------------------------------------------- */
  function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  /* ---------------------------------------------------------------------
     2. SMALL DOM HELPERS
     --------------------------------------------------------------------- */
  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function show(node) { node.classList.remove("state-panel--hidden"); }
  function hide(node) { node.classList.add("state-panel--hidden"); }

  /** Detects whether a video field is a local file or an embeddable URL. */
  function isEmbeddableUrl(src) {
    return /youtube\.com|youtu\.be|vimeo\.com/i.test(src);
  }

  /** Converts a plain YouTube/Vimeo link into its embeddable form. */
  function toEmbedUrl(src) {
    const ytMatch = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return src; // fall back to whatever was given
  }

  /**
   * A few projects.js entries (e.g. "led-chaser") currently hold a
   * description string in githubLink instead of a real URL. Treat only
   * genuine http(s) links as valid so we don't render a broken button.
   */
  function isValidGithubLink(link) {
    return typeof link === "string" && /^https?:\/\/\S+$/i.test(link.trim());
  }

  /* ---------------------------------------------------------------------
     3. POPULATE EACH SECTION
     --------------------------------------------------------------------- */
  function populateHero(project) {
    const heroSrc = project.heroImage || (project.images && project.images[0]) || "";
    const heroImg = document.getElementById("heroImage");
    heroImg.src = heroSrc;
    heroImg.alt = `${project.title} — hero photo`;

    document.getElementById("projectTitle").textContent = project.title;
    document.getElementById("projectShortDesc").textContent = project.shortDescription || "";
    document.getElementById("heroDate").textContent = project.completionDate || "";

    document.title = `${project.title} — Project Details`;
  }

  function populateMetaStrip(project) {
    const hasValidRepo = isValidGithubLink(project.githubLink);
    document.getElementById("metaDate").textContent = project.completionDate || "—";
    document.getElementById("metaTechCount").textContent =
      (project.technologies && project.technologies.length) ? `${project.technologies.length} listed` : "—";
    document.getElementById("metaComponentCount").textContent =
      (project.components && project.components.length) ? `${project.components.length} parts` : "—";
    document.getElementById("metaRepoStatus").textContent = hasValidRepo ? "Public" : "Private";
  }

  function populateDescription(project) {
    const container = document.getElementById("fullDescription");
    container.innerHTML = ""; // clear any placeholder content
    const text = project.fullDescription || project.shortDescription || "";
    // Split on blank lines so projects.js can author multiple paragraphs
    // using "\n\n" without needing any HTML inside the data file.
    text.split(/\n\s*\n/).forEach(function (paragraph) {
      if (paragraph.trim()) container.appendChild(el("p", null, paragraph.trim()));
    });
  }

  function populateFeatures(project) {
    const section = document.getElementById("featuresSection");
    const list = document.getElementById("featuresList");
    list.innerHTML = "";

    if (!project.features || !project.features.length) {
      hide(section);
      return;
    }
    show(section);
    project.features.forEach(function (feature) {
      list.appendChild(el("li", null, feature));
    });
  }

  function populateTechnologies(project) {
    const section = document.getElementById("techSection");
    const row = document.getElementById("techList");
    row.innerHTML = "";

    if (!project.technologies || !project.technologies.length) {
      hide(section);
      return;
    }
    show(section);
    project.technologies.forEach(function (tech) {
      row.appendChild(el("span", "chip", tech));
    });
  }

  function populateComponents(project) {
    const section = document.getElementById("componentsSection");
    const body = document.getElementById("componentsBody");
    body.innerHTML = "";

    if (!project.components || !project.components.length) {
      hide(section);
      return;
    }
    show(section);
    project.components.forEach(function (part) {
      const row = document.createElement("tr");
      row.appendChild(el("td", null, part.name));
      row.appendChild(el("td", "bom-qty", part.qty || "—"));
      row.appendChild(el("td", null, part.note || ""));
      body.appendChild(row);
    });
  }

  function populateCircuitDiagram(project) {
    const section = document.getElementById("circuitSection");
    if (!project.circuitDiagram) {
      hide(section);
      return;
    }
    show(section);
    const img = document.getElementById("circuitImage");
    img.src = project.circuitDiagram;
    img.alt = `${project.title} circuit diagram`;
  }

  function populateGallery(project) {
    const section = document.getElementById("gallerySection");
    const grid = document.getElementById("galleryGrid");
    grid.innerHTML = "";

    // Gallery shows every image *except* the one already used as the hero,
    // so the same photo isn't shown twice back-to-back.
    const heroSrc = project.heroImage || (project.images && project.images[0]) || "";
    const galleryImages = (project.images || []).filter(function (src) { return src !== heroSrc; });

    if (!galleryImages.length) {
      hide(section);
      return;
    }
    show(section);
    galleryImages.forEach(function (src) {
      const item = el("button", "gallery-item");
      item.type = "button";
      item.setAttribute("aria-label", "Open gallery image");
      const img = el("img");
      img.src = src;
      img.alt = `${project.title} — gallery photo`;
      item.appendChild(img);
      item.addEventListener("click", function () { openLightbox(src, img.alt); });
      grid.appendChild(item);
    });
  }

  function populateVideo(project) {
    const section = document.getElementById("videoSection");
    const wrapper = document.getElementById("videoWrapper");
    wrapper.innerHTML = "";

    if (!project.video) {
      hide(section);
      return;
    }
    show(section);

    if (isEmbeddableUrl(project.video)) {
      const iframe = document.createElement("iframe");
      iframe.src = toEmbedUrl(project.video);
      iframe.title = `${project.title} demo video`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      wrapper.appendChild(iframe);
    } else {
      const video = document.createElement("video");
      video.src = project.video;
      video.controls = true;
      video.preload = "metadata";
      wrapper.appendChild(video);
    }
  }

  function populateActions(project) {
    const githubBtn = document.getElementById("githubBtn");
    if (isValidGithubLink(project.githubLink)) {
      githubBtn.href = project.githubLink;
      githubBtn.style.display = "";
    } else {
      githubBtn.style.display = "none";
    }
  }

  /* ---------------------------------------------------------------------
     4. LIGHTBOX (shared by circuit diagram + gallery)
     --------------------------------------------------------------------- */
  function openLightbox(src, alt) {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImage");
    img.src = src;
    img.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function initLightbox() {
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightbox").addEventListener("click", function (e) {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
    document.getElementById("circuitTrigger").addEventListener("click", function () {
      const img = document.getElementById("circuitImage");
      openLightbox(img.src, img.alt);
    });
  }

  /* ---------------------------------------------------------------------
     5. MAIN RENDER FUNCTION
     --------------------------------------------------------------------- */
  function renderProject(project) {
    populateHero(project);
    populateMetaStrip(project);
    populateDescription(project);
    populateFeatures(project);
    populateTechnologies(project);
    populateComponents(project);
    populateCircuitDiagram(project);
    populateGallery(project);
    populateVideo(project);
    populateActions(project);

    hide(document.getElementById("loadingState"));
    hide(document.getElementById("notFoundState"));
    show(document.getElementById("projectContent"));
  }

  function renderNotFound() {
    hide(document.getElementById("loadingState"));
    hide(document.getElementById("projectContent"));
    show(document.getElementById("notFoundState"));
  }

  /* ---------------------------------------------------------------------
     6. BOOTSTRAP
     --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initLightbox();

    const projectId = getProjectIdFromUrl();
    const project = projectId && window.PROJECTS ? window.PROJECTS[projectId] : null;

    if (project) {
      renderProject(project);
    } else {
      renderNotFound();
    }
  });

})();