
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("compareContainer");
    const emptyState = document.getElementById("compareEmpty");
    const countLabel = document.getElementById("compareCount");
    const clearButton = document.getElementById("clearCompare");

    if (!container) return;

    const productList =
        typeof products !== "undefined" && Array.isArray(products)
            ? products
            : [];

    const STORAGE_KEY = "showcaseCompare";

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function readCompare() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(saved) ? saved.map(String) : [];
        } catch {
            return [];
        }
    }

    function saveCompare(ids) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }

    function notify(message, type = "success") {
        if (typeof window.showcaseToast === "function") {
            window.showcaseToast(message, type);
        } else {
            console.info(message);
        }
    }

    function getSelectedProducts() {
        const ids = readCompare();

        return ids
            .map(id =>
                productList.find(product => String(product.id) === id)
            )
            .filter(Boolean);
    }

    function money(value) {
        const amount = Number(value);

        return Number.isFinite(amount)
            ? "₹" + amount.toLocaleString("en-IN")
            : "—";
    }

    function productImage(product) {
        if (product.image) {
            return `
                <img
                    class="compare-product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.hidden=true;this.nextElementSibling.hidden=false"
                >
                <div class="compare-product-emoji" hidden>
                    ${escapeHTML(product.emoji || "📦")}
                </div>
            `;
        }

        return `
            <div class="compare-product-emoji">
                ${escapeHTML(product.emoji || "📦")}
            </div>
        `;
    }

    function render() {
        const selected = getSelectedProducts();

        countLabel.textContent =
            `${selected.length} product${selected.length === 1 ? "" : "s"} selected`;

        emptyState.hidden = selected.length !== 0;
        container.hidden = selected.length === 0;

        if (selected.length === 0) {
            container.innerHTML = "";
            return;
        }

        const rows = [
            {
                label: "Brand",
                value: product => product.brand || "—"
            },
            {
                label: "Category",
                value: product => product.category || "—"
            },
            {
                label: "Price",
                value: product => money(product.price)
            },
            {
                label: "Original Price",
                value: product =>
                    product.oldPrice ? money(product.oldPrice) : "—"
            },
            {
                label: "Rating",
                value: product => `⭐ ${product.rating ?? "—"} / 5`
            },
            {
                label: "Reviews",
                value: product => product.reviews ?? "—"
            },
            {
                label: "Description",
                value: product => product.description || "—"
            }
        ];

        container.innerHTML = `
            <div class="compare-table-wrap">
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th>Product Details</th>

                            ${selected.map(product => `
                                <th>
                                    ${productImage(product)}

                                    <a
                                        class="compare-product-name"
                                        href="product.html?id=${encodeURIComponent(product.id)}"
                                    >
                                        ${escapeHTML(product.name)}
                                    </a>

                                    <button
                                        class="compare-remove-btn"
                                        type="button"
                                        data-remove-id="${escapeHTML(product.id)}"
                                    >
                                        ✕ Remove
                                    </button>
                                </th>
                            `).join("")}
                        </tr>
                    </thead>

                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${escapeHTML(row.label)}</td>

                                ${selected.map(product => `
                                    <td>
                                        ${escapeHTML(row.value(product))}
                                    </td>
                                `).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Add product using ?add=ID
    const params = new URLSearchParams(window.location.search);
    const addId = params.get("add");

    if (addId !== null && addId !== "") {
        const product = productList.find(
            item => String(item.id) === addId
        );

        if (product) {
            const ids = readCompare();

            if (!ids.includes(addId)) {
                ids.push(addId);
                saveCompare(ids);

                notify("Product added to comparison! 💜");
            } else {
                notify("Product is already in comparison!");
            }
        } else {
            notify("Product could not be found.", "error");
        }

        // Prevent adding the same product again on refresh.
        window.history.replaceState(
            {},
            "",
            window.location.pathname
        );
    }

    // Remove individual products.
    container.addEventListener("click", event => {
        const removeButton = event.target.closest("[data-remove-id]");

        if (!removeButton) return;

        const removeId = String(removeButton.dataset.removeId);

        saveCompare(
            readCompare().filter(id => id !== removeId)
        );

        render();
        notify("Product removed from comparison!");
    });

    // Clear the entire comparison list.
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (readCompare().length === 0) {
                notify("Your comparison list is already empty!");
                return;
            }

            saveCompare([]);
            render();

            notify("Comparison list cleared!");
        });
    }

    render();
});
