import type { Product, VibeTag } from '../backend';

export interface FilterState {
  priceRange: [number, number];
  trendTags: string[];
  vibeTags: VibeTag[];
  sortBy: 'price-asc' | 'price-desc' | 'newest';
}

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  let filtered = [...products];

  // Price range filter
  filtered = filtered.filter(p => {
    const price = Number(p.price);
    return price >= filters.priceRange[0] && price <= filters.priceRange[1];
  });

  // Vibe tags filter
  if (filters.vibeTags.length > 0) {
    filtered = filtered.filter(p =>
      p.vibeTags.some(tag => filters.vibeTags.includes(tag))
    );
  }

  // Trend tags filter
  if (filters.trendTags.length > 0) {
    filtered = filtered.filter(p =>
      p.trendTags.some(tag => filters.trendTags.includes(tag))
    );
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'newest':
      filtered.sort((a, b) => Number(b.id) - Number(a.id));
      break;
  }

  return filtered;
}

export function getUnderBudgetProducts(products: Product[], maxPrice: number): Product[] {
  return products.filter(p => Number(p.price) <= maxPrice);
}
