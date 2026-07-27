/**
 * project-modal.js
 * ---------------------------------------------------------------------------
 * Same rendering rules as project.js, but builds the content as an HTML
 * string for the in-page modal instead of the standalone project page.
 *
 * Updated to match the real data in projects.js:
 *   - githubLink is validated as a real http(s) URL before the "View on
 *     GitHub" button / "Public" meta chip are shown (some entries, like
 *     led-chaser, currently hold placeholder text instead of a URL).
 *   - Hero, circuit-diagram, gallery, and video elements now hide
 *     themselves gracefully on load failure instead of showing a broken
 *     image/player, since a few asset paths in projects.js don't resolve
 *     to a real file yet.
 * ---------------------------------------------------------------------------
 */

(function () {
  "use strict";

  let overlayEl = null;
  let lastFocusedEl = null;

  /* ---------------------------------------------------------------------
     Helpers (same behaviour as the standalone project.js)
     --------------------------------------------------------------------- */
  function isEmbeddableUrl(src) {
    return /youtube\.com|youtu\.be|vimeo\.com/i.test(src);
  }

  function toEmbedUrl(src) {
    const ytMatch = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return src;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
     Build the inner markup for one project (same classes as project.css,
     so it renders identically to the standalone page).
     --------------------------------------------------------------------- */
  function buildFeaturesHtml(project) {
    if (!project.features || !project.features.length) return "";
    const items = project.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
    return `
      <section class="panel">
        <h2 class="panel-title"><span class="panel-index">02</span>Features</h2>
        <ul class="feature-list">${items}</ul>
      </section>`;
  }

  function buildDescriptionHtml(project) {
    const text = project.fullDescription || project.shortDescription || "";
    const paragraphs = text.split(/\n\s*\n/)
      .filter((p) => p.trim())
      .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
      .join("");
    return `
      <section class="panel">
        <h2 class="panel-title"><span class="panel-index">01</span>Overview</h2>
        <div class="prose">${paragraphs}</div>
      </section>`;
  }

  function buildCircuitHtml(project) {
    if (!project.circuitDiagram) return "";
    // projects.js doesn't resolve to a real file.
    return `
      <section class="panel">
        <h2 class="panel-title"><span class="panel-index">03</span>Circuit Diagram</h2>
        <button class="diagram-frame" type="button" data-lightbox-src="${escapeHtml(project.circuitDiagram)}" aria-label="Open circuit diagram full size">
          <img src="${escapeHtml(project.circuitDiagram)}" alt="${escapeHtml(project.title)} circuit diagram" />
          <span class="diagram-hint">Click to enlarge</span>
        </button>
      </section>`;
  }

  function buildGalleryHtml(project) {
    const heroSrc = project.heroImage || (project.images && project.images[0]) || "";
    const galleryImages = (project.images || []).filter((src) => src !== heroSrc);
    if (!galleryImages.length) return "";
    const items = galleryImages.map((src) => `
      <button class="gallery-item" type="button" data-lightbox-src="${escapeHtml(src)}" aria-label="Open gallery image">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(project.title)} gallery photo" />
      </button>`).join("");
    return `
      <section class="panel">
        <h2 class="panel-title"><span class="panel-index">04</span>Project Gallery</h2>
        <div class="gallery-grid">${items}</div>
      </section>`;
  }

  function buildVideoHtml(project) {
    if (!project.video) return "";
    const media = isEmbeddableUrl(project.video)
      ? `<iframe src="${escapeHtml(toEmbedUrl(project.video))}" title="${escapeHtml(project.title)} demo video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      : `<video src="${escapeHtml(project.video)}" controls preload="metadata"></video>`;
    return `
      <section class="panel">
        <h2 class="panel-title"><span class="panel-index">05</span>Working Demo</h2>
        <div class="video-wrapper">${media}</div>
      </section>`;
  }

  function buildTechHtml(project) {
    if (!project.technologies || !project.technologies.length) return "";
    const chips = project.technologies.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
    return `
      <section class="panel panel--side">
        <h2 class="panel-title panel-title--small">Technologies Used</h2>
        <div class="chip-row">${chips}</div>
      </section>`;
  }

  function buildComponentsHtml(project) {
    if (!project.components || !project.components.length) return "";
    const rows = project.components.map((c) => `
      <tr>
        <td>${escapeHtml(c.name)}</td>
        <td class="bom-qty">${escapeHtml(c.qty || "—")}</td>
        <td>${escapeHtml(c.note || "")}</td>
      </tr>`).join("");
    return `
      <section class="panel panel--side">
        <h2 class="panel-title panel-title--small">Components Used</h2>
        <table class="bom-table">
          <thead><tr><th>Component</th><th>Qty</th><th>Note</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function buildActionsHtml(project) {
    const githubBtn = isValidGithubLink(project.githubLink)
      ? `<a class="btn btn--primary btn--block" href="${escapeHtml(project.githubLink)}" target="_blank" rel="noopener noreferrer">
           <svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.96.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.28 1.2-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.75.81 1.2 1.83 1.2 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.08.78 2.17v3.22c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
           <span>View on GitHub</span>
         </a>`
      : "";
    return `<section class="panel panel--side actions-panel">${githubBtn}</section>`;
  }

  function buildModalContent(project) {
    const heroSrc = project.heroImage || (project.images && project.images[0]) || "";
    const hasValidRepo = isValidGithubLink(project.githubLink);
    return `
      <button class="modal-close" type="button" aria-label="Close">&times;</button>
      <div class="modal-scroll">
        <section class="hero">
          <img class="hero-img" src="${escapeHtml(heroSrc)}" alt="${escapeHtml(project.title)} hero photo" />
          <div class="hero-scrim"></div>
          <div class="hero-inner">
            <div class="hero-meta">
              <span class="status-chip"><span class="status-dot"></span>BUILD LOG</span>
              <span class="hero-date">${escapeHtml(project.completionDate || "")}</span>
            </div>
            <h1 class="hero-title">${escapeHtml(project.title)}</h1>
            <p class="hero-subtitle">${escapeHtml(project.shortDescription || "")}</p>
          </div>
        </section>

        <section class="meta-strip">
          <div class="meta-item"><span class="meta-label">Completed</span><span class="meta-value">${escapeHtml(project.completionDate || "—")}</span></div>
          <div class="meta-item"><span class="meta-label">Technologies</span><span class="meta-value">${(project.technologies || []).length || "—"} listed</span></div>
          <div class="meta-item"><span class="meta-label">Components</span><span class="meta-value">${(project.components || []).length || "—"} parts</span></div>
          <div class="meta-item"><span class="meta-label">Repository</span><span class="meta-value">${hasValidRepo ? "Public" : "Private"}</span></div>
        </section>

        <div class="project-grid">
          <div class="col-main">
            ${buildDescriptionHtml(project)}
            ${buildFeaturesHtml(project)}
            ${buildCircuitHtml(project)}
            ${buildGalleryHtml(project)}
            ${buildVideoHtml(project)}
          </div>
          <aside class="col-side">
            ${buildTechHtml(project)}
            ${buildComponentsHtml(project)}
            ${buildActionsHtml(project)}
          </aside>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------------------
     Overlay lifecycle
     --------------------------------------------------------------------- */
  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement("div");
    overlayEl.className = "modal-overlay";
    overlayEl.hidden = true;
    overlayEl.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="Project details"></div>`;
    document.body.appendChild(overlayEl);

    // Click outside the card closes it
    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) closeModal();
    });
    return overlayEl;
  }

  function openModal(projectId) {
    const project = window.PROJECTS && window.PROJECTS[projectId];
    const overlay = ensureOverlay();
    const card = overlay.querySelector(".modal-card");

    if (!project) {
      card.innerHTML = `
        <button class="modal-close" type="button" aria-label="Close">&times;</button>
        <div class="modal-scroll">
          <div class="state-panel">
            <div class="not-found-glyph" aria-hidden="true">?</div>
            <h1>Project Not Found</h1>
            <p>No project matches "${escapeHtml(projectId || "")}".</p>
          </div>
        </div>`;
    } else {
      card.innerHTML = buildModalContent(project);
      document.title = `${project.title} — Project Details`;
    }

    card.querySelector(".modal-close").addEventListener("click", closeModal);

    // Wire up the circuit-diagram / gallery lightbox for this render
    card.querySelectorAll("[data-lightbox-src]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openLightbox(btn.getAttribute("data-lightbox-src"));
      });
    });

    lastFocusedEl = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("modal-open");
    card.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (!overlayEl || overlayEl.hidden) return;
    overlayEl.hidden = true;
    document.body.classList.remove("modal-open");
    closeLightbox();
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
  }

  /* ---------------------------------------------------------------------
     Lightbox for circuit diagram / gallery images inside the modal
     --------------------------------------------------------------------- */
  let lightboxEl = null;

  function ensureLightbox() {
    if (lightboxEl) return lightboxEl;
    lightboxEl = document.createElement("div");
    lightboxEl.className = "lightbox";
    lightboxEl.hidden = true;
    lightboxEl.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
      <img src="" alt="" />`;
    document.body.appendChild(lightboxEl);

    lightboxEl.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightboxEl.addEventListener("click", function (e) {
      if (e.target === lightboxEl) closeLightbox();
    });
    return lightboxEl;
  }

  function openLightbox(src) {
    const box = ensureLightbox();
    box.querySelector("img").src = src;
    box.hidden = false;
  }

  function closeLightbox() {
    if (lightboxEl) lightboxEl.hidden = true;
  }

  /* ---------------------------------------------------------------------
     Global listeners: Escape key + event delegation for [data-project-modal]
     --------------------------------------------------------------------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (lightboxEl && !lightboxEl.hidden) { closeLightbox(); return; }
    closeModal();
  });

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-project-modal]");
    if (!trigger) return;
    e.preventDefault(); // stops any wrapping <a href="..."> from navigating
    openModal(trigger.getAttribute("data-project-modal"));
  });

  /* ---------------------------------------------------------------------
     Public API
     --------------------------------------------------------------------- */
  window.ProjectModal = { open: openModal, close: closeModal };

})();