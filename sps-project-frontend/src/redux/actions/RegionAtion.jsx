import axios from "axios"

export  const FetchRegion =()=>async(dispatch)=>{   
    try{
        const response=await axios
        .get("http://127.0.0.1:8000/api/regions")      
        dispatch({type:"FetchRegion",payload:response.data})
        
    }catch(err){
        console.log(err)
    }
    
}