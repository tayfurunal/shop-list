const initialState = {
  shops: [],
  shopWillPurchase: [],
  shopPurchased: [],
  isLoadingShops: true,
  image: null,
};

const shops = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_SHOPS_FROM_SERVER":
      return {
        ...state,
        shops: action.payload,
        shopWillPurchase: action.payload.filter((shop) => !shop.read),
        shopPurchased: action.payload.filter((shop) => shop.read),
      };
    case "ADD_SHOP":
      return {
        ...state,
        shops: [action.payload, ...state.shops],
        shopWillPurchase: [action.payload, ...state.shopWillPurchase],
      };
    case "MARK_SHOP_AS_READ":
      return {
        ...state,
        shops: state.shops.map((shop) => {
          if (shop.name == action.payload.name) {
            return { ...shop, read: true };
          }
          return shop;
        }),
        shopPurchased: [...state.shopPurchased, action.payload],
        shopWillPurchase: state.shopWillPurchase.filter(
          (shop) => shop.name !== action.payload.name
        ),
      };
    case "TOGGLE_IS_LOADING_SHOPS":
      return {
        ...state,
        isLoadingShops: action.payload,
      };
    case "MARK_SHOP_AS_UNREAD":
      return {
        ...state,
        shops: state.shops.map((shop) => {
          if (shop.name == action.payload.name) {
            return { ...shop, read: false };
          }
          return shop;
        }),
        shopPurchased: state.shopPurchased.filter(
          (shop) => shop.name !== action.payload.name
        ),
        shopWillPurchase: [...state.shopWillPurchase, action.payload],
      };
    case "DELETE_SHOP":
      return {
        ...state,
        shops: state.shops.filter((shop) => shop.name !== action.payload.name),
        shopPurchased: state.shopPurchased.filter(
          (shop) => shop.name !== action.payload.name
        ),
        shopWillPurchase: state.shopWillPurchase.filter(
          (shop) => shop.name !== action.payload.name
        ),
      };
    default:
      return state;
  }
};

export default shops;
