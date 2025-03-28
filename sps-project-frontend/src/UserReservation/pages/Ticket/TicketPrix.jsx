import { CheckCircle } from 'lucide-react'
import React from 'react'

function TicketPrix({name,prixNuit,duree,montant_total}) {
  return (
    <div className="mt-4 p-4 bg-ticket rounded-lg border ">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-900 " />
                  Récapitulatif de votre réservation
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Chambre:</div>
                  <div className="font-medium">{name}</div>

                  <div>Prix par nuit:</div>
                  <div className="font-medium">{prixNuit} €</div>

                  <div>Durée du séjour:</div>
                  <div className="font-medium">{duree} nuits</div>

                  <div>Prix total:</div>
                  <div className="font-medium   text-blue-900 ">{montant_total} €</div>
                </div>
              </div>
  )
}

export default TicketPrix
