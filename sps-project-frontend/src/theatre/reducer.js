// src/reducers/EvenementReducer.js

const initialState = {
    evenements: [],
    loading: false,
    error: null,
  };
  
  const EvenementReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_EVENEMENTS_REQUEST":
        return { ...state, loading: true };
      case "FETCH_EVENEMENTS_SUCCESS":
        return { ...state, loading: false, evenements: action.payload };
      case "FETCH_EVENEMENTS_FAILURE":
        return { ...state, loading: false, error: action.payload };
      case "ADD_EVENEMENT_SUCCESS":
        return { ...state, evenements: [...state.evenements, action.payload] };
      case "UPDATE_EVENEMENT_SUCCESS":
        return {
          ...state,
          evenements: state.evenements.map((evenement) =>
            evenement.id === action.payload.id ? action.payload : evenement
          ),
        };
      case "DELETE_EVENEMENT_SUCCESS":
        return {
          ...state,
          evenements: state.evenements.filter((evenement) => evenement.id !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default EvenementReducer;
  