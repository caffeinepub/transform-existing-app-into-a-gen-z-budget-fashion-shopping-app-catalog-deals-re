import { useState } from 'react';
import PageContainer from '../../components/shop/PageContainer';
import ProductGrid from '../../components/shop/ProductGrid';
import FilterSheet from '../../components/shop/FilterSheet';
import AppliedFilterChips from '../../components/shop/AppliedFilterChips';
import { useGetAllProducts } from '../../hooks/useShopQueries';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { applyFilters, type FilterState } from '../../utils/shopFilters';

export default function SearchPage() {
  const { data: allProducts = [], isLoading } = useGetAllProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    trendTags: [],
    vibeTags: [],
    sortBy: 'newest',
  });

  const handleRemoveFilter = (type: 'vibe' | 'price' | 'all', value?: any) => {
    if (type === 'all') {
      setFilters({
        priceRange: [0, 200],
        trendTags: [],
        vibeTags: [],
        sortBy: 'newest',
      });
    } else if (type === 'vibe') {
      setFilters(prev => ({
        ...prev,
        vibeTags: prev.vibeTags.filter(v => v !== value),
      }));
    } else if (type === 'price') {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, 200],
      }));
    }
  };

  let filteredProducts = applyFilters(allProducts, filters);

  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Search</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FilterSheet filters={filters} onFiltersChange={setFilters} />
          <AppliedFilterChips filters={filters} onRemoveFilter={handleRemoveFilter} />
        </div>

        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
          emptyMessage={searchQuery ? 'No products match your search' : 'No products found'}
        />
      </div>
    </PageContainer>
  );
}
