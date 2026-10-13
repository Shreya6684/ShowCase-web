
/* ======================================
   SHOWCASE - MAIN JAVASCRIPT
====================================== */

/* Run after the page loads */

document.addEventListener("DOMContentLoaded", () => {
    setupAccountNavigation();
    renderCategories();
    renderFeaturedProducts();
    renderLatestProducts();
    renderRecentProducts();
    setupSearch();
    setupWishlist();
    setupDarkMode();
});

function setupAccountNavigation() {
    const accountLink = document.querySelector("[data-account-link]");
    const logoutButton = document.querySelector("[data-nav-logout]");
    if (!accountLink) return;

    let session = null;
    try {
        session = JSON.parse(
            localStorage.getItem("showcaseCurrentUser") || "null"
        );
    } catch {
        localStorage.removeItem("showcaseCurrentUser");
    }

    if (session?.role === "admin") {
        accountLink.href = "admin-dashboard.html";
        accountLink.textContent = "Admin Dashboard";
    } else if (session?.role === "user") {
        accountLink.href = "profile.html";
        accountLink.textContent = "My Account";
    } else {
        accountLink.href = "login.html";
        accountLink.textContent = "Login / Register";
    }

    if (logoutButton) {
        logoutButton.hidden = !session;
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("showcaseCurrentUser");
            window.location.href = "index.html";
        });
    }
}

/* Safe HTML output */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

/* Read wishlist from browser storage */

function getWishlist() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("showcaseWishlist") || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

/* Save wishlist */

function saveWishlist(ids) {
    try {
        localStorage.setItem(
            "showcaseWishlist",
            JSON.stringify(ids)
        );
        document.dispatchEvent(new CustomEvent("showcase:wishlist-change"));
    } catch (error) {
        console.warn("Wishlist could not be saved.", error);
    }
}

/* Get product data safely */


function getProducts() {
    const baseProducts = typeof products !== "undefined" && Array.isArray(products)
        ? products
        : Array.isArray(window.products)
            ? window.products
            : [];

    try {
        const saved = JSON.parse(
            localStorage.getItem("showcaseProductsOverride") || "null"
        );

        if (Array.isArray(saved)) {
            const versionKey = "showcaseCatalogSeedVersion";
            const savedVersion = Number(localStorage.getItem(versionKey) || 0);
            const currentVersion = Number(window.SHOWCASE_PRODUCT_CATALOG_VERSION || 1);

            if (baseProducts.length && savedVersion < currentVersion) {
                const savedById = new Map(
                    saved.map(product => [String(product.id), product])
                );
                const baseIds = new Set(baseProducts.map(product => String(product.id)));
                const merged = baseProducts.map(product => ({
                    ...product,
                    ...(savedById.get(String(product.id)) || {})
                }));
                const customProducts = saved.filter(product =>
                    !baseIds.has(String(product.id))
                );
                const migratedProducts = [...merged, ...customProducts];

                localStorage.setItem(
                    "showcaseProductsOverride",
                    JSON.stringify(migratedProducts)
                );
                localStorage.setItem(versionKey, String(currentVersion));
                return migratedProducts;
            }

            return saved;
        }
    } catch (error) {
        console.warn("Saved product data could not be read.", error);
    }

    return baseProducts;
}


/* Get category data safely */

function getCategories() {
    if (Array.isArray(window.SHOWCASE_CATEGORIES)) {
        return window.SHOWCASE_CATEGORIES;
    }

    if (typeof categories !== "undefined" && Array.isArray(categories)) {
        return categories;
    }

    return [];
}

/* Format prices */

function formatPrice(price) {
    if (typeof price === "string" && price.trim() !== "") {
        return escapeHTML(price);
    }

    const amount = Number(price);

    if (!Number.isFinite(amount)) {
        return "Price unavailable";
    }

    return "₹" + amount.toLocaleString("en-IN");
}

/* Render category cards */

function renderCategories(target = "#categoryGrid") {
    const container = typeof target === "string"
        ? document.querySelector(target)
        : target;

    if (!container) return;

    const categoryList = getCategories();

    if (categoryList.length === 0) {
        container.innerHTML = `
            <p class="muted">Categories will appear here soon.</p>
        `;
        return;
    }

    const productList = getProducts();

    container.innerHTML = categoryList.map(category => {
        const name = category.name || "Category";
        const icon = category.emoji || category.icon || "📦";
        const description =
            category.description || category.desc || "";
        const categoryImage = category.image || productList.find(product =>
            String(product.department || product.category).toLowerCase() === String(name).toLowerCase() &&
            product.image
        )?.image || "";

        return `
            <a class="category-card"
               href="catalog.html?category=${encodeURIComponent(name)}">
                <div class="category-photo-wrap">
                    <img class="category-photo"
                         src="${escapeHTML(categoryImage)}"
                         alt=""
                         loading="lazy"
                         decoding="async"
                         onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
                         ${categoryImage ? "" : "hidden"}>
                    <div class="category-icon" ${categoryImage ? "hidden" : ""}>
                        ${escapeHTML(icon)}
                    </div>
                </div>

                <div class="category-info">
                    <h3>${escapeHTML(name)}</h3>
                    <p>${escapeHTML(description)}</p>
                </div>
            </a>
        `;
    }).join("");

    const categoryCards = [...container.querySelectorAll(".category-card")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
        categoryCards.forEach(card => card.classList.add("is-visible"));
        return;
    }

    const categoryObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            categoryObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    categoryCards.forEach((card, index) => {
        card.style.setProperty("--category-enter-delay", `${(index % 4) * 65}ms`);
        categoryObserver.observe(card);
    });
}

