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

  // Enhanced search function with loading states and better UX
 function searchData(providedQuery) {
  const inputEl = document.getElementById('search-input');
  const rawQuery = typeof providedQuery === 'string' ? providedQuery : (inputEl ? inputEl.value : '');
  const query = rawQuery.trim();

  // if no query, just ignore
  if (!query) return;

  const products = document.querySelectorAll('.product-item');
  const categoryItems = document.querySelectorAll('.nav-item'); // For homepage categories
  const resultBox = document.getElementById('result');
  const offcanvas = document.getElementById('offcanvasTop');

  // Expand offcanvas height for better search experience
  if (offcanvas) {
    offcanvas.classList.add('search-active');
  }

  // Show loading state
  resultBox.className = 'row g-4 mt-3 loading';
  resultBox.innerHTML = '';

  // Check if we're on the homepage (index.html)
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname.endsWith('/');

  // if no products on this page and we're not on homepage, redirect to shop.html
  if (products.length === 0 && !isHomePage) {
    setTimeout(() => {
      window.location.href = "shop.html?search=" + encodeURIComponent(query);
    }, 500);
    return;
  }

  // If on homepage, fetch and show products from shop page
  if (isHomePage) {
    setTimeout(() => {
      fetchAndShowProducts(query, resultBox);
    }, 300);
    return;
  }

  // Simulate search delay for better UX
  setTimeout(() => {
    performSearch(query, products, resultBox);
  }, 300);
}

// Separated search logic for better organization
function performSearch(query, products, resultBox) {
  resultBox.className = 'row g-4 mt-3';
  resultBox.innerHTML = "";
  let found = 0;
  const queryLower = query.toLowerCase();

  products.forEach(product => {
    const nameEl = product.querySelector('.name') || product.querySelector('.card-title');
    const name = nameEl ? nameEl.textContent.toLowerCase() : "";
    const category = product.id ? product.id.toLowerCase() : "";
    const type = product.querySelector('img') ? product.querySelector('img').alt.toLowerCase() : "";

    if (name.includes(queryLower) || category.includes(queryLower) || type.includes(queryLower)) {
      found++;

      // Create proper column for grid
      const col = document.createElement('div');
      col.className = 'col-lg-3 col-md-4 col-sm-6';

      // Clone only the .card inside product
      const card = product.querySelector('.card').cloneNode(true);
      
      // Enhance the cloned card for search results
      enhanceSearchCard(card);
      
      col.appendChild(card);
      resultBox.appendChild(col);
    }
  });

  // Show appropriate message based on results
  if (found === 0) {
    showNoResults(query, resultBox);
  }
}

// Enhance search result cards
function enhanceSearchCard(card) {
  // Ensure proper styling
  card.style.height = '100%';
  
  // Add click handlers for better interaction
  const shopBtn = card.querySelector('.shop-now');
  const addToCartBtn = card.querySelector('.add-to-cart');
  
  if (shopBtn) {
    shopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Navigate to shop page for detailed view
      window.location.href = 'shop.html';
    });
  }
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Show success message and could add to cart functionality
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = 'Added!';
      addToCartBtn.classList.remove('btn-success');
      addToCartBtn.classList.add('btn-success', 'disabled');
      
      setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.classList.remove('disabled');
      }, 2000);
      
      // Here you could add actual cart functionality
      console.log('Product added to cart');
    });
  }
}

// Show no results message with better styling
function showNoResults(query, resultBox) {
  resultBox.innerHTML = `
    <div class="col-12">
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h5>No results found</h5>
        <p>We couldn't find any products matching "<strong>${escapeHtml(query)}</strong>"</p>
        <p>Try searching with different keywords or browse our categories.</p>
      </div>
    </div>
  `;
}

// This function is no longer needed since we show products directly

// Function to redirect to shop page with search query
function goToShopWithSearch(query) {
  window.location.href = "shop.html?search=" + encodeURIComponent(query);
}

