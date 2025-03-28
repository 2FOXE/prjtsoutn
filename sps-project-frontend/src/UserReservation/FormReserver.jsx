import { CheckCircle, Mail, Phone, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import { StoreDemandeReservation } from "@/redux/actions/DemandeReserAction";


function FormReserver({ onClose }) {
  const chmabreChoix = useSelector((state) => state.Chambre.chambreReserver);
  const fitragesDonner = useSelector((state) => state.Chambre.filters);
  const dispatch=useDispatch();

  const [dataForm, setDataForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    chambre_id: "",
    date_reservation: "",
    date_debut: "",
    date_fin: "",
    duree: 0,
    nombre_personnes: 0,
    status: "en attende",
    montant_total: 0,
  });
  const [dataFormErrors, setDataFormErrors] = useState({
    prenom: false,
    nom: false,
    email: false,
    telephone: false,
  });

  const [ValideSucces, setValideSucces] = useState(false);

  // fonction de validation
  function validationForm() {
    let isValid = true;

    setDataFormErrors({
      prenom: false,
      nom: false,
      email: false,
      telephone: false,
    });
    setValideSucces(false);
    if (dataForm.prenom.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, prenom: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (dataForm.nom.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, nom: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (dataForm.email.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, email: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (dataForm.telephone.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, telephone: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (!isValid) {
      setValideSucces(true);
    }

    return !isValid;
  }

  // pour calculer montant total
  const handelUpdatePrice = (tarif) => {
    if (fitragesDonner.guests === 1) {
      return tarif.single;
    }
    if (fitragesDonner.guests === 2) {
      return tarif.double;
    }
    if (fitragesDonner.guests === 3) {
      return tarif.triple;
    }

    return tarif.single;
  };


  const FormatData=(date)=>{
    const d=new Date(date)
    return  `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

  }

  // fonction confirmer la reservation
  const handelSubmit = (e) => {
    
    e.preventDefault();

    const hasErrors = validationForm();
    if (hasErrors) {
     
        
      return;
    }
    const diffTime = Math.abs(
      fitragesDonner.date.to - fitragesDonner.date.from
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const prixTotal = handelUpdatePrice(chmabreChoix.tarif_chambre_detail);
    setDataForm((prev) => ({
      ...prev,
      chambre_id: chmabreChoix.id,
      date_reservation:FormatData(new Date()),
      date_debut:FormatData(fitragesDonner.date.from),
      date_fin:FormatData(fitragesDonner.date.to),
      duree: diffDays,
      nombre_personnes: fitragesDonner.guests,
      montant_total: prixTotal * diffDays,
    }));
    
  };

  useEffect(() => {
    if (dataForm.chambre_id) {
      dispatch(StoreDemandeReservation(dataForm));
      onClose()
    }
  }, [dataForm]);
  useEffect(() => {
    console.log(dataForm);
  }, [dataForm]);

  const handelChange = (key, value) => {
    setDataForm((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <div className="modal-overlay ">
      <div className="modal-content  bg-white  flex flex-col gap-3 rounded-xl raduis-button  shadow-2xl p-3 ">
        <div>
          <div id="flex" className="flex justify-between items-center ">
            <p className="text-2xl mb-0 font-medium">reserver une chambre </p>
            <X onClick={onClose} className="cursor-pointer" />
          </div>

          <p className="text-gray-500 text-sm mb-0">
            Chambre Double Supérieure • 120 € / nuit
          </p>

          <form onSubmit={handelSubmit} className="mt-6">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2 ">
                <div className="flex gap-1.5 items-center">
                  <User
                    size={18}
                    className={`${
                      dataFormErrors.prenom ? "animate-zigzag" : ""
                    }`}
                  />
                  <span
                    className={` ${
                      dataFormErrors.prenom ? "!text-red-500" : ""
                    } capitalize text-sm`}
                  >
                    prénom
                  </span>
                </div>
                <Input
                  className={`${
                    dataFormErrors.prenom
                      ? "!border-red-500  focus-visible:ring-0 focus-visible:border-none"
                      : ""
                  }   duration-300 transition-all px-2.5 capitalize`}
                  type="text"
                  placeholder="votre prènom "
                  value={dataForm.prenom}
                  onChange={(e) => {
                    handelChange("prenom", e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <div className="flex gap-1.5 items-center">
                  <User
                    size={18}
                    className={`${dataFormErrors.nom ? "animate-zigzag" : ""}`}
                  />
                  <span
                    className={` ${
                      dataFormErrors.nom
                        ? "!text-red-500  focus-visible:ring-0 focus-visible:border-none"
                        : ""
                    } capitalize text-sm`}
                  >
                    nom
                  </span>
                </div>
                <Input
                  className={`${
                    dataFormErrors.nom
                      ? "!border-red-500   focus-visible:ring-0 focus-visible:border-none"
                      : ""
                  }   duration-300 transition-all px-2.5 capitalize`}
                  type="text"
                  placeholder="votre nom"
                  value={dataForm.nom}
                  onChange={(e) => {
                    handelChange("nom", e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <div className="flex gap-1.5 items-center">
                  <Mail
                    size={18}
                    className={`${
                      dataFormErrors.email ? "animate-zigzag" : ""
                    }`}
                  />
                  <span
                    className={` ${
                      dataFormErrors.email ? "!text-red-500" : ""
                    } capitalize text-sm`}
                  >
                    email
                  </span>
                </div>
                <Input
                  className={`${
                    dataFormErrors.email
                      ? "!border-red-500  focus-visible:ring-0 focus-visible:border-none"
                      : ""
                  }   duration-300 transition-all px-2.5 capitalize`}
                  type="email"
                  placeholder="Votre email "
                  value={dataForm.email}
                  onChange={(e) => {
                    handelChange("email", e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <div className="flex gap-1.5 items-center">
                  <Phone
                    size={18}
                    className={`${
                      dataFormErrors.telephone ? "animate-zigzag" : ""
                    }`}
                  />
                  <span
                    className={` ${
                      dataFormErrors.telephone ? "!text-red-500" : ""
                    } capitalize text-sm`}
                  >
                    téléphone
                  </span>
                </div>
                <Input
                  className={`${
                    dataFormErrors.telephone
                      ? "!border-red-500 focus-visible:ring-0 focus-visible:border-none"
                      : ""
                  }   duration-300 transition-all px-2.5 capitalize`}
                  type="number"
                  placeholder="votre téléphone"
                  value={dataForm.telephone}
                  onChange={(e) => {
                    handelChange("telephone", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-900 " />
                Récapitulatif de votre réservation
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Chambre:</div>
                <div className="font-medium">Chambre Double Supérieure</div>

                <div>Prix par nuit:</div>
                <div className="font-medium">345 €</div>

                <div>Durée du séjour:</div>
                <div className="font-medium">1nuits</div>

                <div>Prix total:</div>
                <div className="font-medium text-green-900 ">128 €</div>
              </div>
            </div>
            <div className="w-full  flex items-center justify-end gap-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="raduis-button raduis-button-hovered-gray      text-gray-950 bg-gray-200 hover:bg-gray-400 hover:text-white duration-300 capitalize my-3  "
              >
                annuler
              </Button>
              <Button
                type="submit"
                className="raduis-button   raduis-button-hovered  duration-300 capitalize  my-3   "
              >
                confirmer Reserver
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormReserver;