/* Product card HTML */

function createProductCard(product) {
    const wishlist = getWishlist();
    const productId = product.id;
    const isSaved = wishlist.some(
        id => String(id) === String(productId)
    );

    const image = product.image || "";
    const emoji = product.emoji || "📦";
    const badge = product.productTag || product.badge || "Popular";
    const name = product.name || "Product";
    const brand = product.brand || "ShowCase";
    const rating = product.rating ?? "New";
    const reviews = product.reviews ?? 0;
    const stockStatus = product.stockStatus || "In Stock";
    const stockClass = stockStatus === "In Stock"
        ? "in-stock"
        : stockStatus === "Limited Stock"
            ? "limited-stock"
            : "out-of-stock";
    const isOutOfStock = stockStatus === "Out of Stock";
    const price = formatPrice(product.price);

    return `
        <article class="product-card">
            <div class="product-visual">

                <span class="product-badge">
                    ${escapeHTML(badge)}
                </span>

                <button
                    class="wishlist-btn ${isSaved ? "active" : ""}"
                    type="button"
                    data-wishlist-id="${escapeHTML(productId)}"
                    aria-label="${isSaved ? "Remove from" : "Add to"} wishlist"
                    aria-pressed="${isSaved}">
                    ${isSaved ? "♥" : "♡"}
                </button>

                <img
                    class="product-photo"
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
                    ${image ? "" : "hidden"}
                >

                <span
                    class="product-emoji fallback-emoji"
                    ${image ? "hidden" : ""}>
                    ${escapeHTML(emoji)}
                </span>

            </div>

            <a class="brand" href="brands.html?brand=${encodeURIComponent(brand)}">
                ${escapeHTML(brand)}
            </a>

            <h3>
                <a href="product.html?id=${encodeURIComponent(productId ?? "")}">
                    ${escapeHTML(name)}
                </a>
            </h3>

            <div class="rating">
                ★ ${escapeHTML(rating)}
                <span class="muted">
                    (${escapeHTML(reviews)} reviews)
                </span>
            </div>

            <p class="product-stock-status ${stockClass}">
                <span aria-hidden="true"></span>${escapeHTML(stockStatus)}
            </p>

            <div class="price">
                ${price}
            </div>

            <button class="add-to-cart-btn" type="button"
                    data-add-to-cart="${escapeHTML(productId)}"
                    ${isOutOfStock ? "disabled" : ""}>
                <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
                ${isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <div class="product-card-actions">

                <a class="btn btn-primary"
                   href="product.html?id=${encodeURIComponent(productId ?? "")}">
                    View Details
                </a>

                <a class="btn btn-outline"
                   href="compare.html?add=${encodeURIComponent(productId ?? "")}">
                    Compare
                </a>

            </div>

        </article>
    `;
}

/* Render products into a grid */

function renderProductGrid(elementId, productList) {
    const container = document.getElementById(elementId);

    if (!container) return;

    if (!Array.isArray(productList) || productList.length === 0) {
        container.innerHTML = `
            <p class="muted">No products available right now.</p>
        `;
        return;
    }

    container.innerHTML = productList
        .map(createProductCard)
        .join("");
}

/* Featured products */

function renderFeaturedProducts() {
    const productList = getProducts();

    renderProductGrid("featuredGrid", productList.slice(0, 4));
}

/* Latest products */

function renderLatestProducts() {
    const productList = getProducts();

    renderProductGrid("latestGrid", productList.slice(4, 8));
}

/* Recently added products */

function renderRecentProducts() {
    const productList = getProducts();

    renderProductGrid("recentGrid", productList.slice(8, 12));
}

/* Wishlist buttons */


function setupWishlist() {
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-wishlist-id]");
        if (!button) return;

        const id = button.dataset.wishlistId;
        const wishlist = getWishlist();

        const index = wishlist.findIndex(
            savedId => String(savedId) === String(id)
        );

        if (index >= 0) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(id);
        }

        saveWishlist(wishlist);

        const isSaved = wishlist.some(
            savedId => String(savedId) === String(id)
        );

        button.classList.toggle("active", isSaved);
        button.textContent = isSaved ? "♥" : "♡";

        button.setAttribute("aria-pressed", String(isSaved));
        button.setAttribute(
            "aria-label",
            `${isSaved ? "Remove from" : "Add to"} wishlist`
        );

        if (window.showcaseToast) {
            window.showcaseToast(
                isSaved
                    ? "Added to your wishlist ❤️"
                    : "Removed from your wishlist"
            );
        }
    });
}

/* Search support */

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    if (!searchInput) return;

    function runSearch() {
        const query = searchInput.value.trim();

        if (!query) {
            searchInput.focus();
            return;
        }

        window.location.href =
            `catalog.html?search=${encodeURIComponent(query)}`;
    }

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            runSearch();
        }
    });

    if (searchButton) {
        searchButton.addEventListener("click", runSearch);
    }
}

/* Dark mode toggle */

