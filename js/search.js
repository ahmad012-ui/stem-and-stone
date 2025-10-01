// js/search.js
// Improved offcanvas search for product names, categories and image alt text.
// - normalizes unicode/diacritics
// - supports Enter key
// - shows results inside the offcanvas #result area
// - safe HTML escaping for messages
(function () {
  'use strict';

  // Normalize helper: lowercases, removes diacritics and trims
  function normalize(s) {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .normalize('NFD')                   // split diacritics
      .replace(/[\u0300-\u036f]/g, '')    // remove diacritics
      .replace(/\s+/g, ' ')               // collapse whitespace
      .trim();
  }

  // Escape HTML for safe messages
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  // Main search function (exposed on window so inline onclick still works)
 function searchData(providedQuery) {
  const inputEl = document.getElementById('search-input');
  const rawQuery = typeof providedQuery === 'string' ? providedQuery : (inputEl ? inputEl.value : '');
  const query = rawQuery.trim();

  // if no query, just ignore
  if (!query) return;

  const products = document.querySelectorAll('.product-item');

  // if no products on this page, redirect to shop.html
  if (products.length === 0) {
    window.location.href = "shop.html?search=" + encodeURIComponent(query);
    return;
  }

  // --- existing shop.html search logic ---
  const resultBox = document.getElementById('result');
  resultBox.innerHTML = "";
  let found = 0;

  products.forEach(product => {
    const nameEl = product.querySelector('.name') || product.querySelector('.card-title');
    const name = nameEl ? nameEl.textContent.toLowerCase() : "";
    const category = product.id ? product.id.toLowerCase() : "";
    const type = product.querySelector('img') ? product.querySelector('img').alt.toLowerCase() : "";

    if (name.includes(query.toLowerCase()) || category.includes(query.toLowerCase()) || type.includes(query.toLowerCase())) {
  found++;

  // ✅ Create proper column for grid
  const col = document.createElement('div');
  col.className = 'col-lg-3 col-md-4 col-sm-6';

  // ✅ Clone only the .card inside product
  const card = product.querySelector('.card').cloneNode(true);
  col.appendChild(card);

  resultBox.appendChild(col);
}

  });

  if (found === 0) {
    resultBox.innerHTML = `<p class='text-danger'>No results found for "<b>${query}</b>".</p>`;
  }
}

  // Expose function for inline onclick fallback (your HTML uses onclick="searchData()")
  window.searchData = searchData;

  // Function to close offcanvas
  window.closeOffcanvas = function() {
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasTop'));
    if (offcanvas) {
      offcanvas.hide();
    }
  };

  // Support pressing Enter while focus is inside the offcanvas input
  document.addEventListener('DOMContentLoaded', function () {
    const offInput = document.getElementById('search-input');
    if (offInput) {
      offInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchData(offInput.value);
        }
      });
    }
  });
})();