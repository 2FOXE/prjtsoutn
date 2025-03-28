import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BathIcon, CoffeeIcon, Tv } from "lucide-react";
import image from "../../../public/chambre.jpeg";
import { Building, Wifi, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-select";
import { useSelector } from "react-redux";
function ChambreDetaillReserveForm() {
  const chmabreChoix = useSelector((state) => state.Chambre.chambreReserver);
  const filtragesDonner = useSelector((state) => state.Chambre.filters);


  const FormatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()} / ${d.getMonth() + 1} / ${d.getDate()}`;
  };
  return (
    <div className="relative">
      <div className="sticky top-10 z-10 grid gap-6 grid-cols-1">
        <div className="overflow-hidden bg-white flex flex-col relative group rounded-2xl shadow-md">
          <div className="z-50 rounded-full bg-white/90 backdrop-blur-sm px-3  text-blue-500 py-1 text-sm font-medium absolute top-2 right-3">
            {chmabreChoix.tarif_chambre_detail.single}$ / nuit
          </div>
          <div className="z-50 rounded-full bg-blue-500  px-3 text-white text-sm  bottom-67  sm:bottom-57  absolute lg:bottom-66 left-3">
            suite
          </div>
          <div className=" z-50 flex flex-col gap-0 mb-0 text-white   absolute  bottom-52   sm:bottom-42 lg:bottom-52 left-3">
            <p className="mb-0  text-lg">
              {chmabreChoix.type_chambre.type_chambre}
            </p>
            <p className="mb-0  text-lg  flex items-center">
              {" "}
              <Building className="h-4 w-4 mr-1" />
              {chmabreChoix.type_chambre.nom}
            </p>
          </div>
          <div className="relative h-48">
            <img
              src={image}
              className="bg-white  h-48 mb-3  w-full object-cover duration-200 rounded-t-xl"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="flex bg-white mt-3  flex-wrap  gap-x-4.5  gap-y-3 items-center px-3  pb-3 ">
            {chmabreChoix.wifi === "oui" ? (
              <Badge className="z-50 capitalize  flex rounded-full bg-blue-100 text-blue-500  badeg-blue    px-2   text-blue text-sm   ">
                <Wifi size={18} /> wifi
              </Badge>
            ) : null}
            <Badge className="z-50 capitalize  flex rounded-full bg-blue-100 text-blue-500  badeg-blue    px-2   text-blue text-sm   ">
              <Tv size={18} /> Tv
            </Badge>
            <Badge className="z-50 capitalize  flex rounded-full bg-blue-100 text-blue-500  badeg-blue    px-2   text-blue text-sm   ">
              <CoffeeIcon size={18} /> coffee
            </Badge>
            {chmabreChoix.nb_salle >=1 ? (
              <Badge className="z-50 capitalize  flex rounded-full bg-blue-100 text-blue-500  badeg-blue    px-2   text-blue text-sm   ">
                <BathIcon size={18} /> bath
              </Badge>
            ) : null}
            {chmabreChoix.climat === "oui" ? (
              <Badge className="z-50 capitalize  flex rounded-full bg-blue-100 text-blue-500  badeg-blue    px-2   text-blue text-sm   ">
                <Wind size={18} /> Ac
              </Badge>
            ) : null}
            
          </div>

          <div className="grid grid-cols-2 gap-y-2 px-4 text-sm mb-4 bg-white">
            <div className="font-medium text-muted-foreground">Capacité:</div>
            <div className="font-semibold">{chmabreChoix.type_chambre.capacite}  Personne</div>

            <div className="font-medium text-muted-foreground">Lits:</div>
            <div className="font-semibold">{chmabreChoix.nb_lit} lits</div>

            <div className="font-medium text-muted-foreground">Superficie:</div>
            <div className="font-semibold">34 m²</div>
          </div>
        </div>
        <div className=" shadow-md  bg-ticket rounded-lg border border-primary/20 py-2 ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Récapitulatif du prix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="    ">date dèbut</span>
              <span className=" text-gray-700 text-sm">{FormatDate(filtragesDonner.date.from)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="">date fin:</span>
              <span className=" text-sm  text-gray-700">{FormatDate(filtragesDonner.date.to)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center border-t-gray-500 border-1   pt-2">
              <span className="font-medium text-lg">Prix total:</span>
              <span className=" text-lg font-semibold text-primary">214 €</span>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}

export default ChambreDetaillReserveForm;
