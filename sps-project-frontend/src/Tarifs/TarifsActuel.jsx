import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import Navigation from "../Acceuil/Navigation";
import TablePagination from "@mui/material/TablePagination";
import { highlightText } from "../utils/textUtils";
// import PrintList from "./PrintList";
// import ExportPdfButton from "./exportToPdf";
import "jspdf-autotable";
import Search from "../Acceuil/Search";
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
import { useOpen } from "../Acceuil/OpenProvider"; // Importer le hook personnalisé
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

//------------------------- Tarifs Actuel ---------------------//
const TarifsActuel = () => {
  const [tarifsActuel, setTarifsActuel] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [tarifsChambre, setTarifsChambre] = useState([]);
  const [tarifsRepas, setTarifsRepas] = useState([]);
  const [tarifsReduction, setTarifsReduction] = useState([]);

  const [tarifChambre, setTarifChambre] = useState([]);
  const [tarifRepas, setTarifRepas] = useState([]);
  const [tarifReduction, setTarifReduction] = useState([]);
  const [typesChambre, setTypesChambre] = useState([]);
  const [typesReduction, setTypesReduction] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [secteurClient, setSecteurClient] = useState([]);

  //---------------form-------------------//

  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [categorieId, setCategorie] = useState();

const [typeChambre, setTypeChambre] = useState('');
const [typeRepas, setTypeRepas] = useState('');
const [typeReduction, setTypeReduction] = useState('');

  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    date_debut: "", 	
    date_fin: "",
    tarif_chambre: "",
    tarif_repas: "",
    tarif_reduction: "",
  });
  const [errors, setErrors] = useState({
    date_debut: "", 	
    date_fin: "",
    tarif_chambre: "",
    tarif_repas: "",
    tarif_reduction: "",
  });
  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0px",
  });
  //-------------------edit-----------------------//
  const [editingTarifActuel, setEditingTarifActuel] = useState(null); // State to hold the client being edited
  const [editingTarifActuelId, setEditingTarifActuelId] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false); 
  const [showAddRepas, setShowAddRepas] = useState(false); 
  const [showAddReduction, setShowAddReduction] = useState(false); 
  const [showAddCategorySite, setShowAddCategorySite] = useState(false); // Gère l'affichage du formulaire

  const [showAddRegein, setShowAddRegein] = useState(false); // Gère l'affichage du formulaire
  const [showAddRegeinSite, setShowAddRegeinSite] = useState(false); // Gère l'affichage du formulaire

  const [showAddSecteur, setShowAddSecteur] = useState(false); // Gère l'affichage du formulaire

  const [showAddMod, setShowAddMod] = useState(false); // Gère l'affichage du formulaire

  //-------------------Pagination-----------------------/
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredTarifsactuel, setFilteredTarifsActuel] = useState([]);
  // Pagination calculations
  const indexOfLastTarif = (page + 1) * rowsPerPage;
  const indexOfFirstTarif = indexOfLastTarif - rowsPerPage;
  const currentChambres = tarifsActuel?.slice(indexOfFirstTarif, indexOfLastTarif);
  //-------------------Selected-----------------------/
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //-------------------Search-----------------------/
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTarifActuelId, setSelectedTarifActuelId] = useState(null);
  //------------------------Site-Client---------------------
  const [showFormSC, setShowFormSC] = useState(false);
  const [editingsitechambre, setEditingsitechambre] = useState(null);
  const [editingsitechambreId, setEditingsitechambreId] = useState(null);
  const [formDataSC, setFormDataSC] = useState({
    date_debut: "", 	
    date_fin: "",
    tarif_chambre: "",
    tarif_repas: "",
    tarif_reduction: "",
  });
  const [formContainerStyleSC, setFormContainerStyleSC] = useState({
    right: "-100%",
  });
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedRowsTarifChambre, setExpandedRowsTarifChambre] = useState([]);
  const [expandedRowsTarifReduction, setExpandedRowsTarifReduction] = useState([]);
  const [expandedRowsTarifRepas, setExpandedRowsTarifRepas] = useState([]);


  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [selectedProductsDataRep, setSelectedProductsDataRep] = useState([]);


  const fetchTarifsActuel = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tarifs-actuel");
      const data = response.data;
      
      setTarifsActuel(data.tarifsActuel);
      setTarifsChambre(data.tarifsChambreDetail);
      setTarifsRepas(data.tarifsRepasDetail);
      setTarifsReduction(data.tarifsReductionDetail);
      setTarifChambre(data.tarifChambre);
      setTarifRepas(data.tarifRepas);
      setTarifReduction(data.tarifReduction);
      setTypesChambre(data.typesChambre);
      setTypesReduction(data.typesReduction);
      
      // localStorage.setItem("tarifChambreActuel", JSON.stringify(data.tarifChambre));
      // localStorage.setItem("tarifRepasActuel", JSON.stringify(data.tarifRepas));
      // localStorage.setItem("tarifReductionActuel", JSON.stringify(data.tarifReduction));
      // localStorage.setItem("tarifsChambreActuel", JSON.stringify(data.tarifsChambreDetail));
      // localStorage.setItem("tarifsRepasActuel", JSON.stringify(data.tarifsRepasDetail));
      // localStorage.setItem("tarifsReductionActuel", JSON.stringify(data.tarifsReductionDetail));
      // localStorage.setItem("tarifsActuel", JSON.stringify(data.tarifsActuel));
      // localStorage.setItem("typesReductionActuel", JSON.stringify(data.typesReduction));
      // localStorage.setItem("typesChambreActuel", JSON.stringify(data.typesChambre));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des Tarifs Actuel.",
        });
      }
    }
  };
  
  useEffect(() => {
    const storedTarifsActuel = localStorage.getItem("tarifsActuel");
    const storedtarifsChambre = localStorage.getItem("tarifsChambreActuel");
    const storedtarifsRepas = localStorage.getItem("tarifsRepasActuel");
    const storedtarifsReduction = localStorage.getItem("tarifsReductionActuel");
    const storedtarifChambre = localStorage.getItem("tarifChambreActuel");
    const storedtarifRepas = localStorage.getItem("tarifRepasActuel");
    const storedtarifReduction = localStorage.getItem("tarifReductionActuel");
    const storedtypesReduction = localStorage.getItem("typesReductionActuel");
    const storedtypesChambre = localStorage.getItem("typesChambreActuel");

    storedTarifsActuel && setTarifsActuel(JSON.parse(storedTarifsActuel));
    storedtarifsChambre && setTarifsChambre(JSON.parse(storedtarifsChambre));
    storedtarifsRepas && setTarifsRepas(JSON.parse(storedtarifsRepas));
    storedtarifsReduction && setTarifsReduction(JSON.parse(storedtarifsReduction));
    storedtarifChambre && setTarifChambre(JSON.parse(storedtarifChambre));
    storedtarifRepas && setTarifRepas(JSON.parse(storedtarifRepas));
    storedtarifReduction && setTarifReduction(JSON.parse(storedtarifReduction));
    storedtypesReduction && setTypesReduction(JSON.parse(storedtypesReduction));
    storedtypesChambre && setTypesChambre(JSON.parse(storedtypesChambre));

    // if (!storedTarifsActuel || !storedtypesChambre || !storedtypesReduction || !storedtarifsChambre || !storedtarifsRepas || !storedtarifsReduction || !storedtarifChambre || !storedtarifRepas || !storedtarifReduction)
      fetchTarifsActuel();
  }, []);

  const toggleRowTarifChambre = (tarifActuelId) => {
      setDetailedData(tarifActuelId);
      setExpandedRowsTarifChambre((prevExpandedRows) =>
      prevExpandedRows.includes(tarifActuelId)
        ? prevExpandedRows?.filter((id) => id !== tarifActuelId)
        : [...prevExpandedRows, tarifActuelId]
    );
  };
  const toggleRowTarifRepas = (tarifActuelId) => {
    setExpandedRowsTarifRepas((prevExpandedRows) =>
      prevExpandedRows.includes(tarifActuelId)
        ? prevExpandedRows?.filter((id) => id !== tarifActuelId)
        : [...prevExpandedRows, tarifActuelId]
    );
  };
  const toggleRowTarifReduction = (tarifActuelId) => {
    setExpandedRowsTarifReduction((prevExpandedRows) =>
      prevExpandedRows.includes(tarifActuelId)
        ? prevExpandedRows?.filter((id) => id !== tarifActuelId)
        : [...prevExpandedRows, tarifActuelId]
    );
  };
  //---------------------------------------------
  useEffect(() => {
    const filtered = tarifsActuel?.filter((tarifActuel) =>
      Object.values(tarifActuel).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
    setFilteredTarifsActuel(JSON.stringify(tarifsActuel));
  }, [tarifsActuel, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };


  const handleChangeSC = (e) => {
    setFormDataSC({
      ...formDataSC,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
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
  //------------------------- tarif Actuel EDIT---------------------//

  const handleEdit = (tarifActuel) => {
    setEditingTarifActuel(tarifActuel); 

    // Populate form data with tarif Actuel details
    setFormData({
      date_debut: tarifActuel.date_debut,
      date_fin: tarifActuel.date_fin,
      tarif_chambre: tarifActuel?.tarif_chambre?.id,
      tarif_repas: tarifActuel?.tarif_repas?.id,
      tarif_reduction: tarifActuel?.tarif_reduction?.id,
  });
  

    // setSelectedProductsDataRep(chambre.represantant?.map(contact => ({ ...contact })));

    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeForm();
    }
  };
  useEffect(() => {
    if (editingTarifActuelId !== null) {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    }
  }, [editingTarifActuelId]);

  useEffect(() => {
    const validateData = () => {
      const newErrors = { ...errors };
      newErrors.date_debut = formData.date_debut === "" || formData.date_debut > formData.date_fin;
      newErrors.date_fin = formData.date_fin === "" || formData.date_fin < formData.date_debut;
      newErrors.tarif_chambre = formData.tarif_chambre === "";
      newErrors.tarif_repas = formData.tarif_repas === "";
      newErrors.tarif_reduction = formData.tarif_reduction === "";
      setErrors(newErrors);
      return true;
    };
    validateData();
  }, [formData]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const hasErrors = Object.values(errors).some(error => error === true);
      if (hasErrors) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;  
      }
      const url = editingTarifActuel 
          ? `http://localhost:8000/api/tarifs-actuel/${editingTarifActuel.id}`
          : "http://localhost:8000/api/tarifs-actuel";
      const method = editingTarifActuel ? "put" : "post";

      let requestData;

      if (editingTarifActuel) {
        requestData = {
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        tarif_chambre: formData.tarif_chambre,
        tarif_repas: formData.tarif_repas,
        tarif_reduction: Number(formData.tarif_reduction),
        }
      }
      else {
      const formDatad = new FormData();
      formDatad.append("date_debut", formData.date_debut);
      formDatad.append("date_fin", formData.date_fin);
      formDatad.append("tarif_chambre", formData.tarif_chambre);
      formDatad.append("tarif_repas", formData.tarif_repas);
      formDatad.append("tarif_reduction", formData.tarif_reduction);
      requestData = formDatad;
      } 
      try {
          const response = await axios({
              method: method,
              url: url,
              data: requestData,
          });
          
          if (response.status === 200 || response.status === 201) {
              fetchTarifsActuel();
              const successMessage = `Tarif Actuel ${editingTarifActuel ? "modifié" : "ajouté"} avec succès.`;
              Swal.fire({
                  icon: "success",
                  title: "Succès!",
                  text: successMessage,
              });
              // Reset form and errors
              setSelectedProductsData([]);
              setSelectedProductsDataRep([]);
              setFormData({
                date_debut: "", 	
                date_fin: "",
                tarif_chambre: "",
                tarif_repas: "",
                tarif_reduction: "",
              });
              setErrors({
                date_debut: "", 	
                date_fin: "",
                tarif_chambre: "",
                tarif_repas: "",
                tarif_reduction: "",
              });
              setEditingTarifActuel(null);
              closeForm();
          }
      } catch (error) {
          if (error.response) {
              const serverErrors = error.response.data.error;
              
          }
          setTimeout(() => {
              setErrors({});
          }, 3000);
      }
  };


    //------------------------- CHAMBRE FORM---------------------//

    const handleShowFormButtonClick = () => {
      if (formContainerStyle.right === "-100%") {
        setFormContainerStyle({ right: "0" });
        setTableContainerStyle({ marginRight: "650px" });
      } else {
        closeForm();
      }
    };

    const closeForm = () => {
      setFormContainerStyle({ right: "-100%" });
      setTableContainerStyle({ marginRight: "0" });
      setShowForm(false); // Hide the form
      setFormData({
        date_debut: "", 	
        date_fin: "",
        tarif_chambre: "",
        tarif_repas: "",
        tarif_reduction: "",
      });
      setErrors({
        date_debut: "", 	
        date_fin: "",
        tarif_chambre: "",
        tarif_repas: "",
        tarif_reduction: "",
      });
      setSelectedProductsData([])
      setSelectedProductsDataRep([])
      setEditingTarifActuel(null); // Clear editing client
    };
  //-------------------------SITE CLIENT----------------------------//
  //-------------------------  SUBMIT---------------------//
  const handleSelectItem = (item) => {
    const selectedIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, item.id]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedItems);
    }

  };

  const getSelectedTarifsActuelIds = () => {
    return selectedItems?.map((item) => item.id);
  };
  
  
  //------------------------- CLIENT PAGINATION---------------------//

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem('rowsPerPageChambres', selectedRows);  // Store in localStorage
    setPage(0);
  };

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem('rowsPerPageChambres');
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  //------------------------- CLIENT DELETE---------------------//

  const handleDelete = (tarifs_actuel_code) => {
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
          .delete(`http://localhost:8000/api/tarifs-actuel/${tarifs_actuel_code}`)
          .then(() => {
            fetchTarifsActuel();
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Tarif Actuel supprimé avec succès.",
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
      } else {
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
          axios
            .delete(`http://localhost:8000/api/tarifs-actuel/${item}`)
            .then(() => {
              fetchTarifsActuel();
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Tarif Actuel supprimé avec succès.",
              });
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression du Tarif Actuel:", error);
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: "Échec de la suppression du Tarif Actuel.",
              });
            });
        });
        fetchTarifsActuel();
      }
    });
    setSelectedItems([]);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(tarifsActuel?.map((tarifActuel) => tarifActuel.id));
    }
  };
  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems?.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const exportToExcel = () => {
    const table = document.getElementById('tarifsActuelTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Tarifs Actuel' });
    XLSX.writeFile(workbook, 'tarifs_actuel_table.xlsx');
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Manually adding HTML content
    const title = 'Table Tarifs Actuel';
    doc.text(title, 14, 16);
    
    doc.autoTable({
      head: [['Date Debut', 'Date Fin', 'Tarif Chambre', 'Tarif Repas', 'Tarif Reduction']],
      body: filteredTarifsActuel?.map(tarifActuel => [
        tarifActuel.date_debut || '',
        tarifActuel.date_fin || '',
        tarifActuel.tarif_chambre.designation || '',
        tarifActuel.tarif_repas.designation || '',
        tarifActuel.tarif_reduction.designation || '',
      ]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: '#007bff' }
    });
  
    doc.save('tarifs_actuel_table.pdf');
  };
  

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Tarifs Actuel List</title>
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
          <h1>Tarifs Actuel List</h1>
          <table>
            <thead>
              <tr>
                <th>Tarif Actuel Code</th>
                <th>Date Debut</th>
                <th>Date Fin</th>
                <th>Tarif Chambre</th>
                <th>Tarif Repas</th>
                <th>Tarif Reduction</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTarifsActuel?.map(tarifsActuel => `
                <tr>
                  <td>${tarifsActuel.date_debut || ''}</td>
                  <td>${tarifsActuel.date_fin || ''}</td>
                  <td>${tarifsActuel?.tarif_chambre?.designation || ''}</td>
                  <td>${tarifsActuel?.tarif_repas?.designation || ''}</td>
                  <td>${tarifsActuel?.tarif_reduction?.designation || ''}</td>
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
    if (event.target && event.target.id.startsWith("actionDropdown_")) {
      const [action, typeId] = event.target.value.split("_");
      if (action === "delete") {
        // Delete action
        handleDeleteChambre(typeId);
      } else if (action === "edit") {
        // Edit action
        handleEditChambre(typeId);
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


const handleChambreFilterChange = (e) => {
  setTypeChambre(e.target.value);
};
const handleTypeRepasChange = (e) => {
  setTypeRepas(e.target.value);
};
const handleTypeReductionChange = (e) => {
  setTypeReduction(e.target.value);
};


const filteredTarifsActuel = tarifsActuel?.filter((tarifActuel) => {
  return (
    (typeChambre ? tarifActuel.tarif_chambre?.type_chambre?.designation == typeChambre : true) &&
    (typeRepas ? tarifActuel.tarif_repas?.designation === typeRepas : true) &&
    (typeReduction ? tarifActuel.tarif_reduction?.designation == typeReduction : true) &&
    (selectedCategory ? tarifActuel.id
      === selectedCategory : true) &&
      (searchTerm ? tarifActuel?.date_debut.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? tarifActuel?.date_fin?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? tarifActuel?.tarif_chambre?.designation?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? tarifActuel?.tarif_repas?.designation?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? tarifActuel?.tarif_reduction?.designation?.toLowerCase().includes(searchTerm.toLowerCase()) : true) 
  );
});

const [activeIndex, setActiveIndex] = useState(0);
const [filtreclientBySect,setFiltreClientBySect] = useState([])
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
const chunks = chunkArray(secteurClient, chunkSize);


const handleCategoryFilterChange = (catId) => {
 
  setSelectedCategory(catId);
};
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles}}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>

       
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ marginTop: "15px" }}
          >
            <h3 className="titreColore">
              {/* <PeopleIcon style={{ fontSize: "24px", marginRight: "8px" }} /> */}
              Liste des Tarifs
            </h3>
            <div className="d-flex">
              <div style={{ width: "500px", marginRight: "20px" }}>
                <Search onSearch={handleSearch} type="search" />
              </div>


              <div>
              <FontAwesomeIcon
    style={{
      cursor: "pointer",
      color: "grey",
      fontSize: "2rem",
    }}
    onClick={printTable}  
    icon={faPrint}
    className="me-2"
  />
                  <FontAwesomeIcon
      style={{
        cursor: "pointer",
        color: "red",
        fontSize: "2rem",
        marginLeft: "15px",
      }}
      onClick={exportToPDF}
            icon={faFilePdf}
    />

                <FontAwesomeIcon
                  icon={faFileExcel}
                  onClick={exportToExcel}
                  style={{
                    cursor: "pointer",
                    color: "green",
                    fontSize: "2rem",
                    marginLeft: "15px",
                  }}
                />
              </div>
            </div>
          </div>

          {
          
            <div style={{height:'125px',marginTop:'-15px'}}>
              <h5 className="container-d-flex justify-content-start AjouteBotton"style={{marginBottom:'-3px'}} >{/*Secteur d'activité*/}</h5> 
              <div className=" bgSecteur" >

              </div>
            </div>

          }

          <div className="container-d-flex justify-content-start">
            <div style={{ display: "flex", alignItems: "center" ,marginTop:'15px' ,padding:'0'}}>
             
              <a
                onClick={handleShowFormButtonClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                className="AjouteBotton"
              >
 <FontAwesomeIcon
                    icon={faPlus}
                    className=" AjouteBotton"
                    style={{ cursor: "pointer" }}
                  />Ajouter un Tarif
              </a>

            </div>

        <div style={{ marginTop:"0px",}}>
        <div id="formContainer" className="" style={{...formContainerStyle,marginTop:'0px',maxHeight:'700px',overflow:'auto',padding:'0'}}>
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
                      {editingTarifActuel ? "Modifier" : "Ajouter"} un Tarif</h4>
                </Form.Label>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Date Debut</Form.Label>
                <Form.Control
                type="datetime-local"
                name="date_debut"
                placeholder="Date Debut"
                isInvalid={!!errors.date_debut}
                value={formData.date_debut}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {errors.date_debut}
              </Form.Text>
                </Form.Group>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Date Fin</Form.Label>
                <Form.Control
                type="datetime-local"
                name="date_fin"
                placeholder="Date Fin"
                isInvalid={!!errors.date_fin}
                value={formData.date_fin}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {errors.date_fin}
              </Form.Text>
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px'}}>Tarif Chambre</Form.Label>                  <Form.Select
                      name="tarif_chambre"
                      value={formData.tarif_chambre}
                      isInvalid={!!errors.tarif_chambre}
                      onChange={handleChange}>
                      <option value="">Sélectionner Tarif de Chambre</option>
                      {tarifChambre?.map((tarif) => (
                          <option key={tarif?.id} value={tarif?.id}>
                            {tarif?.designation}
                          </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px'}}>Tarif Repas</Form.Label>
                  <Form.Select
                      name="tarif_repas"
                      value={formData.tarif_repas}
                      isInvalid={!!errors.tarif_repas}
                      onChange={handleChange}>
                      <option value="">Sélectionner Tarif de Repas</option>
                      {tarifRepas?.map((tarif) => (
                          <option key={tarif?.id} value={tarif?.id}>
                            {tarif?.designation}
                          </option>
                      ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.tarif_repas}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px'}}>Tarif Reduction</Form.Label>
                  <Form.Select
                      name="tarif_reduction"
                      value={formData.tarif_reduction}
                      isInvalid={!!errors.tarif_reduction}
                      onChange={handleChange}>
                      <option value="">Sélectionner Tarif de Reduction</option>
                      {tarifReduction?.map((tarif) => (
                          <option key={tarif?.id} value={tarif?.id}>
                            {tarif?.designation}
                          </option>
                      ))}
                  </Form.Select>
                </Form.Group> 
  <Form.Group className="mt-5 d-flex justify-content-center">
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
                }}
              >
                 <table className="table table-bordered" id="tarifsActuelTable" style={{ marginTop: "-5px", }}>
  <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1,padding:'10px'}}>
    <tr className="tableHead">
      <th className="tableHead">
        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
      </th>
      <th className="tableHead">Date Debut</th>
      <th className="tableHead">Date Fin</th>
      <th className="tableHead">Tarif Chambre</th>
      <th className="tableHead">Tarif Repas</th>
      <th className="tableHead">Tarif Reduction</th>
      <th className="tableHead">Action</th>
    </tr>
  </thead>
  <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
    {filteredTarifsActuel
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ?.map((tarifActuel) => {
      return(
        <>
        <React.Fragment>
          <tr>
      
            <td style={{ backgroundColor: "white" }}>
              <input
                type="checkbox"
                checked={selectedItems.some((item) => item === tarifActuel.id)}
                onChange={() => handleCheckboxChange(tarifActuel.id)}
              />
            </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(tarifActuel?.date_debut, searchTerm)||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(tarifActuel?.date_fin, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}><button onClick={() => toggleRowTarifChambre(tarifActuel?.id)} style={{
              border:'none'
              ,backgroundColor:'white'
            }}>
              <FontAwesomeIcon icon={faList}
             /></button>
              {highlightText(tarifActuel?.tarif_chambre?.designation, searchTerm) || ''}
            </td>
            <td style={{ backgroundColor: "white" }}><button onClick={() => toggleRowTarifRepas(tarifActuel?.id)} style={{
              border:'none'
              ,backgroundColor:'white'
            }}>
              <FontAwesomeIcon icon={faList}
             /></button>
              {highlightText(tarifActuel?.tarif_repas?.designation, searchTerm) || ''}
            </td>
            <td style={{ backgroundColor: "white" }}><button onClick={() => toggleRowTarifReduction(tarifActuel?.id)} style={{
              border:'none'
              ,backgroundColor:'white'
            }}>
              <FontAwesomeIcon icon={faList}
             /></button>
              {highlightText(tarifActuel?.tarif_reduction.designation, searchTerm) || ''}
            </td>
            <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <FontAwesomeIcon
      onClick={() => handleEdit(tarifActuel)}
      icon={faEdit}
      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
    />
    <FontAwesomeIcon
      onClick={() => handleDelete(tarifActuel.id)}
      icon={faTrash}
      style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }}
    />
  </div>  
</td>

  </tr>
    </React.Fragment>
    {expandedRowsTarifChambre.includes(tarifActuel?.id) && (
        <tr>
          <td colSpan="25"
          style={{
            padding: "0",
          }}>
            <div>
                <table
                className="table table-responsive table-bordered"
                style={{marginTop:'0px',marginBottom:'0px'}}>
                  <thead>
                      <tr>
                        <th className="ColoretableForm">Code</th>
                        <th className="ColoretableForm">Type Chambre</th>
                        <th className="ColoretableForm">Single</th>
                        <th className="ColoretableForm">Double</th>
                        <th className="ColoretableForm">Triple</th>
                        <th className="ColoretableForm">Lit Supplémentaires</th>
                      </tr>
                  </thead>
                  <tbody>     
                  {tarifsChambre
                        ?.filter(
                          (item) =>
                            item?.tarif_chambre?.designation ===
                            tarifActuel?.tarif_chambre?.designation
                        )
                        ?.map((item) => (
                          <tr key={item?.id}>
                            <td>{item?.code}</td>
                            <td>{item?.type_chambre?.type_chambre}</td>
                            <td>{item?.single}</td>
                            <td>{item?.double}</td>
                            <td>{item?.triple}</td>
                            <td>{item?.lit_supp}</td>
                          </tr>
                        ))
                      }   
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
                                        )}
                                        {expandedRowsTarifRepas.includes(tarifActuel?.id) && (
        <tr>
          <td colSpan="25"
          style={{
            padding: "0",
          }}>
            <div>
                <table
                className="table table-responsive table-bordered"
                style={{marginTop:'0px',marginBottom:'0px'}}>
                  <thead>
                      <tr>
                        <th   className="ColoretableForm">Type Repas</th>
                        <th   className="ColoretableForm">Montant</th>
                      </tr>
                                                            </thead>
                                                            <tbody>
                                                            {tarifsRepas
                        ?.filter(
                          (item) =>
                            item?.tarif_repas?.designation ===
                            tarifActuel?.tarif_repas?.designation
                        )
                        ?.map((item) => (
                          <tr key={item?.id}>
                            <td>{item?.type_repas?.type_repas}</td>
                            <td>{item?.montant}</td>
                          </tr>
                        ))
                      } 
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {expandedRowsTarifReduction.includes(tarifActuel?.id) && (
        <tr>
          <td colSpan="25"
          style={{
            padding: "0",
          }}>
            <div>
                <table
                className="table table-responsive table-bordered"
                style={{marginTop:'0px',marginBottom:'0px'}}>
                  <thead>
                      <tr>
                        <th   className="ColoretableForm">Type Reduction</th>
                        <th   className="ColoretableForm">Montant</th>
                        <th   className="ColoretableForm">Percentage</th>
                      </tr>
                  </thead>
                  <tbody>
                  {tarifsReduction
                        ?.filter(
                          (item) =>
                            item?.tarif_reduction?.designation ===
                            tarifActuel?.tarif_reduction.designation
                        )
                        ?.map((item) => (
                          <tr key={item?.id}>
                            <td>{item?.type_reduction?.type_reduction}</td>
                            <td>{item?.montant}</td>
                            <td>{item?.percentage}</td>
                          </tr>
                        ))
                      } 
                  </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

    </>
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
                  count={filteredTarifsactuel?.length || 0}
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

export default TarifsActuel;