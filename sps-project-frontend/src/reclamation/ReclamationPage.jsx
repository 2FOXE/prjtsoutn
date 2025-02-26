import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useOpen } from "../Acceuil/OpenProvider";
import SearchWithExportCarousel from "../components/SearchWithExportCarousel";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { openDB } from "idb"; // ✅ IndexedDB Library
import ExpandRTable from "../components/ExpandRTable";
import { highlightText } from "../utils/textUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"; // If using dropdown icons
import DynamicFilter from "../components/DynamicFilter";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import Fab from '@mui/material/Fab';
import "../style.css";
import {
  faTrash,
  faFileExcel,
  faPlus,
  faMinus,
  faCircleInfo,
  faSquarePlus,
  faEdit,
  faList,
  faPrint,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";




const initDB = async () => {
    return openDB("ReclamationsDB", 3, { // 🔥 Change version to 3 (incremented)
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`🔄 Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`);
  
        if (oldVersion < 1) {
          db.createObjectStore("departments", { keyPath: "id" });
          db.createObjectStore("reclamations", { keyPath: "id" });
        }
  
        if (oldVersion < 2) {
          db.createObjectStore("reclamation_historique", { keyPath: "id" });
        }
  
        if (oldVersion < 3) {
          console.log("✅ Version 3: Ensure all stores exist.");
        }
      },
    });
  };


// ✅ Function to chunk the departments array for carousel display
const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};







