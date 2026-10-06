(function () {
  "use strict";

  var listEl = document.getElementById("listaDocumentos");
  var emptyEl = document.getElementById("documentosVacios");
  var errorEl = document.getElementById("documentosError");
  var fallbackEl = document.getElementById("pdfManifestFallback");

  if (!listEl) {
    return;
  }

  function formatTitle(name) {
    return name.replace(/\.pdf$/i, "").replace(/\s+/g, " ").trim();
  }

  function renderList(documents) {
    listEl.innerHTML = "";

    if (!documents.length) {
      if (emptyEl) {
        emptyEl.classList.remove("d-none");
      }
      return;
    }

    if (emptyEl) {
      emptyEl.classList.add("d-none");
    }

    documents.forEach(function (doc) {
      var file = doc.file;
      var title = doc.title || formatTitle(file);
      var li = document.createElement("li");
      li.className = "doc-list-item";

      var link = document.createElement("a");
      link.className = "doc-list-link";
      link.href = "assets/pdfs/" + encodeURIComponent(file);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML =
        '<span class="doc-list-icon" aria-hidden="true">PDF</span>' +
        '<span class="doc-list-text">' +
        '<span class="doc-list-title">' +
        title +
        "</span>" +
        '<span class="doc-list-meta">' +
        file +
        "</span>" +
        "</span>" +
        '<span class="doc-list-action" aria-hidden="true">Abrir</span>';

      li.appendChild(link);
      listEl.appendChild(li);
    });
  }

  function sortDocuments(documents) {
    return documents.slice().sort(function (a, b) {
      return (a.title || a.file).localeCompare(b.title || b.file, "es", { sensitivity: "base" });
    });
  }

  function readFallbackManifest() {
    if (!fallbackEl) {
      return null;
    }
    try {
      return JSON.parse(fallbackEl.textContent);
    } catch (err) {
      return null;
    }
  }

  function applyManifest(data) {
    var documents = (data && data.documents) || [];
    renderList(sortDocuments(documents));
    if (errorEl) {
      errorEl.classList.add("d-none");
    }
  }

  fetch("assets/pdfs/manifest.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("manifest");
      }
      return response.json();
    })
    .then(applyManifest)
    .catch(function () {
      var fallback = readFallbackManifest();
      if (fallback) {
        applyManifest(fallback);
        return;
      }
      if (errorEl) {
        errorEl.classList.remove("d-none");
      }
    });
})();
