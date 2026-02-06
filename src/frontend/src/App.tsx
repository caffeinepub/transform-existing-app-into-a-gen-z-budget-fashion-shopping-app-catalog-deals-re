import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useShopQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/AuthGate';
import OnboardingPage from './pages/OnboardingPage';
import MobileScaffold from './components/MobileScaffold';
import HomePage from './pages/shop/HomePage';
import DealsPage from './pages/shop/DealsPage';
import ReelsPage from './pages/shop/ReelsPage';
import SearchPage from './pages/shop/SearchPage';
import WishlistPage from './pages/shop/WishlistPage';
import CartPage from './pages/shop/CartPage';
import OrdersPage from './pages/shop/OrdersPage';
import OrderDetailPage from './pages/shop/OrderDetailPage';
import ProfilePage from './pages/shop/ProfilePage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CollectionPage from './pages/shop/CollectionPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <MobileScaffold>
        <Outlet />
      </MobileScaffold>
      <Toaster />
    </ThemeProvider>
  ),
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainApp,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage,
});

const dealsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deals',
  component: DealsPage,
});

const reelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reels',
  component: ReelsPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: WishlistPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrdersPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: OrderDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const collectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collection/$collectionId',
  component: CollectionPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  dealsRoute,
  reelsRoute,
  searchRoute,
  wishlistRoute,
  cartRoute,
  ordersRoute,
  orderDetailRoute,
  profileRoute,
  productDetailRoute,
  collectionRoute,
  checkoutRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function MainApp() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const needsOnboarding = isAuthenticated && isFetched && !userProfile;

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <OnboardingPage />;
  }

  return <HomePage />;
}

export default function App() {
  return <RouterProvider router={router} />;
}
