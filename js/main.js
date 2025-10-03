function storeData() {
    var name = document.getElementById("searchInput").value; // Use the correct ID
    if (("localStorage" in window) && window.localStorage !== null) {
        localStorage.setItem("name", name);
    }
}

// function searchData() {
//     // 1. Get the trimmed search term in lowercase
//     const searchTerm = document.getElementById("search-input").value.toLowerCase().trim();
    
//     // 2. Convert to array for safer iteration (HTMLCollections are live)
//     const productItems = Array.from(document.getElementsByClassName("product-item"));
//     let foundResults = false;
  
//     // 3. Use forEach for cleaner iteration
//     productItems.forEach(productItem => {
//       // 4. Use textContent instead of innerText for consistency
//       const cardTitle = productItem.querySelector(".card-title").textContent.toLowerCase();
      
//       // 5. Check if title contains search term
//       const isVisible = cardTitle.includes(searchTerm);
      
//       // 6. Toggle visibility class instead of inline styles
//       productItem.classList.toggle("d-none", !isVisible);
      
//       // 7. Track if we found any results
//       if (isVisible) foundResults = true;
//     });
  
//     // 8. Show feedback if no results found
//     const resultsContainer = document.getElementById("search-results");
//     if (resultsContainer) {
//       resultsContainer.textContent = foundResults ? "" : "No products found matching your search.";
//     }
//   }

// 


// This function is now handled by search.js
// Removed duplicate searchData function to avoid conflicts
// The main search functionality is now centralized in js/search.js


// function searchData() {
//     const searchTerm = document.getElementById("search-input").value.toLowerCase().trim();
//     const resultsContainer = document.getElementById("result");
//     let searchElements;

//     // Clear previous results
//     if (resultsContainer) resultsContainer.innerHTML = "";

//     // Determine context
//     if (document.querySelector(".product-item")) {
//         searchElements = document.querySelectorAll(".product-item");
//     } else if (document.querySelector("#shop .nav-item")) {
//         searchElements = document.querySelectorAll("#shop .nav-item");
//     }

//     let foundResults = false;

//     if (searchElements) {
//         searchElements.forEach(element => {
//             const cardTitle = element.querySelector(".card-title").textContent.toLowerCase();
//             const isVisible = cardTitle.includes(searchTerm);

//             if (isVisible) {
//                 foundResults = true;
//                 const clone = element.cloneNode(true);
//                 clone.classList.remove("d-none"); 

//                 // // Add responsive column classes
//                 // const colWrapper = document.createElement("div");
//                 // colWrapper.className = "col-lg-4 col-md-4 col-sm-6 mb-4"; // Match your grid
//                 // colWrapper.appendChild(clone);
                
//                 // resultsContainer.appendChild(colWrapper);
//             }
//         });
//     }

//     // No results message
//     if (!foundResults) {
//         resultsContainer.innerHTML = `
//             <div class="no-results py-5">
//                 <i class="fa-solid fa-leaf me-2"></i>
//                 No results found for "${searchTerm}"
//             </div>
//         `;
//     }
// }