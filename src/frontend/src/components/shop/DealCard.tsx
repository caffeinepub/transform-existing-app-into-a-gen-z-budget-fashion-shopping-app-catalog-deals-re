import { useNavigate } from '@tanstack/react-router';
import type { Deal } from '../../backend';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { formatPrice } from '../../utils/shopFormat';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate({ to: '/collection/$collectionId', params: { collectionId: deal.id.toString() } })}
      className="p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 cursor-pointer hover:border-primary transition-all hover:scale-[1.02] space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {deal.isFlashSale && <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
            {deal.title}
          </h3>
          <p className="text-sm text-muted-foreground">{deal.description}</p>
        </div>
        <Badge variant="destructive" className="text-lg font-bold">
          {deal.discount}% OFF
        </Badge>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {deal.products.slice(0, 3).map((product) => (
          <div key={product.id.toString()} className="min-w-[100px] space-y-1">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {product.images[0] && (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-xs font-semibold truncate">{formatPrice(product.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
