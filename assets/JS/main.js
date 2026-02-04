(function () {
  const mobileToggle = document.querySelector("[data-mobile-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener("click", () => {
      mobilePanel.classList.toggle("open");
    });

    mobilePanel.addEventListener("click", (event) => {
      if (event.target === mobilePanel) {
        mobilePanel.classList.remove("open");
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
      .map(
        (item) => `
          <article class="library-card">
            <span class="tag">${item.typeLabel}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="library-meta">
              <span>???? ${item.grade}</span>
              <span>${item.duration}</span>
              <span>${item.level}</span>
            </div>
            <div class="actions">
              <a class="btn btn-primary" href="${item.link}">${item.action}</a>
              <a class="btn btn-ghost" href="${item.secondaryLink}">${item.secondaryAction}</a>
            </div>
          </article>
        `,
      )
      .join("");
  };

  [filterGrade, filterType, filterTopic, filterSearch].forEach((control) => {
    if (!control) return;
    control.addEventListener("input", applyFilters);
  });

  applyFilters();
})();
