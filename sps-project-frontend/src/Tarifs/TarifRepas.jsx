import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import Navigation from "../Acceuil/Navigation";
import TablePagination from "@mui/material/TablePagination";
import { highlightText } from '../utils/textUtils';
// import PrintList from "./PrintList";
// import ExportPdfButton from "./exportToPdf";
import { sanitizeInput } from '../utils/sanitizeInput';
import "jspdf-autotable";
import Search from "../Acceuil/Search";
 // Import the new responsive layout
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleIcon from "@mui/icons-material/People";
import jsPDF from 'jspdf';
// import SearchWithExport from "../components/SearchWithExport";
// import CarouselSelector from "../components/CarouselSelector";
import SearchWithExportCarousel from "../components/SearchWithExportCarousel";
import ExpandRTable from "../components/ExpandRTable"; // Adjust the path if needed

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
import { useOpen } from "../Acceuil/OpenProvider"; // Importer le hook personnalisé
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

//------------------------- Tarifs Repas ---------------------//
const TarifRepas = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL_BASE_IMAGE = import.meta.env.VITE_API_URL_BASE_IMAGE;
  const [tarifRepas, setTarifRepas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tarifRepasErrors, setTarifRepasErrors] = useState({
    designation: "",
    photo: null
  })

  const [tarifsRepas, setTarifsRepas] = useState([]);
  const [editingDesignation, setEditingDesignation] = useState({})
  const [typesRepas, setTypesRepas] = useState([]);
  const [newTypeRepas, setNewTypeRepas] = useState({
    code: "",
    type_repas: "",
  });

  //-------------Filtrer par tarifs repas-------------
  const carouselOptions = tarifsRepas?.map((item) => ({
    id: item.id,
    label: item.designation,
    image: item.photo ? `http://127.0.0.1:8000/storage/${item.photo}` : "http://localhost:8000/storage/repas-img.webp",
  }));
   
  


  //---------------form-------------------//
  const [newRepas, setNewRepas] = useState({
    type_repas: "",
    designation: "",
    montant: ""
  });
  const [showEditModalDesignation, setShowEditModalDesignation] = useState(false);
  const [newDesignation, setNewDesignation] = useState({
    designation: "",
    photo: ""
  });
  const [newCategory, setNewCategory] = useState({ categorie: ""})
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditModalSite, setShowEditModalSite] = useState(false);

  const [showEditModalSecteur, setShowEditModalSecteur] = useState(false);
  const [showEditModalmod, setShowEditModalmod] = useState(false);


  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [categorieId, setCategorie] = useState();

