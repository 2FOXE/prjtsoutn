import { legacy_createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootreducer"; // Importer le rootReducer

const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)  // Appliquer redux-thunk pour gérer les actions asynchrones
);

export default store;
