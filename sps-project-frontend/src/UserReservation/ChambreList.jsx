import {Bath,BedDouble,Building,Coffee,Tv,Wifi,Wind} from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import image from "../../public/chambre.jpeg";
import { createPortal } from "react-dom";
import FormReserver from "./FormReserver";
import HeroSection from "./HeroSection";
import { useDispatch, useSelector } from "react-redux";
import Filtrage from "./Filtrage";
import { ChambreReserver, FetchChambre } from "@/redux/actions/ChambreAction";
import { useNavigate } from "react-router-dom";
import { FetchDemandeReservation } from "@/redux/actions/DemandeReserAction";

function Test({ className }) {
  const  Navigate=useNavigate()
  const dispatch=useDispatch()
  const [showModel, setShowModel] = useState(false);
  const ListReservation=useSelector(state=>state.DemandeReser.ListDemandeReservation)
  const listChambres=useSelector(state=>state.Chambre.chambreList)
  const filters=useSelector(state=>state.Chambre.filters)
  const [listCh,setListCh] = useState([]);
  

  useEffect(()=>{
    dispatch(FetchChambre())
    dispatch(FetchDemandeReservation())
  },[dispatch])
  
  
  useEffect(() => {
    setListCh(listChambres);
  }, [listChambres]);


  const handelReserve=(id)=>{
    dispatch(ChambreReserver(id))
    // setShowModel(true)
    Navigate('/user/reservation/')
  }
  const FormatData = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const ListChmabreFiltred = listCh.filter((ele) => {
    const floorNumber = Number(ele.etage?.etage?.match(/\d+/)?.[0]) || 0;
    
    // Formatage des dates
    let from = new Date(filters.date?.from ?? new Date());
    let to = filters.date?.to ? new Date(filters.date.to) : new Date(from);
    
    // Si aucune date de fin n'est fournie, ajouter un jour à la date de début
    if (!filters.date?.to) {
        to.setDate(to.getDate() + 1);
    }
    
    // Formater les dates pour la comparaison
    const formattedFrom = FormatData(from);
    const formattedTo = FormatData(to);
  
    // Vérification de la disponibilité de la chambre
    const isReserved = !filters.date?.from || !ele.demande_reservation.some((res) => {
        const resStart = FormatData(res.date_debut);
        const resEnd = FormatData(res.date_fin);

        // Vérifier le chevauchement des dates
        return (formattedFrom < resEnd && formattedTo > resStart);
    });
  
    return (
        isReserved && 
        (filters.destination ? ele.type_chambre.nom.toLowerCase().includes(filters.destination) : true) &&
        (filters.guests ? Number(ele.type_chambre.capacite) >= Number(filters.guests) : true) &&
        (filters.bathrooms ? Number(ele.nb_salle) >= Number(filters.bathrooms) : true) &&
        (filters.beds ? Number(ele.nb_lit) >= Number(filters.beds) : true) &&
        (filters.floor.length > 0 ? filters.floor.includes(floorNumber) : true)
    );
});
  



  // une fonction qui modifier le prix par le nombre de personne reserver ce chambre
  const handelUpdatePrice=(price)=>{
    if(filters.guests===1){
        return price.single
    }
    if(filters.guests===2){
        return price.double
    }
    if(filters.guests===3){
        return price.triple
    }

    return price.single
}

  return (
    <div className="    min-h-[200vh] ">
      <HeroSection />

      <div className=" flex flex-col gap-14  mx-8 p-6 rounded-xl my-5   mb-6  shadow-lg">
        <Filtrage/>


        <div className="flex justify-between items-center w-full">
          <span className="text-gray-500">{ListChmabreFiltred.length} chambres disponibles</span>
          <Button className="raduis-button hover:bg-gray-600 duration-300 ">
            Rechercher
          </Button>
        </div>
      </div>

      {/* partie chmbres  */}

      <div className="mb-8  px-7">
        <h2 className="text-2xl font-bold mb-2">Nos chambres disponibles</h2>
        <p className="text-muted-foreground">
          Sélectionnez une chambre pour effectuer votre réservation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-7 mb-96 ">
        {ListChmabreFiltred ? 
        ( ListChmabreFiltred.map((ele) => {
          return (
            <div
              key={ele.id}
              className=" overflow-hidden flex flex-col  relative group rounded-2xl raduis-button shadow-2xl"
            >
              <div className="z-20 rounded-full  bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-medium absolute top-2 right-3">
                {handelUpdatePrice(ele.tarif_chambre_detail)} $ / nuit
              </div>
              <img
                src={image}
                className="h-48 mb-3 group-hover:scale-105     w-full object-cover  duration-200 rounded-t-xl "
                alt=""
              />
              <div className="flex justify-between items-center px-3">
                <span className="text-lg font-medium">
                  {" "}
                  {ele.type_chambre.nom}
                </span>
                <div className=" flex  justify-center items-center rounded-full bg-gray-300  px-2 py-1 text-sm font-medium ">
                  <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{ele.nb_lit}</span>
                </div>
              </div>
              <p className="text-gray-500 px-3 text-sm flex  items-center mb-0 capitalize">
                <Building className=" h-4 w-4 mr-1" /> {ele.etage.etage}, chambre {ele.num_chambre}
              </p>
              <div className="flex items-center gap-2 text-gray-500 px-3 my-2 ">
              {ele.wifi === "oui" ? <Wifi size={18} /> : ""}
              {ele.climat === "oui" ? <Wind size={18} /> : ""}
              {ele.nb_salle >=1 ? <Bath size={18} /> : ""}
                <Coffee size={18} />
                {/* <Wind size={18} /> */}
              </div>
              <Button
                onClick={() => handelReserve(ele.id)}
                className="raduis-button   raduis-button-hovered hover:bg-gray-600 duration-300 capitalize mx-3 my-3 hover:-translate-y-1  "
              >
                Reserver
              </Button>
            </div>
          );
        })
        ):"loading"
      
      }
  
      </div>
        
      {showModel &&
        createPortal(
          <FormReserver onClose={() => setShowModel(false)} />,
          document.body
        )}
    </div>
  );
}

export default Test;
