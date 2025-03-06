import axios from "axios";

// Fetch Clients
export const fetchClients = () => async (dispatch) => {
    try {
        console.log("Fetching clients..."); // Debugging log
        const response = await axios.get("http://127.0.0.1:8000/api/clientagence");
        console.log("API Response:", response.data); // Debugging log
        dispatch({ type: "FETCH_CLIENTS_SUCCESS" , payload: response.data });
    } catch (error) {
        console.error("Error fetching clients:", error);
        dispatch({ type: "FETCH_GROUPS_FAILURE", error });
    }
};

// Fetch Groups
export const fetchGroups = () => async (dispatch) => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/groups");
        dispatch({ type: "FETCH_GROUPS_SUCCESS", payload: response.data });
    } catch (error) {
        console.error("Error fetching groups:", error);
        dispatch({ type: "FETCH_GROUPS_FAILURE", error });
    }
};

// Fetch Clients for a Group
export const fetchClientsByGroup = (groupId) => async (dispatch) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/clientgrp?group_id=${groupId}`);
      dispatch({ type: "FETCH_GROUP_CLIENTS_SUCCESS", payload: response.data });
    } catch (error) {
      console.error("Error fetching group clients:", error);
      dispatch({ type: "FETCH_GROUP_CLIENTS_FAILURE", error });
    }
};      


// Submit New Clients to a Group
export const submitClients = (payload) => async (dispatch) => {
    try {
        await axios.post("http://127.0.0.1:8000/api/clientgrp", payload);
        dispatch({ type: "SUBMIT_CLIENTS_SUCCESS", payload });
    } catch (error) {
        console.error("Error submitting clients:", error);
        dispatch({ type: "SUBMIT_CLIENTS_FAILURE", error });
    }
};

export const deleteGroup = (groupNumber) => async (dispatch) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/groups/${groupNumber}`);
        dispatch({ type: "DELETE_GROUP_SUCCESS", payload: groupNumber });
    } catch (error) {
        console.error("Error deleting group:", error);
    }
};

