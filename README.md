# ROMIZ PRINT - Project Documentation & Architecture

This document serves as a comprehensive guide to understanding the **ROMIZ PRINT** project. It is designed to help anyone (new developers, stakeholders, or yourself) quickly understand what the project is, how it's built, and how the different pieces fit together.

---

## 1. Project Description
**ROMIZ PRINT** is a modern, high-performance E-commerce web application built for a custom printing business in Cairo. It transitions the business from a simple quote-request site into a fully-fledged e-commerce experience. 

Customers can browse various printing categories (Business Cards, Custom Apparel, Frames, Banners, etc.), customize their orders with specific options (sizes, colors, custom designs), upload their own design files securely to the cloud, and easily submit their final order directly to the business via a structured WhatsApp message.

---

## 2. Core Technology Stack
- **Framework:** Next.js (App Router) - Provides Server-Side Rendering (SSR) and fast page loads.
- **Language:** TypeScript - Ensures type safety and prevents runtime errors.
- **Styling:** Tailwind CSS - For responsive, modern, and utility-first styling.
- **State Management:** React Context API (`CartContext`) - Manages the shopping cart globally.
- **File Uploads:** Uploadthing (`@uploadthing/react`) - Secure cloud storage for user design files.
- **Icons:** Lucide React - Clean, modern SVG icons.

---

## 3. Key Features Developed
Over the course of development, we implemented several major features:
1. **Dynamic Product Catalog:** 10 core categories (Stickers, Frames, T-Shirts, Business Cards, Tote Bags, Flyers, Mugs, Pens, Roll Ups, Banners) driven by a centralized data structure (`app/data/products.ts`).
2. **"Ready-Made" Galleries:** Specialized galleries for Frames and T-Shirts where clicking a pre-designed item intelligently skips the custom design/upload steps.
3. **Advanced Cart System:** A fully functional cart that tracks products, quantities, custom options, and uploaded file URLs. Features a unique "double-click-to-edit" quantity input for easy bulk ordering.
4. **Cloud File Uploads:** Integrated Uploadthing dropzones so users can upload PDFs/Images (up to 16MB) directly on the product page.
5. **WhatsApp Checkout Integration:** Instead of a traditional payment gateway, checkout dynamically generates a detailed order summary (including prices, options, and design file URLs) and redirects the user to WhatsApp to finalize the order with the admin.

---

## 4. Architecture Tree & File Structure
Here is the core directory structure of the project, explaining where everything lives. This mental model is the easiest way to understand the app:

```mermaid
graph TD
    A[ROMIZ PRINT Project] --> B(app/)
    A --> C(public/)
    A --> D(Configuration Files)

    %% App Directory
    B --> B1(api/)
    B --> B2(cart/)
    B --> B3(categories/)
    B --> B4(components/)
    B --> B5(context/)
    B --> B6(data/)
    B --> B7(products/)

    %% Details
    B1 -.-> |Uploadthing backend routes| B1
    B2 -.-> |Cart page & WhatsApp Checkout| B2
    B3 -.-> |Category filtering & Ready-made Galleries| B3
    B4 -.-> |Reusable UI: Header, Footer, HeroCarousel, ShopByCategory, DesignFileUploader| B4
    B5 -.-> |CartContext.tsx - Global state| B5
    B6 -.-> |categories.ts, products.ts - The database/content| B6
    B7 -.-> |Dynamic product pages [slug]| B7

    %% Configs
    D -.-> |tailwind.config.ts, next.config.mjs, .env.local| D
```

### Detailed Folder Breakdown:
- **`/app/data/`**: The "Database" of the app. `products.ts` contains all product details, pricing, and slugs. If you ever need to add a new product or change a price, you do it here.
- **`/app/context/`**: Contains `CartContext.tsx`. This wraps the entire application, keeping track of what the user has added to their cart so the count updates in the header navigation.
- **`/app/components/`**: All the building blocks. 
  - `HeroCarousel.tsx`: The main image slider on the homepage.
  - `ShopByCategory.tsx`: The popular products grid on the homepage.
  - `DesignFileUploader.tsx`: The component that handles connecting to Uploadthing.
- **`/app/products/[slug]/`**: The dynamic product page. It uses the `slug` from the URL (e.g., `/products/custom-framed-poster`) to find the exact product in `products.ts`, calculate prices based on options, and add it to the cart.
- **`/app/categories/`**: Handles displaying products filtered by groups (like "Marketing & Print" vs "Apparel & Bags").
- **`/app/api/uploadthing/`**: The secure backend endpoints that allow users to upload files to your Uploadthing cloud account.

---

## 5. How Data Flows (The "Memorization" Cheat Sheet)
If a new developer asks *"How does a user buy a custom T-Shirt?"*, here is the exact flow to memorize:

1. **Navigation:** User clicks "T-Shirts" on the homepage (`ShopByCategory.tsx`).
2. **Category Page:** They land on `/categories/t-shirts`. The app reads `products.ts` and displays all T-Shirt items.
3. **Product Page:** They click a specific T-shirt and go to `/products/custom-t-shirt`. The `ProductPageClient.tsx` component loads the specific T-Shirt data.
4. **Customization:** The user selects options (Print type, quantity) and uploads a logo. `DesignFileUploader.tsx` securely sends the logo to the cloud and returns a URL.
5. **Add to Cart:** The user clicks "Add to Cart". The item, its price, its selected options, and the logo URL are saved into `CartContext.tsx`.
6. **Checkout:** The user goes to `/cart`. They review their items. When they click "Checkout", `cart/page.tsx` loops through their items, builds a text message string, and opens WhatsApp with the order details pre-filled.

---

## 6. Maintenance Guide
- **To change a phone number:** Update the WhatsApp link in `app/cart/page.tsx` and the hardcoded numbers in `app/components/Footer.tsx` and `Header.tsx`.
- **To add a new product:** Add it to the array in `app/data/products.ts`. Make sure the `slug` is unique and uses `kebab-case`.
- **To change Homepage categories:** Edit the `popularSlugs` array inside `app/components/ShopByCategory.tsx`.
- **Environment Variables:** The `.env.local` file contains the `UPLOADTHING_TOKEN`. This must be added to your hosting provider (like Vercel) for file uploads to work in production.
