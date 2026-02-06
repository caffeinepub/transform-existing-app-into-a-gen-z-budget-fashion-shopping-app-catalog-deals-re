import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Category "mo:core/Text";

module {
  type OldCommunityId = Text;

  type OldUserProfile = {
    name : Text;
    selectedCommunity : ?OldCommunityId;
  };

  type OldChatRoom = {
    id : Text;
    name : Text;
    community : OldCommunityId;
    creator : Principal;
    createdAt : Int;
  };

  type OldChatMessage = {
    id : Text;
    roomId : Text;
    sender : Principal;
    content : Text;
    timestamp : Int;
    community : OldCommunityId;
  };

  type OldHelpRequest = {
    id : Text;
    creator : Principal;
    description : Text;
    category : Text;
    isAnonymous : Bool;
    timestamp : Int;
    community : OldCommunityId;
  };

  type OldGoodDeedPost = {
    id : Text;
    creator : Principal;
    content : Text;
    tags : [Text];
    isAnonymous : Bool;
    timestamp : Int;
    community : OldCommunityId;
  };

  type OldModerationReport = {
    id : Text;
    reporter : Principal;
    contentId : Text;
    contentType : Text;
    reason : Text;
    timestamp : Int;
    status : Text;
    community : OldCommunityId;
  };

  type OldDailyChallenge = {
    id : Text;
    challenge : Text;
    community : OldCommunityId;
    date : Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    chatRooms : Map.Map<Text, OldChatRoom>;
    chatMessages : Map.Map<Text, OldChatMessage>;
    helpRequests : Map.Map<Text, OldHelpRequest>;
    goodDeedPosts : Map.Map<Text, OldGoodDeedPost>;
    moderationReports : Map.Map<Text, OldModerationReport>;
    dailyChallenges : Map.Map<Text, OldDailyChallenge>;
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
    stylePreferences : {
      budgetRange : (Nat, Nat);
      preferredVibes : [VibeTag];
      preferredCategories : [Category];
      dislikedVibes : [VibeTag];
      excludedColors : ?[Text];
    };
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    trendTags : [Text];
    vibeTags : [VibeTag];
    images : [Text];
    videoPreview : ?Text;
  };

  type Deal = {
    id : Nat;
    title : Text;
    description : Text;
    discount : Nat;
    products : [Product];
    isActive : Bool;
    isFlashSale : Bool;
  };

  type Review = {
    id : Nat;
    productId : Nat;
    user : Principal;
    rating : Nat;
    text : Text;
    isInfluencerPick : Bool;
    influencerQuote : ?Text;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    user : Principal;
    items : [CartItem];
    total : Nat;
    shippingAddress : Text;
    status : OrderStatus;
    trackingInfo : ?Text;
    timestamp : Int;
  };

  type Category = {
    #clothing;
    #accessories;
    #footwear;
  };

  type VibeTag = {
    #streetwear;
    #Y2K;
    #minimal;
    #party;
    #casual;
  };

  type OrderStatus = {
    #processing;
    #shipped;
    #delivered;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    products : Map.Map<Nat, Product>;
    deals : Map.Map<Nat, Deal>;
    reviews : Map.Map<Nat, Review>;
    carts : Map.Map<Principal, List.List<CartItem>>;
    orders : Map.Map<Nat, Order>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) {
        {
          name = oldProfile.name;
          email = "";
          shippingAddress = "";
          stylePreferences = {
            budgetRange = (0, 1000);
            preferredVibes = [];
            preferredCategories = [];
            dislikedVibes = [];
            excludedColors = null;
          };
        };
      }
    );
    {
      userProfiles = newUserProfiles;
      products = Map.empty<Nat, Product>();
      deals = Map.empty<Nat, Deal>();
      reviews = Map.empty<Nat, Review>();
      carts = Map.empty<Principal, List.List<CartItem>>();
      orders = Map.empty<Nat, Order>();
    };
  };
};
