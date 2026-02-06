import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, Deal, Review, CartItem, Order, Category, VibeTag } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(productId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId?.toString()],
    queryFn: async () => {
      if (!actor || !productId) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && productId !== null,
  });
}

export function useGetProductsByCategory(category: Category | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !actorFetching && !!category,
  });
}

export function useGetProductsByVibe(vibe: VibeTag | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'vibe', vibe],
    queryFn: async () => {
      if (!actor || !vibe) return [];
      return actor.getProductsByVibe(vibe);
    },
    enabled: !!actor && !actorFetching && !!vibe,
  });
}

// Deal Queries
export function useGetActiveDeals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Deal[]>({
    queryKey: ['deals', 'active'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveDeals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetFlashSales() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Deal[]>({
    queryKey: ['deals', 'flash'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFlashSales();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Cart Queries
export function useGetCart(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CartItem[]>({
    queryKey: ['cart', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getCart(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
    },
  });
}

export function useCalculateCartTotal() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['cartTotal'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.calculateCartTotal();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Order Queries
export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetUserOrders(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserOrders(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useGetOrder(orderId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId?.toString()],
    queryFn: async () => {
      if (!actor || orderId === null) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !actorFetching && orderId !== null,
  });
}

// Review Queries
export function useGetProductReviews(productId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', productId?.toString()],
    queryFn: async () => {
      if (!actor || !productId) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !actorFetching && productId !== null,
  });
}

export function useGetAverageRating(productId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['rating', productId?.toString()],
    queryFn: async () => {
      if (!actor || !productId) return 0;
      return actor.getAverageRating(productId);
    },
    enabled: !!actor && !actorFetching && productId !== null,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(review);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['rating', variables.productId.toString()] });
    },
  });
}

// Recommendations
export function useGetRecommendations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['recommendations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendedOutfits();
    },
    enabled: !!actor && !actorFetching,
  });
}
