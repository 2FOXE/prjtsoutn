import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import Search from "../Acceuil/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useOpen } from "../Acceuil/OpenProvider";
import Box from "@mui/material/Box";
import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, fetchGroups, fetchClientsByGroup} from "../redux/actions";
//import { FETCH_CLIENTS } from '../redux/actions.js';



export const ClientsAndGroups = () => {
    const dispatch = useDispatch();
    const clients = useSelector(state => state.clients);
    const groups = useSelector(state => state.groups);
    const clientgrp = useSelector(state => state.clientgrp);
    const selectedAdminId = useSelector(state => state.selectedAdminId);
    const [selectedClient, setSelectedClient] = useState(null);
    const [filteredGroups, setFilteredGroups] = useState(groups);
    const { dynamicStyles } = useOpen();
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [clientInputs, setClientInputs] = useState([{ cin: "", nom: "", prenom: "", email: "" }]);
    const [selectedGroupNumber, setSelectedGroupNumber] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [opened, setOpened] = useState("closed");
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [inputValue, setInputValue] = useState(0);
    const [count, setCount] = useState(0);

    // Fetch clients and groups on component mount
    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchGroups());
    }, [dispatch]);

    useEffect(() => {
        setFilteredGroups(groups);
    }, [groups]);
    

    // Toggle group clients
    const toggleClients = (groupId) => {
        if (expandedGroup === groupId) {
            setExpandedGroup(null);
        } else {
            setExpandedGroup(groupId);
            dispatch(fetchClientsByGroup(groupId));
        }
    };

    const isOpen = async (id) => {
        if (!id || id === 0) {
            alert("Error: Invalid id.");
            return;
        }
    
        setSelectedGroupNumber(id);
    
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/groups?id=${id}`);
            const { admin_id } = response.data;
    
            if (admin_id) {
                dispatch(setSelectedAdminId(admin_id.toString())); // Correct Redux update
            } else {
                dispatch(setSelectedAdminId("")); // Reset Redux state
            }
        } catch (error) {
            alert("Error: Unable to fetch admin ID.");
        }
    
        setOpened(opened === "closed" ? "opened" : "closed");
    };

    const deleteGroup = (groupNumber) => async (dispatch) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/groups/${groupNumber}`);
            dispatch({ type: "DELETE_GROUP_SUCCESS", payload: groupNumber });
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    const submitClients = (payload) => async (dispatch) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/clientgrp", payload);
            dispatch({ type: "SUBMIT_CLIENTS_SUCCESS", payload });
        } catch (error) {
            console.error("Error submitting clients:", error);
            dispatch({ type: "SUBMIT_CLIENTS_FAILURE", error });
        }
    };

    const setSelectedAdminId = (adminId) => ({
        type: 'SET_SELECTED_ADMIN_ID',
        payload: adminId,
    });

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const toggleOpened = () => {
        setOpened(opened === "closed" ? "opened" : "closed");
    };

    const handleSubmitCount = (value) => {
        const numClients = parseInt(value, 10);
        if (!isNaN(numClients) && numClients > 0) {
            setCount(numClients);
            setClientInputs(Array.from({ length: numClients }, () => ({ cin: "", nom: "", prenom: "", email: "" })));
        } else {
            alert("Please enter a valid number of clients.");
        }
    };

    // Define the handleInputChange function
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedInputs = [...clientInputs];
        updatedInputs[index][name] = value; // Update the specific input field
        setClientInputs(updatedInputs); // Update the state with the new inputs
    };

    const handleSubmitClients = (e) => {
        e.preventDefault(); // Prevent the default form submission
        const payload = clientInputs; // Use the current client inputs as the payload
        dispatch(submitClients(payload)); // Dispatch the action to submit clients
    };

    return (
    <>
        <style>
                {`
                    .highlight {
                        background-color: #f0f8ff; /* Light blue background for highlighted row */
                    }
                `}
            </style>
        <ThemeProvider theme={createTheme()}>
            <Box sx={{ ...dynamicStyles, width: '95vw', height: '100vh', overflow: 'auto' }}>
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4, width: '100%', height: '100%' }}>
                    <>
                        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'stretch' }}>
                            {/* Clients Table */}
                            <div className="relative z-0 p-2" style={{ flex: 2, marginTop: "5%", overflowX: 'auto' }}>
                                <h1 className="text-xl font-bold mb-4">List de client</h1>
                                <table className="table table-hover">
                                    <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1, padding: '10px' }}>
                                        <tr className="tableHead">
                                            <th className="tableHead">Code</th>
                                            <th className="tableHead">Nom</th>
                                            <th className="tableHead">Prenom</th>
                                            <th className="tableHead">CIN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.length > 0 ? (
                                            clients.map(client => (
                                                <tr key={client.CodeClient}>
                                                    <td className="border p-2">{client.CodeClient}</td>
                                                    <td className="border p-2">{client.name}</td>
                                                    <td className="border p-2">{client.prenom || "N/A"}</td>
                                                    <td className="border p-2">{client.cin}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center p-2">No clients found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>


                            </div>
                
                            {/* Groups Table */}
                            <div className="relative z-0 p-2" style={{ flex: '1 1 50%', marginTop: "5%", overflowX: 'auto' }}>
                            <h1 className="text-xl font-bold mb-4">
                                Groupes {selectedClient ? `de ${clients.find(c => c.CodeClient === selectedClient)?.name || ''}` : ''}
                            </h1>
                                <table className="table table-bordered" style={{ width: '100%', marginTop: '0px' }}>
                                    <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1, padding: '10px' }}>
                                        <tr className="tableHead">
                                            <th className="tableHead">Nombre</th>
                                            <th className="tableHead">Reservation Date</th>
                                            <th className="tableHead">Date d'entre</th>
                                            <th className="tableHead">Date de sortie</th>
                                            <th className="tableHead">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groups.map(group => (
                                            <React.Fragment key={group.id}>
                                                <tr className="cursor-pointer hover:bg-gray-100">
                                                    <td className="border p-2">
                                                    <button
                                                        type="button" 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => toggleClients(group.id)}  // Pass group ID from groups table 
                                                        >
                                                        {expandedGroup === group.id ? "-" : "+"}
                                                    </button>
                                                        {" "}{group.group_number}
                                                    </td>
                                                    <td className="border p-2">{group.dateReservation}</td>
                                                    <td className="border p-2">{group.dateEntre}</td>
                                                    <td className="border p-2">{group.dateSortie}</td>
                                                    <td className="border border-gray-300 p-2">
                                                        <button type="button" className="btn btn-primary" style={{ margin: "1%" }} onClick={() => isOpen(group.id)}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </button>
                                                        <button type="button" className="btn btn-danger" style={{ margin: "1%" }} onClick={() => handleShowDeleteModal(group.groupNumber)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedGroup === group.id && (
                                                    <tr>
                                                        <td colSpan="5">
                                                            {clientgrp.length > 0 ? (
                                                                <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                                                                    <thead>
                                                                        <tr className="bg-gray-100">
                                                                            <th className="ColoretableForm">CIN</th>
                                                                            <th className="ColoretableForm">Nom</th>
                                                                            <th className="ColoretableForm">Prenom</th>
                                                                            <th className="ColoretableForm">Email</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {clientgrp.map(client => (
                                                                            <tr 
                                                                                key={`${client.id}-${client.cin}`} 
                                                                                onClick={() => setSelectedRowId(selectedRowId === client.id ? null : client.id)}
                                                                                className={selectedRowId === client.id ? 'highlight' : ''}
                                                                            >
                                                                                <td className="border p-2">{client.cin}</td>
                                                                                <td className="border p-2">{client.nom}</td>
                                                                                <td className="border p-2">{client.prenom}</td>
                                                                                <td className="border p-2">{client.email}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div>No clients found</div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                                <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirme la suppression</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Vous voulez supprimer ce groupe?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseDeleteModal}>
                                            Non
                                        </Button>
                                        <Button variant="danger" onClick={() => {/* Handle delete logic here */}}>
                                            Oui
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            {opened === "opened" && (
                                <form onSubmit={handleSubmitClients} style={{ marginTop: '5%' }}>
                                    <div className="input-group mb-3" style={{ marginBottom: "4%" }}>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="form-control"
                                            placeholder="nombre"
                                            aria-label="nombre"
                                        />
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmitCount(inputValue);
                                            }}>
                                            Nombre de client
                                        </button><br />
                                        {count > 0 && (
                                            <nav>
                                                {clientInputs.map((client, index) => (
                                                    <div key={index} className="d-flex justify-content-around" style={{ marginTop: "2%" }}>
                                                        <input
                                                            placeholder="CIN"
                                                            value={client.cin}
                                                            onChange={(e) => handleInputChange(e, index)} // Update on change
                                                            name="cin" // Ensure the name corresponds to the field
                                                            className="form-control"
                                                        />
                                                        <input
                                                            placeholder="Nom"
                                                            value={client.nom}
                                                            onChange={(e) => handleInputChange(e, index)} // Update on change
                                                            name="nom" // Ensure the name corresponds to the field
                                                            className="form-control"
                                                        />
                                                        <input
                                                            placeholder="Prenom"
                                                            value={client.prenom}
                                                            onChange={(e) => handleInputChange(e, index)} // Update on change
                                                            name="prenom" // Ensure the name corresponds to the field
                                                            className="form-control"
                                                        />
                                                        <input
                                                            placeholder="Email"
                                                            type="email"
                                                            value={client.email}
                                                            onChange={(e) => handleInputChange(e, index)} // Update on change
                                                            name="email" // Ensure the name corresponds to the field
                                                            className="form-control"
                                                        />
                                                    </div>
                                                ))}
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </nav>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>    
                    </>
                </Box>
            </Box>
        </ThemeProvider></>
    );
}    

