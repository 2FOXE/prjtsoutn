import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import Navigation from "../Acceuil/Navigation";
import { highlightText } from '../utils/textUtils';
import TablePagination from "@mui/material/TablePagination";
import "jspdf-autotable";
import Search from "../Acceuil/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select';  
import {
  faTrash,
  faFileExcel,
  faPlus,
  faEdit,
  faPrint,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "../style.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Checkbox, Fab, Toolbar } from "@mui/material";
import { useOpen } from "../Acceuil/OpenProvider"; // 

//------------------------- Reservation ---------------------//
const Reservation = () => {
  const [reservations, setReservations] = useState([]);


  // Modal and editing state (if you use modals or separate forms)
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    reservation_num: "",
    client_id: "",
    client_type: "",
    reservation_date: "",
    date_debut: "",
    date_fin: "",
    status: "",
    selectedRooms: [] // Array to store selected room IDs (Chambre IDs)
  });
  
  

  const [errors, setErrors] = useState({
    reservation_num: "",
    client_id: "",
    client_type: "",
    reservation_date: "",
    date_debut: "",
    date_fin: "",
    status: "",
    selectedRooms: []
  
  });

  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0px",
  });
  //-------------------edit-----------------------//
  const [editingReservation, setEditingReservation] = useState(null);

  // Pagination and Search for Reservations
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filteredReservations, setFilteredReservations] = useState([]);

  const indexOfLastReservation = (page + 1) * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [selectedProductsDataRep, setSelectedProductsDataRep] = useState([]);




  const fetchReservations = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/reservations");
        if (response.data && response.data.status === 'success') {
            setReservations(response.data.reservations);
            setFilteredReservations(response.data.reservations);
        } else {
            throw new Error(response.data?.message || 'Invalid response format');
        }
    } catch (error) {
        console.error("Error fetching reservations:", error);
        const errorMessage = error.response?.data?.message 
            || error.message 
            || "Erreur lors de la récupération des réservations.";
            
        Swal.fire({
            icon: "error",
            title: "Erreur!",
            text: errorMessage,
        });
    }
};
  
    
  useEffect(() => {
    // Always fetch fresh data when component mounts
    fetchReservations();
    const intervalId = setInterval(fetchReservations, 300000); // Refresh every 5 minutes
    return () => {
      clearInterval(intervalId); 
    };
  }, []); 
    

  const clearAndUpdateLocalStorage = (data) => {
    localStorage.removeItem("reservations");
  
    localStorage.setItem("reservations", JSON.stringify(data));
  }
  
  
  //---------------------------------------------
  const [clientType, setClientType] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [societeClients, setSocieteClients] = useState([]);
  const [particulierClients, setParticulierClients] = useState([]);
  const [isClientsLoading, setIsClientsLoading] = useState(false); 
  const [forceUpdate, setForceUpdate] = useState(false);  
  const handleClientTypeChange = async (e) => {
    const selectedType = e.target.value;
    setClientType(selectedType);
  
    setFormData((prev) => ({
      ...prev,
      client_type: selectedType,
      client_id: "", 
    }));
  
    setIsClientsLoading(true); 
  
    try {
      let response;
      if (selectedType === "societe") {
        response = await axios.get("http://127.0.0.1:8000/api/clients-societe");
        setSocieteClients(response.data);
      } else if (selectedType === "particulier") {
        response = await axios.get("http://127.0.0.1:8000/api/clients-particuliers");
        setParticulierClients(response.data.client);
      }
  
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsClientsLoading(false); // Stop loading
    }
  };
    useEffect(() => {
    console.log("Societe Clients after state update:", societeClients); 
  }, [societeClients]);  
  useEffect(() => {
    console.log("Societe Clients after state update:", societeClients);  
  }, [societeClients]);  // This hook runs whenever societeClients changes
  
  useEffect(() => {
    console.log("Societe Clients:", societeClients);
    console.log("Particulier Clients:", particulierClients);
  }, [societeClients, particulierClients]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  console.log("Client Type:", clientType);

  useEffect(() => {
    console.log("Societe Clients after update:", societeClients);
  }, [societeClients]);
    

  
  useEffect(() => {
    if (!reservations) return; 
  
    const filteredReservations = reservations.filter((reservation) => 
      Object.values(reservation).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
  
    console.log("Filtered Reservations:", filteredReservations);
    setFilteredReservations(filteredReservations);
  }, [reservations, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const [numberOfRooms, setNumberOfRooms] = useState(1);

  
  const [availableEtages, setAvailableEtages] = useState([]);
  const [availableVues, setAvailableVues] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableRoomsForSelect, setAvailableRoomsForSelect] = useState([]); // For room numbers

// Fetch available rooms when date range is selected
const [availableRooms, setAvailableRooms] = useState([]);
const [roomTypes, setRoomTypes] = useState([]);
const [roomEtages, setRoomEtages] = useState([]);
const [roomVues, setRoomVues] = useState([]);
const [selectedVue, setSelectedVue] = useState("");
const [selectedEtage, setSelectedEtage] = useState("");

const [selectedRooms, setSelectedRooms] = useState([]);

const fetchAvailableRooms = async () => {
  if (formData.date_debut && formData.date_fin) {
    try {
      const response = await axios.get("http://localhost:8000/api/available-rooms", {
        params: {
          date_debut: formData.date_debut,
          date_fin: formData.date_fin,
        },
      });

      if (response.data && response.data.rooms) {
        // Set available rooms with proper data structure
        const formattedRooms = response.data.rooms.map(room => ({
          id: room.id,
          num_chambre: room.num_chambre,
          type_chambre: room.type_chambre || 'Unknown',
          vue: room.vue || 'Unknown',
          etage: room.etage || 'Unknown'
        }));
        
        setAvailableRooms(formattedRooms);

        // Extract unique values with fallback to 'Unknown'
        const uniqueTypes = [...new Set(formattedRooms.map(room => room.type_chambre))];
        const uniqueEtages = [...new Set(formattedRooms.map(room => room.etage))];
        const uniqueVues = [...new Set(formattedRooms.map(room => room.vue))];

        setRoomTypes(uniqueTypes);
        setRoomEtages(uniqueEtages);
        setRoomVues(uniqueVues);
      } else {
        setAvailableRooms([]);
        setRoomTypes([]);
        setRoomEtages([]);
        setRoomVues([]);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      setAvailableRooms([]);
      setRoomTypes([]);
      setRoomEtages([]);
      setRoomVues([]);
    }
  }
};

useEffect(() => {
  if (formData.date_debut && formData.date_fin) {
    fetchAvailableRooms();
  }
}, [formData.date_debut, formData.date_fin]);

const getFilteredAvailableRooms = (currentIndex) => {
  const selectedRoomIds = selectedRooms.map(room => room.chambre).filter(id => id); 
  
  return availableRooms.filter(chambre => 
    !selectedRoomIds.includes(chambre.id) || chambre.id === selectedRooms[currentIndex]?.chambre
  );
};
const handleRoomChange = (rowIndex, field, value) => {
  setSelectedRooms(prevRooms => {
    const updatedRooms = [...prevRooms];
    
    // If changing the room number directly
    if (field === "num_chambre") {
      const selectedRoom = availableRooms.find(room => room.num_chambre === value);
      if (selectedRoom) {
        updatedRooms[rowIndex] = {
          ...updatedRooms[rowIndex],
          num_chambre: value,
          type: selectedRoom.type_chambre,
          etage: selectedRoom.etage,
          vue: selectedRoom.vue,
          id: selectedRoom.id
        };
      }
    } 
    // If changing other fields (type, etage, vue)
    else {
      updatedRooms[rowIndex] = {
        ...updatedRooms[rowIndex],
        [field]: value
      };
      
      let filteredRooms = availableRooms;
      if (updatedRooms[rowIndex].type) {
        filteredRooms = filteredRooms.filter(r => r.type_chambre === updatedRooms[rowIndex].type);
      }
      if (updatedRooms[rowIndex].etage) {
        filteredRooms = filteredRooms.filter(r => r.etage === updatedRooms[rowIndex].etage);
      }
      if (updatedRooms[rowIndex].vue) {
        filteredRooms = filteredRooms.filter(r => r.vue === updatedRooms[rowIndex].vue);
      }
      
      if (filteredRooms.length === 1) {
        updatedRooms[rowIndex] = {
          ...updatedRooms[rowIndex],
          num_chambre: filteredRooms[0].num_chambre,
          id: filteredRooms[0].id
        };
      }
    }
    
    return updatedRooms;
  });
};

const handleDeleteRoom = (rowIndex) => {
  const updatedRooms = selectedRooms.filter((_, index) => index !== rowIndex);
  setSelectedRooms(updatedRooms);
};
const addRow = () => {
  setSelectedRooms([...selectedRooms, { type: "", vue: "", etage: "", num: "" }]);
};

const getFilteredOptions = (filterType, rowIndex) => {
  let filteredRooms = [...availableRooms];
  const currentRoom = selectedRooms[rowIndex];

  // Filter out rooms that are already selected in other rows
  const otherSelectedRoomIds = selectedRooms
    .filter((_, index) => index !== rowIndex)
    .map(room => room.id)
    .filter(id => id);
  
  filteredRooms = filteredRooms.filter(room => !otherSelectedRoomIds.includes(room.id));

  // Apply filters based on currently selected values for this row
  if (currentRoom?.type) {
    filteredRooms = filteredRooms.filter(room => room.type_chambre === currentRoom.type);
  }
  if (currentRoom?.etage) {
    filteredRooms = filteredRooms.filter(room => room.etage === currentRoom.etage);
  }
  if (currentRoom?.vue) {
    filteredRooms = filteredRooms.filter(room => room.vue === currentRoom.vue);
  }

  // Return unique values for the requested filter type
  switch (filterType) {
    case 'type':
      return [...new Set(filteredRooms.map(room => room.type_chambre))];
    case 'etage':
      return [...new Set(filteredRooms.map(room => room.etage))];
    case 'vue':
      return [...new Set(filteredRooms.map(room => room.vue))];
    case 'num_chambre':
      return [...new Set(filteredRooms.map(room => room.num_chambre))];
    default:
      return [];
  }
};


console.log('Available rooms:', availableRooms);
console.log('Number of rooms selected:', numberOfRooms);

/*const handleRoomChange = (index, field, value) => {
  setSelectedRooms(prevRooms => {
    const updatedRooms = [...prevRooms];
    updatedRooms[index][field] = value;

    if (field === "chambre" && value) {
      const selectedRoom = availableRooms.find(room => room.id === parseInt(value));
      if (selectedRoom) {
        updatedRooms[index].type = selectedRoom.type_chambre;
        updatedRooms[index].etage = selectedRoom.etage;
        updatedRooms[index].vue = selectedRoom.vue;
      }
    }

    return updatedRooms;
  });
};*/

const handleAddEmptyRow = () => {
  if (selectedRooms.length >= availableRooms.length) {
    Swal.fire({
      icon: "warning",
      title: "Limite atteinte",
      text: "Vous avez sélectionné toutes les chambres disponibles.",
    });
    return; 
  }
  setSelectedRooms(prevRooms => [
    ...prevRooms,
    { type: "", etage: "", vue: "", chambre: "" }
  ]);
};

/*const handleDeleteRoom = (index) => {
  setSelectedRooms(prevRooms => prevRooms.filter((_, i) => i !== index));
};*/


const handleNumberOfRoomsChange = (e) => {
  const number = parseInt(e.target.value);
  
  if (availableRooms.length > 0 && number <= availableRooms.length) {
    setNumberOfRooms(number);  
  } else {
    alert(`You cannot select more rooms than the available rooms (${availableRooms.length}).`);
    setNumberOfRooms(availableRooms.length);  
  }
};


  /*const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };*/

  //------------------------- CHAMBRE EDIT---------------------//

  const handleEdit = (reservation) => {
    setEditingReservation(reservation); 
  
    console.log("Editing Reservation:", reservation);
  
    // Populate form data with chambre details
    setFormData({
      reservation_num: reservation.reservation_num,
      client_id: reservation.client_id,
      client_type: reservation.client_type,
      reservation_date: reservation.reservation_date,
      date_debut: reservation.date_debut,
      date_fin: reservation.date_fin,
      status: reservation.status,
    });
  
    // Handle showing the form
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeForm();
    }
  };
  

  useEffect(() => {
    const validateData = () => {
      const newErrors = { ...errors };
      newErrors.reservation_num = formData.reservation_num === "";
      newErrors.client_id = formData.client_id === "";
      newErrors.reservation_date = formData.reservation_date === "";
      newErrors.date_debut = formData.date_debut === "";
      newErrors.date_fin = formData.date_fin === ""
        || new Date(formData.date_fin) < new Date(formData.date_debut);
      newErrors.status = formData.status === "";
  

      setErrors(newErrors);
    };
  
    validateData();
  }, [formData]); // Run validation whenever formData changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate reservation number if not provided
    const reservationNum = formData.reservation_num || `R${Date.now()}`;

    // Validate required fields
    if (!formData.client_id || !formData.date_debut || 
        !formData.date_fin || !formData.status || !selectedRooms.length) {
        Swal.fire({
            icon: "error",
            title: "Erreur!",
            text: "Veuillez remplir tous les champs obligatoires.",
        });
        return;
    }

    // Get room IDs
    const chambreIds = selectedRooms
        .filter(room => room.id)
        .map(room => room.id);

    // Prepare request data
    const requestData = {
        reservation_num: reservationNum, // Include the reservation number
        client_id: formData.client_id,
        client_type: clientType, // Use clientType state instead of formData.client_type
        reservation_date: formData.reservation_date || new Date().toISOString().split('T')[0],
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        status: formData.status,
        chambre_ids: chambreIds
    };

    try {
        const response = await axios.post("http://localhost:8000/api/reservations", requestData);
        if (response.status === 201) {
            Swal.fire({
                icon: "success",
                title: "Réservation réussie!",
                text: "La réservation a été ajoutée avec succès.",
            });
            closeForm();
            await fetchReservations();
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            icon: "error",
            title: "Erreur!",
            text: error.response?.data?.message || "Une erreur s'est produite lors de la soumission de la réservation.",
        });
    }
};
  
  console.log("Selected rooms:", formData.selectedRooms);

    
  //------------------------- CLIENT PAGINATION---------------------//

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem('rowsPerPageChambres', selectedRows);
    setPage(0);
  };

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem('rowsPerPageReservations');
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  //------------------------- CLIENT DELETE---------------------//

  const handleDelete = (reservation_num) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cette réservation ?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8000/api/reservations/${reservation_num}`)
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Réservation supprimée avec succès.",
              });
              fetchReservations(); 
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression:", error);
            Swal.fire({
              icon: "error",
              title: "Erreur!",
              text: error.response?.data?.message || "Erreur lors de la suppression de la réservation.",
            });
          });
      }
    });
  };

   //-------------------------Select Delete --------------------//
  const handleDeleteSelected = () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
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
        selectedItems.forEach((id) => {
          axios
            .delete(`http://localhost:8000/api/reservations`)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Chambres supprimé avec succès.",
              });
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression du chambre:", error);
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: "Échec de la suppression du chambre.",
              });
            });
        });
      
    setSelectedItems([]);
    fetchReservations();
  }})
}

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(reservations?.map((reservation) => reservation.id));
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
    const table = document.getElementById('reservationsTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Reservations' });
    XLSX.writeFile(workbook, 'reservations_table.xlsx');
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Manually adding HTML content
    const title = 'Table Reservations';
    doc.text(title, 14, 16);
    
    doc.autoTable({
      head: [['Reservation number', 'Client id', 'Client type', 'Chambre id', 'Date reservation', "Date debut", "Date fin", "Status"]],
      body: filteredReservations?.map(reservation => [
        reservation.reservation_num ? { content: 'Reservation number', rowSpan: 1 } : '',
        reservation.client_id || '',
        reservation.client_type || '',
        reservation.chambre_id || '',
        reservation.reservation_date || '',
        reservation.date_debut || '',
        reservation.date_fin || '',
        reservation.status || '',

      ]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: '#007bff' }
    });
  
    doc.save('reservations_table.pdf');
  };
  

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reservation List</title>
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
          <h1>Chambre List</h1>
          <table>
            <thead>
              <tr>
                <th>Reservaton number</th>
                <th>Client</th>
                <th>Type Client</th>
                <th>Nombre de chambre</th>
                <th>Date de reservation</th>
                <th>Date debut</th>
                <th>Date fin</th>
                <th>Status</th>


              </tr>
            </thead>
            <tbody>
              ${filteredReservations?.map(reservation => `
                <tr>
                  <td>${reservation.reservation_num || ''}</td>
                  <td>${reservation.client_id || ''}</td>
                  <td>${reservation.client_type || ''}</td>
                  <td>${reservation.chambre_id || ''}</td>
                  <td>${reservation.reservation_date || ''}</td>
                  <td>${reservation.date_debut || ''}</td>
                  <td>${reservation.date_fin || ''}</td>
                  <td>${reservation.status || ''}</td>

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
        handleDeleteType(typeId);
      } else if (action === "edit") {
        handleEditType(typeId);
      }

      // Clear selection after action
      event.target.value = "";
    }
  });
  


const filteredcReservations = reservations?.filter((reservation) => {
  return (
    (searchTerm
      ? (
          reservation.reservation_num?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (reservation.client_data?.name && reservation.client_data.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          reservation.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (reservation.chambre?.num_chambre && reservation.chambre.num_chambre.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : true)
  );
});

const handleDeleteType = async (categorieId) => {
  try {
    await axios.delete(`http://localhost:8000/api/types-chambre/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Type supprimée avec succès.",
    });
    await fetchReservations(); // Refresh categories after adding

    // Récupérer les nouvelles catégories après suppression
   
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: "Ce type est associé à une autre reservation.",
    });
  }
};

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
  setShowForm(false); 
  setFormData({
    reservation_num: "",
    client_id: "",
    client_type: "",
    reservation_date: "",
    date_debut: "",
    date_fin: "",
    status: "confirmé",
    selectedRooms: []
  });
  setErrors({
    reservation_num: "",
    client_id: "",
    client_type: "",
    reservation_date: "",
    date_debut: "",
    date_fin: "",
    status: "",
    selectedRooms: []
  });
  setSelectedProductsData([])
  setSelectedProductsDataRep([])
  setEditingReservation(null); 
 };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles}}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
          <div className="d-flex justify-content-between align-items-center"
            style={{ marginTop: "15px" }}>
            <h3 className="titreColore">
              {/* <PeopleIcon style={{ fontSize: "24px", marginRight: "8px" }} /> */}
              Liste des Réservations
            </h3>
            <div className="d-flex">
              <div style={{ width: "500px", marginRight: "20px" }}>
                <Search onSearch={handleSearch} type="search" />
              </div>


              <div>
               <FontAwesomeIcon
               style={{ cursor: "pointer", color: "grey", fontSize: "2rem"}} onClick={printTable} icon={faPrint} className="me-2"
               />

               <FontAwesomeIcon style={{ cursor: "pointer", color: "red", fontSize: "2rem", marginLeft: "15px"}}
               icon={faFilePdf}
               onClick={exportToPDF}
               />

               <FontAwesomeIcon style={{ cursor: "pointer", color: "green", fontSize: "2rem", marginLeft: "15px"}} 
               icon={faFileExcel} 
               onClick={exportToExcel}
               />
              </div>
            </div>
          </div>

          <div className="container-d-flex justify-content-start">
            <div style={{ display: "flex", alignItems: "center" ,marginTop:'15px' ,padding:'0'}}>
             
              <a style={{display: "flex", alignItems: "center",cursor: "pointer",}}
                className="AjouteBotton"
                onClick={handleShowFormButtonClick}
              >
 <FontAwesomeIcon
                    icon={faPlus}
                    className=" AjouteBotton"
                    style={{ cursor: "pointer" }}
                  />Ajouter Réservation
              </a>

            </div>

          

        <div style={{ marginTop:"20px",}}>
        <div id="formContainer" className="" style={{...formContainerStyle,marginTop:'0px',maxHeight:'700px',overflow:'auto',padding:'0'}}>
              <Form className="col row" onSubmit={handleSubmit}>
                <Form.Label className="text-center ">
                <h4
            style={{
              fontSize: "28px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "black",
              borderBottom: "2px solid black",
              paddingBottom: "15px",
              marginBottom: "20px"
                    }}
                    >
                      {editingReservation ? "Modifier" : "Ajouter"} une réservation</h4>
                </Form.Label>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>N°Réservation</Form.Label>
                  <Form.Control
                    type="text"
                    name="reservation_num"
                    //isInvalid={!!errors.reservation_num}
                    value={formData.reservation_num}
                    placeholder="Code de réservation"
                    onChange={handleChange}
                    className="form-control"
                    style={{ fontSize: "16px", padding: "12px", borderRadius: "5px" }}
                    lang="fr"
                  />
                  <Form.Text className="text-danger">{errors.num_chambre}</Form.Text>
                </Form.Group>

                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '10px', marginLeft: '7px'}}>Type de Client</Form.Label>
        <div>
          <Form.Check
            type="radio"
            label="Société"
            name="client_type"
            value="societe"
            checked={clientType === "societe"}
            onChange={handleClientTypeChange}
            inline
          />
          <Form.Check
            type="radio"
            label="Particulier"
            name="client_type"
            value="particulier"
            checked={clientType === "particulier"}
            onChange={handleClientTypeChange}
            inline
          />
        </div></Form.Group>


        <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
  <Form.Label className="col-sm-4" style={{ flex: '1', marginRight: '10px', marginLeft: '7px' }}>
    Client
  </Form.Label>

  {/* Only show the dropdown once the client data has been fetched */}
  <Select
    name="client_id"
    value={
      (clientType === "societe" ? societeClients : particulierClients).find(client => client.id === formData.client_id) 
      ? { 
          value: formData.client_id, 
          label: (clientType === "societe" ? societeClients : particulierClients).find(client => client.id === formData.client_id)[clientType === "societe" ? "CodeClient" : "CodeClient"] 
        }
      : null
    }
    onChange={(selectedOption) => {
      setFormData({
        ...formData,
        client_id: selectedOption ? selectedOption.value : "",
      });
    }}
    options={(clientType === "societe" ? societeClients : particulierClients).map((client) => ({
      value: client.id,
      label: clientType === "societe" ? client.CodeClient : client.CodeClient,
    }))}
    placeholder="Sélectionner un client"
    isSearchable
    styles={{
      container: (provided) => ({
        ...provided,
        width: "100%", // Ensure full width for the Select dropdown
      }),
      control: (provided) => ({
        ...provided,
        width: "100%", // Ensure the input control takes up the full width
      }),
    }}
  />
