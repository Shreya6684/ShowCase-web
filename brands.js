document.addEventListener("DOMContentLoaded", () => {
    const brandList = document.getElementById("brandList");
    const productGrid = document.getElementById("brandProducts");
    const searchInput = document.getElementById("brandSearch");
    if (!brandList || !productGrid) return;

    const products = typeof getProducts === "function" ? getProducts() : [];
    const selectedBrand = new URLSearchParams(location.search).get("brand") || "";
    const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const brands = [...new Set(products.map(product => String(product.brand || "").trim()).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second));

    function renderBrands() {
        const query = searchInput.value.trim().toLowerCase();
        brandList.innerHTML = brands.filter(brand => brand.toLowerCase().includes(query))
            .map(brand => {
                const total = products.filter(product => product.brand === brand).length;
                const active = selectedBrand.toLowerCase() === brand.toLowerCase();
                return `
                    <a class="brand-tile ${active ? "active" : ""}" href="brands.html?brand=${encodeURIComponent(brand)}" ${active ? 'aria-current="page"' : ""}>
                        <span class="brand-mark" aria-hidden="true">${escape(brand.slice(0, 1))}</span>
                        <span class="brand-tile-copy"><strong>${escape(brand)}</strong><small>${total} product${total === 1 ? "" : "s"}</small></span>
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                `;
            }).join("");
    }

    const filteredProducts = selectedBrand
        ? products.filter(product => String(product.brand || "").toLowerCase() === selectedBrand.toLowerCase())
        : products;
    const matchedBrand = brands.find(brand => brand.toLowerCase() === selectedBrand.toLowerCase());
    document.getElementById("brandHeading").textContent = matchedBrand
        ? `${matchedBrand} products`
        : "Brands & Manufacturers";
    document.getElementById("brandDescription").textContent = matchedBrand
        ? `Explore products made by ${matchedBrand}.`
        : "Browse products from the makers you know.";
    document.getElementById("brandProductsHeading").textContent = matchedBrand
        ? `Products by ${matchedBrand}`
        : "Products from all brands";
    document.getElementById("brandProductCount").textContent = `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;
    document.getElementById("brandEmpty").hidden = filteredProducts.length > 0;
    productGrid.hidden = filteredProducts.length === 0;
    productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join("");
    document.getElementById("allBrandsLink").hidden = !selectedBrand;

    searchInput.addEventListener("input", renderBrands);
    renderBrands();
});