const [typeRepas, setTypeRepas] = useState('');



  const [showForm, setShowForm] = useState(false);
  
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type_repas: "", 	
    designation: "",
    montat: ""
  });
  const [errors, setErrors] = useState({
    type_repas: false, 
    designation: false,	
    montant: false
  });
  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0px",
  });
  //-------------------edit-----------------------//
  const [editingTarifRepas, setEditingTarifRepas] = useState(null); // State to hold the client being edited
  const [editingTarifRepasId, setEditingTarifRepasId] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false); 
  const [showAddRepas, setShowAddRepas] = useState(false); 
  const [showAddDesignation, setShowAddDesignation] = useState(false); 
  const [showAddCategorySite, setShowAddCategorySite] = useState(false); // Gère l'affichage du formulaire

  const [showAddRegein, setShowAddRegein] = useState(false); // Gère l'affichage du formulaire
  const [showAddRegeinSite, setShowAddRegeinSite] = useState(false); // Gère l'affichage du formulaire

  const [showAddSecteur, setShowAddSecteur] = useState(false); // Gère l'affichage du formulaire

  const [showAddMod, setShowAddMod] = useState(false); // Gère l'affichage du formulaire

  //-------------------Pagination-----------------------/
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredTarifRepas, setFilteredTarifRepas] = useState([]);
  // Pagination calculations
  const indexOfLastTarif = (page + 1) * rowsPerPage;
  const indexOfFirstTarif = indexOfLastTarif - rowsPerPage;
  const currentRepas = tarifRepas?.slice(indexOfFirstTarif, indexOfLastTarif);
  //-------------------Selected-----------------------/
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //-------------------Search-----------------------/
  const [searchTerm, setSearchTerm] = useState("");
  //------------------------Site-Client---------------------

  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedRowsContact, setExpandedRowsContact] = useState([]);
  const [expandedRowsContactSite, setExpandedRowsContactsite] = useState([]);


  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [selectedProductsDataRep, setSelectedProductsDataRep] = useState([]);


  const fetchTarifRepas = async () => {
    try {
      const response = await axios.get(`${API_URL}/tarifs-repas`);
      const data = response.data;
  
      setTarifRepas(data.tarifRepas);
      setTarifsRepas(data.tarifsRepas);
      setTypesRepas(data.typesRepas)

      localStorage.setItem("typesRepas", JSON.stringify(data.typesRepas));
      localStorage.setItem("tarifRepas", JSON.stringify(data.tarifRepas));
      localStorage.setItem("tarifsRepas", JSON.stringify(data.tarifsRepas));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des Tarifs Repas.",
        });
      }
    }
  };
  
  useEffect(() => {
    const storedTarifRepas = localStorage.getItem("tarifRepas");
    const storedTarifsRepas = localStorage.getItem("tarifsRepas");
    const storedTypesRepas = localStorage.getItem("typesRepas");
    storedTypesRepas && setTypesRepas(JSON.parse(storedTypesRepas));
    storedTarifRepas && setTarifRepas(JSON.parse(storedTarifRepas));
    storedTarifsRepas && setTarifsRepas(JSON.parse(storedTarifsRepas));


    if (!storedTarifRepas || !storedTarifsRepas || !storedTypesRepas)
      fetchTarifRepas();
    
  }, []);

  const toggleRow = (tarifRepasId) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(tarifRepasId)
        ? prevExpandedRows?.filter((id) => id !== tarifRepasId)
        : [...prevExpandedRows, tarifRepasId]
    );
  };
  const toggleRowContact = (tarifRepasId) => {
    setExpandedRowsContact((prevExpandedRows) =>
      prevExpandedRows.includes(tarifRepasId)
        ? prevExpandedRows?.filter((id) => id !== tarifRepasId)
        : [...prevExpandedRows, tarifRepasId]
    );
  };
  const toggleRowContactSite = (TarifRepasId) => {
    setExpandedRowsContactsite((prevExpandedRows) =>
      prevExpandedRows.includes(TarifRepasId)
        ? prevExpandedRows?.filter((id) => id !== TarifRepasId)
        : [...prevExpandedRows, TarifRepasId]
    );
  };
  //---------------------------------------------
  useEffect(() => {
    const filtered = tarifRepas?.filter((tarifRepas) =>
      Object.values(tarifRepas).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
    setFilteredTarifRepas(JSON.stringify(tarifRepas));
  }, [tarifRepas, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  // const handleChange = (e) => {
  //   setUser({
  //     ...user,
  //     [e.target.name]:
  //       e.target.type === "file" ? e.target.files[0] : e.target.value,
  //   });
  // };
  //------------------------- tarif Repas EDIT---------------------//

  const handleEdit = (tarifRepas) => {
    setErrors({})
    setEditingTarifRepas(tarifRepas); 

    // Populate form data with tarif Repas details
    setFormData({
        type_repas: tarifRepas.type_repas?.id || "",
        designation: tarifRepas.tarif_repas?.id || "",
        montant: tarifRepas.montant || "",
  });
    // Sélectionner automatiquement la ligne à modifier
    setSelectedItems([tarifRepas.id]);
  
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } 
  };



  useEffect(() => {
    if (editingTarifRepasId !== null) {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    }
  }, [editingTarifRepasId]);

  useEffect(() => {
    const validateData = () => {
      const newErrors = { ...errors };
      const newTarifRepasErrors = { ...tarifRepasErrors };
      // if (editingDesignation.length > 0)
      // newErrors.designationAddTarif = newDesignation.designation === "";
      newErrors.designation = (selectedCategory || formData.designation) === "";
      newErrors.type_repas = formData.type_repas === "";
      newErrors.montant = formData.montant === "";
      const designations = tarifsRepas.filter((chambre) => chambre.designation);
      newTarifRepasErrors.designation = newDesignation.designation === "" || designations.some((chambre) => sanitizeInput(chambre.designation) === sanitizeInput(newDesignation.designation))
      && sanitizeInput(newDesignation.designation) != sanitizeInput(editingDesignation.designation);
      newTarifRepasErrors.designationAdd = newDesignation.designation === "" || designations.some((chambre) => sanitizeInput(chambre.designation) === sanitizeInput(newDesignation.designation));
      setTarifRepasErrors(newTarifRepasErrors);
      setErrors(newErrors);
      return true;
    };
    validateData();
  }, [formData, newDesignation]);

  // handler for form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mark the form as submitted
    setHasSubmitted(true);
  
    // Check for empty fields
    const newErrors = {
      type_repas: formData.type_repas === "",
      designation: formData.designation === "",
      montant: formData.montant === ""
    };
    setErrors(newErrors); // Update error state
  
    // If there are validation errors, show alert and return
    const hasErrors = Object.values(newErrors).some((error) => error === true);
    if (hasErrors) {
      Swal.fire({
        icon: "error",
        title: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }
  
    // Proceed with API call if no errors
    try {
      const url = editingTarifRepas
        ? `${API_URL}/tarifs-repas/${editingTarifRepas?.id}`
        : `${API_URL}/tarifs-repas`;
  
      const formDatad = new FormData();
      formDatad.append("type_repas", formData.type_repas);
      formDatad.append("tarif_repas", formData.designation);
      formDatad.append("montant", formData.montant);

      // Add `_method: "PUT"` if editing an existing Tarif Repas
      if (editingTarifRepas) {
      formDatad.append("_method", "PUT");
     }
  
      // Send a POST request

      await axios.post(url, formDatad);
      fetchTarifRepas();
  
      Swal.fire({
        icon: "success",
        title: `Tarif Repas ${editingTarifRepas ? "modifié" : "ajouté"} avec succès.`,
      }).then(() => {
        // Reset form and errors after success
        setFormData({ type_repas: "", designation: "", montant: "" });
        setErrors({ type_repas: false, designation: false, montant: false });
        setHasSubmitted(false); // Reset submission state
        closeForm(); // Close the form if needed
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: error.response.data.message,
      });
    }
  };
  

    //------------------------- CHAMBRE FORM---------------------//

    const handleShowFormButtonClick = () => {
      setEditingTarifRepas(null);
      setFormData({
        type_repas: "",
        designation: "",
        montant: "",
      });
      setErrors({
        type_repas: false,
        designation: false,
        montant: false,
      });
      
        // Désélectionner toutes les cases cochées
      setSelectedItems([]);

      // Si le formulaire est fermé, on l’ouvre, sinon on le laisse tel quel.
      if (formContainerStyle.right === "-100%") {
        setFormContainerStyle({ right: "0" });
        setTableContainerStyle({ marginRight: "650px" });
      }
    };

    const closeForm = () => {
      setFormContainerStyle({ right: "-100%" });
      setTableContainerStyle({ marginRight: "0" });
      setSelectedCategory("")
      setShowForm(false); // Hide the form
      setSelectedItems([]);
      // Reset the form data
      setFormData({
        type_repas: "", 
        designation: "",	
        montant: "",
      });

      // Reset the form errors
      setErrors({
        type_repas: false,
        designation: false, 	
        montant: false,
      });

      

      setHasSubmitted(false); // Reset the submission state
      setSelectedProductsData([])
      setSelectedProductsDataRep([])
      setEditingTarifRepas(null); // Clear editing client
    };
  //-------------------------SITE CLIENT----------------------------//
  //-------------------------  SUBMIT---------------------//
  const handleSelectItem = (item) => {
    const selectedIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem?.id === item?.id
    );

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, item?.id]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedItems);
    }

  };

  const getSelectedTarifRepasIds = () => {
    return selectedItems?.map((item) => item?.id);
  };
  
  
  //------------------------- CLIENT PAGINATION---------------------//

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem('rowsPerPageRepass', selectedRows);  // Store in localStorage
    setPage(0);
  };

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem('rowsPerPageRepass');
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  //------------------------- CLIENT DELETE---------------------//

  const handleDelete = (tarif_repas_code) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce tarif ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/tarifs-repas/${tarif_repas_code}`)
          .then(() => {
            fetchTarifRepas();
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Tarif Repas supprimé avec succès.",
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response.data.message,
              });
            } 
          });
      } 
    });
  };
  
  //-------------------------Select Delete --------------------//
  const handleDeleteSelected = () => {

    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        selectedItems.forEach((item) => {
          Swal.fire({
            icon: "success",
            title: "Succès!",
            timer: 3500,
            timerProgressBar: true,
            text: "Tarif Repas supprimé avec succès.",
          });
          axios
            .delete(`${API_URL}/tarifs-repas/${item}`)
            .then(() => {
              fetchTarifRepas();
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                timer: 5500,
                background: red,
                showConfirmButton: false,
                timerProgressBar: true,
                text: error.response.data.message,
              });
            });
        });
      }
    });

    setSelectedItems([]);
    setNewDesignation({})
    setNewTypeRepas({});
    fetchTarifRepas();
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(tarifRepas?.map((TarifRepas) => TarifRepas?.id));
    }
  };



  const handleCheckboxChange = (itemId) => {
  let updatedSelection = [...selectedItems];

  if (updatedSelection.includes(itemId)) {
    updatedSelection = updatedSelection.filter((id) => id !== itemId);
  } else {
    updatedSelection.push(itemId);
  }

  setSelectedItems(updatedSelection);

  // Si un seul élément est sélectionné, on l'affiche dans le formulaire
  if (updatedSelection.length === 1) {
    const selectedTarif = tarifRepas.find((item) => item.id === updatedSelection[0]);
    if (selectedTarif) {
      setEditingTarifRepas(selectedTarif);
      setFormData({
        type_repas: selectedTarif.type_repas?.id || "",
        designation: selectedTarif.tarif_repas?.id || "",
        montant: selectedTarif.montant || "",
      });

      if (formContainerStyle.right === "-100%") {
        setFormContainerStyle({ right: "0" });
        setTableContainerStyle({ marginRight: "650px" });
      }
    }
  } else if (updatedSelection.length === 0) {
    closeForm();
  }
};


  const exportToExcel = () => {
    const table = document.getElementById('tarifRepasTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Tarifs Repas' });
    XLSX.writeFile(workbook, 'tarifs-repas_table.xlsx');
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Manually adding HTML content
    const title = 'Table Tarifs Repas';
    doc.text(title, 14, 16);
    
    doc.autoTable({
      head: [['Type Repas Code', 'Type Repas', 'Designation', 'Montant']],
      body: filteredTarifrepas?.map(tarifRepas => [
        tarifRepas.type_repas.code ? { content: 'Tarif Repas Code', rowSpan: 1 } : '',
        tarifRepas.type_repas.type_repas || '',
        tarifRepas.tarif_repas.designation || '',
        tarifRepas.montant || '',
      ]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: '#007bff' }
    });
  
    doc.save('tarifs-repas_table.pdf');
  };
  

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Tarifs Repas List</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Tarifs Repas List</h1>
          <table>
            <thead>
              <tr>
                <th>Tarif Repas Code</th>
                <th>Tarif Repas</th>
                <th>Type Repas</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTarifrepas?.map(tarifRepas => `
                <tr>
                  <td>${tarifRepas?.id || ''}</td>
                  <td>${tarifRepas?.tarif_repas?.designation || ''}</td>
                  <td>${tarifRepas?.type_repas?.type_repas || ''}</td>
                  <td>${tarifRepas.montant || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.print();
  };

  document.addEventListener("change", async function (event) {
    if (event.target && event.target?.id.startsWith("actionDropdown_")) {
      const [action, typeId] = event.target.value.split("_");
      if (action === "delete") {
        // Delete action
        handleDeleteRepas(typeId);
      } else if (action === "edit") {
        // Edit action
        handleEditRepas(typeId);
      }
      event.target.value = "";
    }
  });


  



  //-----------------------------------------//

  const handleAddEmptyRow = () => {
    setSelectedProductsData([...selectedProductsData, {}]);
};
  const handleAddEmptyRowRep = () => {
    setSelectedProductsDataRep([...selectedProductsDataRep, {}]);
};
const handleDeleteProduct = (index, id) => {
  const updatedSelectedProductsData = [...selectedProductsData];
  updatedSelectedProductsData.splice(index, 1);
  setSelectedProductsData(updatedSelectedProductsData);
};

