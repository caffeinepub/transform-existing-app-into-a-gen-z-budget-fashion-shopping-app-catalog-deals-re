import { useParams, useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import ReviewsSection from '../../components/shop/ReviewsSection';
import InfluencerPickBadge from '../../components/shop/InfluencerPickBadge';
import { useGetProduct, useAddToCart } from '../../hooks/useShopQueries';
import { useWishlist } from '../../hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { formatPrice, formatVibeTag } from '../../utils/shopFormat';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({ productId: product.id, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => navigate({ to: '/home' })}
          className="mb-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="aspect-square rounded-xl overflow-hidden bg-muted">
          {product.images[0] && (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {product.images.slice(1).map((img, i) => (
              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img src={img} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleWishlistToggle}
              className="flex-shrink-0"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.vibeTags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {formatVibeTag(tag)}
              </Badge>
            ))}
            {product.trendTags.map((tag, i) => (
              <Badge key={i} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground">{product.description}</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAddToCart} disabled={isPending} className="flex-1 gap-2" size="lg">
            <ShoppingCart className="w-5 h-5" />
            {isPending ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>

        <ReviewsSection productId={product.id} />
      </div>
    </PageContainer>
  );
}
