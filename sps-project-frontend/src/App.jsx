import './App.css';
import { AuthProvider } from './AuthContext';
import Navigation from './Acceuil/Navigation';
import { Suspense, lazy } from 'react';
import { OpenProvider } from './Acceuil/OpenProvider.jsx';
const Login = lazy(() => import('./Login/Login'));
const Dashboard = lazy(() => import('./Acceuil/Dashboard'));
const ClientList = lazy(() => import('./Client/ClientList'));
const ClientParticulierr = lazy(() => import('./Client/ClientParticulierr'));
const TarifsActuel = lazy(() => import('./Tarifs/TarifsActuel'));
const TarifChambre = lazy(() => import('./Tarifs/TarifChambre'));
const TarifRepas = lazy(() => import('./Tarifs/TarifRepas'));
const TarifReduction = lazy(() => import('./Tarifs/TarifReduction'));
const Chambre = lazy(() => import('./Chambre/Chambre'));

// const AgentList = lazy(() => import('./Agents/AgentList'));

import { Routes, Route, useLocation } from 'react-router-dom';


const App = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== '/login';
  return (
    <AuthProvider>
      <OpenProvider>
      {showNavigation && <Navigation />}
      <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients_societe" element={<ClientList />} />
        <Route path="/clients_particulier" element={<ClientParticulierr />} />
        <Route path="/chambres" element={<Chambre />} />
        <Route path="/tarifs_actuel" element={<TarifsActuel />} />
        <Route path="/tarifs_chambre" element={<TarifChambre />} />
        <Route path="/tarifs_repas" element={<TarifRepas />} />
        <Route path="/tarifs_reduction" element={<TarifReduction />} />
     
      </Routes>
      </Suspense>
      </OpenProvider>
    </AuthProvider>
  );
};

export default App;
