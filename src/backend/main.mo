import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
    stylePreferences : StylePreferences;
  };

  public type StylePreferences = {
    budgetRange : (Nat, Nat); // min, max
    preferredVibes : [VibeTag];
    preferredCategories : [Category];
    dislikedVibes : [VibeTag];
    excludedColors : ?[Text];
  };

  public type Category = {
    #clothing;
    #accessories;
    #footwear;
  };

  public type VibeTag = {
    #streetwear;
    #Y2K;
    #minimal;
    #party;
    #casual;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    trendTags : [Text];
    vibeTags : [VibeTag];
    images : [Text]; // image paths
    videoPreview : ?Text; // video path
  };

  public type Deal = {
    id : Nat;
    title : Text;
    description : Text;
    discount : Nat; // percentage
    products : [Product];
    isActive : Bool;
    isFlashSale : Bool;
  };

  public type Review = {
    id : Nat;
    productId : Nat;
    user : Principal;
    rating : Nat; // 1-5
    text : Text;
    isInfluencerPick : Bool;
    influencerQuote : ?Text;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Nat;
    user : Principal;
    items : [CartItem];
    total : Nat;
    shippingAddress : Text;
    status : OrderStatus;
    trackingInfo : ?Text;
    timestamp : Time.Time;
  };

  public type OrderStatus = {
    #processing;
    #shipped;
    #delivered;
  };

  // Persistent storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Nat, Product>();
  let deals = Map.empty<Nat, Deal>();
  let reviews = Map.empty<Nat, Review>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Nat, Order>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product catalog
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(product) { product.category == category }
    );
  };

  public query ({ caller }) func getProductsByVibe(vibe : VibeTag) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.vibeTags.any(func(tag) { tag == vibe });
      }
    );
  };

  // Deals and collections
  public shared ({ caller }) func createDeal(deal : Deal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create deals");
    };
    deals.add(deal.id, deal);
  };

  public query ({ caller }) func getActiveDeals() : async [Deal] {
    deals.values().toArray().filter(
      func(deal) { deal.isActive }
    );
  };

  public query ({ caller }) func getFlashSales() : async [Deal] {
    deals.values().toArray().filter(
      func(deal) { deal.isActive and deal.isFlashSale }
    );
  };

  // Cart management
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };

    let newItem : CartItem = { productId; quantity };

    switch (carts.get(caller)) {
      case (?items) {
        items.add(newItem);
        carts.add(caller, items);
      };
      case (null) {
        let items = List.empty<CartItem>();
        items.add(newItem);
        carts.add(caller, items);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    switch (carts.get(caller)) {
      case (?items) {
        let filteredItems = items.filter(
          func(item) { item.productId != productId }
        );
        carts.add(caller, filteredItems);
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getCart(callerId : Principal) : async [CartItem] {
    if (caller != callerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own cart");
    };
    switch (carts.get(callerId)) {
      case (?items) { items.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func calculateCartTotal() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate cart total");
    };
    switch (carts.get(caller)) {
      case (?items) {
        var total = 0;
        let itemArray = items.toArray();
        for (item in itemArray.values()) {
          switch (products.get(item.productId)) {
            case (?product) { total += product.price * item.quantity };
            case (null) {};
          };
        };
        total;
      };
      case (null) { 0 };
    };
  };

  // Order processing
  public shared ({ caller }) func checkout() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };

    let cartTotal = await calculateCartTotal();
    if (cartTotal == 0) {
      Runtime.trap("Cart is empty");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        let orderId = await generateOrderId();
        switch (carts.get(caller)) {
          case (?items) {
            let order : Order = {
              id = orderId;
              user = caller;
              items = items.toArray();
              total = cartTotal;
              shippingAddress = profile.shippingAddress;
              status = #processing;
              trackingInfo = null;
              timestamp = Time.now();
            };

            orders.add(orderId, order);
            carts.remove(caller);
            orderId;
          };
          case (null) { Runtime.trap("Cart not found") };
        };
      };
      case (null) { Runtime.trap("User profile not found") };
    };
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(orderId)) {
      case (?order) {
        if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserOrders(userId : Principal) : async [Order] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(
      func(order) { order.user == userId }
    );
  };

  // Reviews
  public shared ({ caller }) func addReview(review : Review) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    reviews.add(review.id, review);
  };

  public query ({ caller }) func getProductReviews(productId : Nat) : async [Review] {
    reviews.values().toArray().filter(
      func(review) { review.productId == productId }
    );
  };

  public query ({ caller }) func getAverageRating(productId : Nat) : async Float {
    let productReviews = reviews.values().toArray().filter(
      func(review) { review.productId == productId }
    );

    if (productReviews.size() == 0) { return 0 };

    var total = 0;
    for (review in productReviews.values()) {
      total += review.rating;
    };
    let size = productReviews.size();
    total.toFloat() / size.toInt().toFloat();
  };

  // AI-powered recommendations (deterministic rules)
  public shared ({ caller }) func getRecommendedOutfits() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get recommendations");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        products.values().toArray().filter(
          func(product) {
            isWithinBudget(product, profile.stylePreferences) and
            matchesPreferredVibes(product, profile.stylePreferences) and
            matchesPreferredCategories(product, profile.stylePreferences)
          }
        );
      };
      case (null) { [] };
    };
  };

  func isWithinBudget(product : Product, preferences : StylePreferences) : Bool {
    let (min, max) = preferences.budgetRange;
    product.price >= min and product.price <= max;
  };

  func matchesPreferredVibes(product : Product, preferences : StylePreferences) : Bool {
    product.vibeTags.any(
      func(tag) {
        preferences.preferredVibes.any(func(preferred) {
          preferred == tag;
        });
      }
    );
  };

  func matchesPreferredCategories(product : Product, preferences : StylePreferences) : Bool {
    preferences.preferredCategories.any(func(preferred) {
      preferred == product.category;
    });
  };

  var orderIdCounter = 0;
  func generateOrderId() : async Nat {
    orderIdCounter += 1;
    orderIdCounter;
  };
};
