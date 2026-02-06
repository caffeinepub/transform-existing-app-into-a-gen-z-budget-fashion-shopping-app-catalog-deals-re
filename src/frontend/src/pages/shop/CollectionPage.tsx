import { useParams, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import PageContainer from '../../components/shop/PageContainer';
import ProductGrid from '../../components/shop/ProductGrid';
import FilterSheet from '../../components/shop/FilterSheet';
import AppliedFilterChips from '../../components/shop/AppliedFilterChips';
import { useGetAllProducts } from '../../hooks/useShopQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { applyFilters, getUnderBudgetProducts, type FilterState } from '../../utils/shopFilters';

export default function CollectionPage() {
  const { collectionId } = useParams({ from: '/collection/$collectionId' });
  const navigate = useNavigate();
  const { data: allProducts = [], isLoading } = useGetAllProducts();

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

  let collectionProducts = allProducts;
  let collectionTitle = 'Collection';

  if (collectionId === 'under-20') {
    collectionProducts = getUnderBudgetProducts(allProducts, 20);
    collectionTitle = 'Under $20';
  } else if (collectionId === 'under-35') {
    collectionProducts = getUnderBudgetProducts(allProducts, 35);
    collectionTitle = 'Under $35';
  }

  const filteredProducts = applyFilters(collectionProducts, filters);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate({ to: '/home' })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{collectionTitle}</h1>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} products</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FilterSheet filters={filters} onFiltersChange={setFilters} />
          <AppliedFilterChips filters={filters} onRemoveFilter={handleRemoveFilter} />
        </div>

        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
