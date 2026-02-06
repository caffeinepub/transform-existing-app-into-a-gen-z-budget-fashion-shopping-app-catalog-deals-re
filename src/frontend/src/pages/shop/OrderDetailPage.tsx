import { useParams, useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import OrderStatusTimeline from '../../components/shop/OrderStatusTimeline';
import { useGetOrder, useGetAllProducts } from '../../hooks/useShopQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '../../utils/shopFormat';

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));
  const { data: allProducts = [] } = useGetAllProducts();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </PageContainer>
    );
  }

  const orderItems = order.items.map(item => ({
    ...item,
    product: allProducts.find(p => p.id === item.productId),
  })).filter(item => item.product);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate({ to: '/orders' })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.toString()}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
            </p>
          </div>
        </div>

        <OrderStatusTimeline currentStatus={order.status} />

        {order.trackingInfo && (
          <div className="p-4 border rounded-xl bg-muted/30">
            <p className="text-sm font-semibold">Tracking Info</p>
            <p className="text-sm text-muted-foreground">{order.trackingInfo}</p>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="font-semibold">Items</h2>
          {orderItems.map((item) => (
            <div key={item.productId.toString()} className="flex gap-3 p-3 border rounded-xl">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.product!.images[0] && (
                  <img src={item.product!.images[0]} alt={item.product!.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{item.product!.name}</h3>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity.toString()}</p>
                <p className="font-bold text-primary">{formatPrice(item.product!.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 p-4 border rounded-xl bg-muted/30">
          <h2 className="font-semibold">Shipping Address</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{order.shippingAddress}</p>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-2xl text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
