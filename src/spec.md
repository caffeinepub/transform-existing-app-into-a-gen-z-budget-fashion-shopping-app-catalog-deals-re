# Specification

## Summary
**Goal:** Transform the existing app into a Gen Z, budget-focused mobile fashion shopping app with catalog discovery, deals, reels-style previews, recommendations, and MVP commerce flows (wishlist, cart, checkout, orders), while keeping Internet Identity authentication.

**Planned changes:**
- Replace the current app’s information architecture/routes with shopping-focused screens: Home, Deals, Reels, Search/Filter, Wishlist, Cart, Orders/Tracking, and Profile/Preferences (behind the existing Internet Identity gate).
- Apply a bold, colorful, minimal Gen Z theme across the new UI with lightweight mobile-first animations, skeleton loaders, and stable loading states.
- Add backend Motoko data models and CRUD/query APIs for products (price, category, trend tags, vibe tags, images, optional video preview metadata) plus deals/collections.
- Build catalog browsing UX: product grids, product detail pages (including trend/vibe metadata, reviews summary, influencer pick badge), and add-to-wishlist/add-to-cart actions with empty states.
- Implement Deals and under-budget collection discovery surfaces backed by backend data.
- Add mobile-friendly filtering/sorting by price range, trend, and vibe with visible applied filters (chips) and reliable back-navigation behavior.
- Implement reels-style vertical feed for product previews with mute/unmute, play/pause, and tap-through to product detail; gracefully fall back to image previews when no video exists.
- Implement wishlist and cart with per-user backend persistence, quantity updates, and subtotal/total calculation.
- Implement MVP checkout and order tracking: collect shipping details, confirm order summary, create backend order records, clear cart on success, and show order status timeline in Orders.
- Add reviews/ratings and influencer picks: backend create/list reviews + average rating; UI to display and submit reviews and highlight influencer picks.
- Implement deterministic (non-LLM) “AI” outfit/product recommendations driven by stored user preferences; UI to set preferences and view ranked recommendations.
- Add new static brand assets for the shopping identity and render them in key UI entry points, stored under `frontend/public/assets/generated`.

**User-visible outcome:** After signing in, users land on a Gen Z budget fashion shopping home screen and can browse products, discover deals and under-budget collections, watch reels-style previews, filter/search, save items to wishlist, manage a cart, place an order via an MVP checkout, track orders, leave reviews, see influencer picks, and get preference-based recommendations.
