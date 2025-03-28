
const IntialState = {
  RegionVilleList:[]
};

export function RegionVilleReducer(state = IntialState, action) {
  if (action.type === "FetchRegion") {
    return {
      ...state,RegionVilleList:action.payload.Region
    };
  }

  return state
}