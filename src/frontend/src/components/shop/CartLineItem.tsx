import type { Product } from '../../backend';
import { formatPrice } from '../../utils/shopFormat';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartLineItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartLineItem({ product, quantity, onQuantityChange, onRemove }: CartLineItemProps) {
  return (
    <div className="flex gap-3 p-3 border rounded-xl">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {product.images[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
          <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="h-8 w-8"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQuantityChange(quantity + 1)}
              className="h-8 w-8"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <p className="font-bold text-primary">{formatPrice(product.price * BigInt(quantity))}</p>
        </div>
      </div>
    </div>
  );
}
