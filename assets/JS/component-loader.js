/**
 * Component Loader
 * Dynamically loads shared header and footer components
 */

class ComponentLoader {
  constructor() {
    this.basePath = "assets/components/";
  }

  /**
   * Load an HTML component file and insert it into the DOM
   */
  async loadComponent(componentName, insertBefore = null) {
    try {
      const response = await fetch(`${this.basePath}${componentName}.html`);
      if (!response.ok) {
        console.warn(`Failed to load ${componentName}: ${response.status}`);
        return false;
      }

      const html = await response.text();
      const container = document.createElement("div");
      container.innerHTML = html;

      if (insertBefore && document.querySelector(insertBefore)) {
        document
          .querySelector(insertBefore)
          .parentNode.insertBefore(
            container.firstElementChild,
            document.querySelector(insertBefore),
          );
      } else {
        document.body.appendChild(container.firstElementChild);
      }

      return true;
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      return false;
    }
  }

  /**
   * Load header and footer components
   */
  async loadLayout() {
    // Load header at the beginning
    await this.loadComponent("header", "main");

    // Load footer at the end
    const main = document.querySelector("main");
    if (main) {
      main.parentNode.appendChild(document.createElement("div"));
      await this.loadComponent("footer");
    }

    // Set active navigation link
    this.setActiveNavLink();

    // Set current year in footer
    this.setCurrentYear();

    // Initialize mobile menu toggle
    this.initMobileMenu();
  }

  /**
   * Mark the current page link as active
   */
  setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split("/").pop() || "index.html";

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === currentFile ||
        (currentFile === "" && href === "index.html")
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /**
   * Set the current year in footer
   */
  setCurrentYear() {
    const yearElement = document.querySelector("[data-year]");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Initialize mobile menu toggle
   */
  initMobileMenu() {
    const toggleButton = document.querySelector("[data-mobile-toggle]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");

    if (toggleButton && mobilePanel) {
      toggleButton.addEventListener("click", () => {
        mobilePanel.classList.toggle("active");
      });

      // Close mobile panel when a link is clicked
      mobilePanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mobilePanel.classList.remove("active");
        });
      });

      // Close mobile panel on outside click
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".site-header")) {
          mobilePanel.classList.remove("active");
        }
      });
    }
  }
}

// Load components when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const loader = new ComponentLoader();
    loader.loadLayout();
  });
} else {
  const loader = new ComponentLoader();
  loader.loadLayout();
}
