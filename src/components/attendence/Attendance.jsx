import { useState, useEffect } from "react";
import { updateAttendance } from "../../services/AttendanceService"; // Import AttendanceService functions
import { useParams } from "react-router-dom";
import { fetchAttendanceList } from "../../services/AttendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const { id: centerId } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const [attendanceTaken, setAttendanceTaken] = useState(false); // New state to track attendance taken

  // Fetch student list and initialize attendance on component load
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetchAttendanceList(centerId);
        setStudents(response.data);

        // Check if the first student's attendance is already taken
        if (response.data.length > 0 && response.data[0].status === "yes") {
          alert("Attendance taken for today!"); // Show popup
          setAttendanceTaken(true); // Set the state to disable the submit button
        }

        // Initialize attendance with default values (Absent)
        const initialAttendance = {};
        response.data.forEach((student) => {
          initialAttendance[student.studentId] = student.status === "yes"; // Default value based on API response
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
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
      updatedAttendance[student.studentId] = !selectAll;
    });
    setAttendance(updatedAttendance);
  };

  const handleSubmit = async () => {
    try {
      for (const studentId in attendance) {
        const newAttendenceData = {
          studentId: studentId,
          centerId: centerId,
          status: attendance[studentId] ? "yes" : "no",
        };

        try {
          console.log(newAttendenceData);
          await updateAttendance(studentId, centerId, newAttendenceData); // Call the API to update attendance
        } catch (error) {
          console.error(
            `Error updating attendance for student ID ${studentId}:`,
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
          disabled={attendanceTaken} // Disable if attendance is already taken
        />
        <label className="ms-2">Mark All as Present</label>
      </div>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentId}</td>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>
                <input
                  type="checkbox"
                  checked={attendance[student.studentId] || false}
                  onChange={() => handleAttendanceChange(student.studentId)}
                  disabled={attendanceTaken} // Disable if attendance is already taken
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={attendanceTaken} // Disable the button if attendance is already taken
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;