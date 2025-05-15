import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Box, Fab } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandRTable from "../components/ExpandRTable";
import SearchWithExportCarousel from "../components/SearchWithExportCarousel";
import { useOpen } from "../Acceuil/OpenProvider";
import "../style.css";

const Affichertt = () => {
  const { dynamicStyles } = useOpen();
  const API_EVENTS = "http://127.0.0.1:8000/api/evenements";
  const [evenements, setEvenements] = useState([]);
  const [search, setSearch] = useState("");
  const [currentEvenement, setCurrentEvenement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    designation: "", // Changed from titre
    prix: "",
    lieu: "",
    date: "",
    description: "",
    interieurOuSuperieur: false, // Changed from clientcibler
  });
  const [loading, setLoading] = useState(false);
  const [selectedEvenements, setSelectedEvenements] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pour l'animation du formulaire et ajustement du tableau
  const [tableWidth, setTableWidth] = useState("100%");
  const [formPosition, setFormPosition] = useState("-30%");

  // Fonction pour récupérer les événements
  const fetchEvenements = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_EVENTS);
      const data = await response.json();
      setEvenements(data);
    } catch (error) {
      Swal.fire("Erreur!", "Impossible de récupérer les événements.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvenements();
  }, []);

  // Fonction pour filtrer les événements en fonction de la recherche
  const filteredEvenements = useMemo(() => {
    return evenements.filter((e) => {
      // Update filtering to use the new field name
      return !search || e.designation?.toLowerCase().includes(search.toLowerCase()) || 
             // Fallback to titre for backwards compatibility with existing data
             e.titre?.toLowerCase().includes(search.toLowerCase());
    });
  }, [evenements, search]);

  // Fonction pour ajouter ou modifier un événement
  const handleAddOrUpdateEvenement = async () => {
    const url = currentEvenement ? `${API_EVENTS}/${currentEvenement.id}` : API_EVENTS;
    const method = currentEvenement ? "PUT" : "POST";

    // Create submission data with mapping for backend
    const submissionData = {
      ...formData,
      // Map frontend fields to backend fields if needed
      titre: formData.designation,  // Map designation to titre for backend
      clientcibler: formData.interieurOuSuperieur // Map interieurOuSuperieur to clientcibler for backend
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Erreur lors de la requête");

      Swal.fire(
        currentEvenement ? "Modifié!" : "Ajouté!",
        `L'événement a été ${currentEvenement ? "modifié" : "ajouté"}.`,
        "success"
      );
      
      handleCancel();
      fetchEvenements();
    } catch (error) {
      Swal.fire(
        "Erreur!",
        `Impossible de ${currentEvenement ? "modifier" : "ajouter"} l'événement.`,
        "error"
      );
    }
  };

  // Fonction pour supprimer un événement
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_EVENTS}/${id}`, {
            method: "DELETE",
          });
    
          if (!response.ok) throw new Error("Erreur lors de la suppression");
    
          Swal.fire("Supprimé!", "L'événement a été supprimé.", "success");
          fetchEvenements();
        } catch (error) {
          Swal.fire("Erreur!", "Impossible de supprimer l'événement.", "error");
        }
      }
    });
  };

  // Fonction pour supprimer les événements sélectionnés
  const handleDeleteSelected = async () => {
    if (selectedEvenements.length === 0) {
      Swal.fire("Information", "Aucun événement sélectionné.", "info");
      return;
    }
    
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: `Vous êtes sur le point de supprimer ${selectedEvenements.length} événement(s). Cette action est irréversible!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const id of selectedEvenements) {
            await fetch(`${API_EVENTS}/${id}`, {
              method: "DELETE",
            });
          }
          Swal.fire("Supprimé!", "Les événements sélectionnés ont été supprimés.", "success");
          fetchEvenements();
          setSelectedEvenements([]);
        } catch (error) {
          Swal.fire("Erreur!", "Impossible de supprimer les événements sélectionnés.", "error");
        }
      }
    });
  };

  // Gestion des entrées du formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Fonction pour annuler le formulaire
  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      designation: "", // Changed from titre
      prix: "",
      lieu: "",
      date: "",
      description: "",
      interieurOuSuperieur: false, // Changed from clientcibler
    });
    setTableWidth("100%");
    setFormPosition("-30%");
    setCurrentEvenement(null);
  };

  // Fonction pour afficher le formulaire (ajout ou modification)
  const handleShowForm = (evenement = null) => {
    setCurrentEvenement(evenement);
    
    // When loading an existing event, map backend fields to frontend fields
    setFormData(
      evenement 
        ? {
            ...evenement,
            designation: evenement.titre || evenement.designation || "", // Map from either field
            interieurOuSuperieur: evenement.clientcibler || evenement.interieurOuSuperieur || false // Map from either field
          }
        : { 
            designation: "", 
            prix: "", 
            lieu: "", 
            date: "", 
            description: "", 
            interieurOuSuperieur: false 
          }
    );
    setShowForm(true);
    setTableWidth("65%");
    setFormPosition("0%");
  };

  // Fonction pour gérer la sélection des événements
  const handleSelectEvenement = (id) => {
    setSelectedEvenements((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  // Fonction pour mettre en évidence le texte recherché
  const highlightText = (text) => {
    if (!search || !text) return text;
    
    const parts = String(text).split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === search.toLowerCase() ? 
        <span key={i} style={{ backgroundColor: '#ffff00' }}>{part}</span> : part
    );
  };

  // Configuration des colonnes pour la table
  const columns = [
    { label: "Désignation", key: "titre", minWidth: 150 }, // Changed label but kept key for compatibility
    { label: "Prix", key: "prix", minWidth: 100 },
    { label: "Lieu", key: "lieu", minWidth: 150 },
    { label: "Date", key: "date", minWidth: 120 },
    { 
      label: "Intérieur ou Supérieur", // Changed from "Client Ciblé"
      key: "clientcibler", // Kept key for compatibility
      minWidth: 150,
      render: (item) => (item.clientcibler ? "Supérieur" : "Intérieur") // Changed display values 
    },
    {
      key: "actions",
      label: "Actions",
      minWidth: 150,
      render: (item) => (
        <div>
          <FontAwesomeIcon
            onClick={() => handleShowForm(item)}
            icon={faEdit}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <FontAwesomeIcon
            onClick={() => handleDelete(item.id)}
            icon={faTrash}
            style={{ cursor: "pointer", color: "red" }}
          />
        </div>
      ),
    },
  ];

  // Thème personnalisé pour les boutons Fab
  const theme = createTheme({
    components: {
      MuiFab: {
        styleOverrides: {
          root: {
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            }
          },
          extended: {
            padding: "0 24px",
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
          <h1 style={{ textAlign: "left", marginBottom: "15px", fontWeight: "bold", marginTop: 30 }}>
            Liste des événements
          </h1>

          {/* Barre de recherche avec export */}
          <SearchWithExportCarousel search={search} setSearch={setSearch} />

          {/* Bouton d'ajout */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", alignItems: "center" }}>
            <Fab
              variant="extended"
              className="btn-sm Fab mb-2 mx-2"
              onClick={() => handleShowForm()}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "10px" }} />
              Ajouter événement
            </Fab>
          </div>

          {/* Formulaire d'ajout ou de modification */}
          {showForm && (
            <div
              style={{
                position: "absolute",
                top: "400px",
                right: formPosition,
                zIndex: 1000,
                width: "35%",
                padding: "50px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "0px",
                display: "block",
                height: "auto",
                overflow: "auto",
                border: "3px solid #ccc",
                transition: "right 0.5s ease",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  marginTop: "-30px",
                  borderBottom: "2px solid #000",
                  paddingBottom: "10px",
                }}
              >
                {currentEvenement ? "Modifier" : "Ajouter"} un événement
              </h4>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Désignation</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Désignation de l'événement"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Prix</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="prix"
                      value={formData.prix}
                      onChange={handleInputChange}
                      placeholder="Prix de l'événement"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Lieu</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="lieu"
                      value={formData.lieu}
                      onChange={handleInputChange}
                      placeholder="Lieu de l'événement"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Date</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Description</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description de l'événement"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Intérieur ou Supérieur</Form.Label>
                  </Col>
                  <Col md={8} className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      name="interieurOuSuperieur"
                      checked={formData.interieurOuSuperieur}
                      onChange={handleInputChange}
                      label={formData.interieurOuSuperieur ? "Supérieur" : "Intérieur"}
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-between" style={{ marginTop: "20px" }}>
                  <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" onClick={handleAddOrUpdateEvenement}>
                    {currentEvenement ? "Modifier" : "Ajouter"}
                  </Fab>
                  <Fab 
                    variant="extended" 
                    onClick={handleCancel}
                    sx={{
                      backgroundColor: "#9e9e9e",
                      "&:hover": {
                        backgroundColor: "#757575",
                      }
                    }}
                  >
                    Annuler
                  </Fab>
                </div>
              </Form>
            </div>
          )}

          {/* Tableau des événements */}
          <div style={{ width: tableWidth, transition: "width 0.5s ease" }}>
            <ExpandRTable
              columns={columns}
              data={filteredEvenements}
              selectedItems={selectedEvenements}
              handleSelectAllChange={(e) => {
                if (e.target.checked) {
                  setSelectedEvenements(filteredEvenements.map((evenement) => evenement.id));
                } else {
                  setSelectedEvenements([]);
                }
              }}
              handleCheckboxChange={(id) => handleSelectEvenement(id)}
              handleDeleteSelected={handleDeleteSelected}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={(newPage) => setPage(newPage)}
              handleChangeRowsPerPage={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              expandedRows={expandedRows}
              toggleRowExpansion={(id) => {
                setExpandedRows(prev => ({
                  ...prev,
                  [id]: !prev[id]
                }));
              }}
              highlightText={highlightText}
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Affichertt;