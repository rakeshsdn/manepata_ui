import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/students";

export const listStudents = (centerId) =>
  axios.get(`${REST_API_BASE_URL}/center/${centerId}`);

export const createStudent = (student, centerId) =>
  axios.post(`${REST_API_BASE_URL}/${centerId}`, student, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getStudent = (studentId, centerId) =>
  axios.get(`${REST_API_BASE_URL}/${studentId}/${centerId}`);

export const updateStudent = (studentId, student, centerId) =>
  axios.put(`${REST_API_BASE_URL}/${studentId}/${centerId}`, student, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const deleteStudent = (studentId, centerId) =>
  axios.delete(`${REST_API_BASE_URL}/${studentId}/${centerId}`);

export const bulkCreateStudents = (students, centerId) => {
  const url = `${REST_API_BASE_URL}/bulk-upload/${centerId}`;
  axios.post(url, students);
};