const handleInputChange = (index, field, value) => {
  const updatedProducts = [...selectedProductsData];
  updatedProducts[index][field] = value;


  let newErrors = {...errors};
  if (field === 'name' && value === '') {
    newErrors.nb_lit = 'Le Nombre de lit est obligatoire.';
  } else {
    newErrors.nb_lit = '';
  }
  setSelectedProductsData(updatedProducts);

  setErrors(newErrors);
};
const handleInputChangeRep = (index, field, value) => {
  const updatedProducts = [...selectedProductsDataRep];
  updatedProducts[index][field] = value;
  let newErrors = {...errors};
  





  setErrors(newErrors);
  setSelectedProductsDataRep(updatedProducts);
};




const handleRepasFilterChange = (e) => {
  setTypeRepas(e.target.value);
};



const filteredTarifrepas = tarifRepas?.filter((tarifRepas) => {
  return (
    ((typeRepas ? tarifRepas?.type_repas.type_repas == typeRepas : true) &&
    (selectedCategory ? tarifRepas.tarif_repas?.id
      === selectedCategory : true)) &&
      (
        (searchTerm ? tarifRepas?.tarif_repas?.designation?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
        (searchTerm ? tarifRepas?.type_repas?.type_repas?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
        (searchTerm ? String(tarifRepas?.montant)?.includes(searchTerm) : true) 
      )
    ); 
});

const handleSaveRepas = async () => {
  try {
    await axios.put(`${API_URL}/types-repas/${categorieId}`, newTypeRepas );
    await fetchTarifRepas();
    setShowEditModal(false);
    setSelectedCategoryId([])
    // Fermer le modal
            Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Type Repas modifiée avec succès.",
      });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.response.data.message,
    });
  }
};

