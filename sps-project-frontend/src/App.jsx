// App.jsx
import './App.css';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { OpenProvider } from './Acceuil/OpenProvider.jsx';
import Navigation from './Acceuil/Navigation';
import { ClientsAndGroups } from './Client/clientgrp.jsx'; // Adjust the path based on your file structure




const Login = lazy(() => import('./Login/Login'));
const Dashboard = lazy(() => import('./Acceuil/Dashboard'));
const ClientList = lazy(() => import('./Client/ClientList'));
const ClientParticulierr = lazy(() => import('./Client/ClientParticulierr'));
const TarifsActuel = lazy(() => import('./Tarifs/TarifsActuel'));
const TarifChambre = lazy(() => import('./Tarifs/TarifChambre'));
const TarifRepas = lazy(() => import('./Tarifs/TarifRepas'));
const TarifReduction = lazy(() => import('./Tarifs/TarifReduction'));
const Chambre = lazy(() => import('./Chambre/Chambre'));
const ChambresDisponibles = lazy(() => import('./Chambre/ChambresDisponibles'));
const ReclamationPage = lazy(() => import('./reclamation/ReclamationPage'));



const App = () => {
  return (
    <AuthProvider>
      <OpenProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients_societe" element={<ClientList />} />
            <Route path="/clients_particulier" element={<ClientParticulierr />} />
            <Route path="/clientgrp" element={<ClientsAndGroups />} />
            <Route path="/chambres" element={<Chambre />} />
            <Route path="/tarifs_actuel" element={<TarifsActuel />} />
            <Route path="/tarifs_chambre" element={<TarifChambre />} />
            <Route path="/tarifs_repas" element={<TarifRepas />} />
            <Route path="/tarifs_reduction" element={<TarifReduction />} />
            <Route path="/reclamations" element={<ReclamationPage />} />
            <Route path="/chambres-disponibles" element={<ChambresDisponibles />} />
          </Routes>
        </Suspense>
      </OpenProvider>
    </AuthProvider>
  );
};

export default App;
