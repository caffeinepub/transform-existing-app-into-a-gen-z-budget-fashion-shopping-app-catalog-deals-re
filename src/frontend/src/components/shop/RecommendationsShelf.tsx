import { useGetRecommendations } from '../../hooks/useShopQueries';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './Skeletons';
import { Sparkles } from 'lucide-react';

export default function RecommendationsShelf() {
  const { data: recommendations = [], isLoading } = useGetRecommendations();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          For You
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-[160px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        For You
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {recommendations.slice(0, 6).map((product) => (
          <div key={product.id.toString()} className="min-w-[160px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
