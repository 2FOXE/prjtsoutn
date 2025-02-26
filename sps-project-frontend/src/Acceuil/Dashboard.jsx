import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BarChartIcon from "@mui/icons-material/BarChart";
import Navigation from "./Navigation";
import { Toolbar } from "@mui/material";
import Alert from 'react-bootstrap/Alert';
import { useOpen } from "../Acceuil/OpenProvider"; // Importer le hook personnalisé


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [objectifs, setObjectifs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          withCredentials: true,
        });
        setUser(response.data);
        const permissionsData = response.data[0].roles[0].permissions;
        const permissionNames = permissionsData.map(
          (permission) => permission.name
        );
        setPermissions(permissionNames);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchCounts = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/DachbordeData");

        setClients(response.data.clients);
        setProduits(response.data.produits);
        setFournisseurs(response.data.fournisseurs);
        setCommandes(response.data.commandes);
        setLivreurs(response.data.livreurs);
        setVehicules(response.data.vehicules);
        setObjectifs(response.data.objectifs);
    } catch (error) {
        console.error("Error fetching counts:", error);
    }
};
const [latestPreparation, setLatestPreparation] = useState(null);
  const [latestCommande, setLatestCommande] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch latest preparation and commande
  const fetchLatestData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/FicheDactulate");
      setLatestPreparation(response.data.latest_preparation);
      setLatestCommande(response.data.latest_commande);
      console.log('setLatestPreparation',response.data.latest_preparation,response.data.latest_commande)
    } catch (error) {
      setError("Error fetching latest data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLatestData(); // Call the fetch function on component mount
  }, []);

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles  }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {permissions.includes("view_all_clients") && (
                  <Grid item xs={12 } sm={6} md={4}>
                    <Card  style={{backgroundColor:'#ff8a80'}}>
                      <CardContent>
                        <Typography variant="h6" className="nombre" component="div">
                          Nombre de clients
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {clients}
                        </Typography>
                        <PeopleAltIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {permissions.includes("view_all_products") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card style={{backgroundColor:'#ce93d8'}}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Nombre de produits
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {produits}
                        </Typography>
                        <ShoppingCartIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {permissions.includes("view_all_fournisseurs") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card  style={{backgroundColor:'#80deea'}}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Nombre des fournisseurs
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {fournisseurs}
                        </Typography>
                        <LocalShippingIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {permissions.includes("view_all_livreurs") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card style={{backgroundColor:'#a5d6a7'}}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Nombre de livreurs
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {livreurs}
                        </Typography>
                        <DeliveryDiningIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {permissions.includes("view_all_commandes") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card style={{backgroundColor:'#ffcc80'}}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Nombre de Commandes
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {commandes}
                        </Typography>
                        <ShoppingBasketIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {permissions.includes("view_all_vehicules") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card style={{backgroundColor:'#ffe082'}}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Nombre de véhicules
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {vehicules}
                        </Typography>
                        <DirectionsCarIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {permissions.includes("view_all_objectifs") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card style={{backgroundColor:'#ffab91'}}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Nombre d'objectifs
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {objectifs}
                        </Typography>
                        <BarChartIcon
                          style={{ fontSize: 40 }}
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              {/* Sidebar */}
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      marginBottom: 2,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold", 
                      textDecoration: "underline", 
                    }}
                    align="center"
                  >
                    Fiche d'actualité
                  </Typography>
                </CardContent>
                <>
      {error && <p>{error}</p>}

      {latestCommande && (
        <Alert variant="success" style={{ marginLeft: '10px', marginRight: '10px' }}>
        Une nouvelle commande a été créée ! Référence de la commande : {latestCommande.reference}
      </Alert>
      )}

      {latestPreparation && (
        <Alert variant="info" style={{ marginLeft: '10px', marginRight: '10px' }}>
        Cette commande a une préparation ! Référence de la commande : {latestPreparation.commande.reference}, Statut de la préparation : {latestPreparation.status_preparation}
      </Alert>
      )}

      {/* Sample static alerts */}
      {['primary', 'success', 'danger'].map((variant) => (
        <Alert key={variant} variant={variant} style={{ marginLeft: '10px', marginRight: '10px' }}>
          This is a {variant} alert—check it out!
        </Alert>
      ))}
    </>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
