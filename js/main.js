(function () {
  "use strict";

  var navbar = document.getElementById("navbarPrincipal");
  var menuCollapse = document.getElementById("menuNav");
  var anchorNavLinks = document.querySelectorAll("[data-nav]");
  var sections = document.querySelectorAll(".section-anchor");
  var currentPage = document.body.getAttribute("data-page");
  var navInstitucional = document.getElementById("navInstitucional");
  var institucionalSectionIds = ["datos-institucionales", "mision", "funciones"];

  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function closeMobileMenu() {
    if (!menuCollapse || !menuCollapse.classList.contains("show")) {
      return;
    }
    if (typeof bootstrap !== "undefined") {
      var instance = bootstrap.Collapse.getInstance(menuCollapse);
      if (instance) {
        instance.hide();
      }
    }
  }

  document.querySelectorAll("#menuNav .nav-link, #menuNav .dropdown-item").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (link.getAttribute("data-bs-toggle") === "dropdown") {
        return;
      }
      closeMobileMenu();
    });
  });

  function clearNavActive() {
    document.querySelectorAll("#menuNav .nav-link, #menuNav .dropdown-item").forEach(function (link) {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
  }

  function setInstitucionalToggleActive(isActive) {
    if (navInstitucional) {
      navInstitucional.classList.toggle("active", isActive);
    }
  }

  function setActiveNavById(id) {
    clearNavActive();
    anchorNavLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var hash = href.indexOf("#") >= 0 ? href.slice(href.indexOf("#")) : "";
      if (hash === "#" + id || (id === "inicio" && (hash === "#inicio" || hash === ""))) {
        link.classList.add("active");
        link.setAttribute("aria-current", "true");
      }
    });

    setInstitucionalToggleActive(institucionalSectionIds.indexOf(id) >= 0);
  }

  function setActiveNavByPage(page) {
    if (!page) {
      return;
    }
    clearNavActive();
    document.querySelectorAll("[data-nav-page]").forEach(function (link) {
      if (link.getAttribute("data-nav-page") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    if (page === "organismos") {
      setInstitucionalToggleActive(true);
    }
  }

  function setActiveNavByHashOrPage() {
    var hashId = window.location.hash ? window.location.hash.slice(1) : "inicio";
    if (document.getElementById(hashId) && hashId !== "inicio") {
      setActiveNavById(hashId);
      return;
    }
    if (currentPage === "inicio") {
      setActiveNavById("inicio");
    }
  }

  if (currentPage && currentPage !== "inicio") {
    setActiveNavByPage(currentPage);
  } else if (sections.length && "IntersectionObserver" in window) {
    var navHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
        10
      ) || 72;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNavById(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-" + navHeight + "px 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    setActiveNavByHashOrPage();
    window.addEventListener("hashchange", setActiveNavByHashOrPage);
  }
})();
