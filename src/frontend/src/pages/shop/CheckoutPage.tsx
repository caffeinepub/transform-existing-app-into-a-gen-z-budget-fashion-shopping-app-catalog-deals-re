import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useCheckout, useCalculateCartTotal } from '../../hooks/useShopQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '../../utils/shopFormat';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile } = useSaveCallerUserProfile();
  const { mutateAsync: checkout, isPending } = useCheckout();
  const { data: total = BigInt(0) } = useCalculateCartTotal();

  const [shippingAddress, setShippingAddress] = useState(profile?.shippingAddress || '');
  const [email, setEmail] = useState(profile?.email || '');

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    try {
      if (profile) {
        await saveProfile({
          ...profile,
          email: email.trim(),
          shippingAddress: shippingAddress.trim(),
        });
      }

      const orderId = await checkout();
      toast.success('Order placed successfully!');
      navigate({ to: '/orders/$orderId', params: { orderId: orderId.toString() } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate({ to: '/cart' })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-sm text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Shipping Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter your full shipping address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Order Total</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
