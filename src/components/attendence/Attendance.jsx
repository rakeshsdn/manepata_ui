import { useState, useEffect } from "react";
import { updateAttendance } from "../../services/AttendanceService"; // Import AttendanceService functions
import { useParams } from "react-router-dom";
import { fetchAttendanceList } from "../../services/AttendanceService";

const Attendance = () => {
  const dummyData = [
    { id: 1, name: "John Doe", rollNumber: "101" },
    { id: 2, name: "Jane Smith", rollNumber: "102" },
    { id: 3, name: "Alice Johnson", rollNumber: "103" },
    { id: 4, name: "Bob Brown", rollNumber: "104" },
  ];

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const { id: centerId } = useParams();
  const [selectAll, setSelectAll] = useState(false);

  // Fetch student list and initialize attendance on component load
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetchAttendanceList(centerId);
        setStudents(response.data);
        // Initialize attendance with default values (Absent)
        const initialAttendance = {};
        response.data.forEach((student) => {
          initialAttendance[student.id] = false; // Default value (not present)
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
      setStudents(dummyData); // Set the dummy data for testing purposes
    };

    loadAttendance();
  }, [centerId]);

  // Handle individual attendance change
  const handleAttendanceChange = (studentId) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: !prevAttendance[studentId],
    }));
  };

  // Handle 'Select All' checkbox change
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    const updatedAttendance = {};
    students.forEach((student) => {
      updatedAttendance[student.id] = !selectAll;
    });
    setAttendance(updatedAttendance);
  };

  const handleSubmit = async () => {
    try {
      for (const studentId in attendance) {
        const student = students.find((s) => s.id === parseInt(studentId));
        const attendanceData = {
          name: student.name,
          rollNumber: student.rollNumber,
          attendance: attendance[studentId] ? "yes" : "no",
        };
        console.log(attendanceData.rollNumber, centerId, attendanceData);

        try {
          await updateAttendance(
            attendanceData.rollNumber,
            centerId,
            attendanceData
          ); // Call the API to update attendance
        } catch (error) {
          console.error(
            `Error updating attendance for roll number ${attendanceData.rollNumber}:`,
            error
          );
        }
      }
      console.log("Attendance Submitted:", attendance);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4 text-center">Take Attendance</h2>
      <div className="text-center mb-4">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
        <label className="ms-2">Mark All as Present</label>
      </div>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Student Name</th>
            <th>Roll Number</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>
                <input
                  type="checkbox"
                  checked={attendance[student.id] || false}
                  onChange={() => handleAttendanceChange(student.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