function setupDarkMode() {
    const toggles = [
        document.getElementById("darkModeToggle"),
        document.getElementById("themeToggle")
    ].filter(Boolean);

    try {
        if (localStorage.getItem("showcaseDarkMode") === "true") {
            document.body.classList.add("dark-mode");
        }
    } catch (error) {
        console.warn("Dark mode preference could not be read.", error);
    }

    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            try {
                localStorage.setItem(
                    "showcaseDarkMode",
                    String(document.body.classList.contains("dark-mode"))
                );
            } catch (error) {
                console.warn("Dark mode preference could not be saved.", error);
            }
        });
    });
}

/* ===== SHOPPING CART FUNCTIONALITY ===== */

(() => {
    const CART_KEY = "showcaseCart";

    function getCart() {
        try {
            const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
    }

    function money(amount) {
        return "₹" + Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
    }

    function getProduct(id) {
        const productList = typeof getProducts === "function"
            ? getProducts()
            : typeof products !== "undefined" && Array.isArray(products)
                ? products
                : [];
        return productList.find(product => String(product.id) === String(id));
    }

    function getProductImage(product) {
        if (product.image) {
            return product.image;
        }

        if (typeof productImage === "function") {
            return productImage(product.photoId || "");
        }

        return "";
    }

    function updateCartBadge() {
        const totalItems = getCart().reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        document.querySelectorAll("[data-cart-count]").forEach(element => {
            element.textContent = totalItems;
        });
    }

    function addToCart(id) {
        const product = getProduct(id);
        if (!product) return;

        if (product.stockStatus === "Out of Stock") {
            window.showcaseToast?.("This product is currently out of stock.", "error");
            return;
        }

        const cart = getCart();
        const existing = cart.find(item => String(item.id) === String(id));

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: product.id, quantity: 1 });
        }

        saveCart(cart);

        if (document.getElementById("cartItems")) {
            renderCart();
        }

        window.showcaseToast(product.name + " added to your cart!");
    }

    function changeQuantity(id, amount) {
        const cart = getCart();
        const item = cart.find(entry => String(entry.id) === String(id));

        if (!item) return;

        item.quantity += amount;

        const updatedCart = cart.filter(entry => entry.quantity > 0);
        saveCart(updatedCart);
        renderCart();
    }

    function removeFromCart(id) {
        const updatedCart = getCart().filter(
            item => String(item.id) !== String(id)
        );

        saveCart(updatedCart);
        renderCart();
    }

    function renderCart() {
        const container = document.getElementById("cartItems");
        if (!container) return;

        const validCart = getCart().filter(item => {
            return getProduct(item.id) && Number(item.quantity) > 0;
        });

        if (validCart.length !== getCart().length) {
            saveCart(validCart);
        }

        const totalItems = validCart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const subtotal = validCart.reduce((sum, item) => {
            const product = getProduct(item.id);
            return sum + Number(product.price) * item.quantity;
        }, 0);

        document.getElementById("cartItemCount").textContent =
            totalItems + (totalItems === 1 ? " item" : " items");

        document.getElementById("cartSubtotal").textContent = money(subtotal);
        document.getElementById("cartTotal").textContent = money(subtotal);

        const checkoutButton = document.getElementById("checkoutButton");
        checkoutButton.disabled = validCart.length === 0;

        if (validCart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any products yet.</p>
                    <a href="catalog.html" class="cart-shop-btn">
                        Explore Products
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = validCart.map(item => {
            const product = getProduct(item.id);
            const image = getProductImage(product);
            const lineTotal = Number(product.price) * item.quantity;

            const imageMarkup = image
                ? `<img src="${image}" alt="" onerror="this.style.display='none';this.parentElement.textContent='🛍️'">`
                : (product.emoji || "🛍️");

            return `
                <article class="cart-item">
                    <div class="cart-item-image">${imageMarkup}</div>

                    <div class="cart-item-info">
                        <h3>${escapeCartText(product.name)}</h3>
                        <p class="cart-item-brand">
                            ${escapeCartText(product.brand || "")}
                        </p>
                        <div class="cart-item-price">
                            ${money(product.price)}
                        </div>

                        <div class="cart-quantity">
                            <button
                                type="button"
                                data-cart-action="decrease"
                                data-id="${product.id}"
                                aria-label="Decrease quantity"
                                ${item.quantity <= 1 ? "disabled" : ""}
                            >−</button>

                            <span>${item.quantity}</span>

                            <button
                                type="button"
                                data-cart-action="increase"
                                data-id="${product.id}"
                                aria-label="Increase quantity"
                            >+</button>
                        </div>
                    </div>

                    <div class="cart-item-actions">
                        <span class="cart-line-total">${money(lineTotal)}</span>
                        <button
                            type="button"
                            class="cart-remove-btn"
                            data-cart-action="remove"
                            data-id="${product.id}"
                        >Remove</button>
                    </div>
                </article>
            `;
        }).join("");
    }

    function escapeCartText(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    // Cart page quantity and remove controls.
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-cart-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.cartAction;

        if (action === "increase") changeQuantity(id, 1);
        if (action === "decrease") changeQuantity(id, -1);
        if (action === "remove") removeFromCart(id);
    });

    // Add-to-cart buttons can use data-add-to-cart="PRODUCT_ID".
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-add-to-cart]");
        if (!button) return;

        event.preventDefault();
        addToCart(button.dataset.addToCart);
    });

    // Demo checkout only; this does not process payments or place orders.
    
/* ===== DEMO CHECKOUT ===== */

