import { combineReducers } from "redux";
import EvenementReducer from "./reducer";  // Importer le reducer des événements

const rootReducer = combineReducers({
  evenements: EvenementReducer,  // Ajouter le reducer des événements
  // autres reducers...
});

export default rootReducer;