</Form.Group>



<Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
<Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '10px', marginLeft: '7px'}}>Client</Form.Label>
    <Select
      name="client_id"
      value={
        (clientType === "societe" ? societeClients : particulierClients).find(client => client.id === formData.client_id)
          ? {
              value: formData.client_id,
              label:
                clientType === "societe"
                  ? (societeClients.find(client => client.id === formData.client_id) || {}).raison_sociale
                  : `${(particulierClients.find(client => client.id === formData.client_id) || {}).name} ${(particulierClients.find(client => client.id === formData.client_id) || {}).prenom}`,  // Adjust based on client type
            }
          : null
      }
      onChange={(selectedOption) => {
        handleChange({
          target: {
            name: "client_id",
            value: selectedOption ? selectedOption.value : "",
          },
        });
      }}
      options={
        clientType === "societe"
          ? societeClients.map((client) => ({
              value: client.id,
              label: client.raison_sociale, // For societe, we use CodeClient
            }))
          : particulierClients.map((client) => ({
              value: client.id,
              label: `${client.name} ${client.prenom}`, // For particulier, we use nom and prenom
            }))
      }
      placeholder="Sélectionner un client"
      isSearchable
      styles={{
        container: (provided) => ({
          ...provided,
          width: "100%", // Ensure full width for the Select dropdown
        }),
        control: (provided) => ({
          ...provided,
          width: "100%", // Ensure the input control takes up the full width
        }),
      }}
    />
