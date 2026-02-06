export function formatPrice(price: bigint): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(Number(price));
}

export function formatVibeTag(vibe: string): string {
  const vibeMap: Record<string, string> = {
    streetwear: 'Streetwear',
    Y2K: 'Y2K',
    minimal: 'Minimal',
    party: 'Party',
    casual: 'Casual',
  };
  return vibeMap[vibe] || vibe;
}

export function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    clothing: 'Clothing',
    accessories: 'Accessories',
    footwear: 'Footwear',
  };
  return categoryMap[category] || category;
}

export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };
  return statusMap[status] || status;
}