document.addEventListener("click", event => {
    const button = event.target.closest("#checkoutButton");
    if (!button) return;

    let currentUser = null;
    try {
        currentUser = JSON.parse(
            localStorage.getItem("showcaseCurrentUser") || "null"
        );
    } catch {
        localStorage.removeItem("showcaseCurrentUser");
    }

    if (!currentUser || currentUser.role !== "user") {
        window.location.href = "login.html?next=cart.html";
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        window.showcaseToast?.("Your cart is empty!", "error");
        return;
    }

    const productList = getProducts();

    const orderItems = cart.map(item => {
        const product = productList.find(
            p => String(p.id) === String(item.id)
        );

        if (!product) return null;

        return {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: Number(item.quantity)
        };
    }).filter(Boolean);

    if (orderItems.length === 0) {
        window.showcaseToast?.(
            "Unable to process your cart. Please try again.",
            "error"
        );
        return;
    }

    const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const ordersKey = "showcaseDemoOrders";
    let orders = [];

    try {
        orders = JSON.parse(
            localStorage.getItem(ordersKey) || "[]"
        );

        if (!Array.isArray(orders)) orders = [];
    } catch {
        orders = [];
    }

    const order = {
        id: "SC" + Date.now().toString().slice(-8),
        date: new Date().toLocaleString("en-IN"),
        items: orderItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        ),
        total,
        status: "Order Placed",
        customer: {
            name: currentUser.name || "Customer",
            email: currentUser.email || ""
        },
        products: orderItems
    };

    orders.unshift(order);

    try {
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        localStorage.removeItem("showcaseCart");
    } catch {
        window.showcaseToast?.(
            "Could not save your order. Please try again.",
            "error"
        );
        return;
    }

    const container = document.getElementById("cartItems");

    if (container) {
        container.innerHTML = `
            <div class="cart-empty order-success">
                <div class="cart-empty-icon">🎉</div>
                <h2>Order Placed Successfully!</h2>
                <p>Your order has been saved.</p>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Total:</strong> ₹${total.toLocaleString("en-IN")}</p>
                <p class="muted">
                    Thank you for your order! Your order has been placed successfully.
                </p>
                <a href="profile.html" class="cart-shop-btn">
                    View Order History
                </a>
                <a href="catalog.html" class="cart-shop-btn">
                    Continue Shopping
                </a>
            </div>
        `;
    }

    document.getElementById("cartItemCount")?.replaceChildren(
        document.createTextNode("0 items")
    );
    document.getElementById("cartSubtotal")?.replaceChildren(
        document.createTextNode("₹0")
    );
    document.getElementById("cartTotal")?.replaceChildren(
        document.createTextNode("₹0")
    );

    document.querySelectorAll("[data-cart-count]").forEach(element => {
        element.textContent = "0";
    });

    button.disabled = true;

    window.showcaseToast?.("Your demo order was placed successfully! 🎉");
});

    document.addEventListener("DOMContentLoaded", () => {
        renderCart();
        updateCartBadge();
    });

    // Also works if this code is loaded after DOMContentLoaded.
    renderCart();
    updateCartBadge();
})();

/* ===== SHOWCASE PROFILE & DEMO ORDER HISTORY ===== */

(() => {
    const PROFILE_KEY = "showcaseUserProfile";
    const ORDERS_KEY = "showcaseDemoOrders";

    function readSavedData(key, fallback) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return data ?? fallback;
        } catch {
            return fallback;
        }
    }

    function safeText(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function initProfilePage() {
        const form = document.getElementById("profileForm");
        if (!form) return;

        const session = readSavedData("showcaseCurrentUser", null);
        if (!session || session.role !== "user") {
            window.location.replace("login.html?next=profile.html");
            return;
        }

        const nameInput = document.getElementById("profileName");
        const emailInput = document.getElementById("profileEmail");
        const nameDisplay = document.getElementById("profileDisplayName");
        const emailDisplay = document.getElementById("profileDisplayEmail");
        const message = document.getElementById("profileMessage");

        const savedProfile = readSavedData(PROFILE_KEY, {});
        const profile = savedProfile.email === session.email
            ? savedProfile
            : { name: session.name || "", email: session.email || "" };

        nameInput.value = profile.name || "";
        emailInput.value = profile.email || "";

        function updateProfileDisplay(data) {
            nameDisplay.textContent = data.name || "Your Name";
            emailDisplay.textContent = data.email || "your@email.com";
        }

        updateProfileDisplay(profile);

        form.addEventListener("submit", event => {
            event.preventDefault();

            const updatedProfile = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim()
            };

            if (!updatedProfile.name || !updatedProfile.email) {
                message.textContent = "Please fill in both fields.";
                return;
            }

            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(updatedProfile)
            );
            session.name = updatedProfile.name;
            localStorage.setItem("showcaseCurrentUser", JSON.stringify(session));

            updateProfileDisplay(updatedProfile);
            message.textContent = "Profile saved successfully!";
        });

        renderDemoOrders();
    }

    function renderDemoOrders() {
        const container = document.getElementById("profileOrderList");
        if (!container) return;

        let session = null;
        try {
            session = JSON.parse(
                localStorage.getItem("showcaseCurrentUser") || "null"
            );
        } catch {
            session = null;
        }

        const orders = readSavedData(ORDERS_KEY, []).filter(order =>
            order.customer?.email === session?.email
        );
        const count = document.getElementById("profileOrderCount");

        if (!Array.isArray(orders) || orders.length === 0) {
            count.textContent = "0 orders";
            container.innerHTML = `
                <div class="profile-empty">
                    <div style="font-size:42px">📦</div>
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here when orders are added.</p>
                </div>
            `;
            return;
        }

        count.textContent =
            orders.length + (orders.length === 1 ? " order" : " orders");

        container.innerHTML = orders.map(order => `
            <article class="profile-order">
                <div>
                    <h3>Order #${safeText(order.id)}</h3>
                    <p>${safeText(order.date || "Date unavailable")}</p>
                    <p>${Number(order.items || 0)} item(s)</p>
                    <span class="profile-order-status">
                        ${safeText(order.status || "Demo")}
                    </span>
                </div>
                <div class="profile-order-total">
                    ₹${Number(order.total || 0).toLocaleString("en-IN")}
                </div>
            </article>
        `).join("");
    }

    document.addEventListener("DOMContentLoaded", initProfilePage);

    // Allows the page to initialize if this script runs after page loading.
    initProfilePage();
})();