const ReclamationPage = () => {
  const { dynamicStyles } = useOpen();
  const [reclamations, setReclamations] = useState([]);
  const [filteredReclamations, setFilteredReclamations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [historique, setHistorique] = useState([]);
  const [historiqueData, setHistoriqueData] = useState([]); // ✅ Define state
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [showAddReclamationModal, setShowAddReclamationModal] = useState(false);
  const [showEditReclamationModal, setShowEditReclamationModal] = useState(false);
  const [reclamationFormData, setReclamationFormData] = useState({
    type_reclamation: "",
    reclamer_a_travers: "",
    departement_affecte: "",
    suivi: "",
    reponse: "",
  });
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
  const [tableContainerStyle, setTableContainerStyle] = useState({ marginRight: "0" });
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: "" });
  const [departmentErrors, setDepartmentErrors] = useState({ name: false });
  const [editingDepartment, setEditingDepartment] = useState(null);

  // ✅ Load Cached Data from IndexedDB
  const loadCachedData = useCallback(async () => {
    const db = await initDB();
  
    const cachedDepartments = await db.getAll("departments");
    const cachedReclamations = await db.getAll("reclamations");
    const cachedHistorique = await db.getAll("reclamation_historique");
  
    if (cachedDepartments.length > 0) setDepartments(cachedDepartments);
    if (cachedReclamations.length > 0) {
      setReclamations(cachedReclamations);
      setFilteredReclamations(cachedReclamations);
    }
    if (cachedHistorique.length > 0) setHistorique(cachedHistorique);
  
    console.log("🔄 Loaded Cached Data from IndexedDB:", {
      departments: cachedDepartments,
      reclamations: cachedReclamations,
      historique: cachedHistorique,
    });
  }, []);
  

  // ✅ Fetch all data simultaneously for faster load
  const fetchData = useCallback(async () => {
    try {
      console.log("🚀 Fetching data from API...");
  
      const [deptResponse, recResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/reclamations/departements"),
        axios.get("http://localhost:8000/api/reclamations"),
      ]);
  
      console.log("✅ API responses received", {
        departments: deptResponse.data,
        reclamations: recResponse.data,
      });
  
      // ✅ DELETE OLD IndexedDB if version conflict
      if (indexedDB.databases) {
        const databases = await indexedDB.databases();
        if (databases.some(db => db.name === "ReclamationsDB" && db.version < 2)) {
          console.warn("⚠️ IndexedDB version outdated, deleting...");
          indexedDB.deleteDatabase("ReclamationsDB");
        }
      }
  
      const db = await initDB(); // ✅ Open updated database
  
      // ✅ Store Departments
      const formattedDepartments = deptResponse.data.map((dept) => ({
        id: dept.id,
        designation: dept.nom,
      }));
      setDepartments(formattedDepartments);
      await db.clear("departments");
      formattedDepartments.forEach((dept) => db.put("departments", dept));
  
      // ✅ Store Reclamations & Historique
      setReclamations(recResponse.data);
      setFilteredReclamations(recResponse.data);
      await db.clear("reclamations");
      await db.clear("reclamation_historique");
  
      let allHistorique = [];
      recResponse.data.forEach((rec) => {
        db.put("reclamations", rec);
        if (rec.historique) {
          rec.historique.forEach((histo) => {
            db.put("reclamation_historique", histo);
            allHistorique.push(histo);
          });
        }
      });
  
      setHistoriqueData(allHistorique); // ✅ Store historique in state
      console.log("✅ Historique stored in IndexedDB:", allHistorique);
    } catch (error) {
      console.error("❌ Fetch error:", error.response?.status, error.response?.data);
      Swal.fire("Erreur!", `Échec du chargement des données: ${error.message}`, "error");
    }
  }, []);
  
  
  
  // Add this handler function
  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/reclamations/${editingReclamation.id}`, editingReclamation);
      fetchData();
      setEditingReclamation(null);
      Swal.fire("Success!", "Réclamation mise à jour", "success");
    } catch (error) {
      Swal.fire("Error!", "Échec de la mise à jour", "error");
    }
  };


  // ✅ Load cached data instantly, then fetch fresh data
  useEffect(() => {
    loadCachedData();
    fetchData();
  }, [loadCachedData, fetchData]);

  // ✅ Pre-chunk departments before rendering to avoid delays
  const chunks = useMemo(() => chunkArray(departments, 9), [departments]);

  // ✅ Optimized filtering logic
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredReclamations(
      reclamations.filter((rec) => {
        const matches = [
          rec.type_reclamation,
          rec.suivi,
          rec.reclamer_a_travers,
          rec.reponse,
          rec.departement?.nom, // ✅ Ensure department name is included
        ].some(field => field?.toLowerCase().includes(lowerSearchTerm));
  
        return matches;
      })
    );
  }, [reclamations, searchTerm]);
  
  




  // ✅ Export Data Optimization
  const exportData = useMemo(
    () =>
      filteredReclamations.map((rec) => ({
        Type: rec.type_reclamation,
        "Réclamé à travers": rec.reclamer_a_travers,
        Département: rec.departement_affecte,
        Suivi: rec.suivi,
        Réponse: rec.reponse,
      })),
    [filteredReclamations]
  );

  // ✅ Export Handlers
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Type", "Réclamé à travers", "Département", "Suivi", "Réponse"]],
      body: exportData.map(Object.values),
    });
    doc.save("reclamations.pdf");
  }, [exportData]);


  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Réclamations");
    XLSX.writeFile(workbook, "reclamations.xlsx");
  }, [exportData]);

  // table parts
  const columns = [
    { key: "type_reclamation", label: "Type de Réclamation", render: (item) => highlightText(item.type_reclamation, searchTerm) },
    { key: "reclamer_a_travers", label: "Réclamé à Travers", render: (item) => highlightText(item.reclamer_a_travers, searchTerm) },
    { 
  key: "departement_nom", 
  label: "Département Affecté", 
  render: (item) => highlightText(item.departement?.nom || "Non spécifié", searchTerm) 
},
    {
        key: "suivi",
        label: "Status",
        render: (item, searchTerm, toggleRowExpansion) => (
          <>
            <button 
              onClick={() => toggleRowExpansion(item.id)} 
              style={{ border: "none", backgroundColor: "white", cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {highlightText(item.suivi, searchTerm) || ""}
          </>
        ),
      },
    { key: "reponse", label: "Réponse", render: (item) => highlightText(item.reponse, searchTerm) }
  ];
  
  

/////////////////////////////////////////////////////// Table part //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const toggleRowExpansion = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id], // Toggle between true and false
    }));
  };
  
  const renderExpandedRow = (item) => {
    console.log("Expanded Row Item:", item); // Debugging
  
    if (!item.historique || item.historique.length === 0) {
      return (
        <div>
          <table className="table table-responsive table-bordered">
            <tbody>
              <tr>
                <td colSpan="25" style={{ textAlign: "center", fontStyle: "italic" }}>
                  Aucun historique disponible
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  
    // ✅ Filter historique by matching `suivi` status and ensuring a meaningful description
    const latestHistorique = item.historique
      .filter(h => h.description && h.description !== "Réclamation mise à jour") // ✅ Ignore generic updates
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // ✅ Get the latest entry
      .shift();
  
    return (
      <div>
        <table className="table table-responsive table-bordered">
          <tbody>
            <tr>
              <td colSpan="25" style={{ padding: "0" }}>
                <div>
                  <table
                    className="table table-responsive table-bordered"
                    style={{ marginTop: "0px", marginBottom: "0px" }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#0097A7", color: "white" }}>
                        <th className="ColoretableForm">Date</th>
                        <th className="ColoretableForm">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestHistorique ? (
                        <tr>
                          <td style={{ textAlign: "center", fontWeight: "bold" }}>
                            {new Date(latestHistorique.date).toLocaleDateString("fr-FR")}
                          </td>
                          <td>{latestHistorique.description}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="2" style={{ textAlign: "center", fontStyle: "italic" }}>
                            Aucun historique correspondant au statut actuel
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReclamationFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
  
    // Validation
    const requiredFields = {
      type_reclamation: !reclamationFormData.type_reclamation,
      reclamer_a_travers: !reclamationFormData.reclamer_a_travers,
      departement_affecte: !reclamationFormData.departement_affecte,
    };
  
    if (Object.values(requiredFields).some(field => field)) {
      setErrors(requiredFields);
      Swal.fire("Erreur!", "Champs obligatoires manquants", "error");
      return;
    }
  
    const payload = {
      type_reclamation: reclamationFormData.type_reclamation.trim(),
      reclamer_a_travers: reclamationFormData.reclamer_a_travers.trim(),
      departement_id: parseInt(reclamationFormData.departement_affecte, 10), // ✅ Correct field name
      suivi: reclamationFormData.suivi || "En attente",
      reponse: reclamationFormData.reponse?.trim() || "",
    };
    
    console.log("Submitting Payload:", payload);    
  
    try {
      console.log("Submitting payload:", payload); // ✅ Debugging log
  
      const { id } = editingReclamation || {};
      const url = id 
        ? `http://localhost:8000/api/reclamations/${id}`
        : "http://localhost:8000/api/reclamations";
      
      const method = id ? "put" : "post";
  
      const response = await axios[method](url, payload);
  
      console.log("Response:", response); // ✅ Debugging log
  
      if ([200, 201].includes(response.status)) {
        await fetchData();
        closeForm();
        Swal.fire("Succès!", `Réclamation ${id ? 'modifiée' : 'ajoutée'}`, "success");
      }
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message, error);
      Swal.fire("Erreur!", error.response?.data?.message || error.message, "error");
    }
  };
  

