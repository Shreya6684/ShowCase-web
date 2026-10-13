document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("wishlistGrid");
    const count = document.getElementById("wishlistCount");
    const empty = document.getElementById("wishlistEmpty");
    const clearButton = document.getElementById("clearWishlist");
    if (!grid) return;

    function renderWishlist() {
        const ids = typeof getWishlist === "function" ? getWishlist() : [];
        const productList = typeof getProducts === "function" ? getProducts() : [];
        const savedProducts = ids.map(id =>
            productList.find(product => String(product.id) === String(id))
        ).filter(Boolean);

        count.textContent = `${savedProducts.length} saved product${savedProducts.length === 1 ? "" : "s"}`;
        clearButton.disabled = savedProducts.length === 0;
        empty.hidden = savedProducts.length > 0;
        grid.hidden = savedProducts.length === 0;
        grid.innerHTML = savedProducts.map(product => createProductCard(product)).join("");
    }

    clearButton.addEventListener("click", () => {
        if (typeof saveWishlist === "function") saveWishlist([]);
    });

    document.addEventListener("showcase:wishlist-change", renderWishlist);
    renderWishlist();
});
