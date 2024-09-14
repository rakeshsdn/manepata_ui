// CenterService.js
import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/centers";

// Function to create a new center
export const createCenter = (center) =>
  axios.post(REST_API_BASE_URL, center, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Function to fetch all centers
export const listCenters = () => axios.get(REST_API_BASE_URL);

export const listCentersById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

// Function to update a center
export const updateCenter = (centerId, center) =>
  axios.put(`${REST_API_BASE_URL}/${centerId}`, center, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Function to delete a center
export const deleteCenter = (centerId) =>
  axios.delete(`${REST_API_BASE_URL}/${centerId}`);
