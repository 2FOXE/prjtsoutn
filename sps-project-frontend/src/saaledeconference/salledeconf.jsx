import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Box, Fab } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchWithExportCarousel from "../components/SearchWithExportCarousel";
import ExpandRTable from "../components/ExpandRTable";
import { useOpen } from "../Acceuil/OpenProvider";
import "../style.css";

const SalleConf = () => {
  const { dynamicStyles } = useOpen();
  const API_SALLES = "http://127.0.0.1:8000/api/salles_conference";
  const [salles, setSalles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSalle, setCurrentSalle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    designation: "",
    capacite: "",
    prix_heure: "",
    description: "",
    disponibilite: true,
  });
  const [loading, setLoading] = useState(false);
  const [selectedSalles, setSelectedSalles] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tableWidth, setTableWidth] = useState("100%");
  const [formPosition, setFormPosition] = useState("-30%");

  const fetchSalles = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_SALLES);
      const data = await response.json();
      if (Array.isArray(data.salles_coneference)) {
        setSalles(data.salles_coneference);
      } else {
        Swal.fire("Erreur!", "Données des salles non valides", "error");
      }
    } catch (error) {
      Swal.fire("Erreur!", "Impossible de récupérer les salles.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  const filteredSalles = useMemo(() => {
    return salles.filter((s) => {
      return !search || s.designation?.toLowerCase().includes(search.toLowerCase());
    });
  }, [salles, search]);

  const handleAddOrUpdateSalle = async () => {
    const url = currentSalle ? `${API_SALLES}/${currentSalle.id}` : API_SALLES;
    const method = currentSalle ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la requête");

      Swal.fire(
        currentSalle ? "Modifiée!" : "Ajoutée!",
        `La salle a été ${currentSalle ? "modifiée" : "ajoutée"}.`,
        "success"
      );
      handleCancel();
      fetchSalles();
    } catch (error) {
      Swal.fire(
        "Erreur!",
        `Impossible de ${currentSalle ? "modifier" : "ajouter"} la salle.`,
        "error"
      );
    }
  };

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
          const response = await fetch(`${API_SALLES}/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Erreur lors de la suppression");
          Swal.fire("Supprimée!", "La salle a été supprimée.", "success");
          fetchSalles();
        } catch (error) {
          Swal.fire("Erreur!", "Impossible de supprimer la salle.", "error");
        }
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedSalles.length === 0) {
      Swal.fire("Information", "Aucune salle sélectionnée.", "info");
      return;
    }
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: `Vous êtes sur le point de supprimer ${selectedSalles.length} salle(s). Cette action est irréversible!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const id of selectedSalles) {
            await fetch(`${API_SALLES}/${id}`, {
              method: "DELETE",
            });
          }
          Swal.fire("Supprimées!", "Les salles sélectionnées ont été supprimées.", "success");
          fetchSalles();
          setSelectedSalles([]);
        } catch (error) {
          Swal.fire("Erreur!", "Impossible de supprimer les salles sélectionnées.", "error");
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      designation: "",
      capacite: "",
      prix_heure: "",
      description: "",
      disponibilite: true,
    });
    setTableWidth("100%");
    setFormPosition("-30%");
    setCurrentSalle(null);
  };

  const handleShowForm = (salle = null) => {
    setCurrentSalle(salle);
    setFormData(
      salle
        ? { ...salle }
        : { designation: "", capacite: "", prix_heure: "", description: "", disponibilite: true }
    );
    setShowForm(true);
    setTableWidth("65%");
    setFormPosition("0%");
  };

  const handleSelectSalle = (id) => {
    setSelectedSalles((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const highlightText = (text) => {
    if (!search || !text) return text;
    const parts = String(text).split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase()
        ? <span key={i} style={{ backgroundColor: '#ffff00' }}>{part}</span>
        : part
    );
  };

  const columns = [
    { label: "Désignation", key: "designation", minWidth: 150 },
    { label: "Capacité", key: "capacite", minWidth: 100 },
    { label: "Surface", key: "prix_heure", minWidth: 100 },
    { label: "Description", key: "description", minWidth: 200 },
    {
      label: "Disponibilité",
      key: "disponibilite",
      minWidth: 100,
      render: (item) => (item.disponibilite ? "Disponible" : "Indisponible")
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

  const theme = createTheme({
    components: {
      MuiFab: {
        styleOverrides: {
          root: {
            backgroundColor: "#329982",
            color: "white",
            "&:hover": {
              backgroundColor: "#267764",
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
            Liste des Salles de Conférence
          </h1>

          <SearchWithExportCarousel search={search} setSearch={setSearch} />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", alignItems: "center" }}>
            <Fab
              variant="extended"
              className="btn-sm Fab mb-2 mx-2"
              onClick={() => handleShowForm()}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "10px" }} />
              Ajouter une salle
            </Fab>
          </div>

          {showForm && (
            <div style={{
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
            }}>
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
                {currentSalle ? "Modifier" : "Ajouter"} une salle de conférence
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
                      placeholder="Désignation de la salle"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Capacité</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="number"
                      name="capacite"
                      value={formData.capacite}
                      onChange={handleInputChange}
                      placeholder="Capacité de la salle"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Surface</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="prix_heure"
                      value={formData.prix_heure}
                      onChange={handleInputChange}
                      placeholder="Surface de la salle"
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
                      placeholder="Description de la salle"
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                  <Col md={4}>
                    <Form.Label style={{ fontWeight: "bold" }}>Disponibilité</Form.Label>
                  </Col>
                  <Col md={8} className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      name="disponibilite"
                      checked={formData.disponibilite}
                      onChange={handleInputChange}
                      label={formData.disponibilite ? "Disponible" : "Indisponible"}
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-between" style={{ marginTop: "20px" }}>
                  <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" onClick={handleAddOrUpdateSalle}>
                    {currentSalle ? "Modifier" : "Ajouter"}
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

          <div style={{ width: tableWidth, transition: "width 0.5s ease" }}>
            <ExpandRTable
              columns={columns}
              data={filteredSalles}
              selectedItems={selectedSalles}
              handleSelectAllChange={(e) => {
                if (e.target.checked) {
                  setSelectedSalles(filteredSalles.map((salle) => salle.id));
                } else {
                  setSelectedSalles([]);
                }
              }}
              handleCheckboxChange={(id) => handleSelectSalle(id)}
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

export default SalleConf;