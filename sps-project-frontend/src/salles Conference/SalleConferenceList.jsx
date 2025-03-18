"use client"

import React, { useState, useEffect } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useOpen } from "@/Acceuil/OpenProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import  hero_image from "../../public/banner_hero.jpg"



// import { Button } from "@/components/ui/button"

const SalleConferenceList = () => {
  const { open } = useOpen();
    const { dynamicStyles } = useOpen();
    const [date, setDate] = useState(new Date())  // Pas besoin de spécifier "Date | undefined", on initialise avec la date actuelle




  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles}}>
        <Box component="main" sx={{   mt:5,  }}>

         {/* <Button variant="default">Destructive</Button> */}
         <div className="mb-8">
        {/* Composant Card pour le conteneur principal */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="">
            {/* Image d'arrière-plan avec Next.js Image */}
            <div className=" w-full">
              <img
                src={hero_image}
                alt="Luxury hotel"
                fill
                className="object-cover brightness-[0.85] max-h-90 w-full"
                priority
              />
              {/* Overlay gradient */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div> */}
            </div>

            {/* Contenu du héros */}
            <div className="absolute inset-0 flex flex-col justify-center md:px-8 lg:px-14">
              <div className="">
                {/* Badge pour mise en avant */}
                <Badge className="mb-2 bg-gray-800 cursor-pointer hover:bg-gray-900   text-white  border-0 px-3 py-1 text-sm">
                  <Star className="h-3.5 w-3.5 mr-1" /> Hôtel 5 étoiles
                </Badge>

                {/* Titre et sous-titre */}
                <h1 className="text-2xl md:text-5xl lg:text-4xl font-bold mb-1 text-white leading-tight">
                  Luxe et Élégance 
                  pour votre Séjour
                </h1>
                <p className="text-lg md:text-xl mb-4 text-white/90 max-w-xl">
                  Découvrez notre sélection de chambres et suites luxueuses pour un séjour inoubliable au cœur de la
                  ville.
                </p>

                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gray-950  text-white raduis-button hover:bg-gray-600 duration-300 ">
                    Réserver maintenant
                  </Button>
                  <Button size="lg" variant="outline" className="text-white  bg-gray-400 border-white  raduis-button hover:bg-gray-300">
                    Découvrir l'hôtel
                  </Button>
                </div>

                {/* Informations complémentaires */}
                <div className="mt-8 flex flex-col md:flex-row gap-6 text-white">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <span>10 Avenue des Champs-Élysées, Paris</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    <span>4.9/5 (230 avis)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
         


        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SalleConferenceList;