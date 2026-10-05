(function () {
  "use strict";

  var configUrl = window.SITE_PUBLIC_URL;
  if (!configUrl || typeof configUrl !== "string") {
    return;
  }

  var base = configUrl.replace(/\/$/, "");
  var path = window.location.pathname.replace(/\\/g, "/");
  var file = path.split("/").pop() || "index.html";
  var pageUrl = base + "/" + file;

  var canonical = document.querySelector('link[rel="canonical"][data-dynamic="true"]');
  if (canonical) {
    canonical.setAttribute("href", pageUrl);
  }

  document.querySelectorAll('meta[data-dynamic="og-url"]').forEach(function (meta) {
    meta.setAttribute("content", pageUrl);
  });

  document.querySelectorAll('meta[data-dynamic="og-image"]').forEach(function (meta) {
    meta.setAttribute("content", base + "/assets/img/hero-1.jpg");
  });

  document.querySelectorAll('meta[data-dynamic="twitter-image"]').forEach(function (meta) {
    meta.setAttribute("content", base + "/assets/img/hero-1.jpg");
  });
})();
