import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: bigint;
    text: string;
    user: Principal;
    productId: bigint;
    isInfluencerPick: boolean;
    rating: bigint;
    influencerQuote?: string;
}
export type Time = bigint;
export interface Deal {
    id: bigint;
    title: string;
    description: string;
    isActive: boolean;
    discount: bigint;
    products: Array<Product>;
    isFlashSale: boolean;
}
export interface StylePreferences {
    preferredCategories: Array<Category>;
    excludedColors?: Array<string>;
    dislikedVibes: Array<VibeTag>;
    budgetRange: [bigint, bigint];
    preferredVibes: Array<VibeTag>;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    trackingInfo?: string;
    total: bigint;
    user: Principal;
    timestamp: Time;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface Product {
    id: bigint;
    trendTags: Array<string>;
    name: string;
    videoPreview?: string;
    description: string;
    category: Category;
    price: bigint;
    vibeTags: Array<VibeTag>;
    images: Array<string>;
}
export interface UserProfile {
    name: string;
    email: string;
    shippingAddress: string;
    stylePreferences: StylePreferences;
}
export enum Category {
    clothing = "clothing",
    accessories = "accessories",
    footwear = "footwear"
}
export enum OrderStatus {
    shipped = "shipped",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VibeTag {
    Y2K = "Y2K",
    minimal = "minimal",
    streetwear = "streetwear",
    casual = "casual",
    party = "party"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addReview(review: Review): Promise<void>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateCartTotal(): Promise<bigint>;
    checkout(): Promise<bigint>;
    createDeal(deal: Deal): Promise<void>;
    getActiveDeals(): Promise<Array<Deal>>;
    getAllProducts(): Promise<Array<Product>>;
    getAverageRating(productId: bigint): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(callerId: Principal): Promise<Array<CartItem>>;
    getFlashSales(): Promise<Array<Deal>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductReviews(productId: bigint): Promise<Array<Review>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getProductsByVibe(vibe: VibeTag): Promise<Array<Product>>;
    getRecommendedOutfits(): Promise<Array<Product>>;
    getUserOrders(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
