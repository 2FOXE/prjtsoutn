import "./App.css";
import { AuthProvider } from "./AuthContext";
import Navigation from "./Acceuil/Navigation";
import { Fragment, Suspense, lazy } from "react";
import { OpenProvider } from "./Acceuil/OpenProvider.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import { ClientsAndGroups } from "./Client/ClientGrp";
import { CircularProgress } from "@mui/material";
// Correction de l'importation de Affichertt
import Affichertt from './theatre/Affichertheatre';
import AfficherReservations from './theatre/resrvationsevenments'
// Lazy-loaded components
const Login = lazy(() => import("./Login/Login"));
const Dashboard = lazy(() => import("./Acceuil/Dashboard"));
const ClientList = lazy(() => import("./Client/ClientList"));
const ClientParticulierr = lazy(() => import("./Client/ClientParticulierr"));
const TarifsActuel = lazy(() => import("./Tarifs/TarifsActuel"));
const TarifChambre = lazy(() => import("./Tarifs/TarifChambre"));
const TarifRepas = lazy(() => import("./Tarifs/TarifRepas"));
const TarifReduction = lazy(() => import("./Tarifs/TarifReduction"));
const Chambre = lazy(() => import("./Chambre/Chambre"));
const ChambresDisponibles = lazy(() =>
  import("./Chambre/ChambresDisponibles.jsx")
);
const ReclamationPage = lazy(() => import("./reclamation/ReclamationPage"));
const EtatChambre = lazy(() => import("./Chambre/etatChambre"));
const Reservation = lazy(() => import("./Reservation/Reservation"));
const ReserveBooking = lazy(() =>
  import("./reservation_client/ReserveBooking.jsx")
);
const Test = lazy(() => import("./UserReservation/ChambreList"));
const BookingApp = lazy(() => import("./BookingApp"));
const Salles_conference=lazy(()=>import('./saaledeconference/salledeconf'))
const Salledetheattre = lazy(() => import('./theatre/Affichertheatre'));
const Reservation_evenement=lazy(()=>import('./theatre/resrvationsevenments'))

const App = () => {
  const location = useLocation();
  const isAdminRoute =
    !location.pathname.startsWith("/user") && location.pathname !== "/login";

  function GradientCircularProgress() {
    return (
      <Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </Fragment>
    );
  }

  return (
    <AuthProvider>
      <OpenProvider>
        {isAdminRoute && <Navigation />}

        <Suspense
          fallback={
            <div className="modal-overlay-loaders ">
              <GradientCircularProgress />
            </div>
          }
        >
          <Routes>
            <Route path="/salleconference" element={<Salles_conference/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients_societe" element={<ClientList />} />
            <Route
              path="/clients_particulier"
              element={<ClientParticulierr />}
            />
            <Route path="/reservertheatre" element={<Reservation_evenement/>}/>
            <Route path="/ClientGrp" element={<ClientsAndGroups />} />
            <Route path="/chambres" element={<Chambre />} />
            <Route path="/tarifs_actuel" element={<TarifsActuel />} />
            <Route path="/tarifs_chambre" element={<TarifChambre />} />
            <Route path="/tarifs_repas" element={<TarifRepas />} />
            <Route path="/tarifs_reduction" element={<TarifReduction />} />
            <Route path="/reclamations" element={<ReclamationPage />} />
            <Route path="/theatrelist" element={<Affichertt />} /> {/* Routage vers Affichertt */}
            <Route path="/chambres-disponibles" element={<ChambresDisponibles />} />
            <Route path="/etat-chambre" element={<EtatChambre />} />
            <Route path="/reservations" element={<Reservation />} />
            <Route path="/reserver_booking" element={<ReserveBooking />} />
            <Route path='/theatrelist' element={<Salledetheattre/>}/>

            <Route path="/user/*" element={<BookingApp />} />
          </Routes>
        </Suspense>
      </OpenProvider>
    </AuthProvider>
  );
};

export default App;
