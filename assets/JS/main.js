(function () {
  const mobileToggle = document.querySelector("[data-mobile-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (mobileToggle && mobilePanel) {
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-controls", "mobile-panel");
    mobilePanel.setAttribute("id", "mobile-panel");

    mobileToggle.addEventListener("click", () => {
      const isOpen = mobilePanel.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobilePanel.addEventListener("click", (event) => {
      if (event.target === mobilePanel) {
        mobilePanel.classList.remove("open");
        document.body.classList.remove("menu-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });

    mobilePanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobilePanel.classList.remove("open");
        document.body.classList.remove("menu-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobilePanel.classList.contains("open")) {
        mobilePanel.classList.remove("open");
        document.body.classList.remove("menu-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const libraryGrid = document.querySelector("[data-library-grid]");
  if (!libraryGrid || !window.LibraryItems) {
    return;
  }

  const filterGrade = document.querySelector("[data-filter-grade]");
  const filterType = document.querySelector("[data-filter-type]");
  const filterTopic = document.querySelector("[data-filter-topic]");
  const filterSearch = document.querySelector("[data-filter-search]");

  const applyFilters = () => {
    const grade = filterGrade ? filterGrade.value : "all";
    const type = filterType ? filterType.value : "all";
    const topic = filterTopic ? filterTopic.value : "all";
    const query = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

    const results = window.LibraryItems.filter((item) => {
      const matchesGrade = grade === "all" || item.grade === grade;
      const matchesType = type === "all" || item.type === type;
      const matchesTopic = topic === "all" || item.topic === topic;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query);
      return matchesGrade && matchesType && matchesTopic && matchesQuery;
    });

    libraryGrid.innerHTML = results
      .map((item) => {
        const actions = [];
        if (item.link && item.action) {
          actions.push(
            `<a class="btn btn-primary" href="${item.link}">${item.action}</a>`,
          );
        }
        if (item.secondaryLink && item.secondaryAction) {
          actions.push(
            `<a class="btn btn-ghost" href="${item.secondaryLink}">${item.secondaryAction}</a>`,
          );
        }

        return `
          <article class="library-card">
            <span class="tag">${item.typeLabel}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="library-meta">
              <span>پایه ${item.grade}</span>
              <span>${item.duration}</span>
              <span>${item.level}</span>
            </div>
            ${actions.length ? `<div class="actions">${actions.join("")}</div>` : ""}
          </article>
        `;
      })
      .join("");
  };

  [filterGrade, filterType, filterTopic, filterSearch].forEach((control) => {
    if (!control) return;
    control.addEventListener("input", applyFilters);
  });

  applyFilters();
})();