// Create filter options based on your departments data
// Correct if rec.departement_affecte is the department name
const filterOptions = [
  {
    label: "Department",
    key: "departement_affecte",
    options: departments.map((dept) => ({
      value: dept.designation,  // Ensure you are using the department name
      label: dept.designation,
    })),
  },
];



// Handler for filter changes – adjust as needed for other filters
const handleFilterChange = (key, value) => {
  setSelectedDepartment(value);
  setFilteredReclamations(
    reclamations.filter(
      rec => rec.departement?.nom === value // ✅ Properly checking department name
    )
  );
};




// Handler for the Add button click (e.g., open the "Add Reclamation" modal)
const handleAddClick = () => {
  setShowAddReclamationModal(true);
};




const closeForm = () => {
  setReclamationFormData({
    type_reclamation: "",
    reclamer_a_travers: "",
    departement_affecte: "",
    suivi: "",
    reponse: "",
  });
  setErrors({});
  setHasSubmitted(false);
  setShowAddReclamationModal(false);
  setShowEditReclamationModal(false);
  setFormContainerStyle({ right: "-100%" });
  setTableContainerStyle({ 
    marginRight: "0",
    transition: "margin 0.3s ease" 
  });
};
  

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(reclamations.map((rec) => rec.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleEdit = (reclamation) => {
    console.log("Editing:", reclamation); // ✅ Debugging log
    setEditingReclamation(reclamation);
    handleShowFormButtonClick(reclamation);
  };
  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Supprimer cette réclamation?",
      icon: "warning",
      showCancelButton: true,
    });
  
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:8000/api/reclamations/${id}`);
      fetchData(); // Refresh the table
      Swal.fire("Supprimé!", "Réclamation supprimée.", "success");
    }
  };
  
  const handleDeleteSelected = async () => {
    const result = await Swal.fire({
      title: "Supprimer les réclamations sélectionnées?",
      icon: "warning",
      showCancelButton: true,
    });
  
    if (result.isConfirmed) {
      for (let id of selectedItems) {
        await axios.delete(`http://localhost:8000/api/reclamations/${id}`);
      }
      fetchData(); // Refresh the table
      Swal.fire("Supprimé!", "Les réclamations sélectionnées ont été supprimées.", "success");
    }
  };

  const handleShowFormButtonClick = (reclamation = null) => {
    setEditingReclamation(reclamation);
    setReclamationFormData(reclamation ? {
      ...reclamation,
      departement_affecte: reclamation.departement_id ? reclamation.departement_id.toString() : "", // ✅ Correct field
    } : {
      type_reclamation: "",
      reclamer_a_travers: "",
      departement_affecte: "",
      suivi: "",
      reponse: "",
    });
  
    setFormContainerStyle({ right: "0" });
    setTableContainerStyle({ 
      marginRight: "650px", // Match form width + gap
      transition: "margin 0.3s ease" 
    });
  };
  

  const handleAddDepartment = async () => {
    try {
      if (!newDepartment.name.trim()) {
        setDepartmentErrors({ name: true });
        return;
      }
  
      const url = editingDepartment
        ? `http://localhost:8000/api/reclamations/departements/${editingDepartment.id}`
        : "http://localhost:8000/api/reclamations/departements";
      const method = editingDepartment ? "put" : "post";
  
      await axios[method](url, { nom: newDepartment.name });
  
      Swal.fire("Succès!", `Département ${editingDepartment ? "modifié" : "ajouté"}`, "success");
      fetchData(); // Refresh departments list
      setShowAddDepartmentModal(false);
      setNewDepartment({ name: "" });
      setEditingDepartment(null);
    } catch (error) {
      Swal.fire("Erreur!", error.response?.data?.message || "Échec de l'opération", "error");
      console.error(error); // log error for debugging purposes
    }
  };
  
  
  const handleDeleteDepartment = async (id) => {
    const result = await Swal.fire({
        title: "Supprimer ce département?",
        text: "Cette action est irréversible.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer!",
        cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`http://localhost:8000/api/reclamations/departements/${id}`);
            fetchData(); // Refresh departments list
            Swal.fire("Supprimé!", "Département supprimé.", "success");
        } catch (error) {
            console.error("Error deleting department:", error.response?.data); // Log the error details
            Swal.fire(
                "Erreur!",
                error.response?.data?.message || "Échec de la suppression",
                "error"
            );
        }
    }
}; 
  
  
  
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
          <SearchWithExportCarousel
            onSearch={setSearchTerm}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
            printTable={() => window.print()}
            categories={departments}
            selectedCategory={selectedDepartment}
            handleCategoryFilterChange={setSelectedDepartment}
            activeIndex={activeIndex}
            handleSelect={setActiveIndex}
            chunks={chunks}
            subtitle="Réclamations"
            Title="Liste des Réclamations"
          />
  
          <DynamicFilter
            filters={filterOptions}
            onFilterChange={handleFilterChange}
            onAddClick={() => handleShowFormButtonClick()}
            addButtonLabel="Ajouter Réclamation"
          />
  <div className="form-table-container" style={{ position: 'relative', display: 'flex' }}>
            <div id="formContainer" className="form-sidebar" style={{ ...formContainerStyle }}>
            <Form onSubmit={handleSubmit} className="text-center">
              <h4
                style={{
                  fontSize: "25px",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  color: "black",
                  borderBottom: "2px solid black",
                  paddingBottom: "5px",
                }}
              >
                {editingReclamation ? "Modifier" : "Ajouter"} Réclamation
              </h4>

              {/* Type de Réclamation */}
              <Form.Group className="form-group d-flex align-items-center">
                <Form.Label className="form-label" style={{ minWidth: "195px" }}>
                  Type de Réclamation
                </Form.Label>
                <div style={{ flex: 1, position: "relative" }}>
                  <Form.Control
                    type="text"
                    name="type_reclamation"
                    value={reclamationFormData.type_reclamation}
                    onChange={handleChange}
                    isInvalid={hasSubmitted && !!errors.type_reclamation}
                  />
                  <Form.Control.Feedback type="invalid" style={{ width: "100%", textAlign: "left" }}>
                    {hasSubmitted && errors.type_reclamation && "Required"}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Réclamé à travers */}
              <Form.Group className="form-group d-flex align-items-center">
                <Form.Label className="form-label" style={{ minWidth: "195px" }}>
                  Réclamé à travers
                </Form.Label>
                <div style={{ flex: 1, position: "relative" }}>
                  <Form.Control
                    type="text"
                    name="reclamer_a_travers"
                    value={reclamationFormData.reclamer_a_travers}
                    onChange={handleChange}
                    isInvalid={hasSubmitted && !!errors.reclamer_a_travers}
                  />
                  <Form.Control.Feedback type="invalid" style={{ width: "100%", textAlign: "left" }}>
                    {hasSubmitted && errors.reclamer_a_travers && "Required"}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Département */}
              <Form.Group className="form-group d-flex align-items-center">
              <FontAwesomeIcon 
                    icon={faPlus} 
                    className="text-primary ms-2" 
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddDepartmentModal(true)}
                  />
                <Form.Label className="form-label" style={{ minWidth: "195px" }}>
                  Département
                </Form.Label>
                <div style={{ flex: 1, position: "relative" }}>
                <Form.Select
                  name="departement_affecte"
                  value={reclamationFormData.departement_affecte}
                  onChange={(e) => {
                    const selectedDept = departments.find(
                      (dept) => dept.id === parseInt(e.target.value, 10)
                    );
                    console.log("Selected Department ID:", e.target.value);
                    setReclamationFormData(prev => ({
                      ...prev,
                      departement_affecte: selectedDept?.id || ""
                    }));
                  }}
                  isInvalid={hasSubmitted && !!errors.departement_affecte}
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.designation}
                    </option>
                  ))}
                </Form.Select>
                  <Form.Control.Feedback type="invalid" style={{ width: "100%", textAlign: "left" }}>
                    {hasSubmitted && errors.departement_affecte && "Required"}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Suivi */}
              <Form.Group className="form-group d-flex align-items-center">
                <Form.Label className="form-label" style={{ minWidth: "195px" }}>
                  Status
                </Form.Label>
                <div style={{ flex: 1 }}>
                  <Form.Select
                    name="suivi"
                    value={reclamationFormData.suivi}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner un status</option>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Traité">Traité</option>
                    <option value="Résolu">Résolu</option>
                  </Form.Select>
                </div>
              </Form.Group>

              {/* Réponse */}
              <Form.Group className="form-group d-flex align-items-center">
                <Form.Label className="form-label" style={{ minWidth: "195px" }}>
                  Réponse
                </Form.Label>
                <div style={{ flex: 1 }}>
                  <Form.Control
                    as="textarea"
                    name="reponse"
                    value={reclamationFormData.reponse || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </Form.Group>

              {/* Buttons */}
              <Form.Group className="d-flex justify-content-center mt-3">
                <Fab variant="extended" className="btn-sm Fab mx-2" type="submit">
                  VALIDER
                </Fab>
                <Fab variant="extended" className="btn-sm FabAnnule mx-2" onClick={closeForm}>
                  ANNULER
                </Fab>
              </Form.Group>
            </Form>
          </div>

  
          <div id="tableContainer" className="table-container" style={{ ...tableContainerStyle }}>
            <ExpandRTable
              columns={columns}
              data={reclamations}
              filteredData={filteredReclamations}
              searchTerm={searchTerm}
              highlightText={highlightText}
              selectAll={selectAll}
              selectedItems={selectedItems}
              handleSelectAllChange={handleSelectAllChange}
              handleCheckboxChange={handleCheckboxChange}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleDeleteSelected={handleDeleteSelected}
              rowsPerPage={5}
              page={0}
              handleChangePage={() => {}}
              handleChangeRowsPerPage={() => {}}
              expandedRows={expandedRows}
              toggleRowExpansion={toggleRowExpansion}
              renderExpandedRow={renderExpandedRow}
            />
          </div>
          </div>
        </Box>
      </Box>

      <Modal 
          show={showAddDepartmentModal} 
          onHide={() => setShowAddDepartmentModal(false)}
          size="md"
        >
          <Modal.Header closeButton style={{ borderBottom: '2px solid #dee2e6' }}>
            <Modal.Title className="w-100 text-center">
              <h4 style={{
                fontSize: "25px",
                fontFamily: "Arial, sans-serif", 
                fontWeight: "bold",
                color: "black",
                paddingBottom: "5px",
              }}>
                {editingDepartment ? "Modifier" : "Ajouter"} Département
              </h4>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label>Nom du Département</Form.Label>
              <Form.Control
                type="text"
                value={newDepartment.name}
                onChange={(e) => {
                  setNewDepartment({ name: e.target.value });
                  setDepartmentErrors({ name: false });
                }}
                isInvalid={departmentErrors.name}
                style={{ borderRadius: '4px', padding: '8px 12px' }}
              />
              <Form.Control.Feedback type="invalid">
                Veuillez entrer un nom valide
              </Form.Control.Feedback>
            </Form.Group>

            <div className="mt-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th>Nom</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.designation}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-primary me-2"
                          style={{ cursor: "pointer", fontSize: '1.2rem' }}
                          onClick={() => {
                            setNewDepartment({ name: dept.designation });
                            setEditingDepartment(dept);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-danger"
                          style={{ cursor: "pointer", fontSize: '1.2rem' }}
                          onClick={() => handleDeleteDepartment(dept.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>

          <Modal.Footer style={{ borderTop: '1px solid #dee2e6' }}>
            <div className="d-flex justify-content-center w-100">
              <Fab
                variant="extended"
                className="btn-sm Fab mx-2"
                onClick={handleAddDepartment}
                style={{ minWidth: '120px' }}
              >
                {editingDepartment ? "Modifier" : "Valider"}
              </Fab>
              <Fab
                variant="extended"
                className="btn-sm FabAnnule mx-2"
                onClick={() => setShowAddDepartmentModal(false)}
                style={{ minWidth: '120px' }}
              >
                Annuler
              </Fab>
            </div>
          </Modal.Footer>
        </Modal>
    </ThemeProvider>
  );
};

export default ReclamationPage;
