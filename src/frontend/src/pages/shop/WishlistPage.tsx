import PageContainer from '../../components/shop/PageContainer';
import ProductGrid from '../../components/shop/ProductGrid';
import { useWishlist } from '../../hooks/useWishlist';
import { useGetAllProducts } from '../../hooks/useShopQueries';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { data: allProducts = [], isLoading } = useGetAllProducts();

  const wishlistProducts = allProducts.filter(p => wishlist.some(id => id === p.id));

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            Wishlist
          </h1>
          <p className="text-sm text-muted-foreground">Your saved items</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground">Start adding items you love!</p>
          </div>
        ) : (
          <ProductGrid products={wishlistProducts} isLoading={isLoading} emptyMessage="Wishlist items not found" />
        )}
      </div>
    </PageContainer>
  );
}
