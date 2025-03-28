const IntialState={
    ListDemandeReservation:[]
}

export function DemandeReserReducer(state=IntialState,action){

    if(action.type==="FetchDemandeReservation"){
        return  {...state,ListDemandeReservation:action.payload.data}
    }
    return  state
}