</Form.Group>





               


                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Date Debut</Form.Label>
                <Form.Control
                type="date"
                name="date_debut"
                placeholder="Date Debut"
                //isInvalid={!!errors.date_debut}
                value={formData.date_debut}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {errors.type_chambre}
              </Form.Text>
                </Form.Group>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Date Fin</Form.Label>
                <Form.Control
                type="date"
                name="date_fin"
                placeholder="Date Fin"
                //isInvalid={!!errors.date_fin}
                value={formData.date_fin}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {errors.type_chambre}
              </Form.Text>
                </Form.Group>


                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }}>
  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '10px', marginLeft: '7px'}}>
    Status
  </Form.Label>
  <Form.Control
    as="select"
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="form-control"
  >
    <option value="">Sélectionner un status</option>
    <option value="en attente">En attente</option>
    <option value="confirmé">Confirmé</option>
    <option value="annulé">Annulé</option>
  </Form.Control>
  <Form.Text className="text-danger">{errors.status}</Form.Text>
</Form.Group>





                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Date Réservation</Form.Label>
                <Form.Control
                type="date"
                name="reservation_date"
                placeholder="Date Réservation"
                //isInvalid={!!errors.reservation_date}
                value={formData.reservation_date}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {errors.type_chambre}
              </Form.Text>
                </Form.Group>

                
                <div style={{ marginLeft: '10px' }}>
  <a href="#" onClick={handleAddEmptyRow}>
    <Button
      className="btn btn-sm mb-2"
      variant="primary"
      disabled={selectedRooms.length >= availableRooms.length}
    >
      <FontAwesomeIcon icon={faPlus} />
    </Button>
    <span style={{ margin: "0 8px" }}></span>
    <strong style={{ color: 'black' }}>Ajouter Chambre</strong>
  </a>
