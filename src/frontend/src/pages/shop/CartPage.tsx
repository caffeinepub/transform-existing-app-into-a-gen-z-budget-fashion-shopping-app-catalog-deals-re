import { useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import CartLineItem from '../../components/shop/CartLineItem';
import { useGetCart, useAddToCart, useRemoveFromCart, useCalculateCartTotal, useGetAllProducts } from '../../hooks/useShopQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/shopFormat';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cartItems = [], isLoading } = useGetCart(identity?.getPrincipal() || null);
  const { data: allProducts = [] } = useGetAllProducts();
  const { data: total = BigInt(0) } = useCalculateCartTotal();
  const { mutateAsync: addToCart } = useAddToCart();
  const { mutateAsync: removeFromCart } = useRemoveFromCart();

  const handleQuantityChange = async (productId: bigint, newQuantity: number) => {
    try {
      await removeFromCart(productId);
      if (newQuantity > 0) {
        await addToCart({ productId, quantity: BigInt(newQuantity) });
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId: bigint) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const cartWithProducts = cartItems.map(item => ({
    ...item,
    product: allProducts.find(p => p.id === item.productId),
  })).filter(item => item.product);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cart</h1>
          <p className="text-sm text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => navigate({ to: '/home' })}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cartWithProducts.map((item) => (
                <CartLineItem
                  key={item.productId.toString()}
                  product={item.product!}
                  quantity={Number(item.quantity)}
                  onQuantityChange={(newQty) => handleQuantityChange(item.productId, newQty)}
                  onRemove={() => handleRemove(item.productId)}
                />
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-2xl text-primary">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
