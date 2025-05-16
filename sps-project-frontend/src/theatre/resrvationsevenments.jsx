import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Box, Fab, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandRTable from "../components/ExpandRTable";
import SearchWithExportCarousel from "../components/SearchWithExportCarousel";
import { useOpen } from "../Acceuil/OpenProvider";
import "../style.css";

const AfficherReservations = () => {
  const { dynamicStyles } = useOpen();
  const API_RESERVATIONS = "http://127.0.0.1:8000/api/reservationss";
  const API_EVENTS = "http://127.0.0.1:8000/api/evenements";

  const [reservations, setReservations] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [search, setSearch] = useState("");
  const [currentReservation, setCurrentReservation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    idclient: "",
    idSpectacle: "",
    prix: "",
    systemedepaiment: "",
    nombredesbilletts: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableWidth, setTableWidth] = useState("100%");
  const [formPosition, setFormPosition] = useState("-30%");

  // Utility function to handle reservation ID (both coderes and id)
  const getReservationId = (reservation) => reservation.coderes || reservation.id;

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_RESERVATIONS);
      const data = await response.json();

      if (Array.isArray(data)) {
        setReservations(data);
      } else if (data && data.reservations) {
        setReservations(data.reservations);
      } else {
        console.error("Invalid response format:", data);
        Swal.fire("Erreur!", "Les données des réservations sont invalides.", "error");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      Swal.fire("Erreur!", "Impossible de récupérer les réservations.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events
  const fetchEvenements = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_EVENTS);
      const data = await response.json();

      if (Array.isArray(data)) {
        setEvenements(data);
      } else {
        throw new Error("Les événements sont dans un format incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      Swal.fire("Erreur!", "Impossible de récupérer les événements.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchEvenements(); // Fetch events on component mount
  }, []);

  // Filter reservations based on search input
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) =>
      !search || r.idclient?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [reservations, search]);

  // Map frontend status values to backend expected values
  const mapStatusToBackend = (status) => {
    const statusMap = {
      "Confirmée": "confirmée",
      "En Attente": "en attente",
      "Annulée": "annulée"
    };
    return statusMap[status] || status;
  };
  
  // Map backend status values to frontend display values
  const mapStatusToFrontend = (status) => {
    const statusMap = {
      "confirmée": "Confirmée",
      "en attente": "En Attente",
      "annulée": "Annulée"
    };
    return statusMap[status] || status;
  };

  // Handle adding or updating reservation
  const handleAddOrUpdateReservation = async () => {
    // Validate required fields
    if (!formData.idclient || !formData.idSpectacle || !formData.prix || !formData.systemedepaiment || !formData.nombredesbilletts || !formData.status) {
      Swal.fire("Erreur!", "Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    // Create a copy of the form data with mapped status
    const submissionData = {
      ...formData,
      status: mapStatusToBackend(formData.status)
    };

    const url = currentReservation ? `${API_RESERVATIONS}/${getReservationId(currentReservation)}` : API_RESERVATIONS;
    const method = currentReservation ? "PUT" : "POST";  // POST for adding, PUT for updating

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur:", errorData);
        throw new Error("Erreur lors de la requête");
      }

      Swal.fire(
        currentReservation ? "Modifiée!" : "Ajoutée!",
        `La réservation a été ${currentReservation ? "modifiée" : "ajoutée"}.`,
        "success"
      );
      handleCancel();
      fetchReservations();  // Refresh reservations after add/update
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la modification:", error);
      Swal.fire(
        "Erreur!",
        `Impossible de ${currentReservation ? "modifier" : "ajouter"} la réservation.`,
        "error"
      );
    }
  };

  // Handle deleting reservation
  const handleDelete = async (reservation) => {
    const id = getReservationId(reservation);
    
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
          const response = await fetch(`${API_RESERVATIONS}/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Erreur lors de la suppression");

          Swal.fire("Supprimée!", "La réservation a été supprimée.", "success");
          fetchReservations();  // Refresh reservations after delete
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          Swal.fire("Erreur!", "Impossible de supprimer la réservation.", "error");
        }
      }
    });
  };

  // Handle deleting selected reservations
  const handleDeleteSelected = async () => {
    if (selectedReservations.length === 0) {
      Swal.fire("Information", "Aucune réservation sélectionnée.", "info");
      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr?",
      text: `Vous êtes sur le point de supprimer ${selectedReservations.length} réservation(s). Cette action est irréversible!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const id of selectedReservations) {
            await fetch(`${API_RESERVATIONS}/${id}`, {
              method: "DELETE",
            });
          }
          Swal.fire("Supprimé!", "Les réservations sélectionnées ont été supprimées.", "success");
          fetchReservations();  // Refresh reservations after batch delete
          setSelectedReservations([]);  // Clear selected reservations
        } catch (error) {
          console.error("Erreur lors de la suppression des réservations sélectionnées:", error);
          Swal.fire("Erreur!", "Impossible de supprimer les réservations sélectionnées.", "error");
        }
      }
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Update state for each form field
    }));
  };

  // Handle canceling the form
  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      idclient: "",
      idSpectacle: "",
      prix: "",
      systemedepaiment: "",
      nombredesbilletts: "",
      status: "",
    });
    setTableWidth("100%");
    setFormPosition("-30%");
    setCurrentReservation(null);
  };

  // Handle showing the form for adding or updating a reservation
  const handleShowForm = (reservation = null) => {
    setCurrentReservation(reservation);
    
    // If editing, map the status from backend to frontend format
    const formattedReservation = reservation ? {
      ...reservation,
      status: mapStatusToFrontend(reservation.status)
    } : {
      idclient: "",
      idSpectacle: "",
      prix: "",
      systemedepaiment: "",
      nombredesbilletts: "",
      status: "",
    };
    
    setFormData(formattedReservation);
    setShowForm(true);
    setTableWidth("65%");
    setFormPosition("0%");
  };

  // Handle selecting a reservation
  const handleSelectReservation = (id) => {
    setSelectedReservations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  // Handle clicking on a row to select it
  const handleRowClick = (id, e) => {
    // Ignore clicks on checkbox and action buttons
    if (
      e.target.type === 'checkbox' || 
      e.target.closest('.action-icons') || 
      e.target.tagName === 'svg' || 
      e.target.tagName === 'path'
    ) {
      return;
    }
    
    handleSelectReservation(id);
  };

  // Highlight search text in reservations
  const highlightText = (text) => {
    if (!search || !text) return text;

    const parts = String(text).split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ?
        <span key={i} style={{ backgroundColor: '#ffff00' }}>{part}</span> : part
    );
  };

  // Define columns for the reservations table
  const columns = [
    { label: "ID Client", key: "idclient", minWidth: 100 },
    { label: "ID Spectacle", key: "idSpectacle", minWidth: 100 },
    { label: "Prix", key: "prix", minWidth: 100 },
    { label: "Système de paiement", key: "systemedepaiment", minWidth: 150 },
    { label: "Nombre de billets", key: "nombredesbilletts", minWidth: 120 },
    { label: "Status", key: "status", minWidth: 100 },
    {
      key: "actions",
      label: "Actions",
      minWidth: 150,
      render: (item) => (
        <div className="action-icons">
          <FontAwesomeIcon
            onClick={() => handleShowForm(item)}
            icon={faEdit}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <FontAwesomeIcon
            onClick={() => handleDelete(item)}
            icon={faTrash}
            style={{ cursor: "pointer", color: "red" }}
          />
        </div>
      ),
    },
  ];

  // Create custom theme for the Fab buttons
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
            Liste des réservations
          </h1>

          {/* Search bar with export */}
          <SearchWithExportCarousel search={search} setSearch={setSearch} />

          {/* Add button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", alignItems: "center" }}>
            <Fab
              variant="extended"
              className="btn-sm Fab mb-2 mx-2"
              onClick={() => handleShowForm()}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "10px" }} />
              Ajouter réservation
            </Fab>
          </div>

          {/* Add or edit form */}
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
                {currentReservation ? "Modifier" : "Ajouter"} une réservation
              </h4>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>ID Client</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="idclient"
                      value={formData.idclient}
                      onChange={handleInputChange}
                      placeholder="ID du client"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Événement</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      name="idSpectacle"
                      value={formData.idSpectacle}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez un événement</option>
                      {Array.isArray(evenements) && evenements.map((evenement) => (
                        <option key={evenement.id} value={evenement.id}>
                          {evenement.id}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Prix</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleInputChange}
                      placeholder="Prix"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Système de paiement</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="systemedepaiment"
                      value={formData.systemedepaiment}
                      onChange={handleInputChange}
                      placeholder="Système de paiement"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Nombre de billets</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      name="nombredesbilletts"
                      value={formData.nombredesbilletts}
                      onChange={handleInputChange}
                      placeholder="Nombre de billets"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Status</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez un statut</option>
                      <option value="Confirmée">Confirmée</option>
                      <option value="En Attente">En Attente</option>
                      <option value="Annulée">Annulée</option>
                    </Form.Control>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between" style={{ marginTop: "20px" }}>
                  <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" onClick={handleAddOrUpdateReservation}>
                    {currentReservation ? "Modifier" : "Ajouter"}
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

          {/* Reservation table */}
          <div style={{ width: tableWidth, transition: "width 0.5s ease" }}>
            <ExpandRTable
              columns={columns}
              data={filteredReservations}
              selectedItems={selectedReservations}
              handleSelectAllChange={(e) => {
                if (e.target.checked) {
                  setSelectedReservations(filteredReservations.map((reservation) => getReservationId(reservation)));
                } else {
                  setSelectedReservations([]);
                }
              }}
              handleCheckboxChange={(id) => handleSelectReservation(id)}
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
                setExpandedRows((prev) => ({
                  ...prev,
                  [id]: !prev[id],
                }));
              }}
              highlightText={highlightText}
              onRowClick={handleRowClick}
              rowStyle={(item) => ({
                cursor: 'pointer',
                backgroundColor: selectedReservations.includes(getReservationId(item)) ? 'rgba(25, 118, 210, 0.1)' : 'inherit',
              })}
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AfficherReservations;