</div>


{/* Chambre Selection Table */}
{/* Chambre Selection Table */}
<Form.Group controlId="selectedChambreTable">
  <div className="table-responsive">
    <table className="table table-bordered" style={{ width: '100%', marginTop: '2px' }}>
      <thead>
        <tr>
          <th colSpan={5}>Liste des Chambres</th>
        </tr>
        <tr>
          <th className="ColoretableForm">Type de Chambre</th>
          <th className="ColoretableForm">Étage</th>
          <th className="ColoretableForm">Vue</th>
          <th className="ColoretableForm">Numéro</th>
          <th className="ColoretableForm">Action</th>
        </tr>
      </thead>
      <tbody>
        {availableRooms.length > 0 ? (
          availableRooms.map((room, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <Form.Control
                  as="select"
                  value={room.type || ''}
                  onChange={(e) => handleRoomChange(rowIndex, "type", e.target.value)}
                >
                  <option value="">Sélectionner un type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Control>
              </td>

              <td>
                <Form.Control
                  as="select"
                  value={room.etage || ''}
                  onChange={(e) => handleRoomChange(rowIndex, "etage", e.target.value)}
                >
                  <option value="">Sélectionner un étage</option>
                  {getFilteredOptions("etage", rowIndex).map((etage) => (
                    <option key={etage} value={etage}>
                      {etage}
                    </option>
                  ))}
                </Form.Control>
              </td>

              <td>
                <Form.Control
                  as="select"
                  value={room.vue || ''}
                  onChange={(e) => handleRoomChange(rowIndex, "vue", e.target.value)}
                >
                  <option value="">Sélectionner une vue</option>
                  {getFilteredOptions("vue", rowIndex).map((vue) => (
                    <option key={vue} value={vue}>
                      {vue}
                    </option>
                  ))}
                </Form.Control>
              </td>

              <td>
                <Form.Control
                  as="select"
                  value={room.num_chambre || ''}
                  onChange={(e) => handleRoomChange(rowIndex, "num_chambre", e.target.value)}
                >
                  <option value="">Sélectionner une chambre</option>
                  {getFilteredOptions("num_chambre", rowIndex).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Control>
              </td>

              <td>
                <FontAwesomeIcon
                  color="red"
                  onClick={() => handleDeleteRoom(rowIndex)}
                  icon={faTrash}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">Aucune chambre ajoutée</td>
          </tr>
        )}
      </tbody>
    </table>
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
                }}
              >
                 <table className="table table-bordered" id="reservationsTable" style={{ marginTop: "-5px", }}>
  <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1,padding:'10px'}}>
    <tr className="tableHead">
      <th className="tableHead">
        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
      </th>
      <th className="tableHead">Code Réservation</th>
      <th className="tableHead">Client</th>
      <th className="tableHead">Chambres</th>
      <th className="tableHead">Date Reservation</th>
      <th className="tableHead">Date Début</th>
      <th className="tableHead">Date Fin</th>
      <th className="tableHead">Status</th>
      <th className="tableHead">Action</th>
    </tr>
  </thead>
  <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
    {filteredReservations
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ?.map((reservation) => {
      return(
         <React.Fragment key={reservation.reservation_num}>
          <tr>
            <td style={{ backgroundColor: "white" }}>
              <input
                type="checkbox"
                checked={selectedItems.some((item) => item === reservation.id)}
                onChange={() => handleCheckboxChange(reservation.id)}
              />
            </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(reservation.reservation_num , searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(reservation.client_id , searchTerm)||''}</td>
            <td style={{ backgroundColor: "white" }}>{reservation.chambres ? highlightText(reservation.chambres.map(chambre=>chambre.num_chambre).join(', '), searchTerm) : ''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(reservation.reservation_date , searchTerm)||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(reservation.date_debut , searchTerm)||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(reservation.date_fin , searchTerm)||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(reservation.status , searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <FontAwesomeIcon
      onClick={() => handleEdit(reservation)}
      icon={faEdit}
      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
    />
    <FontAwesomeIcon
      onClick={() => handleDelete(reservation.reservation_num)}
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
                  count={filteredReservations?.length || 0}
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


export default Reservation;