// Product data for homepage search (extracted from shop.html)
const productData = [
  { id: "indoor", name: "Rubber Plant (Ficus Elastica)", price: "$15", image: "img/rubber plant.jpeg", alt: "Indoor Plant" },
  { id: "outdoor", name: "Rose Plant", price: "$25", image: "img/rose.jpg", alt: "Outdoor Plant" },
  { id: "succulents", name: "Echeveria Succulent", price: "$12", image: "img/echeveria.jpg", alt: "Succulent" },
  { id: "herbs", name: "Basil Herb", price: "$8", image: "img/basil.jpg", alt: "Herb" },
  { id: "indoor", name: "Snake Plant", price: "$50", image: "img/Snake_Plant.jpg", alt: "Indoor Plant" },
  { id: "indoor", name: "Parlor Palm", price: "$70", image: "img/parlour-palm-plant.jpg", alt: "Indoor Plant" },
  { id: "indoor", name: "ENGLISH IVY CREEPER – CLIMBERS", price: "$60", image: "img/english-ivy.jpg", alt: "Indoor Plant" },
  { id: "indoor", name: "Chinese Evergreen", price: "$75", image: "img/chinese-evergreen.jpg", alt: "Indoor Plant" },
  { id: "outdoor", name: "Alexendar Palm", price: "$100", image: "img/alexendra-palm.webp", alt: "Outdoor Plant" },
  { id: "outdoor", name: "ASPARAGUS MARRY – FOXTAIL FERN", price: "$30", image: "img/marry.webp", alt: "Outdoor Plant" },
  { id: "succulents", name: "Aloe Vera", price: "$18", image: "img/aloe-vera.jpg", alt: "Succulent" },
  { id: "herbs", name: "Mint Plant", price: "$10", image: "img/mint.jpg", alt: "Herb" },
  { id: "seeds", name: "CELOSIA-SUMMER SEEDS", price: "$15", image: "img/celosia seed.webp", alt: "Seeds" },
  { id: "seeds", name: "TOMATO SEEDS", price: "$15", image: "img/tomato_seeds.jpeg", alt: "Seeds" },
  { id: "seeds", name: "COCONUT BULB", price: "$25", image: "img/coconut_bulb.jpeg", alt: "Seeds" }
];

// Display products on homepage search
function fetchAndShowProducts(query, resultBox) {
  resultBox.className = 'row g-4 mt-3';
  resultBox.innerHTML = "";
  
  let found = 0;
  const queryLower = query.toLowerCase();

  productData.forEach(product => {
    const name = product.name.toLowerCase();
    const category = product.id.toLowerCase();
    const alt = product.alt.toLowerCase();

    if (name.includes(queryLower) || category.includes(queryLower) || alt.includes(queryLower)) {
      found++;

      // Create proper column for grid
      const col = document.createElement('div');
      col.className = 'col-lg-3 col-md-4 col-sm-6';

      // Create product card
      const card = createProductCard(product);
      
      // Enhance the card for search results
      enhanceSearchCard(card);
      
      col.appendChild(card);
      resultBox.appendChild(col);
    }
  });

  // Show appropriate message based on results
  if (found === 0) {
    showNoResults(query, resultBox);
  }
}

// Create product card element
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'card product-card';
  
  card.innerHTML = `
    <img src="${product.image}" class="product-img" alt="${product.alt}">
    <div class="card-body text-center">
      <h5 class="card-title name">${product.name}</h5>
      <p class="card-text">${product.price}</p>
      <div class="btn-container">
        <button class="btn btn-success shop-now">Shop Now</button>
        <button class="btn btn-success add-to-cart">Add to Cart</button>            
      </div>          
    </div>
  `;
  
  return card;
}

  // Expose functions for inline onclick fallback (your HTML uses onclick="searchData()")
  window.searchData = searchData;
  window.goToShopWithSearch = goToShopWithSearch;

  // Add keyboard support for search
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchData();
        }
      });
      
      // Clear results when input is empty
      searchInput.addEventListener('input', function(e) {
        if (e.target.value.trim() === '') {
          const resultBox = document.getElementById('result');
          const offcanvas = document.getElementById('offcanvasTop');
          
          if (resultBox) {
            resultBox.innerHTML = '';
            resultBox.className = 'row g-4 mt-3';
          }
          
          // Reset offcanvas height when search is cleared
          if (offcanvas) {
            offcanvas.classList.remove('search-active');
          }
        }
      });
    }
  });

  // Function to close offcanvas
  window.closeOffcanvas = function() {
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasTop'));
    if (offcanvas) {
      offcanvas.hide();
    }
  };

  // Reset offcanvas height when it's hidden
  document.addEventListener('DOMContentLoaded', function() {
    const offcanvasElement = document.getElementById('offcanvasTop');
    if (offcanvasElement) {
      offcanvasElement.addEventListener('hidden.bs.offcanvas', function() {
        this.classList.remove('search-active');
        const resultBox = document.getElementById('result');
        if (resultBox) {
          resultBox.innerHTML = '';
          resultBox.className = 'row g-4 mt-3';
        }
        // Clear search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.value = '';
        }
      });
    }
  });

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