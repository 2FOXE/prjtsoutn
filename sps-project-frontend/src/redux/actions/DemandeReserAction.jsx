import axios from "axios";
import { FetchChambre } from "./ChambreAction";

export  const FetchDemandeReservation =()=>async(dispatch)=>{   
    try{
        const response=await axios
        .get("http://127.0.0.1:8000/api/demandes_reservation")      
        dispatch({type:"FetchDemandeReservation",payload:response.data});
        
    }catch(err){
        console.log(err)
    }
      
}
export  const StoreDemandeReservation =(data)=>async(dispatch)=>{   
    try{
        const response=await axios
        .post("http://127.0.0.1:8000/api/demandes_reservation",data)      
        dispatch(FetchChambre());
        
    }catch(err){
        console.log(err)
    }
      
}