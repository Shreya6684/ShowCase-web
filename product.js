
document.addEventListener("DOMContentLoaded", () => {
  const detailsContainer = document.getElementById("productDetails");
  const similarContainer = document.getElementById("similarProducts");

  // Run only on the product details page
  if (!detailsContainer) return;

  // Get products from products.js
  function getProductList() {
    if (typeof getProducts === "function") {
      return getProducts();
    }

    if (typeof products !== "undefined" && Array.isArray(products)) {
      return products;
    }

    if (Array.isArray(window.products)) {
      return window.products;
    }

    return [];
  }

  const productList = getProductList();
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  // Show the first product when this page is opened without a selected ID.
  const currentProduct = productId
    ? productList.find(
        product => String(product.id) === String(productId)
      )
    : productList[0];

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function formatMoney(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return "Price unavailable";
    }

    return "₹" + amount.toLocaleString("en-IN");
  }

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

  function saveWishlist(list) {
    try {
      localStorage.setItem("showcaseWishlist", JSON.stringify(list));
      return true;
    } catch {
      alert("Wishlist could not be saved in this browser.");
      return false;
    }
  }

  function readProductReviews() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("showcaseProductReviews") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  // Show an error only if product data or ID is missing
  if (!currentProduct) {
    detailsContainer.innerHTML = `
      <div class="detail-not-found">
        <h2>Product not found 😕</h2>
        <p>
          ${productId
            ? "We could not find this product. Please select it again from the catalog."
            : "Please open a product using its View Details button."}
        </p>
        <a href="catalog.html">← Back to Explore Products</a>
      </div>
    `;

    if (similarContainer) {
      similarContainer.innerHTML = "";
    }

    console.error("Product details could not load.", {
      productId,
      productsAvailable: productList.length
    });

    return;
  }

  const isSaved = getWishlist().some(
    id => String(id) === String(currentProduct.id)
  );
  const submittedReviews = readProductReviews().filter(review =>
    String(review.productId) === String(currentProduct.id)
  );
  const baseRating = Number(currentProduct.rating) || 0;
  const baseReviewCount = Number(currentProduct.reviews) || 0;
  const allRatingsCount = baseReviewCount + submittedReviews.length;
  const averageRating = allRatingsCount
    ? ((baseRating * baseReviewCount + submittedReviews.reduce(
        (sum, review) => sum + Number(review.rating || 0), 0
      )) / allRatingsCount).toFixed(1)
    : "New";
  const stockStatus = currentProduct.stockStatus || "In Stock";
  const stockClass = stockStatus === "In Stock"
    ? "in-stock"
    : stockStatus === "Limited Stock"
      ? "limited-stock"
      : "out-of-stock";
  const productTag = currentProduct.productTag || currentProduct.badge || "";

  const productImages = Array.isArray(currentProduct.images)
    ? [...new Set(currentProduct.images.filter(Boolean))]
    : [];
  if (currentProduct.image && !productImages.includes(currentProduct.image)) {
    productImages.unshift(currentProduct.image);
  }
  if (currentProduct.backImage && !productImages.includes(currentProduct.backImage)) {
    productImages.push(currentProduct.backImage);
  }
  if (productImages.length === 0 && currentProduct.image) {
    productImages.push(currentProduct.image);
  }
  const frontProductImage = productImages[0] || "";
  let activeProductImage = frontProductImage;

  const imageMarkup = productImages.length
    ? `
      <div class="detail-gallery-main">
        <img
          id="detailMainImage"
          class="detail-product-image"
          src="${escapeHTML(productImages[0])}"
          alt="${escapeHTML(currentProduct.name)}"
          onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
        >
        <span class="detail-emoji" hidden>
          ${escapeHTML(currentProduct.emoji || "📦")}
        </span>
      </div>
      ${productImages.length > 1 ? `
        <div class="detail-gallery-thumbnails" role="group" aria-label="Product images">
          ${productImages.map((image, index) => `
            <button type="button" class="detail-gallery-thumbnail ${index === 0 ? "active" : ""}"
                    data-gallery-image="${escapeHTML(image)}"
                    aria-label="Show product image ${index + 1}"
                    aria-pressed="${index === 0}">
              <img src="${escapeHTML(image)}" alt="" loading="lazy">
            </button>
          `).join("")}
        </div>
      ` : ""}
      <div class="detail-gallery-modes" role="group" aria-label="Image view">
        <button type="button" class="active" data-gallery-mode="front" aria-pressed="true">Front</button>
        ${currentProduct.backImage ? '<button type="button" data-gallery-mode="back" aria-pressed="false">Back</button>' : ""}
        <button type="button" data-gallery-mode="zoom" aria-pressed="false">Zoom</button>
      </div>
    `
    : `
      <div class="detail-gallery-main">
        <span id="detailMainImage" class="detail-emoji">
          ${escapeHTML(currentProduct.emoji || "📦")}
        </span>
      </div>
    `;

  const specificationEntries = [
    ["Brand", currentProduct.brand || "Not specified"],
    ["Category", currentProduct.category || "General"],
    ...Object.entries(currentProduct.specifications || {}),
    ["Availability", stockStatus]
  ];

  // Render the selected product
  detailsContainer.innerHTML = `
    <div class="detail-image-box">
      ${imageMarkup}
    </div>

    <div class="detail-information">
      <a class="detail-brand" href="brands.html?brand=${encodeURIComponent(currentProduct.brand || "")}">
        ${escapeHTML(currentProduct.brand || "ShowCase")}
      </a>

      <h1 class="detail-title">
        ${escapeHTML(currentProduct.name || "Product")}
      </h1>

      <p class="detail-rating">
        ⭐ ${escapeHTML(averageRating)} / 5
        <span>
          (${allRatingsCount} ratings)
        </span>
      </p>

      <div class="detail-price-row">
        <span class="detail-price">
          ${formatMoney(currentProduct.price)}
        </span>

        ${currentProduct.oldPrice
          ? `<span class="detail-old-price">
               ${formatMoney(currentProduct.oldPrice)}
             </span>`
          : ""}

         ${productTag
          ? `<span class="detail-product-badge">
           ${escapeHTML(productTag)}
             </span>`
          : ""}
      </div>

      <p class="detail-stock-status ${stockClass}">
        <span aria-hidden="true"></span>${escapeHTML(stockStatus)}
      </p>

      <p class="detail-description">
        ${escapeHTML(
          currentProduct.description ||
          "Discover more about this product with ShowCase."
        )}
      </p>

      <div class="detail-specifications">
        <h2>Specifications</h2>
        <dl class="detail-spec-list">
          ${specificationEntries.map(([label, value]) => `
            <div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>
          `).join("")}
        </dl>
      </div>

      <div class="detail-actions">
        <button type="button" class="detail-action-btn primary detail-cart-button"
                data-add-to-cart="${escapeHTML(currentProduct.id)}"
                ${stockStatus === "Out of Stock" ? "disabled" : ""}>
          ${stockStatus === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
        </button>
        <button
          type="button"
          class="detail-action-btn primary"
          id="wishlistDetailBtn"
          aria-pressed="${isSaved}"
        >
          ${isSaved ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
        </button>

        <a
          class="detail-action-btn"
          href="compare.html?add=${encodeURIComponent(currentProduct.id)}"
        >
          ⇄ Add to Compare
        </a>

        <a href="catalog.html" class="detail-action-btn">
          ← Explore More
        </a>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-gallery-image]").forEach(button => {
    button.addEventListener("click", () => {
      const mainImage = document.getElementById("detailMainImage");
      const fallback = mainImage?.nextElementSibling;
      activeProductImage = button.dataset.galleryImage;
      if (mainImage?.tagName === "IMG") {
        mainImage.src = activeProductImage;
        mainImage.alt = `${currentProduct.name} image`;
        mainImage.hidden = false;
        mainImage.style.transform = "scale(1)";
        if (fallback) fallback.hidden = true;
      }

      const demoImage = document.getElementById("demoProductImage");
      if (demoImage?.tagName === "IMG") {
        demoImage.src = activeProductImage;
        demoImage.style.transform = "scale(1)";
      }

      document.querySelectorAll("[data-gallery-image]").forEach(thumbnail => {
        const active = thumbnail === button;
        thumbnail.classList.toggle("active", active);
        thumbnail.setAttribute("aria-pressed", String(active));
      });
    });
  });

  document.querySelectorAll("[data-gallery-mode]").forEach(button => {
    button.addEventListener("click", () => {
      const image = document.getElementById("detailMainImage");
      const mode = button.dataset.galleryMode;
      const source = mode === "back"
        ? currentProduct.backImage
        : mode === "front"
          ? frontProductImage
          : activeProductImage;
      if (source) activeProductImage = source;
      if (image?.tagName === "IMG" && source) image.src = source;
      if (image) image.style.transform = mode === "zoom" ? "scale(1.65)" : "scale(1)";
      const demoImage = document.getElementById("demoProductImage");
      if (demoImage?.tagName === "IMG" && source) demoImage.src = source;

      document.querySelectorAll("[data-gallery-mode]").forEach(mode => {
        const active = mode === button;
        mode.classList.toggle("active", active);
        mode.setAttribute("aria-pressed", String(active));
      });
    });
  });

  const demo = document.getElementById("productDemo");
  if (demo) {
    const demoImage = currentProduct.image
      ? `<img id="demoProductImage" src="${escapeHTML(currentProduct.image)}" alt="${escapeHTML(currentProduct.name)}">`
      : `<span id="demoProductImage" class="detail-emoji">${escapeHTML(currentProduct.emoji || "📦")}</span>`;

    demo.innerHTML = `
      <div class="demo-viewer">
        <div class="demo-screen">
          ${demoImage}
          <div class="demo-product-details" id="demoProductDetails" hidden>
            <span class="demo-product-emoji">${escapeHTML(currentProduct.emoji || "📦")}</span>
            <p>${escapeHTML(currentProduct.brand || "ShowCase")}</p>
            <h3>${escapeHTML(currentProduct.name || "Product")}</h3>
            <p>${escapeHTML(currentProduct.description || "Product details")}</p>
          </div>
        </div>
        <div class="demo-zoom-control">
          <label for="demoZoom">Image zoom</label>
          <input id="demoZoom" type="range" min="1" max="1.6" step="0.05" value="1">
          <output id="demoZoomValue" for="demoZoom">1.0×</output>
        </div>
      </div>
      <div class="demo-control-panel">
        <p class="section-kicker">PRODUCT VIEWER</p>
        <h3>Take a closer look</h3>
        <p>Use the controls to inspect the product image or read its listing details.</p>
        <div class="demo-view-tabs" role="group" aria-label="Product demo view">
          <button type="button" class="active" data-demo-view="image" aria-pressed="true">Image</button>
          <button type="button" data-demo-view="details" aria-pressed="false">Details</button>
        </div>
        <dl class="demo-facts">
          <div><dt>Brand</dt><dd>${escapeHTML(currentProduct.brand || "—")}</dd></div>
          <div><dt>Category</dt><dd>${escapeHTML(currentProduct.category || "—")}</dd></div>
          <div><dt>Price</dt><dd>${formatMoney(currentProduct.price)}</dd></div>
        </dl>
      </div>
    `;

    const zoomInput = document.getElementById("demoZoom");
    const zoomImage = document.getElementById("demoProductImage");
    zoomInput?.addEventListener("input", () => {
      const zoom = Number(zoomInput.value);
      if (zoomImage) zoomImage.style.transform = `scale(${zoom})`;
      document.getElementById("demoZoomValue").value = `${zoom.toFixed(1)}×`;
    });

    demo.querySelectorAll("[data-demo-view]").forEach(button => {
      button.addEventListener("click", () => {
        const showingDetails = button.dataset.demoView === "details";
        const details = document.getElementById("demoProductDetails");
        const screenImage = document.getElementById("demoProductImage");
        if (details) details.hidden = !showingDetails;
        if (screenImage) screenImage.hidden = showingDetails;
        if (zoomInput) zoomInput.disabled = showingDetails;
        demo.querySelectorAll("[data-demo-view]").forEach(tab => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-pressed", String(active));
        });
      });
    });
  }

  const reviewFormArea = document.getElementById("productReviewFormArea");
  let currentUser = null;
  try {
    currentUser = JSON.parse(
      localStorage.getItem("showcaseCurrentUser") || "null"
    );
  } catch {
    currentUser = null;
  }

  if (reviewFormArea) {
    reviewFormArea.innerHTML = currentUser?.role === "user"
      ? `
        <form id="productReviewForm" class="product-review-form">
          <h3>Write a review</h3>
          <p>Posting as ${escapeHTML(currentUser.name || currentUser.email)}</p>
          <fieldset class="review-rating-fieldset">
            <legend>Your rating</legend>
            <div class="review-star-picker">
              ${[5, 4, 3, 2, 1].map(rating => `
                <label>
                  <input type="radio" name="rating" value="${rating}" required>
                  <span aria-label="${rating} out of 5 stars">★</span>
                </label>
              `).join("")}
            </div>
          </fieldset>
          <label class="review-comment-label" for="reviewComment">Your review</label>
          <textarea id="reviewComment" name="comment" rows="4" maxlength="600" required placeholder="What should other shoppers know?"></textarea>
          <button type="submit" class="detail-action-btn primary">Submit Review</button>
          <p id="reviewFormMessage" class="review-form-message" aria-live="polite"></p>
        </form>
      `
      : `
        <div class="review-login-prompt">
          <h3>Share your experience</h3>
          <p>Sign in with a customer account to submit a product review.</p>
          <a href="login.html">Login / Register</a>
        </div>
      `;
  }

  function renderProductReviews() {
    const reviews = readProductReviews().filter(review =>
      String(review.productId) === String(currentProduct.id)
    );
    const reviewList = document.getElementById("productReviewList");
    const summary = document.getElementById("reviewSummary");
    if (reviewList) {
      reviewList.innerHTML = reviews.length
        ? reviews.slice().reverse().map(review => `
            <article class="product-review">
              <div class="product-review-heading">
                <strong>${escapeHTML(review.name || "Customer")}</strong>
                <span class="product-review-stars" aria-label="${Number(review.rating)} out of 5 stars">${"★".repeat(Math.max(0, Math.min(5, Number(review.rating))))}</span>
              </div>
              <p>${escapeHTML(review.comment)}</p>
              <time>${escapeHTML(review.date || "")}</time>
            </article>
          `).join("")
        : `<p class="reviews-empty">No written reviews yet. Be the first to share your experience.</p>`;
    }

    if (summary) {
      const currentCount = baseReviewCount + reviews.length;
      const rating = currentCount
        ? ((baseRating * baseReviewCount + reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0), 0
          )) / currentCount).toFixed(1)
        : "New";
      summary.textContent = `${rating} / 5 from ${currentCount} rating${currentCount === 1 ? "" : "s"} · ${reviews.length} written review${reviews.length === 1 ? "" : "s"}`;

      const detailRating = document.querySelector(".detail-rating");
      if (detailRating) {
        detailRating.replaceChildren(document.createTextNode(`★ ${rating} / 5 `));
        const countLabel = document.createElement("span");
        countLabel.textContent = `(${currentCount} ratings)`;
        detailRating.append(countLabel);
      }
    }
  }

  document.getElementById("productReviewForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const review = {
      id: "review-" + Date.now(),
      productId: currentProduct.id,
      productName: currentProduct.name,
      rating: Number(formData.get("rating")),
      comment: String(formData.get("comment") || "").trim(),
      name: currentUser.name || "Customer",
      email: currentUser.email || "",
      date: new Date().toLocaleDateString("en-IN")
    };
    if (!review.rating || !review.comment) return;

    const allReviews = readProductReviews();
    allReviews.push(review);
    try {
      localStorage.setItem("showcaseProductReviews", JSON.stringify(allReviews));
      form.reset();
      renderProductReviews();
      document.getElementById("reviewFormMessage").textContent = "Your review was submitted.";
    } catch {
      document.getElementById("reviewFormMessage").textContent = "Could not save your review in this browser.";
    }
  });

  renderProductReviews();

  // Wishlist button
  const wishlistButton = document.getElementById("wishlistDetailBtn");

  wishlistButton.addEventListener("click", () => {
    const wishlist = getWishlist();

    const alreadySaved = wishlist.some(
      id => String(id) === String(currentProduct.id)
    );

    const updatedWishlist = alreadySaved
      ? wishlist.filter(
          id => String(id) !== String(currentProduct.id)
        )
      : [...wishlist, currentProduct.id];

    if (!saveWishlist(updatedWishlist)) return;

    wishlistButton.textContent = alreadySaved
      ? "♡ Add to Wishlist"
      : "♥ Saved to Wishlist";

    wishlistButton.setAttribute(
      "aria-pressed",
      String(!alreadySaved)
    );
  });

  // Render similar products from the same category
  if (similarContainer) {
    const similarProducts = productList
      .filter(product =>
        String(product.id) !== String(currentProduct.id) &&
        String(product.category).toLowerCase() ===
          String(currentProduct.category).toLowerCase()
      )
      .slice(0, 4);

    if (similarProducts.length === 0) {
      similarContainer.innerHTML =
        "<p>No similar products available yet.</p>";
    } else if (typeof createProductCard === "function") {
      similarContainer.innerHTML = similarProducts
        .map(product => createProductCard(product))
        .join("");
    } else {
      similarContainer.innerHTML = similarProducts.map(product => `
        <article class="product-card">
          <a href="product.html?id=${encodeURIComponent(product.id)}">
            <div class="product-visual">
              ${product.image
                ? `<img class="product-photo"
                     src="${escapeHTML(product.image)}"
                     alt="${escapeHTML(product.name)}">`
                : `<span>${escapeHTML(product.emoji || "📦")}</span>`}
            </div>
            <div class="product-info">
              <p class="brand">${escapeHTML(product.brand)}</p>
              <h3>${escapeHTML(product.name)}</h3>
              <strong>${formatMoney(product.price)}</strong>
            </div>
          </a>
        </article>
      `).join("");
    }
  }
});
