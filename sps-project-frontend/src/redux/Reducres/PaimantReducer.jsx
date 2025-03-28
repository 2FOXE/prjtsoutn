
const IntialState = {
    PaimentList:[]
  };
  
  export function PaimantReducer(state = IntialState, action) {
    if (action.type === "FetchPaimant") {
      return {
        ...state,PaimentList:action.payload.modes
      };
    }
  
    return state
  }