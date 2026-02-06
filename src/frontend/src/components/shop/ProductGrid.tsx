import type { Product } from '../../backend';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from './Skeletons';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({ products, isLoading, emptyMessage = 'No products found' }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id.toString()} product={product} />
      ))}
    </div>
  );
}
