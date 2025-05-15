// src/actions/EvenementActions.js
import axios from "axios";

// Fetch Evenements
export const fetchEvenements = () => async (dispatch) => {
  dispatch({ type: "FETCH_EVENEMENTS_REQUEST" });
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/evenements");
    dispatch({ type: "FETCH_EVENEMENTS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "FETCH_EVENEMENTS_FAILURE", payload: error.message });
  }
};

// Add Evenement
export const addEvenement = (evenement) => async (dispatch) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/evenements", evenement);
    dispatch({ type: "ADD_EVENEMENT_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Error adding evenement:", error);
  }
};

// Update Evenement
export const updateEvenement = (id, updatedData) => async (dispatch) => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/evenements/${id}`, updatedData);
    dispatch({ type: "UPDATE_EVENEMENT_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Error updating evenement:", error);
  }
};

// Delete Evenement
export const deleteEvenement = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/evenements/${id}`);
    dispatch({ type: "DELETE_EVENEMENT_SUCCESS", payload: id });
  } catch (error) {
    console.error("Error deleting evenement:", error);
  }
};
