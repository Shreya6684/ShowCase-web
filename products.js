
/* ==========================================
   SHOWCASE - PRODUCT DATA
   Each product has its own matching photo
========================================== */

// Helper to create optimized image URLs
function productImage(photoId) {
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=700&q=80`;
}

window.SHOWCASE_PRODUCT_CATALOG_VERSION = 2;

// All products
const products = [
    {
        id: 1,
        name: "Apple MacBook Pro",
        brand: "Apple",
        category: "Laptops",
        price: 199900,
        oldPrice: 219900,
        rating: 4.9,
        reviews: 245,
        emoji: "💻",
        image: productImage("photo-1517336714731-489689fd1ca8"),
        images: [productImage("photo-1517336714731-489689fd1ca8")],
        specifications: { "Product type": "Laptop", "Recommended use": "Work, creativity and productivity" },
        badge: "Best Seller",
        description: "Powerful Apple MacBook Pro for work, creativity and everyday productivity."
    },
    {
        id: 2,
        name: "Apple iPhone",
        brand: "Apple",
        category: "Smartphones",
        price: 79900,
        oldPrice: 84900,
        rating: 4.8,
        reviews: 320,
        emoji: "📱",
        image: productImage("photo-1592750475338-74b7b21085ab"),
        images: [productImage("photo-1592750475338-74b7b21085ab")],
        specifications: { "Product type": "Smartphone", "Display": "Immersive display" },
        badge: "Popular",
        description: "A premium smartphone with a modern design and an immersive display."
    },
    {
        id: 3,
        name: "Sony Wireless Headphones",
        brand: "Sony",
        category: "Audio",
        price: 9990,
        oldPrice: 12990,
        rating: 4.7,
        reviews: 186,
        emoji: "🎧",
        image: productImage("photo-1505740420928-5e560c06d30e"),
        images: [productImage("photo-1505740420928-5e560c06d30e")],
        specifications: { "Product type": "Headphones", "Connectivity": "Wireless", "Recommended use": "Music, calls and entertainment" },
        badge: "Trending",
        description: "Comfortable wireless headphones for music, calls and entertainment."
    },
    {
        id: 4,
        name: "Apple Watch",
        brand: "Apple",
        category: "Wearables",
        price: 32900,
        oldPrice: 35900,
        rating: 4.6,
        reviews: 154,
        emoji: "⌚",
        image: productImage("photo-1523275335684-37898b6baf30"),
        images: [productImage("photo-1523275335684-37898b6baf30")],
        specifications: { "Product type": "Smartwatch", "Recommended use": "Everyday routine" },
        badge: "New",
        description: "A stylish smartwatch designed to complement your everyday routine."
    },
    {
        id: 5,
        name: "Dell Inspiron Laptop",
        brand: "Dell",
        category: "Laptops",
        price: 64990,
        oldPrice: 69990,
        rating: 4.5,
        reviews: 112,
        emoji: "💻",
        image: productImage("photo-1496181133206-80ce9b88a853"),
        images: [productImage("photo-1496181133206-80ce9b88a853")],
        specifications: { "Product type": "Laptop", "Recommended use": "Study, office work and everyday computing" },
        badge: "Great Value",
        description: "A versatile laptop for studying, office work and everyday computing."
    },
    {
        id: 6,
        name: "Apple iPad",
        brand: "Apple",
        category: "Tablets",
        price: 39900,
        oldPrice: 42900,
        rating: 4.8,
        reviews: 208,
        emoji: "📲",
        image: productImage("photo-1544244015-0df4b3ffc6b0"),
        images: [productImage("photo-1544244015-0df4b3ffc6b0")],
        specifications: { "Product type": "Tablet", "Recommended use": "Reading, entertainment and creativity" },
        badge: "Editor's Pick",
        description: "A sleek tablet for reading, entertainment, creativity and productivity."
    },
    {
        id: 7,
        name: "Portable Bluetooth Speaker",
        brand: "JBL",
        category: "Audio",
        price: 4999,
        oldPrice: 5999,
        rating: 4.4,
        reviews: 97,
        emoji: "🔊",
        image: productImage("photo-1608043152269-423dbba4e7e1"),
        images: [productImage("photo-1608043152269-423dbba4e7e1")],
        specifications: { "Product type": "Portable Bluetooth speaker", "Connectivity": "Bluetooth", "Recommended use": "Home and outdoor listening" },
        badge: "Popular",
        description: "A compact speaker for enjoying your favourite music at home or outdoors."
    },
    {
        id: 8,
        name: "Canon Digital Camera",
        brand: "Canon",
        category: "Cameras",
        price: 45990,
        oldPrice: 49990,
        rating: 4.7,
        reviews: 86,
        emoji: "📷",
        image: productImage("photo-1516035069371-29a1b244cc32"),
        images: [productImage("photo-1516035069371-29a1b244cc32")],
        specifications: { "Product type": "Digital camera", "Recommended use": "Photography and creative projects" },
        badge: "Creator Pick",
        description: "A digital camera for photography, creative projects and capturing memories."
    },
    {
        id: 9,
        name: "Logitech Wireless Mouse",
        brand: "Logitech",
        category: "Accessories",
        price: 1499,
        oldPrice: 1799,
        rating: 4.5,
        reviews: 143,
        emoji: "🖱️",
        image: productImage("photo-1527814050087-3793815479db"),
        images: [productImage("photo-1527814050087-3793815479db")],
        specifications: { "Product type": "Wireless mouse", "Connectivity": "Wireless", "Recommended use": "Everyday computing" },
        badge: "Best Value",
        description: "A practical wireless mouse for comfortable everyday computer use."
    },
    {
        id: 10,
        name: "Apple AirPods",
        brand: "Apple",
        category: "Audio",
        price: 14900,
        oldPrice: 16900,
        rating: 4.8,
        reviews: 276,
        emoji: "🎧",
        image: productImage("photo-1600294037681-c80b4cb5b434"),
        images: [productImage("photo-1600294037681-c80b4cb5b434")],
        specifications: { "Product type": "Wireless earbuds", "Connectivity": "Wireless", "Recommended use": "Music and calls" },
        badge: "Trending",
        description: "Compact wireless earbuds for listening to music and taking calls."
    },
    {
        id: 11,
        name: "Samsung Galaxy Smartphone",
        brand: "Samsung",
        category: "Smartphones",
        price: 54999,
        oldPrice: 59999,
        rating: 4.6,
        reviews: 192,
        emoji: "📱",
        image: productImage("photo-1592750475338-74b7b21085ab"),
        images: [productImage("photo-1592750475338-74b7b21085ab")],
        specifications: { "Product type": "Smartphone", "Display": "Large display" },
        badge: "Featured",
        description: "A modern smartphone with a large display for everyday entertainment."
    },
    {
        id: 12,
        name: "Premium Laptop",
        brand: "ASUS",
        category: "Laptops",
        price: 72990,
        oldPrice: 77990,
        rating: 4.6,
        reviews: 128,
        emoji: "💻",
        image: productImage("photo-1496181133206-80ce9b88a853"),
        images: [productImage("photo-1496181133206-80ce9b88a853")],
        specifications: { "Product type": "Laptop", "Recommended use": "Study, coding and daily productivity" },
        badge: "Recommended",
        description: "A sleek laptop suitable for students, coding and daily productivity."
    },
    {
        id: 13,
        name: "Everyday Canvas Backpack",
        brand: "Northline",
        category: "Fashion",
        price: 2499,
        oldPrice: 2999,
        rating: 4.6,
        reviews: 38,
        emoji: "🎒",
        image: productImage("photo-1553062407-98eeb64c6a62"),
        images: [productImage("photo-1553062407-98eeb64c6a62")],
        specifications: { "Product type": "Canvas backpack", "Recommended use": "Everyday carry" },
        stockStatus: "In Stock",
        productTag: "New Arrival",
        badge: "New Arrival",
        description: "A practical canvas backpack for carrying everyday essentials."
    },
    {
        id: 14,
        name: "Modern Design Handbook",
        brand: "Northstar Books",
        category: "Books",
        price: 899,
        oldPrice: 1099,
        rating: 4.7,
        reviews: 24,
        emoji: "📚",
        image: productImage("photo-1544947950-fa07a98d237f"),
        images: [productImage("photo-1544947950-fa07a98d237f")],
        specifications: { "Format": "Printed book", "Subject": "Design" },
        stockStatus: "Limited Stock",
        productTag: "Featured",
        badge: "Featured",
        description: "An illustrated introduction to design principles and visual thinking."
    },
    {
        id: 15,
        name: "Adjustable Desk Lamp",
        brand: "Casa Home",
        category: "Home & Living",
        price: 1799,
        oldPrice: 2199,
        rating: 4.5,
        reviews: 31,
        emoji: "💡",
        image: productImage("photo-1507473885765-e6ed057f782c"),
        images: [productImage("photo-1507473885765-e6ed057f782c")],
        specifications: { "Product type": "Desk lamp", "Recommended use": "Reading and workspaces" },
        stockStatus: "In Stock",
        productTag: "Best Seller",
        badge: "Best Seller",
        description: "An adjustable desk lamp for focused work, reading and home spaces."
    },
    {
        id: 16,
        name: "Trail Daypack",
        brand: "Trailmark",
        category: "Sports & Outdoors",
        price: 3299,
        oldPrice: 3799,
        rating: 4.4,
        reviews: 19,
        emoji: "⛰️",
        image: productImage("photo-1622260614153-03223fb72052"),
        images: [productImage("photo-1622260614153-03223fb72052")],
        specifications: { "Product type": "Daypack", "Recommended use": "Hiking and outdoor trips" },
        stockStatus: "Out of Stock",
        productTag: "Featured",
        badge: "Featured",
        description: "A lightweight daypack for hikes and short outdoor trips."
    },
    {
        id: 17,
        name: "Wireless Gaming Controller",
        brand: "PlayForge",
        category: "Gaming",
        price: 3999,
        oldPrice: 4499,
        rating: 4.8,
        reviews: 53,
        emoji: "🎮",
        image: productImage("photo-1603481546238-487240415921"),
        images: [productImage("photo-1603481546238-487240415921")],
        specifications: { "Product type": "Game controller", "Connectivity": "Wireless", "Recommended use": "Gaming" },
        stockStatus: "In Stock",
        productTag: "New Arrival",
        badge: "New Arrival",
        description: "A wireless controller for comfortable play across compatible gaming setups."
    },
    {
        id: 18,
        name: "Everyday Cotton T-Shirt",
        brand: "Northline",
        category: "T-Shirts",
        price: 699,
        oldPrice: 899,
        rating: 4.5,
        reviews: 22,
        emoji: "👕",
        image: productImage("photo-1521572163474-6864f9cf17ab"),
        images: [productImage("photo-1521572163474-6864f9cf17ab")],
        specifications: { "Product type": "T-shirt", "Style": "Everyday wear" },
        stockStatus: "In Stock",
        productTag: "New Arrival",
        badge: "New Arrival",
        description: "A versatile T-shirt for a simple everyday wardrobe."
    },
    {
        id: 19,
        name: "Casual Sneakers",
        brand: "Northline",
        category: "Shoes",
        price: 2499,
        oldPrice: 2999,
        rating: 4.4,
        reviews: 19,
        emoji: "👟",
        image: productImage("photo-1542291026-7eec264c27ff"),
        images: [productImage("photo-1542291026-7eec264c27ff")],
        specifications: { "Product type": "Sneakers", "Style": "Casual footwear" },
        stockStatus: "Limited Stock",
        productTag: "Featured",
        badge: "Featured",
        description: "Everyday sneakers for casual outfits and daily wear."
    },
    {
        id: 20,
        name: "Everyday Handbag",
        brand: "Northline",
        category: "Handbags",
        price: 1899,
        oldPrice: 2299,
        rating: 4.6,
        reviews: 26,
        emoji: "👜",
        image: productImage("photo-1584917865442-de89df76afd3"),
        images: [productImage("photo-1584917865442-de89df76afd3")],
        specifications: { "Product type": "Handbag", "Recommended use": "Everyday carry" },
        stockStatus: "In Stock",
        productTag: "Best Seller",
        badge: "Best Seller",
        description: "A practical handbag for carrying everyday essentials."
    },
    {
        id: 21,
        name: "A4 Ruled Notebook",
        brand: "Northstar Books",
        category: "Notebooks",
        price: 249,
        oldPrice: 299,
        rating: 4.7,
        reviews: 41,
        emoji: "📓",
        image: productImage("photo-1517842645767-c639042777db"),
        images: [productImage("photo-1517842645767-c639042777db")],
        specifications: { "Product type": "Ruled notebook", "Page size": "A4" },
        stockStatus: "In Stock",
        productTag: "Best Seller",
        badge: "Best Seller",
        description: "An A4 ruled notebook for notes, planning and everyday writing."
    },
    {
        id: 22,
        name: "Desk Stationery Set",
        brand: "Northstar Books",
        category: "Stationery",
        price: 499,
        oldPrice: 599,
        rating: 4.3,
        reviews: 17,
        emoji: "✏️",
        image: productImage("photo-1455390582262-044cdead277a"),
        images: [productImage("photo-1455390582262-044cdead277a")],
        specifications: { "Product type": "Stationery set", "Recommended use": "Study and desk work" },
        stockStatus: "In Stock",
        productTag: "New Arrival",
        badge: "New Arrival",
        description: "A stationery set for organizing everyday writing and desk tasks."
    }
];

const productCatalogMetadata = {
    1: { stockStatus: "In Stock", productTag: "Best Seller" },
    2: { stockStatus: "Limited Stock", productTag: "Featured" },
    3: { stockStatus: "In Stock", productTag: "Best Seller" },
    4: { stockStatus: "Limited Stock", productTag: "New Arrival" },
    5: { stockStatus: "In Stock", productTag: "Featured" },
    6: { stockStatus: "In Stock", productTag: "Featured" },
    7: { stockStatus: "Limited Stock", productTag: "Best Seller" },
    8: { stockStatus: "In Stock", productTag: "Featured" },
    9: { stockStatus: "In Stock", productTag: "Best Seller" },
    10: { stockStatus: "In Stock", productTag: "Best Seller" },
    11: { stockStatus: "Limited Stock", productTag: "Featured" },
    12: { stockStatus: "In Stock", productTag: "New Arrival" }
};

const productDepartments = {
    13: "Fashion",
    14: "Books",
    15: "Home & Living",
    16: "Sports & Outdoors",
    17: "Gaming",
    18: "Fashion",
    19: "Fashion",
    20: "Fashion",
    21: "Books",
    22: "Books"
};

products.forEach(product => {
    product.department = product.id <= 12
        ? "Electronics"
        : productDepartments[product.id] || product.category;
    Object.assign(product, productCatalogMetadata[product.id] || {});
});

// Product categories
const categories = [
    {
        name: "Electronics",
        emoji: "💻",
        description: "Devices, audio, cameras and everyday tech"
    },
    {
        name: "Fashion",
        emoji: "👕",
        description: "Wearables, bags and everyday style"
    },
    {
        name: "Books",
        emoji: "📚",
        description: "Books for ideas, learning and leisure"
    },
    {
        name: "Home & Living",
        emoji: "🏠",
        description: "Useful details for home and workspace"
    },
    {
        name: "Sports & Outdoors",
        emoji: "🎯",
        description: "Gear for trails, training and fresh air"
    },
    {
        name: "Gaming",
        emoji: "🎮",
        description: "Accessories for your gaming setup"
    }
];

// Format prices in Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

// Find one product using its ID
function getProductById(id) {
    return products.find(product => product.id === Number(id));
}

// Get products belonging to one category
function getProductsByCategory(categoryName) {
    if (!categoryName || categoryName.toLowerCase() === "all") {
        return products;
    }

    return products.filter(product =>
        String(product.department || product.category).toLowerCase() === categoryName.toLowerCase() ||
        String(product.category).toLowerCase() === categoryName.toLowerCase()
    );
}

// Search products by name, brand or category
function searchProducts(searchTerm) {
    const term = String(searchTerm || "").trim().toLowerCase();

    if (!term) {
        return products;
    }

    return products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        String(product.department || "").toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
}
