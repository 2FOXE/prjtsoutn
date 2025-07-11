import { legacy_createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from "@redux-devtools/extension";

// Create the Redux store
const store = legacy_createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
