import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Zap, Video, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetCart } from '../hooks/useShopQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity } = useInternetIdentity();
  const { data: cartItems = [] } = useGetCart(identity?.getPrincipal() || null);

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/deals', icon: Zap, label: 'Deals' },
    { path: '/reels', icon: Video, label: 'Reels' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset z-50 shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.startsWith(item.path);
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: item.path })}
              className={`relative flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all ${
                isActive ? 'text-primary scale-110' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