/* ===== SHOWCASE TOAST SYSTEM ===== */

(() => {
    let toastContainer;

    function getToastContainer() {
        if (toastContainer && toastContainer.isConnected) {
            return toastContainer;
        }

        toastContainer = document.createElement("div");
        toastContainer.className = "showcase-toast-container";
        toastContainer.setAttribute("aria-live", "polite");
        toastContainer.setAttribute("aria-atomic", "false");
        document.body.appendChild(toastContainer);

        return toastContainer;
    }

    window.showcaseToast = function (message, type = "success") {
        const container = getToastContainer();
        const toast = document.createElement("div");
        const icon = document.createElement("span");
        const text = document.createElement("span");
        const close = document.createElement("button");

        toast.className = "showcase-toast toast-" +
            (type === "error" ? "error" : "success");

        icon.className = "showcase-toast-icon";
        icon.textContent = type === "error" ? "!" : "✓";
        icon.setAttribute("aria-hidden", "true");

        text.className = "showcase-toast-message";
        text.textContent = String(message);

        close.className = "showcase-toast-close";
        close.type = "button";
        close.textContent = "×";
        close.setAttribute("aria-label", "Dismiss notification");

        let dismissed = false;

        function dismiss() {
            if (dismissed) return;
            dismissed = true;
            clearTimeout(timer);
            toast.classList.add("toast-hide");
            toast.addEventListener("animationend", () => toast.remove(), {
                once: true
            });
            setTimeout(() => toast.remove(), 350);
        }

        close.addEventListener("click", dismiss);

        toast.append(icon, text, close);
        container.appendChild(toast);

        const timer = setTimeout(dismiss, 3200);

        return toast;
    };
})();

/* ===== SHOWCASE AUTHENTICATION: LOGIN & REGISTER ===== */

