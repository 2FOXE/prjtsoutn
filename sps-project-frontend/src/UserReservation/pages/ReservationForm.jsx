import React from "react";
import {
  ArrowLeft,
  CheckSquare,
  CreditCard,
  Home,
  Info,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Square,
  User,
} from "lucide-react";
import { Toaster } from "sonner";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import ChambreDetaillReserveForm from "./ChambreDetaillReserveForm";
import handleErrorTest from "./Toast/ErrorToast";
import { FetchRegion } from "@/redux/actions/RegionAtion";
import handleToastAccept from "./Toast/HandelToastAccept";
import { FetchPaimant } from "@/redux/actions/PaimantAction";
import {  StoreDemandeReservation } from "@/redux/actions/DemandeReserAction";

function ReservationForm() {
  const RegionsVilles = useSelector(
    (state) => state.RegionVille.RegionVilleList
  );
  const PaimantList = useSelector((state) => state.Paimant.PaimentList);
  const chmabreChoix = useSelector((state) => state.Chambre.chambreReserver);
  const filtragesDonner = useSelector((state) => state.Chambre.filters);
  const dispatch = useDispatch();
  const Navigate=useNavigate();

  const [reservation, setReservation] = useState({       
    termsAccepted: false,
    // ... autres champs de réservation si nécessaire
  });
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
    region_id: "",
    ville_id: "",
    adresse: "",
    paimant_id: "",
    code_postal: "",
    demandes_speciales: "",
  });
  const [dataFormErrors, setDataFormErrors] = useState({
    prenom: false,
    nom: false,
    email: false,
    telephone: false,
    region_id: false,
    ville_id: false,
    adresse: false,
    paimant_id: false,
    code_postal: false,
    demandes_speciales: false,
  });

  const [ValideSucces, setValideSucces] = useState(false);
  const [regions, setRegions] = useState([]);
  const [ville, setVille] = useState([]);

  // fonction de validation
  function validationForm() {
    let isValid = true;

    setDataFormErrors({
      prenom: false,
      nom: false,
      email: false,
      telephone: false,
      adresse: false,
      region_id: false,
      ville_id: false,
      paimant_id: false,
      code_postal: false,
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
    if (dataForm.adresse.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, adresse: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (dataForm.region_id.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, region_id: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (dataForm.ville_id.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, ville_id: true }));
      setValideSucces(true);
      isValid = false;
    }

    if (dataForm.paimant_id === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, paimant_id: true }));
      setValideSucces(true);
      isValid = false;
    }
    if (dataForm.code_postal.trim() === "") {
      setDataFormErrors((prevValue) => ({ ...prevValue, code_postal: true }));
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
    if (filtragesDonner.guests === 1) {
      return tarif.single;
    }
    if (filtragesDonner.guests === 2) {
      return tarif.double;
    }
    if (filtragesDonner.guests === 3) {
      return tarif.triple;
    }

    return tarif.single;
  };

  const FormatData = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  // fonction confirmer la reservation
  const handelSubmit = (e) => {
    e.preventDefault();

    const hasErrors = validationForm();
    if (hasErrors) {
      handleErrorTest();
      return;
    }
    if (reservation.termsAccepted === false) {
      handleToastAccept();
      return;
    }

    const diffTime = Math.abs(
      filtragesDonner.date.to - filtragesDonner.date.from
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const prixTotal = handelUpdatePrice(chmabreChoix.tarif_chambre_detail);
    setDataForm((prev) => ({
      ...prev,
      chambre_id: chmabreChoix.id,
      date_reservation: FormatData(new Date()),
      date_debut: FormatData(filtragesDonner.date.from),
      date_fin: FormatData(filtragesDonner.date.to),
      duree: diffDays,
      nombre_personnes: filtragesDonner.guests,
      montant_total: prixTotal * diffDays,
      ville_id: dataForm.ville_id,
      region_id: dataForm.region_id,
      adresse: dataForm.adresse,
      paimant_id: dataForm.paimant_id,
      code_postal: dataForm.code_postal,
      demandes_speciales: dataForm.demandes_speciales,
    }));
  };

  useEffect(() => {
    if (dataForm.chambre_id) {
      dispatch(StoreDemandeReservation(dataForm));
      Navigate('/user')
    }
  }, [dataForm]);

  useEffect(() => {
    dispatch(FetchRegion());
    dispatch(FetchPaimant());
  }, [dispatch]);

  useEffect(() => {
    setRegions(RegionsVilles);
    const NewVille = regions.find(
      (ele) => ele.id === Number(dataForm.region_id)
    );
    setVille(NewVille ? NewVille.ville : []);
  }, [RegionsVilles, dataForm.region_id]);

  const handelChange = (key, value) => {
    setDataForm((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };
  return (
    <div>
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
          },
        }}
      />
      <div className="mb-20 px-3">
        <div>
          <Link to="/user">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-2  raduis-button hover:bg-blue-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
          </Link>
          <h1 className="text-2xl">Réservation</h1>
          <p className="text-gray-500 text-sm ">
            Complétez le formulaire ci-dessous pour réserver votre chambre
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChambreDetaillReserveForm />

          <div className="col-span-2 shadow-md rounded-lg p-3 border  flex flex-col gap-2 border-gray-900">
            <p className="text-2xl mb-0  font-semibold">
              Formulaire de réservation
            </p>
            <p className="text-gray-400 text-sm  flex items-center gap-2 mb-0  ">
              <Info size={16} />
              Les champs marqués d'un astérisque (*) sont obligatoires
            </p>

            <form onSubmit={handelSubmit} className="">
              <div className="flex flex-col  gap-5 ">
                <div>
                  <p className="text-lg font-semibold   mt-3 pb-2 border-b border-gray-300">
                    1. Informations personnelles
                  </p>
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
                          prénom <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <Input
                        className={`${
                          dataFormErrors.prenom
                            ? "!border-red-500  focus-visible:ring-0 focus-visible:border-none"
                            : ""
                        }   duration-300 transition-all px-2.5 capitalize `}
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
                          className={`${
                            dataFormErrors.nom ? "animate-zigzag" : ""
                          }`}
                        />
                        <span
                          className={` ${
                            dataFormErrors.nom
                              ? "!text-red-500  focus-visible:ring-0 focus-visible:border-none"
                              : ""
                          } capitalize text-sm`}
                        >
                          nom <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <Input
                        className={`${
                          dataFormErrors.nom
                            ? "!border-red-500   focus-visible:ring-0 focus-visible:border-none"
                            : ""
                        }   duration-300 transition-all px-2.5 capitalize `}
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
                          email <span className="text-red-700">*</span>
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
                          téléphone <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <Input
                        className={`${
                          dataFormErrors.telephone
                            ? "!border-red-500 focus-visible:ring-0 focus-visible:border-none"
                            : ""
                        }   duration-300 transition-all px-2.5 capitalize`}
                        type="number"
                        placeholder="06 a5 45 67 45"
                        value={dataForm.telephone}
                        onChange={(e) => {
                          handelChange("telephone", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/*  adresse block */}
                <div>
                  <p className="text-lg font-semibold   mt-3 pb-2 border-b border-gray-300">
                    2. Adresse
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2 ">
                      <div className="flex gap-1.5 items-center">
                        <Home
                          size={18}
                          className={`${
                            dataFormErrors.adresse ? "animate-zigzag" : ""
                          }`}
                        />
                        <span
                          className={` ${
                            dataFormErrors.adresse ? "!text-red-500" : ""
                          } capitalize text-sm`}
                        >
                          Addresse <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <Input
                        className={`${
                          dataFormErrors.adresse
                            ? "!border-red-500  focus-visible:ring-0 focus-visible:border-none"
                            : ""
                        }   duration-300 transition-all px-2.5 capitalize `}
                        type="text"
                        placeholder="votre prènom "
                        value={dataForm.adresse}
                        onChange={(e) => {
                          handelChange("adresse", e.target.value);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1  gap-4 md:gap-7  md:grid-cols-2 w-full">
                      <div className="flex flex-col gap-2 ">
                        <div className="flex gap-1.5 items-center">
                          <MapPinned
                            size={18}
                            className={`${
                              dataFormErrors.region_id ? "animate-zigzag" : ""
                            }`}
                          />
                          <span
                            className={` ${
                              dataFormErrors.region_id
                                ? "!text-red-500  focus-visible:ring-0 focus-visible:border-none"
                                : ""
                            } capitalize text-sm`}
                          >
                            Region<span className="text-red-700">*</span>
                          </span>
                        </div>

                        <div className="relative">
                          <select
                            className="select-region text-sm w-full px-4 py-2 text-gray-900 border bg-gray-100 border-none rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-300"
                            value={dataForm.region_id}
                            onChange={(e) => {
                              handelChange("region_id", e.target.value);
                            }}
                          >
                            <option className="bg-gray-200" value="" disabled>
                              Select region
                            </option>
                            {regions
                              ? regions.map((ele, index) => {
                                  return (
                                    <option
                                      key={ele.id}
                                      value={ele.id}
                                      className="text-gray-800 bg-gray-200"
                                    >
                                      {ele.region}
                                    </option>
                                  );
                                })
                              : " "}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <div className="flex gap-1.5 items-center">
                          <MapPin
                            size={18}
                            className={`${
                              dataFormErrors.ville_id ? "animate-zigzag" : ""
                            }`}
                          />
                          <span
                            className={` ${
                              dataFormErrors.ville_id ? "!text-red-500" : ""
                            } capitalize text-sm`}
                          >
                            Ville <span className="text-red-700">*</span>
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            className="select-region text-sm w-full px-4 py-2 text-gray-900 border bg-gray-100 border-none rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-300"
                            value={dataForm.ville_id}
                            onChange={(e) => {
                              handelChange("ville_id", e.target.value);
                            }}
                            disabled={ville.length === 0}
                          >
                            <option className="bg-gray-200" value="" disabled>
                              Select ville
                            </option>
                            {ville
                              ? ville.map((ele, index) => {
                                  return (
                                    <option
                                      key={ele.id}
                                      value={ele.id}
                                      className="text-gray-800 bg-gray-200"
                                    >
                                      {ele.ville}
                                    </option>
                                  );
                                })
                              : " "}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <div className="flex gap-1.5 items-center">
                        <MapPin
                          size={18}
                          className={`${
                            dataFormErrors.code_postal ? "animate-zigzag" : ""
                          }`}
                        />
                        <span
                          className={` ${
                            dataFormErrors.code_postal ? "!text-red-500" : ""
                          } capitalize text-sm`}
                        >
                          Code Postal <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <Input
                        className={`${
                          dataFormErrors.code_postal
                            ? "!border-red-500 focus-visible:ring-0 focus-visible:border-none"
                            : ""
                        }   duration-300 transition-all px-2.5 capitalize`}
                        type="number"
                        placeholder="votre téléphone"
                        value={dataForm.code_postal}
                        onChange={(e) => {
                          handelChange("code_postal", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/*  paiment  block */}
                <div>
                  <p className="text-lg font-semibold   mt-3 pb-2 border-b border-gray-300">
                    3. Paiement et confirmation
                  </p>
                  <div className="grid grid-cols-1 gap-6.5">
                    <div className="flex flex-col gap-2 ">
                      <div className="flex gap-1.5 items-center">
                        <User
                          size={18}
                          className={`${
                            dataFormErrors.paimant_id ? "animate-zigzag" : ""
                          }`}
                        />
                        <span
                          className={` ${
                            dataFormErrors.paimant_id ? "!text-red-500" : ""
                          } capitalize text-sm`}
                        >
                          Mode de paiement
                          <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {/** Option 1: Carte de crédit */}
                        {PaimantList
                          ? PaimantList.map((ele) => {
                              return (
                                <div  key={ele.id} className="flex items-center     gap-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="payment"
                                    value={ele.id}
                                    checked={dataForm.paimant_id === Number(ele.id)}
                                    onChange={(e) => {
                                      handelChange(
                                        "paimant_id",
                                        Number(e.target.value)
                                      );
                                    }}
                                    className="w-4 h-4 border-blue-500     text-blue-600 focus:ring-blue-500"
                                  />
                                  <CreditCard size={18} />{" "}
                                  <span className="text-sm  ">
                                    {ele.mode_paimants}
                                  </span>
                                </div>
                              );
                            })
                          : ""}
                        
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <div className="flex gap-1.5 items-center">
                        <User
                          size={18}
                          className={`${
                            dataFormErrors.demandes_speciales
                              ? "animate-zigzag"
                              : ""
                          }`}
                        />
                        <span
                          className={` ${
                            dataFormErrors.demandes_speciales
                              ? "!text-red-500  focus-visible:ring-0 focus-visible:border-none"
                              : ""
                          } capitalize text-sm`}
                        >
                          demandes speciales{" "}
                          <span className="text-red-700">*</span>
                        </span>
                      </div>
                      <Textarea
                        id="specialRequests"
                        placeholder="Avez-vous des demandes particulières pour votre séjour ?"
                        className="resize-none"
                        rows={6}
                        value={dataForm.demandes_speciales}
                        onChange={(e) => {
                          handelChange("demandes_speciales", e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <div className="flex gap-3  ">
                        <div className="mt-1">
                          {reservation.termsAccepted ? (
                            <CheckSquare
                              className="h-5 w-5 text-primary cursor-pointer"
                              onClick={() =>
                                setReservation({
                                  ...reservation,
                                  termsAccepted: false,
                                })
                              }
                            />
                          ) : (
                            <Square
                              className="h-5 w-5 text-muted-foreground cursor-pointer"
                              onClick={() =>
                                setReservation({
                                  ...reservation,
                                  termsAccepted: true,
                                })
                              }
                            />
                          )}
                        </div>
                        <div className="text-sm">
                          <p className="required  mb-0">
                            J'accepte les conditions générales de vente et la
                            politique de confidentialité
                          </p>
                          <p className="text-muted-foreground mt-1">
                            En confirmant cette réservation, vous acceptez nos
                            conditions générales et notre politique
                            d'annulation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <TicketPrix name={chmabreChoix.type_chambre.nom}  prixNuit={chmabreChoix.tarif_chambre_detail.single}  duree={Math.ceil(Math.abs(filtragesDonner.date.to - filtragesDonner.date.from) / (1000 * 60 * 60 * 24))}  montant_total={Math.ceil(Math.abs(filtragesDonner.date.to - filtragesDonner.date.from) / (1000 * 60 * 60 * 24)) * handelUpdatePrice(chmabreChoix.tarif_chambre_detail)}/> */}
              <div className="w-full  flex items-center justify-end gap-4">
                <Button
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
    </div>
  );
}

export default ReservationForm;
