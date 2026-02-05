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
  if (!libraryGrid) {
    return;
  }

  const filterGrade = document.querySelector("[data-filter-grade]");
  const filterType = document.querySelector("[data-filter-type]");
  const filterTopic = document.querySelector("[data-filter-topic]");
  const filterSearch = document.querySelector("[data-filter-search]");
  const emptyState = document.querySelector("[data-library-empty]");

  const toLibraryItem = (item) => {
    if (item.aparatId || item.youtubeId) {
      return {
        title: item.title,
        summary: item.summary,
        grade: item.grade,
        type: "video",
        typeLabel: "ویدیو",
        topic: item.topic,
        duration: item.duration,
        level: item.level,
        action: "پخش ویدیو",
        secondaryAction: "جزوه مرتبط",
        link: `video-player.html?id=${encodeURIComponent(item.id)}`,
        secondaryLink: "library.html?type=notes&grade=" + encodeURIComponent(item.grade),
      };
    }

    return {
      title: item.title,
      summary: item.summary,
      grade: item.grade,
      type: "notes",
      typeLabel: "جزوه/کاربرگ",
      topic: item.topic,
      duration: item.pages || "PDF",
      level: item.level,
      action: "دانلود جزوه",
      secondaryAction: "مشاهده آنلاین",
      link: item.file,
      secondaryLink: `note-viewer.html?file=${encodeURIComponent(item.file)}&title=${encodeURIComponent(item.title)}`,
      download: true,
    };
  };

  const applyFilters = (items) => {
    const grade = filterGrade ? filterGrade.value : "all";
    const type = filterType ? filterType.value : "all";
    const topic = filterTopic ? filterTopic.value : "all";
    const query = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

    const results = items.filter((item) => {
      const matchesGrade = grade === "all" || item.grade === grade;
      const matchesType = type === "all" || item.type === type;
      const matchesTopic = topic === "all" || item.topic === topic;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query);
      return matchesGrade && matchesType && matchesTopic && matchesQuery;
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", results.length !== 0);
    }

    libraryGrid.innerHTML = results
      .map((item) => {
        const actions = [];
        if (item.link && item.action) {
          actions.push(
            `<a class="btn btn-primary" href="${item.link}" ${item.download ? "download" : ""}>${item.action}</a>`,
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

  const setFiltersFromParams = () => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get("path");
    const grade = params.get("grade");
    const type = params.get("type");
    const topic = params.get("topic");
    const search = params.get("search");

    if (filterGrade) {
      if (path && path.startsWith("grade-")) {
        filterGrade.value = path.replace("grade-", "");
      } else if (grade) {
        filterGrade.value = grade;
      }
    }

    if (filterType && type) {
      filterType.value = type;
    }

    if (filterTopic && topic) {
      filterTopic.value = topic;
    }

    if (filterSearch && search) {
      filterSearch.value = search;
    }
  };

  const initLibrary = async () => {
    try {
      const response = await fetch("assets/content/library.json");
      if (!response.ok) {
        throw new Error("Failed to load library content");
      }

      const data = await response.json();
      const items = [
        ...(data.videos || []).map(toLibraryItem),
        ...(data.notes || []).map(toLibraryItem),
      ];

      [filterGrade, filterType, filterTopic, filterSearch].forEach((control) => {
        if (!control) return;
        control.addEventListener("input", () => applyFilters(items));
      });

      setFiltersFromParams();
      applyFilters(items);
    } catch (error) {
      libraryGrid.innerHTML =
        '<p>در حال حاضر امکان بارگذاری محتوا وجود ندارد.</p>';
    }
  };

  initLibrary();
})();
