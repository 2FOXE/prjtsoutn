import axios from "axios";
export const login = (formData) => async (dispatch) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", formData);
            dispatch({ 
        type: "login", 
        payload: { 
          token: response.data.token, 
          user: response.data.user 
        } 
      });
      
    } catch (err) {
      throw err;
    }
};
export const register = (formData) => async (dispatch) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", formData);
            dispatch({ 
        type: "register",
        payload: { 
          token: response.data.token, 
          user: response.data.user 
        } 
      });
      
    } catch (err) {
        console.log(err)
      throw err;
    }
    
};

export const logout=(token)=>async (dispatch)=>{
    try{
        await axios
        .get("http://127.0.0.1:8000/api/logout",{
          headers:{Authorization:`Bearer ${token}`}
        })
        //vidè le localsotorage
        localStorage.removeItem("user")
        localStorage.removeItem("token_jwt")
        dispatch({type:"logout"})
        
      }catch(err){
        console.error(err)
      }
    }