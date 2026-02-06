import { useNavigate } from '@tanstack/react-router';
import PageContainer from '../../components/shop/PageContainer';
import { useGetUserOrders } from '../../hooks/useShopQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatOrderStatus } from '../../utils/shopFormat';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: orders = [], isLoading } = useGetUserOrders(identity?.getPrincipal() || null);

  const sortedOrders = [...orders].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Track your purchases</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => (
              <div
                key={order.id.toString()}
                onClick={() => navigate({ to: '/orders/$orderId', params: { orderId: order.id.toString() } })}
                className="p-4 border rounded-xl cursor-pointer hover:border-primary transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Order #{order.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {formatOrderStatus(order.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
