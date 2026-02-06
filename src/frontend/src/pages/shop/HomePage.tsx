import { useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import BrandBackground from '../../components/shop/BrandBackground';
import CategoryStrip from '../../components/shop/CategoryStrip';
import ProductGrid from '../../components/shop/ProductGrid';
import RecommendationsShelf from '../../components/shop/RecommendationsShelf';
import { useGetAllProducts } from '../../hooks/useShopQueries';
import { Button } from '@/components/ui/button';
import { Search, Zap, User } from 'lucide-react';
import { getUnderBudgetProducts } from '../../utils/shopFilters';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: allProducts = [], isLoading } = useGetAllProducts();

  const underBudgetProducts = getUnderBudgetProducts(allProducts, 1000);
  const featuredProducts = allProducts.slice(0, 6);

  return (
    <>
      <BrandBackground />
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Lowkey Luxurious
              </h1>
              <p className="text-sm text-muted-foreground">Fresh fits, low prices</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate({ to: '/search' })}
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate({ to: '/profile' })}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <CategoryStrip />

          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            <Button
              variant="outline"
              className="gap-2 whitespace-nowrap"
              onClick={() => navigate({ to: '/collection/$collectionId', params: { collectionId: 'under-500' } })}
            >
              <Zap className="w-4 h-4" />
              Under ₹500
            </Button>
            <Button
              variant="outline"
              className="gap-2 whitespace-nowrap"
              onClick={() => navigate({ to: '/collection/$collectionId', params: { collectionId: 'under-1000' } })}
            >
              <Zap className="w-4 h-4" />
              Under ₹1000
            </Button>
            <Button
              variant="outline"
              className="gap-2 whitespace-nowrap"
              onClick={() => navigate({ to: '/deals' })}
            >
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Flash Deals
            </Button>
          </div>

          <RecommendationsShelf />

          <div className="space-y-3">
            <h2 className="text-xl font-bold">Featured</h2>
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </div>

          {underBudgetProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Under ₹1000</h2>
                <Button
                  variant="link"
                  onClick={() => navigate({ to: '/collection/$collectionId', params: { collectionId: 'under-1000' } })}
                >
                  See all
                </Button>
              </div>
              <ProductGrid products={underBudgetProducts.slice(0, 4)} />
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
