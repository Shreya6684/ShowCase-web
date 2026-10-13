
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalogGrid");
  const count = document.getElementById("productCount");
  const empty = document.getElementById("catalogEmpty");
  const searchInput = document.getElementById("catalogSearch");
  const searchButton = document.getElementById("catalogSearchButton");
  const sortSelect = document.getElementById("sortProducts");
  const categoryContainer = document.getElementById("catalogCategories");

  if (!grid) return;

  // Get products from products.js
  const allProducts = typeof getProducts === "function"
    ? getProducts()
    : typeof products !== "undefined" && Array.isArray(products)
      ? products
      : [];

  if (allProducts.length === 0) {
    grid.innerHTML = "";
    if (count) count.textContent = "0 products";
    if (empty) {
      empty.style.display = "block";
      empty.textContent =
        "Products could not be loaded. Please check products.js.";
    }
    return;
  }

  const params = new URLSearchParams(window.location.search);

  let selectedCategory = params.get("category") || "All Products";
  let searchTerm = params.get("search") || "";

  if (searchInput) searchInput.value = searchTerm;

  function renderCategoryButtons() {
    if (!categoryContainer) return;

    const categoryList =
      typeof categories !== "undefined" && Array.isArray(categories)
        ? categories
        : [];

    const names = ["All Products", ...categoryList.map(category => category.name)]
      .filter(Boolean);
    if (!names.some(name => name.toLowerCase() === selectedCategory.toLowerCase())) {
      names.splice(1, 0, selectedCategory);
    }

    categoryContainer.innerHTML = names
      .map((name) => {
        const active =
          name.toLowerCase() === selectedCategory.toLowerCase();

        return `
          <button
            type="button"
            class="filter-chip ${active ? "active" : ""}"
            data-category="${String(name).replace(/"/g, "&quot;")}"
          >
            ${name}
          </button>
        `;
      })
      .join("");
  }

  function renderProducts() {
    let filtered = allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        String(product.department || "").toLowerCase() ===
          selectedCategory.toLowerCase() ||
        String(product.category || "").toLowerCase() ===
          selectedCategory.toLowerCase();

      const searchableText = [
        product.name,
        product.brand,
        product.department,
        product.category,
        product.productTag,
        product.stockStatus,
        product.description
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        searchTerm.trim().toLowerCase()
      );

      return matchesCategory && matchesSearch;
    });

    const sortValue = sortSelect ? sortSelect.value : "default";

    if (sortValue === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortValue === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortValue === "rating") {
      filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortValue === "name") {
      filtered.sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    }

    if (count) {
      count.textContent = `${filtered.length} product${
        filtered.length === 1 ? "" : "s"
      } found`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (empty) {
        empty.style.display = "block";
        empty.textContent = "No products found. Try another search.";
      }
      return;
    }

    if (empty) empty.style.display = "none";

    if (typeof createProductCard === "function") {
      grid.innerHTML = filtered.map(createProductCard).join("");
    } else {
      grid.innerHTML = filtered
        .map(
          (product) => `
            <article class="product-card">
              <div class="product-visual">
                ${product.image
                  ? `<img class="product-photo" src="${product.image}" alt="${product.name}">`
                  : `<span>${product.emoji || "📦"}</span>`}
              </div>
              <div class="product-info">
                <p class="brand">${product.brand || ""}</p>
                <h3>${product.name || "Product"}</h3>
                <p>${product.description || ""}</p>
                <strong>₹${product.price ?? "—"}</strong>
              </div>
            </article>
          `
        )
        .join("");
    }
  }

  if (categoryContainer) {
    categoryContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      selectedCategory = button.dataset.category;
      renderCategoryButtons();
      renderProducts();
    });
  }

  function runSearch() {
    searchTerm = searchInput ? searchInput.value : "";
    renderProducts();
  }

  if (searchButton) {
    searchButton.addEventListener("click", runSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("input", runSearch);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") runSearch();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }

  renderCategoryButtons();
  renderProducts();
});
