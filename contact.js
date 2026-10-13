document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inquiryForm");
    const productSelect = document.getElementById("inquiryProduct");
    if (!form) return;

    const products = typeof getProducts === "function" ? getProducts() : [];
    const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    productSelect.insertAdjacentHTML("beforeend", products.map(product =>
        `<option value="${escape(product.id)}">${escape(product.name)}</option>`
    ).join(""));

    try {
        const session = JSON.parse(localStorage.getItem("showcaseCurrentUser") || "null");
        if (session?.role === "user") {
            document.getElementById("inquiryName").value = session.name || "";
            document.getElementById("inquiryEmail").value = session.email || "";
        }
    } catch {
        localStorage.removeItem("showcaseCurrentUser");
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const product = products.find(item => String(item.id) === String(data.get("productId")));
        const inquiry = {
            id: "INQ-" + Date.now().toString().slice(-8),
            name: String(data.get("name") || "").trim(),
            email: String(data.get("email") || "").trim(),
            productId: product?.id ?? null,
            productName: product?.name || "General question",
            message: String(data.get("message") || "").trim(),
            date: new Date().toLocaleString("en-IN"),
            status: "New"
        };
        if (!inquiry.name || !inquiry.email || !inquiry.message) return;

        let inquiries = [];
        try {
            inquiries = JSON.parse(localStorage.getItem("showcaseInquiries") || "[]");
            if (!Array.isArray(inquiries)) inquiries = [];
            inquiries.unshift(inquiry);
            localStorage.setItem("showcaseInquiries", JSON.stringify(inquiries));
            form.reset();
            document.getElementById("inquiryStatus").textContent = "Your inquiry has been recorded.";
        } catch {
            document.getElementById("inquiryStatus").textContent = "Could not save your inquiry in this browser.";
        }
    });
});
