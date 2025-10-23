// Navbar Loader - Loads navbar component into any page
async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html");
    const navbarHTML = await response.text();

    // Find navbar container or create one
    let container = document.getElementById("navbar-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "navbar-container";
      document.body.insertBefore(container, document.body.firstChild);
    }

    container.innerHTML = navbarHTML;

    // Initialize navbar functionality
    if (window.NavbarComponent) {
      new window.NavbarComponent();
    }

    console.log("Navbar loaded successfully");
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

// Load navbar when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadNavbar);
} else {
  loadNavbar();
}