const handleDeleteRepas = async (categorieId) => {
  try {
    await axios.delete(`${API_URL}/tarifs-Repas/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Tarif Repas supprimée avec succès.",
    });
    await fetchTarifRepas(); // Refresh categories after adding

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.response.data.message,
    });
  }
};


const [activeIndex, setActiveIndex] = useState(0);
const handleSelect = (selectedIndex) => {
  setActiveIndex(selectedIndex);
};
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array?.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
const chunkSize = 9;
const chunks = chunkArray(tarifsRepas, chunkSize);


const handleCategoryFilterChange = (catId) => {
  setSelectedCategory(catId);
  setFormData({...formData, designation: ""})
  setErrors({...errors, designation: false})
};
const handleAddTypeRepas = async () => {
  try {
    const formData = new FormData();
    formData.append("code", newTypeRepas.code);
    formData.append("type_repas", newTypeRepas.type_repas);
    const response = await axios.post(`${API_URL}/types-repas`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await fetchTarifRepas();
    if (response.status === 201) {
            Swal.fire({
                        icon: "success",
                        title: "Succès!",
                        text: "Type Repas ajoutée avec succès.",
                      }); // Hide the modal after success
                      setShowAddCategory(false);
                      fetchTarifRepas();
            }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error
    }); 
    setShowAddCategory(false);
  }
};
const handleEditRepas
= (categorieId) => {
  setErrors({})
  setSelectedCategoryId(categorieId);
  setCategorie(categorieId?.id)
  setShowEditModal(true);
};
const handleDeleteTypeRepas = async (categorieId) => {
  try {
    await axios.delete(`${API_URL}/types-repas/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Type Repas supprimée avec succès.",
    });
    await fetchTarifRepas(); // Refresh categories after adding

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.response.data.message,
    });
  }
};
const handleEditTypeRepas
= (categorieId) => {
  setNewTypeRepas(categorieId);
  setCategorie(categorieId?.id)
  setShowEditModal(true);
};
const handleAddDesignation = async () => {
  try {
    const hasErrors = Object.values(tarifRepasErrors).some(error => error === true);
      if (hasErrors) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;  
      }
    const formData = new FormData();
    if (newDesignation.photo) {
      formData.append('photo', newDesignation.photo);
    }
    formData.append("designation", newDesignation.designation);
    
    const response = await axios.post(
      `${API_URL}/desigs-repas`, formData
    );

    await fetchTarifRepas(); 
    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Tarif Repas ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddDesignation(false);
              setNewDesignation({
                photo: null,
                designation: "",
              })

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.response.data.message,
    });
  }
};
const handleDeleteDesignation = async (categorieId) => {
  try {
    await axios.delete(`${API_URL}/desigs-repas/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Tarif Repas supprimée avec succès.",
    });
    await fetchTarifRepas(); // Refresh categories after adding

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.response.data.message,
    });
  }
};
const handleEditDesignation = (categorieId) => {
  setNewDesignation(categorieId);
  setEditingDesignation(categorieId);
  setCategorie(categorieId?.id)
  setShowEditModalDesignation(true);
};
const handleSaveDesignation = async () => {
  const formData = new FormData();
  formData.append('_method', 'put');
    if (newDesignation.photo) {
      formData.append('photo', newDesignation.photo);
    }
    formData.append("designation", newDesignation.designation);

  try {
    const response = await axios.post(`${API_URL}/desigs-repas/${categorieId}`,formData);

    await fetchTarifRepas();
    setShowEditModalDesignation(false);
    
    // Show success message
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Tarif Repas modifiée avec succès.",
    });
    
    // Clear the form state
    setNewDesignation({ designation: '', photo: null });
  } catch (error) {
    setTimeout(() => {
      setErrors({
        photo: error.response.data?.errors?.photo,
        designation: error.response.data?.errors?.tarif_repas,
      });
  }, 3000);
  }
};
const handleShowTarifRepas = () => {
  setShowAddDesignation(true)
}
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles}}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>




    <div>
      <SearchWithExportCarousel
        onSearch={handleSearch}
        exportToExcel={exportToExcel}
        exportToPDF={exportToPDF}
        printTable={printTable}
        categories={chunks}
        selectedCategory={selectedCategory}
        handleCategoryFilterChange={handleCategoryFilterChange}
        activeIndex={activeIndex}
        handleSelect={handleSelect}
        chunks={chunks}
        subtitle="Tarifs de Repas"
         Title="Liste des Tarifs"
      />
    </div>
          

        <div className="container-d-flex justify-start sm:justify-between">
          <div style={{ display: "flex", alignItems: "center", marginTop: '-12px', padding: '15px' }}>

            <button
              onClick={handleShowFormButtonClick}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#329982",
                color: "white",
                borderRadius: "10px",
                fontWeight: "bold",
                marginLeft: "96%",  // Keep your marginLeft for large screens
                padding: "6px 15px",
                border: "none",
                height: "40px",
              }}
              className="gap-2 AjouteBotton sm:ml-0 md:ml-auto" // Add responsive margin class
            >

                <FontAwesomeIcon
                    icon={faPlus}
                    className=" AjouteBotton"
                    style={{ cursor: "pointer" ,color: "white"}}
                  />
              </button>
            </div>
            <div className="filters" 
            >
        <Form.Select
        aria-label="Default select example"
        value={typeRepas}
        onChange={handleRepasFilterChange}
        style={{
          width: '12%', // Keep your width for large screens
          height: "40px",
          position: 'absolute',
          marginTop:"20px",
          left: '81%', // Keep your left for large screens
          top: '224px',
          cursor: "pointer",
          borderRadius: "10px",
          color: "black",
          fontWeight: "bold",
        }}
        className="sm:w-3/4 md:w-1/2 lg:w-1/4"  // Add responsive width here
      >
    <option value="" style={{ fontWeight: "bold", color: "white" }}>Sélectionner Type Repas</option>
        {
          typesRepas?.map((type) => (
            <option value={type.type_repas}>{type.type_repas}</option>
          ))
        }
    </Form.Select>
</div>

        <div style={{ marginTop:"0px",}}>
        <div id="formContainer" className="" style={{...formContainerStyle,marginTop:'0px',maxHeight:'700px',overflow:'auto',padding:'0'}}>
              <Form className="d-flex flex-column align-items-start" onSubmit={handleSubmit}>
                <Form.Label className="w-100 text-center">
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
                      {editingTarifRepas ? "Modifier" : "Ajouter"} un Tarif</h4>
                </Form.Label>

                 {/* // Type Repas  //     */}

                 <Form.Group className="form-group">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-primary"
                      style={{ cursor: "pointer", marginRight: "8px" }}
                      onClick={handleShowTarifRepas}
                    />
                    <Form.Label>Tarif Repas</Form.Label>
                    <div style={{ flexGrow: 1, position: "relative" }}>
                      <Form.Select
                        name="designation"
                        value={formData.designation}
                        isInvalid={hasSubmitted && errors.designation}
                        onChange={handleChange}
                        style={{ minWidth: "100%" , marginRight: "15px" }}
                      >
                        <option value="">Sélectionner un Tarif Repas</option>
                        {tarifsRepas?.map((tarif) => (
                          <option key={tarif.id} value={tarif.id}>
                            {tarif.designation}
                          </option>
                        ))}
                      </Form.Select>
                      {hasSubmitted && errors.designation && (
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      )}
                    </div>
                  </Form.Group>


                <Modal show={showEditModalDesignation} onHide={() => setShowEditModalDesignation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Tarif de Repas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!tarifRepasErrors.photo}
                    onChange={(e) => setNewDesignation({ ...newDesignation, photo: e.target.files[0] })}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                isInvalid={!!tarifRepasErrors.designation}
                // isValid={!tarifRepasErrors.designation}
                value={newDesignation.designation}
                onChange={(e) => setNewDesignation({ ...newDesignation, designation: e.target.value })}
                />
            </Form.Group>
      </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveDesignation}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalDesignation(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
      <Modal show={showAddDesignation} onHide={() => setShowAddDesignation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter Tarif de Repas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!tarifRepasErrors.photo}
                    onChange={(e) => setNewDesignation({ ...newDesignation, photo: e.target.files[0] })}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                // isValid={!errors.designationAdd}
                isInvalid={!!tarifRepasErrors.designationAdd}
                onChange={(e) => setNewDesignation({ ...newDesignation, designation: e.target.value })}
              />
            </Form.Group>
      </Form>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3" style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Designation</th>
                  <th>Photo</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tarifsRepas?.map(categ => (
                  <tr>
                    <td>{categ?.designation}</td>
                    <td>  
                    <img
                        decoding="async"
                        src={categ.photo ? `http://127.0.0.1:8000/storage/${categ.photo}` : "http://localhost:8000/storage/repas-img.webp"}
                        alt={categ.designation}
                        loading="lazy"
                        aria-hidden="true"
                        className={`rounded-circle category-img`}
                      />
                    </td>
                    <td>
                        <FontAwesomeIcon
                                  onClick={() => handleEditDesignation(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteDesignation(categ?.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddDesignation}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddDesignation(false)}
  >
    Annuler
  </Fab>
  </Form.Group>
      </Modal.Body>
      </Modal>
      <Form.Group className="form-group">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-primary"
              style={{ cursor: "pointer", marginRight: "8px" }}
              onClick={() => setShowAddCategory(true)}
            />
            <Form.Label>Type Repas</Form.Label>
            <div style={{ flexGrow: 1, position: "relative" }}>
              <Form.Select
                name="type_repas"
                value={formData.type_repas}
                isInvalid={hasSubmitted && errors.type_repas}
                onChange={handleChange}
                style={{ minWidth: "100%" , marginRight: "15px"}}
              >
                <option value="">Sélectionner Type de Repas</option>
                {typesRepas?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_repas}
                  </option>
                ))}
              </Form.Select>
              {hasSubmitted && errors.type_repas && (
                <Form.Control.Feedback type="invalid">
                  Required
                </Form.Control.Feedback>
              )}
            </div>
      </Form.Group>

                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Type de Repas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                name="code"
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, code: e.target.value })}
                value={newTypeRepas.code}
                />
              <Form.Text className="text-danger">{errors.code}</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Type Repas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type Repas"
                name="type_repas"
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, type_repas: e.target.value })}
                value={newTypeRepas.type_repas}
                />
              <Form.Text className="text-danger">{errors.type_repas}</Form.Text>
            </Form.Group>
      </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveRepas}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModal(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
                <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Type Repas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group>
              <Form.Label>Code Repas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code Repas"
                name="code"
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, code: e.target.value })}
              />
            </Form.Group>
          <Form.Group>
              <Form.Label>Type Repas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type Repas"
                name="type_repas"
                value={newTypeRepas.type_repas}
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, type_repas: e.target.value })}
              />
            </Form.Group>
      </Form>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3" style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                <th>Code Repas</th>
                  <th>Type Repas</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {typesRepas?.map(categ => (
                  <tr>
                    <td>{categ.code}</td>
                    <td>{categ.type_repas}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditTypeRepas(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteTypeRepas(categ?.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddTypeRepas}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddCategory(false)}
  >
    Annuler
  </Fab>
  </Form.Group>
      </Modal.Body>
      </Modal>

      {/* // Montant //  */}
      
      <Form.Group className="form-group" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
  {/* Placeholder for the "+" icon */}
  <div style={{ width: "18px" }}></div> 

  <Form.Label style={{ minWidth: "170px", fontWeight: "bold", marginRight: "0" }}>
    Montant
  </Form.Label>

  <div style={{ flexGrow: 1, position: "relative" }}>
    <Form.Control
      type="number"
      name="montant"
      value={formData.montant}
      isInvalid={hasSubmitted && errors.montant}
      onChange={handleChange}
      style={{ minWidth: "100%", maxWidth: "400px" }} // Ensures the width is consistent
    />
    {hasSubmitted && errors.montant && (
      <Form.Control.Feedback type="invalid" style={{ fontSize: "12px", position: "absolute", top: "100%", left: "0" }}>
        Required
      </Form.Control.Feedback>
    )}
  </div>
</Form.Group>



<Form.Group className="mt-5 tarif-button-container">
  <div className="button-container">
    <Fab
      variant="extended"
      className="btn-sm Fab mb-2 mx-2"
      type="submit"
    >
      Valider
    </Fab>
    <Fab
      variant="extended"
      className="btn-sm FabAnnule mb-2 mx-2"
      onClick={closeForm}
    >
      Annuler
    </Fab>
  </div>
</Form.Group>













              </Form>
            </div>
        </div>
            <div className="">
              <div
                id="tableContainer"
                className="table-responsive"
                style={{...tableContainerStyle, overflowX: 'auto', minWidth: '650px',
                  maxHeight: '700px', overflow: 'auto',
                  marginTop:'0px',
                  paddingTop:'0px'
                }}
              >
                
  <table className="table table-bordered" id="tarifRepasTable" style={{ marginTop: "-5px", }}>
  <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1,padding:'10px'}}>
    <tr className="tableHead">
      <th className="tableHead">
        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
      </th>
      <th className="tableHead">Tarifs Repas</th>
      <th className="tableHead">Type Repas</th>
      <th className="tableHead">Montant</th>
      <th className="tableHead">Action</th>
    </tr>
  </thead>
  <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
    {filteredTarifrepas
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ?.map((tarifRepas) => {
      return(
        <React.Fragment>
          <tr>
      
            <td style={{ backgroundColor: "white" }}>
              <input
                type="checkbox"
                checked={selectedItems.includes(tarifRepas?.id)}
                onChange={() => handleCheckboxChange(tarifRepas?.id)}
              />
            </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(tarifRepas?.tarif_repas.designation, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(tarifRepas?.type_repas.type_repas, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(String(tarifRepas.montant), searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <FontAwesomeIcon
      onClick={() => handleEdit(tarifRepas)}
      icon={faEdit}
      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
    />
    <FontAwesomeIcon
      onClick={() => handleDelete(tarifRepas?.id)}
      icon={faTrash}
      style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }}
    />
  </div>  
</td>
          </tr>

        </React.Fragment>
      )
       
})}
  </tbody>
</table>

                {/* )} */}
               
                <a href="#">
                  <Button
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteSelected}
                  disabled={selectedItems?.length === 0}
                  style={{
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "17px",
                    color: "white",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Supprimer selection
                </Button>
                </a>
                <TablePagination
                  rowsPerPageOptions={[5, 10,15,20, 25]}
                  component="div"
                  count={filteredTarifrepas?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TarifRepas;