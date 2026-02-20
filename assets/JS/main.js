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

  const bookshelfContainer = document.querySelector("[data-bookshelf-container]");
  const gradeTabs = document.querySelectorAll(".grade-tab");
  const emptyState = document.querySelector("[data-library-empty]");

  if (!bookshelfContainer || !gradeTabs.length) {
    return;
  }

  // Topic display names
  const topicLabels = {
    'فیزیک': 'فیزیک',
    'زیست': 'زیست‌شناسی',
    'شیمی': 'شیمی',
    'زمین': 'زمین‌شناسی',
    'عمومی': 'عمومی'
  };

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
        id: item.id,
        link: `video-player.html?id=${encodeURIComponent(item.id)}`,
      };
    }

    return {
      title: item.title,
      summary: item.summary,
      grade: item.grade,
      type: "notes",
      typeLabel: "جزوه",
      topic: item.topic,
      duration: item.pages || "PDF",
      level: item.level,
      id: item.id,
      file: item.file,
      link: item.file,
      download: true,
    };
  };

  const createBookElement = (item) => {
    const summaryText = item.summary.substring(0, 80) + (item.summary.length > 80 ? '...' : '');

    return `
      <a class="book ${item.type}" href="${item.link}" ${item.download ? 'download' : ''} title="${item.title}">
        <span class="book-text">${item.title}</span>
        <div class="book-preview">
          <div class="book-preview-title">${item.title}</div>
          <div class="book-preview-meta">
            <span>پایه ${item.grade}</span>
            <span>${item.typeLabel}</span>
            <span>${item.duration}</span>
          </div>
          <p style="font-size: 0.8rem; margin: 8px 0 0 0;">${summaryText}</p>
        </div>
      </a>
    `;
  };

  const renderBookshelf = (grade, items) => {
    // Group items by topic and type
    const shelves = {};
    const topicOrder = ['فیزیک', 'زیست', 'شیمی', 'زمین', 'عمومی'];

    items.forEach(item => {
      if (item.grade !== grade) return;

      if (!shelves[item.topic]) {
        shelves[item.topic] = [];
      }
      shelves[item.topic].push(item);
    });

    let html = '';

    // Render shelves in topic order
    topicOrder.forEach(topic => {
      const topicItems = shelves[topic];
      if (!topicItems || topicItems.length === 0) return;

      html += `
        <section class="bookshelf-section">
          <h3>${topicLabels[topic]}</h3>
          <div class="shelf">
            ${topicItems.map(createBookElement).join('')}
          </div>
        </section>
      `;
    });

    if (!html) {
      emptyState.classList.remove('hidden');
      bookshelfContainer.innerHTML = '';
    } else {
      emptyState.classList.add('hidden');
      bookshelfContainer.innerHTML = html;
    }
  };

  const initBookshelf = async () => {
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

      // Set initial grade
      let currentGrade = "7";

      // Render initial bookshelf
      renderBookshelf(currentGrade, items);

      // Handle grade tab clicks
      gradeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Update active state
          gradeTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          // Update current grade and render
          currentGrade = tab.dataset.grade;
          renderBookshelf(currentGrade, items);
        });
      });

    } catch (error) {
      console.error('Error loading library:', error);
      bookshelfContainer.innerHTML = '<p>در حال حاضر امکان بارگذاری محتوا وجود ندارد.</p>';
    }
  };

  initBookshelf();
})();
