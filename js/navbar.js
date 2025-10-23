// Reusable Navbar Component JavaScript
class NavbarComponent {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  init() {
    this.initLanguageSwitcher();
    this.initMobileMenu();
    this.initStickyNav();
    this.updateActiveNavLink();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop().replace(".html", "") || "index";
    return page === "index" ? "home" : page;
  }

  updateActiveNavLink() {
    // Update desktop nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      const page = link.getAttribute("data-page");
      if (page === this.currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update mobile nav links
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      const page = link.getAttribute("data-page");
      if (page === this.currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  initLanguageSwitcher() {
    console.log("Initializing language switcher...");
    const langDropdownBtn = document.getElementById("lang-dropdown-btn");
    const langDropdownContent = document.getElementById(
      "lang-dropdown-content"
    );
    const currentLangFlag = document.getElementById("current-lang-flag");
    const currentLangCode = document.getElementById("current-lang-code");
    const langOptions = document.querySelectorAll(".lang-option");

    console.log("Language switcher elements:", {
      langDropdownBtn: !!langDropdownBtn,
      langDropdownContent: !!langDropdownContent,
      currentLangFlag: !!currentLangFlag,
      currentLangCode: !!currentLangCode,
      langOptions: langOptions.length,
    });

    // Language configuration with codes
    const languages = {
      en: { flag: "EN", name: "English", code: "EN" },
      sq: { flag: "SQ", name: "Shqip", code: "SQ" },
      de: { flag: "DE", name: "Deutsch", code: "DE" },
    };

    // Get saved language or default to EN
    let currentLang = localStorage.getItem("lang") || "en";
    this.updateLanguage(currentLang, languages, currentLangCode, langOptions);

    // Toggle dropdown
    langDropdownBtn?.addEventListener("click", (e) => {
      console.log("Language dropdown clicked");
      e.preventDefault();
      e.stopPropagation();
      const isOpen = langDropdownContent?.classList.contains("show");
      if (isOpen) {
        langDropdownContent?.classList.remove("show");
      } else {
        langDropdownContent?.classList.add("show");
      }
      console.log("Dropdown show class toggled:", !isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !langDropdownBtn?.contains(e.target) &&
        !langDropdownContent?.contains(e.target)
      ) {
        langDropdownContent?.classList.remove("show");
      }
    });

    // Language option click handlers
    langOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedLang = option.getAttribute("data-lang");
        if (selectedLang && selectedLang !== currentLang) {
          currentLang = selectedLang;
          localStorage.setItem("lang", currentLang);
          this.updateLanguage(
            currentLang,
            languages,
            currentLangCode,
            langOptions
          );
          langDropdownContent?.classList.remove("show");
        }
      });
    });
  }

  updateLanguage(lang, languages, currentLangCode, langOptions) {
    const langConfig = languages[lang];
    if (!langConfig) return;

    // Update button display (globe icon stays, just update code)
    if (currentLangCode) currentLangCode.textContent = langConfig.code;

    // Update active state in dropdown
    langOptions.forEach((option) => {
      if (option.getAttribute("data-lang") === lang) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });

    // Update all elements with language attributes
    document.querySelectorAll("[data-lang-en]").forEach((element) => {
      const text = element.getAttribute(`data-lang-${lang}`);
      if (text) {
        // Check if it's an input/textarea placeholder
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = text;
        } else {
          element.textContent = text;
        }
      }
    });
  }

  initMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    mobileMenuToggle?.addEventListener("click", () => {
      const isOpen = mobileMenu?.classList.contains("show");
      if (isOpen) {
        mobileMenu?.classList.remove("show");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      } else {
        mobileMenu?.classList.add("show");
        mobileMenuToggle.setAttribute("aria-expanded", "true");
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !mobileMenuToggle?.contains(e.target) &&
        !mobileMenu?.contains(e.target)
      ) {
        mobileMenu?.classList.remove("show");
        mobileMenuToggle?.setAttribute("aria-expanded", "false");
      }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu?.classList.remove("show");
        mobileMenuToggle?.setAttribute("aria-expanded", "false");
      });
    });
  }

  initStickyNav() {
    const nav = document.getElementById("main-nav");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        nav?.classList.add("scrolled");
      } else {
        nav?.classList.remove("scrolled");
      }

      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        nav?.classList.add("nav-hidden");
      } else {
        nav?.classList.remove("nav-hidden");
      }

      lastScrollY = currentScrollY;
    });
  }
}

// Initialize navbar when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new NavbarComponent();
});

// Export for use in other files
window.NavbarComponent = NavbarComponent;
