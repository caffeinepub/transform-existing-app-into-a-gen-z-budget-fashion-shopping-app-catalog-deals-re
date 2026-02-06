import { useNavigate } from '@tanstack/react-router';
import type { Product } from '../../backend';
import { formatPrice } from '../../utils/shopFormat';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '../../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  showInfluencerBadge?: boolean;
}

export default function ProductCard({ product, showInfluencerBadge }: ProductCardProps) {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div
      onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}
      className="group cursor-pointer space-y-2 animate-in fade-in-50 duration-300"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 rounded-full shadow-lg"
          onClick={handleWishlistToggle}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        {showInfluencerBadge && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500">
            Influencer Pick
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
        {product.vibeTags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {product.vibeTags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
