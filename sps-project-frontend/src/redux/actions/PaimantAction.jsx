import axios from "axios"

export  const FetchPaimant =()=>async(dispatch)=>{   
    try{
        const response=await axios
        .get("http://127.0.0.1:8000/api/mode-paimants")      
        dispatch({type:"FetchPaimant",payload:response.data})
        
    }catch(err){
        console.log(err)
    }
    
}