(() => {
    const ADMIN_EMAIL = "admin@showcase.com";
    const ADMIN_PASSWORD = "Admin@123";
    const USERS_KEY = "showcaseRegisteredUsers";
    const SESSION_KEY = "showcaseCurrentUser";
    const requestedPage = new URLSearchParams(location.search).get("next");
    const returnPage = ["cart.html", "profile.html"].includes(requestedPage)
        ? requestedPage
        : "index.html";

    document.addEventListener("DOMContentLoaded", initAuth);

    function initAuth() {
        const form = document.getElementById("authForm");
        if (!form) return;

        const loginTab = document.getElementById("loginTab");
        const registerTab = document.getElementById("registerTab");
        const nameField = document.getElementById("nameField");
        const confirmField = document.getElementById("confirmField");
        const nameInput = document.getElementById("authName");
        const emailInput = document.getElementById("authEmail");
        const passwordInput = document.getElementById("authPassword");
        const confirmInput = document.getElementById("authConfirmPassword");
        const title = document.getElementById("authTitle");
        const subtitle = document.getElementById("authSubtitle");
        const submit = document.getElementById("authSubmit");
        const message = document.getElementById("authMessage");
        const switchText = document.getElementById("authSwitchText");
        const switchButton = document.getElementById("switchToRegister");

        let mode = "login";

        function readUsers() {
            try {
                const data = JSON.parse(
                    localStorage.getItem(USERS_KEY) || "[]"
                );
                return Array.isArray(data) ? data : [];
            } catch {
                return [];
            }
        }

        function showMessage(text, success = false) {
            message.textContent = text;
            message.classList.toggle("success", success);
        }

        function setMode(nextMode) {
            mode = nextMode;
            const registering = mode === "register";

            loginTab.classList.toggle("active", !registering);
            registerTab.classList.toggle("active", registering);
            nameField.hidden = !registering;
            confirmField.hidden = !registering;

            nameInput.required = registering;
            confirmInput.required = registering;

            passwordInput.autocomplete = registering
                ? "new-password"
                : "current-password";

            title.textContent = registering
                ? "Create Your Account"
                : "Welcome Back!";

            subtitle.textContent = registering
                ? "Join ShowCase and explore products."
                : "Login to continue shopping.";

            submit.innerHTML = registering
                ? 'Create Account <i class="fa-solid fa-user-plus"></i>'
                : 'Login <i class="fa-solid fa-arrow-right"></i>';

            switchText.firstChild.textContent = registering
                ? "Already have an account? "
                : "Don't have an account? ";

            switchButton.textContent = registering ? "Login" : "Register";
            showMessage("");
        }

        function saveSession(user) {
            const session = {
                name: user.name,
                email: user.email,
                role: user.role
            };

            try {
                localStorage.setItem(
                    SESSION_KEY,
                    JSON.stringify(session)
                );
            } catch {
                showMessage("Unable to save login. Check browser storage.");
                return false;
            }

            return true;
        }

        function redirectUser(user) {
            if (!saveSession(user)) return;

            showMessage("Login successful! Redirecting...", true);

            window.location.href = user.role === "admin"
                ? "admin-dashboard.html"
                : returnPage;
        }

        loginTab.addEventListener("click", () => setMode("login"));
        registerTab.addEventListener("click", () => setMode("register"));

        switchButton.addEventListener("click", () => {
            setMode(mode === "login" ? "register" : "login");
        });

        form.addEventListener("submit", event => {
            event.preventDefault();
            showMessage("");

            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            const name = nameInput.value.trim();

            if (!email || !password) {
                showMessage("Please enter your email and password.");
                return;
            }

            if (mode === "register") {
                if (!name) {
                    showMessage("Please enter your full name.");
                    return;
                }

                if (password.length < 6) {
                    showMessage("Password must be at least 6 characters.");
                    return;
                }

                if (password !== confirmInput.value) {
                    showMessage("Passwords do not match.");
                    return;
                }

                if (email === ADMIN_EMAIL) {
                    showMessage("This email is reserved for the admin account.");
                    return;
                }

                const users = readUsers();

                if (users.some(user => user.email === email)) {
                    showMessage("This email is already registered. Please login.");
                    return;
                }

                users.push({
                    name,
                    email,
                    password,
                    role: "user"
                });

                try {
                    localStorage.setItem(USERS_KEY, JSON.stringify(users));
                } catch {
                    showMessage("Registration could not be saved.");
                    return;
                }

                showMessage("Registration successful! You can now login.", true);
                form.reset();
                setMode("login");
                emailInput.value = email;
                return;
            }

            // Demo admin login.
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                redirectUser({
                    name: "Admin",
                    email: ADMIN_EMAIL,
                    role: "admin"
                });
                return;
            }

            const user = readUsers().find(
                item => item.email === email && item.password === password
            );

            if (!user) {
                showMessage("Invalid email or password.");
                return;
            }

            redirectUser({
                name: user.name,
                email: user.email,
                role: "user"
            });
        });

        // Keep a signed-in user from accidentally reopening the login page.
        try {
            const currentUser = JSON.parse(
                localStorage.getItem(SESSION_KEY) || "null"
            );

            if (currentUser && currentUser.role === "admin") {
                window.location.replace("admin-dashboard.html");
                return;
            }

            if (currentUser && currentUser.role === "user") {
                window.location.replace(returnPage);
                return;
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }

        setMode("login");
    }
})();

/* ===== SHOWCASE ADMIN DASHBOARD ===== */

