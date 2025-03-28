import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin, Phone, Star } from 'lucide-react'
import React from 'react'

function HeroSection() {
  return (
    <Card className=" bg-image border-0 shadow-xl">
        <div className="">
          <div className=" flex mt-8 py-4 px-4 flex-col justify-center md:px-8 lg:px-14">
            <div className="">
              <Badge className="mb-2 bg-blue-800 cursor-pointer hover:bg-gray-900   text-white  border-0 px-3 py-1 text-sm">
                <Star className="h-3.5 w-3.5 mr-1" /> Hôtel 5 étoiles
              </Badge>
              <h1 className="text-2xl md:text-5xl lg:text-4xl font-bold mb-1 text-white leading-tight">
                Luxe et Élégance pour votre Séjour
              </h1>
              <p className="text-lg md:text-xl mb-4 text-white/90 max-w-xl">
                Découvrez notre sélection de chambres et suites luxueuses pour
                un séjour inoubliable au cœur de la ville.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600  text-white raduis-button hover:bg-blue-400 duration-300 "
                >
                  Réserver maintenant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-gray-950  bg-white border-white  raduis-button hover:bg-gray-300"
                >
                  Découvrir l'hôtel
                </Button>
              </div>

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
  )
}

export default HeroSection
