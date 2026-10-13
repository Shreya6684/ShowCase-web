# ShowCase – Product Showcase Platform

A modern, responsive, and interactive product showcase website developed using HTML5, CSS3, and Vanilla JavaScript. ShowCase provides a user-friendly interface for exploring products across different categories, viewing product details, managing a shopping cart and wishlist, comparing products, and managing products and orders through an admin dashboard.

This project is developed as part of the **Web Development Internship Task WD-SW-003 – ShowCase Product Showcase Platform**.

## Project Overview

ShowCase is designed to provide a clean and engaging product discovery experience. Users can browse products, search for items, explore categories, view product information, and manage their shopping activities through an interactive frontend interface.

The platform also includes user account functionality and an administrative interface for managing the product catalogue and customer orders.

## Objectives

- Develop a responsive and visually appealing product showcase website.
- Organize products into categories for easier browsing.
- Implement interactive functionality using JavaScript.
- Provide product search, filtering, and comparison features.
- Allow users to manage their cart and wishlist.
- Provide user account and order history interfaces.
- Build an admin dashboard for product and order management.
- Store demo application data using browser local storage.

## Features

### 1. Product Discovery
- Product cards with images, names, prices, and ratings.
- Featured and latest product sections.
- Category-based product browsing.
- Product detail pages.
- Search and filtering functionality, where implemented.

### 2. User Authentication and Account
- Login and registration interfaces.
- Separate customer and administrator experiences.
- My Account and profile functionality.
- Sign-out option.
- Browser-based session management for the frontend demo.

### 3. Shopping Cart and Checkout
- Add products to the cart.
- View selected products and their quantities.
- Calculate the order total.
- Require a signed-in customer before checkout.
- Save demo orders and display order history.

### 4. Wishlist and Product Comparison
- Add or remove products from the wishlist.
- Save wishlist data in local storage.
- Select products for comparison.
- View selected products on the comparison page.

### 5. Product Ratings and Reviews
- Product rating and review interface, if enabled in the current build.
- Review storage and display using browser local storage, where implemented.

### 6. Admin Dashboard
- View product, order, and review summaries.
- Add, edit, and delete products.
- View customer orders.
- Update order statuses.
- Review customer feedback, where implemented.

### 7. Responsive User Interface
- Modern product cards and navigation.
- Responsive layouts for desktop and mobile screens.
- Mobile-friendly navigation.
- Dark mode support, if enabled.
- Empty states and feedback messages for supported actions.

## Technology Stack

- **HTML5:** Website structure and content.
- **CSS3:** Layout, styling, animations, and responsive design.
- **Vanilla JavaScript:** Application logic, interactivity, and DOM manipulation.
- **Local Storage:** Persistence of demo products, cart, wishlist, session, and order data.

No frontend framework or database is required for the current demo implementation.

## Project Structure

```text
ShowCase/
│
├── index.html             # Homepage
├── brands.html            # Brands listing page
├── catalog.html           # Product catalogue and browsing
├── product.html            # Product details page
├── compare.html            # Product comparison page
├── wishlist.html           # Wishlist page
├── cart.html               # Shopping cart and checkout
├── login.html              # Login and registration page
├── profile.html            # User profile and order history
├── admin-dashboard.html    # Admin dashboard
├── contact.html            # Contact page
│
├── products.js             # Product data and product utilities
├── script.js               # Main website functionality
├── brands.js               # Brands page functionality
├── catalog.js              # Catalogue functionality
├── product.js              # Product details functionality
├── compare.js              # Product comparison functionality
├── wishlist.js             # Wishlist functionality
├── contact.js              # Contact page functionality
│
├── style.css               # Main website styles
├── product.css             # Product details page styles
├── compare.css             # Product comparison styles
├── features.css            # Additional feature styles
│
└── README.md               # Project documentation
```

### File Organization

- **HTML Files:** Define the structure of the homepage, product pages, catalogue, brands, cart, wishlist, comparison, contact, login, profile, and admin dashboard.
- **CSS Files:** Handle the website's appearance, product layouts, comparison page, and additional interface features.
- **JavaScript Files:** Manage product data, page interactions, search and browsing, wishlist, comparison, contact functionality, and other interactive features.
- **README.md:** Documents the project's overview, features, technology stack, setup instructions, and limitations.

*Note: The structure above is representative. Keep only the files that exist in your final project and include any additional pages or stylesheets used by your implementation.*

## Getting Started

### Prerequisites

- A modern web browser.
- Visual Studio Code.
- The Live Server extension for VS Code, or another local static server.

### Installation

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Confirm that the HTML, CSS, and JavaScript files are in their expected locations.
4. Open `index.html` using Live Server.
5. Explore the product catalogue and available features.

### Run Locally

Right-click `index.html` and select **Open with Live Server**.

Alternatively, run the project using a local static server. Do not rely on opening the HTML file directly if the browser or project configuration requires a server.

## Demo Admin Account

For the local demonstration, the configured admin credentials are:

- **Email:** `admin@showcase.com`
- **Password:** `Admin@123`

Change these demo credentials before sharing the project publicly. This frontend-only authentication is for demonstration purposes and is not secure for production use.

## Data Storage

The application uses browser local storage to retain supported information across page refreshes. Depending on the implemented feature, this may include:

- Cart items
- Wishlist items
- User profile and session information
- Product changes
- Demo orders
- Product reviews

Data is stored in the current browser profile. It is not automatically synchronized across devices or different browsers. Clearing browser storage may remove the saved demo data.

## Limitations

- The project is a frontend demonstration and does not include a production backend or database.
- Checkout records demo orders; it does not process real payments.
- Client-side authentication and role checks are not secure for real customer data.
- A production deployment would require server-side authentication, authorization, validated data storage, and secure payment integration.

## Future Enhancements

- Backend integration with a database.
- Secure authentication and role-based authorization.
- Real payment gateway integration.
- Product inventory and stock management.
- Advanced search, sorting, and filtering.
- Verified-purchase reviews and ratings.
- Order tracking and email notifications.
- Automated testing and deployment.

## Learning Outcomes

This project demonstrates practical skills in semantic HTML, CSS layouts, responsive web design, JavaScript DOM manipulation, event handling, URL query parameters, local storage, form validation, and multi-page frontend development.

## Project Information

- **Project:** ShowCase Product Showcase Platform
- **Task ID:** WD-SW-003
- **Category:** Web Development
- **Technologies:** HTML5, CSS3, Vanilla JavaScript
- **Developer:** Shreya Sharma

## License

This project is created for educational and internship purposes. Add a suitable license if you intend to distribute or reuse the project publicly.
Project Blog Post: www.freeinternships.in/blog/ task-submission-das010156-product-showcase-platform
Live Demo : https://showcase-web-eight.vercel.app
