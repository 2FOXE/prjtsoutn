import axios from "axios"

export  const FetchChambre =()=>async(dispatch)=>{   
    try{
        const response=await axios
        .get("http://127.0.0.1:8000/api/chambres")      
        dispatch({type:"FetchChambres",payload:response.data})
        
    }catch(err){
        console.log(err)
    }
      
}




export const FiltrageAction=(filters)=>(dispatch)=>{
    dispatch({type:"Filtrage",payload:filters})
}



export const ChambreReserver=(chambreId)=>(dispatch)=>{
    dispatch({type:"ChambreReserver",payload:chambreId})
}