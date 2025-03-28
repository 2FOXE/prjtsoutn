import { addDays } from "date-fns";

const IntialState = {
  chambreList: [],
  etagesList: [],
  filters: {
    floor: [],
    date: { from: new Date(), to: addDays(new Date(), 1) },
    guests: 1,
    beds: 1,
    bathrooms: 1,
  },
  chambreReserver: {},
};

export function ChambreReducre(state = IntialState, action) {
  if (action.type === "FetchChambres") {
    return {
      ...state,
      chambreList: action.payload.chambres,
      etagesList: action.payload.etages,
    };
  }
  if (action.type === "Filtrage") {
    return {
      ...state,
      filters: {
        ...state.filters,
        ...action.payload,
        floor: Array.isArray(action.payload.floor) ? action.payload.floor : [],
      },
    };
  }

  if (action.type === "ChambreReserver") {
    return {
      ...state,
      chambreReserver: state.chambreList.find(
        (ele) => ele.id === action.payload
      ),
    };
  }
  return state;
}
