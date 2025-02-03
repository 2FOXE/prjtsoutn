import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Carousel } from "react-bootstrap";
import Search from "../Acceuil/Search";
import { highlightText } from "../utils/textUtils";
import TablePagination from "@mui/material/TablePagination";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleIcon from "@mui/icons-material/People";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
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
import * as XLSX from "xlsx";
import "../style.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Checkbox, Fab, Toolbar } from "@mui/material";
import { useOpen } from "../Acceuil/OpenProvider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";



//------------------------- Chambres ---------------------//
const Chambre = () => {
  // Data states
  const [chambres, setChambres] = useState([]);
  const [vues, setVues] = useState([
    { id: 1, vue: "Vue 1", photo: "" },
    { id: 2, vue: "Vue 2", photo: "" },
    // Add the rest of the vues as needed...
  ]);
  const [etages, setEtages] = useState([
    { id: 1, etage: "Etage 1", photo: "" },
    { id: 2, etage: "Etage 2", photo: "" },
    // Add the rest of the etages as needed...
  ]);
  const [types, setTypes] = useState([]);
  const [selectedVue, setSelectedVue] = useState(null);
  const [selectedEtage, setSelectedEtage] = useState(null);

  // New record states
  const [newVue, setNewVue] = useState({ vue: "", vueAdd: "", photo: "" });
  const [newEtage, setNewEtage] = useState({ etage: "", photo: "", etageAdd: "" });
  const [newTypes, setNewTypes] = useState({
    code: "",
    types: "",
    nb_lit: "",
    nb_salle: "",
    commentaire: "",
    codeAdd: "",
    type_chambreAdd: "",
    nb_litAdd: "",
    nb_salleAdd: "",
    commentaireAdd: ""
  });

  // UI control states for modals/forms
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddVue, setShowAddVue] = useState(false);
  const [showAddEtage, setShowAddEtage] = useState(false);
  const [showEditModalVue, setShowEditModalVue] = useState(false);
  const [showEditModalEtage, setShowEditModalEtage] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form data & error states
  const [formData, setFormData] = useState({
    types: "",
    num_chambre: "",
    etage: "",
    nb_lit: "",
    nb_salle: "",
    climat: false,
    wifi: false,
    vue: "",
  });
  const [errors, setErrors] = useState({});

  // Editing state
  const [editingChambre, setEditingChambre] = useState(null);

  // Pagination & selection states
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredChambres, setFilteredChambres] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Form container style states
  const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
  const [tableContainerStyle, setTableContainerStyle] = useState({ marginRight: "0px" });

  // Separate carousel active indexes for vues and etages
  const [activeIndexVue, setActiveIndexVue] = useState(0);
  const [activeIndexEtage, setActiveIndexEtage] = useState(0);

  // Context for dynamic styles
  const { dynamicStyles } = useOpen();

  
  // Fetch chambres data from API
  const fetchChambres = async () => {
    try {
      const response = await axios.get("http://localhost:8000/sanctum/csrf-cookie");

      
      const data = response.data;
      setChambres(data.chambres);
      if (data.vues && data.vues.length > 0) {
        setVues(data.vues);
      }
      if (data.etages && data.etages.length > 0) {
        setEtages(data.etages);
      }
      setTypes(data.types);
      localStorage.setItem("chambres", JSON.stringify(data.chambres));
      localStorage.setItem("vues", JSON.stringify(data.vues));
      localStorage.setItem("etages", JSON.stringify(data.etages));
      localStorage.setItem("types", JSON.stringify(data.types));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des Chambres.",
        });
      }
    }
  };

  useEffect(() => {
    const storedChambres = localStorage.getItem("chambres");
    const storedTypes = localStorage.getItem("types");
    const storedVues = localStorage.getItem("vues");
    const storedEtages = localStorage.getItem("etages");

    if (storedChambres && storedTypes && storedVues && storedEtages) {
      setChambres(JSON.parse(storedChambres));
      setTypes(JSON.parse(storedTypes));
      setVues(JSON.parse(storedVues));
      setEtages(JSON.parse(storedEtages));
    } else {
      fetchChambres();
    }
  }, []);

  // Filtering useEffect: filters chambres by selectedVue, selectedEtage and searchTerm.
  useEffect(() => {
    let updatedChambres = chambres;
    if (selectedVue) {
      updatedChambres = updatedChambres.filter(
        (chambre) => chambre.vue && chambre.vue.id === selectedVue
      );
    }
    if (selectedEtage) {
      updatedChambres = updatedChambres.filter(
        (chambre) => chambre.etage && chambre.etage.id === selectedEtage
      );
    }
    if (searchTerm) {
      updatedChambres = updatedChambres.filter((chambre) =>
        Object.values(chambre).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (typeof value === "number") {
            return value.toString().includes(searchTerm);
          }
          return false;
        })
      );
    }
    setFilteredChambres(updatedChambres);
  }, [chambres, selectedVue, selectedEtage, searchTerm]);
  const authenticateUser = async () => {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
};

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.type === "radio") {
      // For radio buttons, store as boolean (true/false)
      setFormData({
        ...formData,
        [e.target.name]: e.target.value === "true", // Convert radio to boolean
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // When editing a chambre, convert numeric fields to booleans for the radio buttons.
  const handleEdit = (chambre) => {
    setEditingChambre(chambre);
    setFormData({
      type_chambre: chambre.type_chambre.id,
      num_chambre: chambre.num_chambre,
      etage: chambre.etage_id,
      nb_lit: chambre.nb_lit,
      nb_salle: chambre.nb_salle,
      climat: chambre.climat === 1, // Convert numeric to boolean
      wifi: chambre.wifi === 1, // Convert numeric to boolean
      vue: chambre.vue_id,
    });
    setFormContainerStyle({ right: "0" });
    setTableContainerStyle({ marginRight: "650px" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.num_chambre) newErrors.num_chambre = "Le numéro de chambre est requis.";
    if (!formData.type_chambre) newErrors.type_chambre = "Le type de chambre est requis.";
    if (!(selectedVue || formData.vue)) newErrors.vue = "La vue est requise.";
    if (!(selectedEtage || formData.etage)) newErrors.etage = "L'étage est requis.";
    if (!formData.nb_lit) newErrors.nb_lit = "Le nombre de lit est requis.";
    if (!formData.nb_salle) newErrors.nb_salle = "Le nombre de salle est requis.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // Retrieve stored token
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Non authentifié",
        text: "Vous devez être connecté pour ajouter une chambre.",
      });
      return;
    }
  
    try {
      // Step 1: Ensure CSRF cookie is set before making the API request
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true, // Make sure cookies are sent
      });
  
      const requestData = {
        type_chambre: formData.type_chambre,
        num_chambre: formData.num_chambre,
        etage_id: formData.etage || selectedEtage,
        nb_lit: formData.nb_lit,
        nb_salle: formData.nb_salle,
        climat: formData.climat ? 1 : 0,
        wifi: formData.wifi ? 1 : 0,
        vue_id: formData.vue || selectedVue,
      };
  
      // Step 2: Send the request with the token
      const response = await axios.post("http://localhost:8000/api/chambres", requestData, {
        headers: {
          "Authorization": `Bearer ${token}`, // Include token in header
          "Content-Type": "application/json", // Ensure JSON content type
        },
        withCredentials: true, // Ensure credentials are sent if needed for Sanctum
      });
  
      fetchChambres();
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Chambre ajoutée avec succès.",
      });
      closeForm();
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de l'ajout de la chambre.",
      });
    }
  };
  
  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0" });
    setShowForm(false);
    setFormData({
      type_chambre: "",
      num_chambre: "",
      etage: "",
      nb_lit: "",
      nb_salle: "",
      climat: false,
      wifi: false,
      vue: "",
    });
    setErrors({});
    setEditingChambre(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem("rowsPerPageChambres", selectedRows);
    setPage(0);
  };

  useEffect(() => {
    const savedRows = localStorage.getItem("rowsPerPageChambres");
    if (savedRows) {
      setRowsPerPage(parseInt(savedRows, 10));
    }
  }, []);

  const handleDelete = (num_chambre) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce client ?",
      showDenyButton: true,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/chambres/${num_chambre}`)
          .then(() => {
            fetchChambres();
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Chambre supprimée avec succès.",
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response.data.error,
              });
            } else {
              console.error("Une erreur s'est produite :", error);
            }
          });
      }
    });
  };

  const handleDeleteSelected = () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      showDenyButton: true,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedItems.forEach((id) => {
          axios
            .delete(`http://localhost:8000/api/all-chambres`)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Chambres supprimées avec succès.",
              });
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression:", error);
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: "Échec de la suppression.",
              });
            });
        });
        setSelectedItems([]);
        fetchChambres();
      }
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(chambres?.map((chambre) => chambre.id));
    }
  };

  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const exportToExcel = () => {
    const table = document.getElementById("chambresTable");
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Chambres" });
    XLSX.writeFile(workbook, "chambres_table.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Table Chambres", 14, 16);
    doc.autoTable({
      head: [["Code Chambre", "Type", "Etage", "Nombre de lit", "Nombre de salle", "Climat", "Wifi", "Vue"]],
      body: filteredChambres?.map((chambre) => [
        chambre.num_chambre || "",
        chambre.type_chambres?.type_chambre || "",
        chambre.etage?.etage || "",
        chambre.nb_lit || "",
        chambre.nb_salle || "",
        chambre.climat || "",
        chambre.wifi || "",
        chambre.vue?.vue || "",
      ]),
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8, overflow: "linebreak" },
      headStyles: { fillColor: "#007bff" },
    });
    doc.save("chambres_table.pdf");
  };

  const printTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Chambre List</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Chambre List</h1>
          <table>
            <thead>
              <tr>
                <th>Code Chambre</th>
                <th>Type</th>
                <th>Etage</th>
                <th>Nombre de lit</
              <tr>
                <th>Code Chambre</th>
                <th>Type</th>
                <th>Etage</th>
                <th>Nombre de lit</th>
                <th>Nombre de salle</th>
                <th>Climat</th>
                <th>Wifi</th>
                <th>Vue</th>
              </tr>
            </thead>
            <tbody>
              ${filteredChambres?.map(
                (chambre) => `
                <tr>
                  <td>${chambre.num_chambre || ""}</td>
                  <td>${chambre.type_chambre?.type_chambre || ""}</td>
                  <td>${chambre.etage?.etage || ""}</td>
                  <td>${chambre.nb_lit || ""}</td>
                  <td>${chambre.nb_salle || ""}</td>
                  <td>${chambre.climat ? "Oui" : "Non"}</td>
                  <td>${chambre.wifi ? "Oui" : "Non"}</td>
                  <td>${chambre.vue?.vue || ""}</td>
                </tr>`
              ).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Utility: split an array into chunks.
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array?.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const chunkSize = 9;
  const chunks = chunkArray(vues, chunkSize);
  const chunks1 = chunkArray(etages, chunkSize);

  const handleVueFilterChange = (catId) => {
    setSelectedVue(catId);
    setFormData({ ...formData, vue: "" });
  };

  const handleEtageFilterChange = (catId) => {
    setSelectedEtage(catId);
    setFormData({ ...formData, etage: "" });
  };

  const handleShowFormButtonClick = () => {
    setFormContainerStyle({ right: "0" });
    setTableContainerStyle({ marginRight: "650px" });
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "15px" }}>
            <h3 className="titreColore">
              {/* <PeopleIcon style={{ fontSize: "24px", marginRight: "8px" }} /> */}
              Liste des Chambres
            </h3>
            <div className="d-flex">
              <div style={{ width: "500px", marginRight: "20px" }}>
                <Search onSearch={handleSearch} type="search" />
              </div>
              <div>
                <FontAwesomeIcon
                  style={{ cursor: "pointer", color: "grey", fontSize: "2rem" }}
                  onClick={printTable}
                  icon={faPrint}
                  className="me-2"
                />
                <FontAwesomeIcon
                  style={{ cursor: "pointer", color: "red", fontSize: "2rem", marginLeft: "15px" }}
                  onClick={exportToPDF}
                  icon={faFilePdf}
                />
                <FontAwesomeIcon
                  icon={faFileExcel}
                  onClick={exportToExcel}
                  style={{ cursor: "pointer", color: "green", fontSize: "2rem", marginLeft: "15px" }}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between w-100 position-relative">
  {/* Vues du Chambre */}
  <div className="text-center w-50">
    <h5 className="AjouteBotton text-start">Vues du Chambre</h5>
    <div className="bgSecteur d-flex align-items-center position-relative">
      {/* Left Arrow */}
      <div
        className="carousel-arrow left"
        onClick={() => setActiveIndex(activeIndex - 1)}
      >
        <FaArrowLeft />
      </div>

      {/* Vues Carousel */}
      <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null} controls={false} indicators={false}>
        {chunks?.map((chunk, chunkIndex) => (
          <Carousel.Item key={chunkIndex}>
            <div className="d-flex justify-content-start">
              {chunk?.map((category, index) => (
                <a href="#" className="mx-2 text-center" key={index}>
                  <div
                    className={`category-item ${selectedVue === category.id ? "active" : ""}`}
                    onClick={() => handleVueFilterChange(category.id)}
                  >
                    <img
                      src={category.photo ? `http://127.0.0.1:8000/storage/${category.photo}` : "http://127.0.0.1:8000/storage/vue-img.webp"}
                      alt={category.vue}
                      loading="lazy"
                      className="rounded-circle category-img"
                    />
                    <p className="category-text">{category.vue}</p>
                  </div>
                </a>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Right Arrow */}
      <div
        className="carousel-arrow right"
        onClick={() => setActiveIndex(activeIndex + 1)}
      >
        <FaArrowRight />
      </div>
    </div>
  </div>

  {/* Etages du Chambre */}
  <div className="text-center w-50">
    <h5 className="AjouteBotton text-start">Etages du Chambre</h5>
    <div className="bgSecteur d-flex align-items-center position-relative">
      {/* Left Arrow */}
      <div
        className="carousel-arrow left"
        onClick={() => setActiveIndex(activeIndex - 1)}
      >
        <FaArrowLeft />
      </div>

      {/* Etages Carousel */}
      <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null} controls={false} indicators={false}>
        {chunks1?.map((chunk, chunkIndex) => (
          <Carousel.Item key={chunkIndex}>
            <div className="d-flex justify-content-start">
              {chunk?.map((category, index) => (
                <a href="#" className="mx-2 text-center" key={index}>
                  <div
                    className={`category-item ${selectedEtage === category.id ? "active" : ""}`}
                    onClick={() => handleEtageFilterChange(category.id)}
                  >
                    <img
                      src={category.photo ? `http://127.0.0.1:8000/storage/${category.photo}` : "http://127.0.0.1:8000/storage/etage-img.webp"}
                      alt={category.etage}
                      loading="lazy"
                      className="rounded-circle category-img"
                    />
                    <p className="category-text">{category.etage}</p>
                  </div>
                </a>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Right Arrow */}
      <div
        className="carousel-arrow right"
        onClick={() => setActiveIndex(activeIndex + 1)}
      >
        <FaArrowRight />
      </div>
    </div>
  </div>
</div>




<div className="container-d-flex justify-content-start">
            <div style={{ display: "flex", alignItems: "center", marginTop: '15px', padding: '0' }}>
              <button 
                className="btn btn-success btn-sm d-flex align-items-center"
                onClick={handleShowFormButtonClick}
                style={{ marginBottom: '10px' }}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" style={{ fontSize: '18px' }} />
                Ajouter Chambre
              </button>
            </div>

          

        <div style={{ marginTop:"0px",}}>
        <div 
              id="formContainer" 
              className="" 
              style={{
                ...formContainerStyle,
                marginTop: '20px', // Added margin-top
                maxHeight: '700px',
                overflow: 'auto',
                padding: '0'
              }}
            >
              <Form className="col row" onSubmit={handleSubmit}>
                <Form.Label className="text-center ">
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
                      {editingChambre ? "Modifier" : "Ajouter"} une Chambre</h4>
                </Form.Label>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label>Numero de Chambre</Form.Label>
                  <Form.Control
                    type="number"
                    name="num_chambre"
                    isInvalid={!!errors.num_chambre}
                    value={formData.num_chambre}
                    placeholder="Numero de Chambre"
                    onChange={handleChange}
                    className="form-control"
            
                    lang="fr"
                  />
                  <Form.Text className="text-danger">{errors.num_chambre}</Form.Text>
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className=" text-primary"
                    style={{ cursor: "pointer",marginTop:'-10px' }}
                    onClick={() => setShowAddCategory(true)} // Affiche le formulaire
                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px'}}>Type</Form.Label>
                  <Form.Select
                      name="type_chambre"
                      value={formData.type_chambre}
                      isInvalid={!!errors.type_chambre}
                      onChange={handleChange}>
                      <option value="">Sélectionner Type</option>
                      {types?.map((type) => (
                        <option key={type.id} value={type.id}>{type.type_chambre}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">{errors.type_chambre}</Form.Text>
                  </Form.Group>
                  <Form.Group className="col-sm-6 mt-2" controlId="vue">
                    <FontAwesomeIcon icon={faPlus} className="text-primary" style={{ cursor: "pointer" }}
                      onClick={() => setShowAddVue(true)} />
                    <Form.Label style={{ marginLeft: "10px", marginTop: "7px" }}>Vue</Form.Label>
                    <Form.Select name="vue" value={selectedVue || formData.vue} onChange={handleChange}>
                      <option value="">Sélectionner une Vue</option>
                      {vues?.map((vue) => (
                        <option key={vue.id} value={vue.id}>{vue.vue}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">{errors.vue}</Form.Text>
                  </Form.Group>
                  <Form.Group className="col-sm-6 mt-2" controlId="etage">
                    <FontAwesomeIcon icon={faPlus} className="text-primary" style={{ cursor: "pointer" }}
                      onClick={() => setShowAddEtage(true)} />
                    <Form.Label style={{ marginLeft: "10px", marginTop: "7px" }}>Etage</Form.Label>
                    <Form.Select name="etage" value={selectedEtage || formData.etage} onChange={handleChange}>
                      <option value="">Sélectionner un Etage</option>
                      {etages?.map((etage) => (
                        <option key={etage.id} value={etage.id}>{etage.etage}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">{errors.etage}</Form.Text>
                  </Form.Group>
                  <Form.Group className="col-sm-6 mt-2" controlId="nb_salle">
                  <FontAwesomeIcon icon={faPlus} className="text-primary" style={{ cursor: "pointer", marginTop: "-10px" }}
                      onClick={() => setShowAddCategory(true)} />
                    &nbsp;
                    <Form.Label>Nombre de salle</Form.Label>
                    <Form.Select name="nb_salle" value={formData.nb_salle} onChange={handleChange}>
                      <option value="">Nombre de Salle</option>
                      {Array.from({ length: 7 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">{errors.nb_salle}</Form.Text>
                  </Form.Group>
                  {/* Climat Radio Buttons */}
                  <Form.Group className="col-sm-6 mt-2" controlId="climat">
                    <Form.Label>Climat</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Oui"
                        type="radio"
                        name="climat"
                        id="climatOui"
                        value="true"
                        checked={formData.climat === true}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Non"
                        type="radio"
                        name="climat"
                        id="climatNon"
                        value="false"
                        checked={formData.climat === false}
                        onChange={handleChange}
                      />
                    </div>
                    <Form.Text className="text-danger">{errors.climat}</Form.Text>
                  </Form.Group>
                  {/* Wifi Radio Buttons */}
                  <Form.Group className="col-sm-6 mt-2" controlId="wifi">
                    <Form.Label>Wifi</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Oui"
                        type="radio"
                        name="wifi"
                        id="wifiOui"
                        value="true"
                        checked={formData.wifi === true}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Non"
                        type="radio"
                        name="wifi"
                        id="wifiNon"
                        value="false"
                        checked={formData.wifi === false}
                        onChange={handleChange}
                      />
                    </div>
                    <Form.Text className="text-danger">{errors.wifi}</Form.Text>
                  </Form.Group>
                  <Form.Group className="col-sm-6 mt-2" controlId="nb_lit">
                    <FontAwesomeIcon icon={faPlus} className="text-primary" style={{ cursor: "pointer", marginTop: "-10px" }}
                      onClick={() => setShowAddCategory(true)} />
                    &nbsp;
                    <Form.Label>Nombre de lit</Form.Label>
                    <Form.Select name="nb_lit" value={formData.nb_lit} onChange={handleChange}>
                      <option value="">Nombre de Lit</option>
                      {Array.from({ length: 7 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">{errors.nb_lit}</Form.Text>
                  </Form.Group>
                  <div className="mt-5 d-flex justify-content-center" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <button type="submit" className="btn btn-primary mx-2">
                      Valider
                    </button>
                    <button type="button" className="btn btn-secondary mx-2" onClick={closeForm}>
                      Annuler
                    </button>
                  </div>
                </Form>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div id="tableContainer" className="table-responsive" style={{
                ...tableContainerStyle,
                overflowX: "auto",
                minWidth: "650px",
                maxHeight: "700px",
              }}>
                <table className="table table-bordered" id="chambresTable" style={{ marginTop: "-5px" }}>
                  <thead className="text-center table-secondary" style={{
                    position: "sticky", top: -1,
                    backgroundColor: "#ddd", zIndex: 1, padding: "10px"
                  }}>
                    <tr>
                      <th>
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                      </th>
                      <th>Num Chambre</th>
                      <th>Type</th>
                      <th>Etage</th>
                      <th>Vue</th>
                      <th>Nombre de lit</th>
                      <th>Nombre de Salle</th>
                      <th>Climat</th>
                      <th>Wifi</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center" style={{ backgroundColor: "#007bff" }}>
                    {filteredChambres?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((chambre) => (
                        <React.Fragment key={chambre.num_chambre}>
                          <tr>
                            <td style={{ backgroundColor: "white" }}>
                              <input type="checkbox" checked={selectedItems.some((item) => item === chambre.id)}
                                onChange={() => handleCheckboxChange(chambre.id)} />
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.num_chambre, searchTerm) || ""}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.type_chambre?.type_chambre, searchTerm) || ""}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.etage?.etage, searchTerm) || ""}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.vue?.vue, searchTerm) || ""}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(String(chambre.nb_lit), searchTerm) || ""}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.nb_salle, searchTerm) || ""}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.climat ? "Oui" : "Non", searchTerm)}
                            </td>
                            <td style={{ backgroundColor: "white" }}>
                              {highlightText(chambre.wifi ? "Oui" : "Non", searchTerm)}
                            </td>
                            <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FontAwesomeIcon onClick={() => handleEdit(chambre)} icon={faEdit}
                                  style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }} />
                                <FontAwesomeIcon onClick={() => handleDelete(chambre.id)} icon={faTrash}
                                  style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }} />
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
                <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}>
                  <FontAwesomeIcon icon={faTrash} style={{ marginRight: "0.5rem" }} />
                  Supprimer sélection
                </button>
                <TablePagination rowsPerPageOptions={[5, 10, 15, 20, 25]} component="div"
                  count={filteredChambres?.length || 0} rowsPerPage={rowsPerPage} page={page}
                  onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};



export default Chambre;

