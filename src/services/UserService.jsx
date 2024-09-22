import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/users";

// Function to fetch the list of users
export const fetchUserList = () => axios.get(REST_API_BASE_URL);

// Function to fetch a single user by ID
export const fetchUserById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

// Function to create a new user
export const createUser = (userData) =>
  axios.post(REST_API_BASE_URL, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Function to update an existing user
export const updateUser = (id, userData) =>
  axios.put(`${REST_API_BASE_URL}/${id}`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Function to delete a user by ID
export const deleteUser = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);

const UserService = {
  fetchUserList,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default UserService;