(() => {
    const PRODUCTS_KEY = "showcaseProductsOverride";
    const USERS_KEY = "showcaseRegisteredUsers";
    const SESSION_KEY = "showcaseCurrentUser";
    const ORDERS_KEY = "showcaseDemoOrders";
    const REVIEWS_KEY = "showcaseProductReviews";
    const INQUIRIES_KEY = "showcaseInquiries";

    const $ = id => document.getElementById(id);

    function readJSON(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "null");
            return value ?? fallback;
        } catch {
            return fallback;
        }
    }

    function saveJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function text(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#39;"
        })[char]);
    }

    function notify(message, type = "success") {
        if (typeof window.showcaseToast === "function") {
            window.showcaseToast(message, type);
        } else {
            alert(message);
        }
    }

    function money(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN");
    }

    function getAdminProducts() {
        const base = typeof products !== "undefined" && Array.isArray(products)
            ? products
            : [];

        const saved = readJSON(PRODUCTS_KEY, null);
        return Array.isArray(saved) ? saved : base;
    }

    function getOrders() {
        return readJSON(ORDERS_KEY, []).map(order => ({
            ...order,
            status: order.status || "Order Placed"
        }));
    }

    function initDashboard() {
        if (!$("adminProductsBody")) return;

        const session = readJSON(SESSION_KEY, null);

        if (!session || session.role !== "admin") {
            window.location.replace("login.html");
            return;
        }

        $("adminName").textContent = session.name || "Admin";

        // Dashboard navigation.
        document.querySelectorAll("[data-section]").forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                openSection(link.dataset.section);
            });
        });

        document.querySelectorAll("[data-go]").forEach(button => {
            button.addEventListener("click", () => {
                openSection(button.dataset.go);
                if (button.dataset.go === "products") {
                    showProductForm();
                }
            });
        });

        $("adminLogout").addEventListener("click", () => {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = "login.html";
        });

        $("showProductForm").addEventListener("click", showProductForm);
        $("cancelProductForm").addEventListener("click", hideProductForm);
        $("adminProductForm").addEventListener("submit", saveProduct);
        $("adminProductSearch").addEventListener("input", renderProducts);

        $("adminProductsBody").addEventListener("click", event => {
            const button = event.target.closest("[data-product-action]");
            if (!button) return;

            const id = button.dataset.id;
            const action = button.dataset.productAction;

            if (action === "edit") editProduct(id);
            if (action === "delete") deleteProduct(id);
        });

        $("adminOrdersBody").addEventListener("change", event => {
            const select = event.target.closest("[data-order-id]");
            if (!select) return;

            const orders = getOrders();
            const order = orders.find(
                item => String(item.id) === String(select.dataset.orderId)
            );

            if (!order) return;

            order.status = select.value;

            try {
                saveJSON(ORDERS_KEY, orders);
                renderOrders();
                renderOverview();
                notify("Order status updated!");
            } catch {
                notify("Could not save order status.", "error");
            }
        });

        $("adminInquiriesBody").addEventListener("change", event => {
            const select = event.target.closest("[data-inquiry-id]");
            if (!select) return;

            const inquiries = readJSON(INQUIRIES_KEY, []);
            const inquiry = inquiries.find(
                item => String(item.id) === String(select.dataset.inquiryId)
            );
            if (!inquiry) return;

            inquiry.status = select.value;
            try {
                saveJSON(INQUIRIES_KEY, inquiries);
                renderInquiries();
                notify("Inquiry status updated.");
            } catch {
                notify("Could not save inquiry status.", "error");
            }
        });

        renderAll();
        openSection(location.hash.slice(1) || "overview");
    }

    function openSection(id) {
        const allowed = ["overview", "products", "orders", "reviews", "inquiries"];
        if (!allowed.includes(id)) id = "overview";

        document.querySelectorAll(".admin-section").forEach(section => {
            section.classList.toggle("active", section.id === id);
        });

        document.querySelectorAll("[data-section]").forEach(link => {
            link.classList.toggle("active", link.dataset.section === id);
        });

        const titles = {
            overview: "Dashboard Overview",
            products: "Product Management",
            orders: "Order Management",
            reviews: "Customer Reviews",
            inquiries: "Product Inquiries"
        };

        $("adminPageTitle").textContent = titles[id];
        history.replaceState(null, "", "#" + id);
    }

    function renderAll() {
        renderProducts();
        renderOrders();
        renderReviews();
        renderInquiries();
        renderOverview();
    }

    function renderOverview() {
        const list = getAdminProducts();
        const orders = getOrders();
        const reviews = readJSON(REVIEWS_KEY, []);

        $("statProducts").textContent = list.length;
        $("statOrders").textContent = orders.length;
        $("statReviews").textContent = reviews.length;

        const revenue = orders.reduce((sum, order) => {
            const amount = Number(order.total);
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        $("statRevenue").textContent = money(revenue);

        const recent = orders.slice(0, 5);

        $("overviewOrders").innerHTML = recent.length
            ? recent.map(order => `
                <tr>
                    <td>${text(order.id)}</td>
                    <td>${text(order.customer?.name || "Guest")}</td>
                    <td>${text(order.date || "—")}</td>
                    <td>${Number(order.items || 0)}</td>
                    <td>${money(order.total)}</td>
                    <td><span class="admin-status">${text(order.status || "Order Placed")}</span></td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="admin-empty">No orders yet.</td></tr>`;
    }

    function renderProducts() {
        const query = $("adminProductSearch").value.trim().toLowerCase();

        const list = getAdminProducts().filter(product =>
            [product.name, product.brand, product.category]
                .some(value => String(value || "").toLowerCase().includes(query))
        );

        $("adminProductCount").textContent =
            `${list.length} product${list.length === 1 ? "" : "s"}`;

        $("adminProductsBody").innerHTML = list.length
            ? list.map(product => `
                <tr>
                    <td>
                        <div class="admin-product-name">
                            <span class="admin-product-thumb">
                                ${product.image
                                    ? `<img src="${text(product.image)}" alt=""
                                        onerror="this.style.display='none'">`
                                    : text(product.emoji || "📦")}
                            </span>
                            <span>
                                <strong>${text(product.name)}</strong>
                                <small>${text(product.brand || "")}</small>
                            </span>
                        </div>
                    </td>
                    <td>${text(product.category || "—")}</td>
                    <td>${money(product.price)}</td>
                    <td>⭐ ${text(product.rating ?? "—")}</td>
                    <td>
                        <button class="admin-action-btn"
                            data-product-action="edit"
                            data-id="${text(product.id)}">Edit</button>
                        <button class="admin-action-btn delete"
                            data-product-action="delete"
                            data-id="${text(product.id)}">Delete</button>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="admin-empty">No matching products found.</td></tr>`;
    }

    function showProductForm() {
        $("adminProductForm").hidden = false;
        $("productFormTitle").textContent = "Add New Product";
        $("adminProductForm").reset();
        $("editProductId").value = "";
        $("products").scrollIntoView({ behavior: "smooth", block: "start" });
        $("newProductName").focus();
    }

    function hideProductForm() {
        $("adminProductForm").hidden = true;
        $("adminProductForm").reset();
        $("editProductId").value = "";
    }

    function editProduct(id) {
        const product = getAdminProducts().find(
            item => String(item.id) === String(id)
        );
        if (!product) return;

        $("editProductId").value = product.id;
        $("newProductName").value = product.name || "";
        $("newProductBrand").value = product.brand || "";
        $("newProductCategory").value = product.category || "";
        $("newProductPrice").value = product.price ?? "";
        $("newProductOldPrice").value = product.oldPrice ?? "";
        $("newProductImage").value = product.image || "";
        $("newProductBackImage").value = product.backImage || "";
        $("newProductEmoji").value = product.emoji || "";
        $("newProductBadge").value = product.badge || "";
        $("newProductDescription").value = product.description || "";

        $("productFormTitle").textContent = "Edit Product";
        $("adminProductForm").hidden = false;
        $("adminProductForm").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function saveProduct(event) {
        event.preventDefault();

        const list = getAdminProducts();
        const editId = $("editProductId").value;
        const price = Number($("newProductPrice").value);
        const oldPriceInput = $("newProductOldPrice").value;
        const oldPrice = oldPriceInput === "" ? null : Number(oldPriceInput);

        if (!Number.isFinite(price) || price < 0 ||
            (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < 0))) {
            notify("Please enter valid prices.", "error");
            return;
        }

        const name = $("newProductName").value.trim();
        const brand = $("newProductBrand").value.trim();
        const category = $("newProductCategory").value.trim();

        if (!name || !brand || !category) {
            notify("Please complete all required fields.", "error");
            return;
        }

        const editing = editId !== "";
        const existing = editing
            ? list.find(item => String(item.id) === String(editId))
            : null;

        const image = $("newProductImage").value.trim();
        const backImage = $("newProductBackImage").value.trim();

        const newProduct = {
            ...(existing || {}),
            id: existing ? existing.id : "sc-" + Date.now(),
            name,
            brand,
            category,
            price,
            oldPrice,
            image,
            backImage,
            images: [image, backImage].filter(Boolean),
            emoji: $("newProductEmoji").value.trim() || "📦",
            badge: $("newProductBadge").value.trim() || "New",
            description: $("newProductDescription").value.trim(),
            rating: existing?.rating ?? 0,
            reviews: existing?.reviews ?? 0
        };

        const updated = editing
            ? list.map(item => String(item.id) === String(editId) ? newProduct : item)
            : [...list, newProduct];

        try {
            saveJSON(PRODUCTS_KEY, updated);
            hideProductForm();
            renderAll();
            notify(editing ? "Product updated!" : "Product added!");
        } catch {
            notify("Could not save product data.", "error");
        }
    }

    function deleteProduct(id) {
        const product = getAdminProducts().find(
            item => String(item.id) === String(id)
        );
        if (!product) return;

        if (!confirm(`Delete "${product.name}"?`)) return;

        try {
            const updated = getAdminProducts().filter(
                item => String(item.id) !== String(id)
            );

            saveJSON(PRODUCTS_KEY, updated);
            renderAll();
            notify("Product deleted.");
        } catch {
            notify("Could not delete product.", "error");
        }
    }

    function renderOrders() {
        const orders = getOrders();
        const statuses = [
            "Order Placed",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        $("adminOrdersBody").innerHTML = orders.length
            ? orders.map(order => `
                <tr>
                    <td>${text(order.id)}</td>
                    <td>${text(order.customer?.name || "Guest")}</td>
                    <td>${text(order.date || "—")}</td>
                    <td>${Number(order.items || 0)}</td>
                    <td>${money(order.total)}</td>
                    <td>
                        <select class="admin-status-select"
                            data-order-id="${text(order.id)}">
                            ${statuses.map(status => `
                                <option value="${status}"
                                    ${status === (order.status || "Order Placed") ? "selected" : ""}>
                                    ${status}
                                </option>
                            `).join("")}
                        </select>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="6" class="admin-empty">No orders have been placed yet.</td></tr>`;
    }

    function renderReviews() {
        const reviews = readJSON(REVIEWS_KEY, []);

        $("adminReviewsList").innerHTML = reviews.length
            ? reviews.slice().reverse().map(review => `
                <article class="admin-review-card">
                    <h3>${text(review.productName || "Product Review")}</h3>
                    <div>⭐ ${text(review.rating)} / 5</div>
                    <p>${text(review.comment || "")}</p>
                    <div class="admin-review-meta">
                        By ${text(review.name || "Customer")}
                        · ${text(review.date || "")}
                    </div>
                </article>
            `).join("")
            : `<div class="admin-empty">No customer reviews yet. Reviews will appear here after customers submit them.</div>`;
    }

    function renderInquiries() {
        const inquiries = readJSON(INQUIRIES_KEY, []);
        const statuses = ["New", "In Progress", "Responded"];

        $("adminInquiriesBody").innerHTML = inquiries.length
            ? inquiries.map(inquiry => `
                <tr>
                    <td>${text(inquiry.id)}</td>
                    <td>${text(inquiry.name || "Customer")}</td>
                    <td><a href="mailto:${encodeURIComponent(inquiry.email || "")}">${text(inquiry.email || "—")}</a></td>
                    <td>${text(inquiry.productName || "General question")}</td>
                    <td class="admin-inquiry-message">${text(inquiry.message || "")}</td>
                    <td>${text(inquiry.date || "—")}</td>
                    <td>
                        <select class="admin-status-select" data-inquiry-id="${text(inquiry.id)}" aria-label="Inquiry status">
                            ${statuses.map(status => `
                                <option value="${status}" ${status === (inquiry.status || "New") ? "selected" : ""}>${status}</option>
                            `).join("")}
                        </select>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="7" class="admin-empty">No product inquiries have been submitted yet.</td></tr>`;
    }

    document.addEventListener("DOMContentLoaded", initDashboard);
})();




