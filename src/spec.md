# Specification

## Summary
**Goal:** Rename the app to “Lowkey Luxurious” across key shopping entry screens and update “under-budget” collections from ₹20/₹35 to ₹500/₹1000, including labels, routing, and filtering behavior.

**Planned changes:**
- Replace user-facing brand text “Vibe Shop” with “Lowkey Luxurious” in AuthGate and Shop Home, and update the HTML document `<title>` to “Lowkey Luxurious”.
- Update Shop Home UI labels and section headers from “Under ₹20/Under ₹35” to “Under ₹500/Under ₹1000”, and ensure Collection page titles reflect the selected under-budget collection.
- Update under-budget collection routing slugs/IDs so Home quick buttons navigate to collection IDs understood by CollectionPage.
- Update under-budget filtering logic to use thresholds of ≤ ₹500 and ≤ ₹1000 (including the Home under-budget shelf).
- Adjust default price-range filter state on CollectionPage and SearchPage so products above ₹200 are not hidden by default (supporting the new ≤ ₹1000 collections).

**User-visible outcome:** The app displays the “Lowkey Luxurious” brand name (including the browser tab title), and under-budget browsing works correctly for “Under ₹500” and “Under ₹1000” across Home, Collection, and Search without missing items due to outdated thresholds or default filters.
