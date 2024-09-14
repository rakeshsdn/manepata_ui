import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/attendance";

// Function to fetch attendance data
export const fetchAttendanceList = (centerId) =>
  axios.get(`${REST_API_BASE_URL}/${centerId}`);

// Function to update attendance for a student
export const updateAttendance = (studentId, centerId, attendanceData) =>
  axios.put(`${REST_API_BASE_URL}/${centerId}/${studentId}`, attendanceData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
