const IntialState={

    token:localStorage.getItem("token_jwt"),
    user:JSON.parse(localStorage.getItem("user")),


}
export function UserReducer(state=IntialState,action){

    if(action.type==="login"){
        localStorage.setItem("token_jwt",action.payload.token);
        localStorage.setItem("user",JSON.stringify(action.payload.user));
        return {...state,user:action.payload.user,token:action.payload.token} 
    }
    if(action.type==="register"){
        localStorage.setItem("token_jwt",action.payload.token);
        localStorage.setItem("user",JSON.stringify(action.payload.user));
        return {...state,user:action.payload.user,token:action.payload.token} 
    }
    if(action.type==="logout"){
        localStorage.removeItem("user")
        localStorage.removeItem("token_jwt")
        return {...state,user:null,token:null}
    }
    return  state
}