import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Form, Button, Row, Col } from 'react-bootstrap';
import SearchWithExport from '../components/SearchWithExport';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DynamicFilter from "../components/DynamicFilter";
import '../style.css';
import ChambreTable from '../components/etatChambreTable';
import axios from "axios";

const exportToExcel = () => {
  const table = document.getElementById('exportTable');
  if (!table) {
    console.error("Table element not found!");
    return;
  }
  const workbook = XLSX.utils.table_to_book(table, { sheet: 'Chambres' });
  XLSX.writeFile(workbook, 'chambres.xlsx');
};

const exportToPDF = () => {
  const table = document.getElementById('exportTable');
  if (!table) {
    console.error("Table element not found!");
    return;
  }
  const doc = new jsPDF();
  doc.text("État des Chambres", 14, 16);
  doc.autoTable({
    html: '#exportTable',
    startY: 20,
    theme: 'grid',
    styles: { fontSize: 8, overflow: 'linebreak' },
    headStyles: { fillColor: '#00afaa' }
  });
  doc.save("chambres.pdf");
};

const printTable = () => {
  const tableElement = document.getElementById('exportTable');
  if (!tableElement) {
    console.error("Table element not found!");
    return;
  }
  const tableHtml = tableElement.outerHTML;
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #00afaa; color: #fff; }
        </style>
      </head>
      <body>
        ${tableHtml}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

const EtatChambre = () => {
  const [chambres, setChambres] = useState([]);
  const [formData, setFormData] = useState({
    num_chambre: '',
    status: '',
    date_nettoyage: '',
    nettoyée_par: '',
    maintenance: 'non',
    type_maintenance: '',
    date_debut_maintenance: '',
    date_fin_maintenance: '',
    commentaire: '',
  });

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [dateNettoyage, setDateNettoyage] = useState("");
  const [dateDebutMaintenance, setDateDebutMaintenance] = useState("");
  const [dateFinMaintenance, setDateFinMaintenance] = useState("");
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);

  useEffect(() => {
    // Récupération des chambres
    axios.get("http://localhost:8000/api/chambres")
      .then((response) => {
        setRoomNumbers(response.data.chambres);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des chambres:", error);
        setError("Impossible de récupérer la liste des chambres.");
      });
  
    // Récupération de l'état des chambres
    axios.get("http://localhost:8000/api/etat-chambre")
      .then((response) => {
        const flatChambres = response.data.chambres.map((chambre) => ({
          ...chambre,
          maintenance: chambre.maintenance ? "oui" : "non",
          type_maintenance: chambre.types_maintenance ? String(chambre.types_maintenance) : "",
          date_debut_maintenance: chambre.date_debut_maintenance || "",
          date_fin_maintenance: chambre.date_fin_maintenance || "",
        }));
        setChambres(flatChambres);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  
    // Récupération des types de maintenance
    axios.get("http://localhost:8000/api/maintenance-types")
      .then((response) => {
        setMaintenanceTypes(response.data.types);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des types de maintenance:", error);
      });
  }, []);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleEditClick = (chambre) => {
    setIsEdit(true);
    setFormData({
      ...chambre,
      maintenance: chambre.maintenance ? 'oui' : 'non',
      // Ensure the field is always a string for controlled inputs.
      type_maintenance: chambre.types_maintenance ? String(chambre.types_maintenance) : '',
      date_debut_maintenance: chambre.date_debut_maintenance || '',
      date_fin_maintenance: chambre.date_fin_maintenance || '',
      num_chambre: chambre.num_chambre || '',
      status: chambre.status || '',
      date_nettoyage: chambre.date_nettoyage || '',
      nettoyée_par: chambre.nettoyée_par || '',
      commentaire: chambre.commentaire || '',
    });
    if (!showForm) {
      handleShowForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);

    if (!formData.num_chambre) {
      setError("Le numéro de chambre est obligatoire");
      return;
    }

    if (!isEdit) {
      const alreadyExists = chambres.some(ch => ch.num_chambre === formData.num_chambre);
      if (alreadyExists) {
        setError("Cette chambre existe déjà");
        return;
      }
    }

    try {
      const url = isEdit 
        ? `http://localhost:8000/api/etat-chambre/${formData.num_chambre}`
        : 'http://localhost:8000/api/etat-chambre';
      const method = isEdit ? 'PUT' : 'POST';

      const maintenanceActive = formData.maintenance === 'oui';
      const payload = {
        ...formData,
        maintenance: maintenanceActive,
        // Send the value as a number if defined, otherwise null
        type_maintenance: maintenanceActive && formData.type_maintenance
          ? Number(formData.type_maintenance)
          : null,
        date_debut_maintenance: maintenanceActive ? formData.date_debut_maintenance || null : null,
        date_fin_maintenance: maintenanceActive ? formData.date_fin_maintenance || null : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur serveur');
      }

      const { etat_chambre } = await response.json();

      if (isEdit) {
        setChambres(prev =>
          prev.map(ch => ch.num_chambre === etat_chambre.num_chambre ? etat_chambre : ch)
        );
      } else {
        setChambres(prev => [...prev, etat_chambre]);
      }

      resetAndCloseForm();
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "Erreur lors de l'opération");
    }
  };

  const resetAndCloseForm = () => {
    setFormData({
      num_chambre: '',
      status: '',
      date_nettoyage: '',
      nettoyée_par: '',
      maintenance: 'non',
      type_maintenance: '',
      date_debut_maintenance: '',
      date_fin_maintenance: '',
      commentaire: '',
    });
    setIsEdit(false);
    setShowForm(false);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleMarkAsClean = (chambre) => {
    const updatedChambre = {
      ...chambre,
      status: "nettoyée",
      date_nettoyage: new Date().toISOString().split('T')[0],
    };

    fetch(`http://localhost:8000/api/etat-chambre/${chambre.num_chambre}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedChambre),
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP Error ${response.status}: ${text}`);
        }
        return response.json();
      })
      .then((data) => {
        setChambres((prevChambres) =>
          prevChambres.map((ch) =>
            ch.num_chambre === data.etat_chambre.num_chambre ? data.etat_chambre : ch
          )
        );
      })
      .catch((error) => {
        console.error("Error marking room as clean:", error);
        setError("Erreur lors de la mise à jour du statut de la chambre");
      });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (key, value) => {
    if (key === "status") {
      setSelectedStatus(value);
    } else if (key === "maintenance") {
      setSelectedMaintenance(value);
    } else if (key === "date_nettoyage") {
      setDateNettoyage(value);
    } else if (key === "date_debut_maintenance") {
      setDateDebutMaintenance(value);
    } else if (key === "date_fin_maintenance") {
      setDateFinMaintenance(value);
    }
  };

  const filteredChambres = chambres.filter((ch) => {
    const matchesSearch = ch.num_chambre
      ? ch.num_chambre.toString().toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const matchesStatus = selectedStatus
      ? ch.status.toLowerCase() === selectedStatus.toLowerCase()
      : true;

    const maintenanceValue = ch.maintenance === 'oui' ? 'oui' : 'non';
    const matchesMaintenance = selectedMaintenance
      ? maintenanceValue === selectedMaintenance
      : true;

    const matchesDateNettoyage = dateNettoyage ? ch.date_nettoyage === dateNettoyage : true;
    const matchesDateDebut = dateDebutMaintenance ? ch.date_debut_maintenance === dateDebutMaintenance : true;
    const matchesDateFin = dateFinMaintenance ? ch.date_fin_maintenance === dateFinMaintenance : true;

    return matchesSearch && matchesStatus && matchesMaintenance && matchesDateNettoyage && matchesDateDebut && matchesDateFin;
  });



  return (
    <div className="container my-4">
      <SearchWithExport 
        onSearch={handleSearch}
        exportToExcel={exportToExcel}
        exportToPDF={exportToPDF}
        printTable={printTable}
        Title="État des Chambres"
      />
      <br />
      <DynamicFilter
        filters={[
          {
            label: "Status",
            key: "status",
            options: [
              { value: "", label: "Tous" },
              { value: "nettoyée", label: "Nettoyée" },
              { value: "non nettoyée", label: "Non Nettoyée" },
            ],
          },
          {
            label: "Maintenance",
            key: "maintenance",
            options: [
              { value: "", label: "Tous" },
              { value: "oui", label: "Oui" },
              { value: "non", label: "Non" },
            ],
          },
          {
            label: "Date de Nettoyage",
            key: "date_nettoyage",
            type: "date",
          },
          {
            label: "Fin Maintenance",
            key: "date_fin_maintenance",
            type: "date",
          },
          {
            label: "Début Maintenance",
            key: "date_debut_maintenance",
            type: "date",
          }
        ]}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onAddClick={() => {
          setIsEdit(false);
          setFormData({
            num_chambre: '',
            status: '',
            date_nettoyage: '',
            nettoyée_par: '',
            maintenance: 'non',
            type_maintenance: '',
            date_debut_maintenance: '',
            date_fin_maintenance: '',
            commentaire: '',
          });
          handleShowForm();
        }}
        addButtonLabel="Ajouter un État de Chambre"
      />

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Chargement des données...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filteredChambres.length === 0 && (
        <Alert variant="info">Aucune chambre ne correspond aux filtres.</Alert>
      )}

      <div className="row">
        <div className="col-md-7">
          <ChambreTable 
            filteredChambres={filteredChambres}
            handleEditClick={handleEditClick}
            handleMarkAsClean={handleMarkAsClean}
          />
        </div>
        <div className="col-md-5">
          <div id="formContainer" className={`transition ${showForm ? 'd-block' : 'd-none'}`} style={{ maxHeight: '680px', overflow: 'auto', background: '#fff', boxShadow: '-2px 0 15px rgba(0,0,0,0.1)' }}>
            {showForm && (
              <Form onSubmit={handleSubmit}>
                <Form.Label className="text-center">
                  <h4 style={{ fontSize: "25px", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "black", borderBottom: "2px solid black", paddingBottom: "5px" }}>
                    {isEdit ? "Modifier" : "Ajouter"} un État de Chambre
                  </h4>
                </Form.Label>
                <Form.Group as={Row} className="mb-3" controlId="num_chambre">
                  <Form.Label column sm={4}>Numéro de Chambre</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      as="select"
                      name="num_chambre"
                      value={formData.num_chambre || ''}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner une chambre</option>
                      {roomNumbers.map(ch => (
                        <option key={ch.num_chambre} value={ch.num_chambre}>{ch.num_chambre}</option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="status">
                  <Form.Label column sm={4}>Statut</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      as="select"
                      name="status"
                      value={formData.status || ''}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner le statut</option>
                      <option value="nettoyée">Nettoyée</option>
                      <option value="non nettoyée">Non nettoyée</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="date_nettoyage">
                  <Form.Label column sm={4}>Date de Nettoyage</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      name="date_nettoyage"
                      value={formData.date_nettoyage || ''}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="nettoyée_par">
                  <Form.Label column sm={4}>Nettoyée Par</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      name="nettoyée_par"
                      value={formData.nettoyée_par || ''}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="maintenance">
                  <Form.Label column sm={4}>Maintenance</Form.Label>
                  <Col sm={8}>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        label="Oui"
                        name="maintenance"
                        value="oui"
                        checked={formData.maintenance === 'oui'}
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="radio"
                        label="Non"
                        name="maintenance"
                        value="non"
                        checked={formData.maintenance === 'non'}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Form.Group>
                {formData.maintenance === 'oui' && (
                  <Form.Group as={Row} className="mb-3" controlId="types_maintenance">
                    <Form.Label column sm={4}>Type de Maintenance</Form.Label>
                    <Col sm={8}>
                      <Form.Control 
                        as="select"
                        name="type_maintenance"
                        value={formData.type_maintenance || ''}
                        onChange={handleChange}
                      >
                        <option value="">Sélectionner le type</option>
                        {maintenanceTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.types_maintenance}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                )}
                {formData.maintenance === 'oui' && (
                  <>
                    <Form.Group as={Row} className="mb-3" controlId="date_debut_maintenance">
                      <Form.Label column sm={4}>Date Début Maintenance</Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="date"
                          name="date_debut_maintenance"
                          value={formData.date_debut_maintenance || ''}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="date_fin_maintenance">
                      <Form.Label column sm={4}>Date Fin Maintenance</Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="date"
                          name="date_fin_maintenance"
                          value={formData.date_fin_maintenance || ''}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>
                  </>
                )}
                <Form.Group as={Row} className="mb-3" controlId="commentaire">
                  <Form.Label column sm={4}>Commentaire</Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="commentaire"
                      value={formData.commentaire || ''}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mt-5 d-flex justify-content-center">
                  <Button variant="primary" size="sm" className="mx-2" type="submit">
                    Valider
                  </Button>
                  <Button variant="secondary" size="sm" className="mx-2" onClick={resetAndCloseForm}>
                    Annuler
                  </Button>
                </Form.Group>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtatChambre;
