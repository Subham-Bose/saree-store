# Saree E-commerce Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from premium e-commerce platforms (Shopify stores, Etsy, luxury fashion sites) with emphasis on visual storytelling and elegant product presentation. Sarees require sophisticated, image-forward design that balances traditional aesthetics with modern usability.

## Typography System
**Primary Font:** Playfair Display (serif) for headings - elegant, traditional feel
**Secondary Font:** Inter (sans-serif) for body text and UI elements
**Hierarchy:**
- Hero titles: text-5xl to text-6xl, font-semibold
- Section headings: text-3xl to text-4xl, font-semibold
- Product names: text-xl, font-medium
- Body text: text-base, regular
- UI labels/buttons: text-sm to text-base, medium

## Layout & Spacing System
**Tailwind Units:** Consistently use 4, 6, 8, 12, 16, 20, 24 units
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Card spacing: p-6 to p-8
- Component gaps: gap-6 to gap-8
- Container: max-w-7xl with px-6 to px-8

## Page-Specific Layouts

### Homepage
**Hero Section:** Full-width hero image (80vh) showcasing elegant saree with model, center-aligned headline "Timeless Elegance in Every Drape" with blurred-background CTA button
**Featured Collections:** 3-column grid (lg:grid-cols-3 md:grid-cols-2) with large product images, overlay text on hover
**New Arrivals:** 4-column product grid with clean product cards
**Testimonials:** 2-column layout with customer photos
**Newsletter/Footer:** Full-width with multi-column footer (4 columns: About, Shop, Support, Follow)

### Product Listing Page
**Layout:** Sidebar filters (left, 1/4 width) + Product grid (right, 3/4 width)
**Grid:** 3-column on desktop (grid-cols-3), 2-column tablet, 1-column mobile
**Product Cards:** Square aspect ratio image, product name, price, quick-view button on hover
**Filters:** Collapsible categories (fabric, price, occasion, color)

### Product Detail Page
**Layout:** 2-column split (60/40) - image gallery left, product info right
**Image Gallery:** Large primary image with thumbnail strip below, zoom on click
**Product Info:** Sticky sidebar with name, price, size/color selectors, quantity, add-to-cart CTA
**Below Fold:** Full-width tabs for Description, Fabric Details, Care Instructions, Reviews
**Related Products:** 4-column carousel at bottom

### Cart & Checkout
**Cart:** Clean table layout with product thumbnails, stepper quantity controls, remove option
**Checkout:** Single-column stepped process (Shipping → Payment → Review) with progress indicator at top
**Form Layout:** 2-column for address fields (grid-cols-2), single-column for payment

### Authentication Pages
**Layout:** Centered card (max-w-md) on minimal background, not full-height
**Forms:** Single column, generous spacing between fields
**Address Management:** Card-based grid showing saved addresses with edit/delete options

## Component Library

**Navigation:**
- Sticky header with logo center, navigation left, cart/account icons right
- Mega-menu for categories with image previews
- Mobile: Hamburger menu with slide-in drawer

**Product Cards:**
- 4:5 aspect ratio image
- Overlay "New" or "Sale" badges (top-left)
- Heart icon for wishlist (top-right)
- Product name, price below image
- Hover: Slight scale transform, quick-add button appears

**Buttons:**
- Primary: Large, rounded (rounded-lg), text-base, px-8 py-3
- Secondary: Outlined variant
- Icon buttons: Circular for cart/wishlist

**Forms:**
- Input fields: Bordered, rounded-md, py-3 px-4
- Labels: text-sm, font-medium, mb-2
- Focus states: Ring treatment

**Modals:**
- Cart preview: Slide-in from right (w-96)
- Quick view: Centered modal with product essentials

## Images Strategy

**Hero Image:** Full-width lifestyle shot of model wearing saree in traditional setting (palace, garden), high-quality, professionally styled
**Product Images:** Clean white background for consistency, multiple angles (front, back, drape detail, fabric closeup)
**Category Banners:** Lifestyle images for collection headers
**Testimonial Photos:** Customer headshots, circular crops
**Trust Badges:** Payment icons, security badges in footer

**Image Specifications:**
- Hero: 1920x1200px minimum
- Product listing: 800x1000px
- Product detail: 1200x1500px with additional detail shots
- Thumbnails: 400x500px

## Animations
Minimal, purposeful animations:
- Product card hover: Scale 1.05 transition
- Add to cart: Subtle shake confirmation
- Page transitions: Smooth fade
- NO complex scroll animations or excessive motion

## Accessibility
- ARIA labels on interactive elements
- Keyboard navigation throughout
- Color contrast meeting WCAG AA
- Focus indicators on all interactive elements
- Alt text for all product images