import { createStore, combineReducers } from "redux";

import shopReducer from "../reducers/ShopReducer";

const store = createStore(
  combineReducers({
    shops: shopReducer,
  })
);

export default store;
