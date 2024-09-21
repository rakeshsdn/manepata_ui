import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import "./ListStudentComponent.css"; // Import CSS for styling
import {
  listStudents,
  deleteStudent,
  bulkCreateStudents,
} from "../../services/StudentService"; // Import the service functions
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Modal, Button } from "react-bootstrap";

const ListStudentComponent = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id: centerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch students data when the component mounts
    listStudents(centerId)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the students!", error);
      });
  }, []);

  const handleAddStudent = () => {
    navigate(`/add-student/${centerId}`);
  };

  const handleUpdateStudent = (id) => {
    navigate(`/edit-student/${id}/${centerId}`);
  };

  const handleDeleteStudent = (id) => {
    // Show a confirmation dialog to the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      deleteStudent(id, centerId)
        .then(() => {
          setStudents(students.filter((student) => student.id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the student!", error);
        });
    }
  };

  const handleUploadExcel = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Map Excel data to new student fields
      const mappedStudents = jsonData.map((row, index) => ({
        id: index + 1, // You may adjust this if your ID needs to come from Excel
        firstName: row["First Name"],
        lastName: row["Last Name"],
        age: row["Age"], // Added the new fields
        dateOfBirth: row["Date of Birth"],
        motherName: row["Mother Name"],
        fatherName: row["Father Name"],
        motherOccupation: row["Mother Occupation"],
        fatherOccupation: row["Father Occupation"],
        grade: row["Grade"],
        gender: row["Gender"], // Added the new fields
        details: row["Details"], // Added the new fields
      }));

      setIsLoading(true);

      try {
        await bulkCreateStudents(mappedStudents, centerId); // Make sure `centerId` is passed correctly
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/list-student/${centerId}`); // Reload the page or navigate to the updated list
        }, 2000); // Display loading for 2 seconds
      } catch (error) {
        console.error("Error uploading students:", error);
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleExportStudents = () => {
    const doc = new jsPDF();

    // Add Center ID to the PDF
    doc.text(`Center ID: ${centerId}`, 14, 16);
    doc.text("Students List", 14, 24);

    // Prepare the data for the table
    const tableData = students.map((student) => [
      student.id,
      student.firstName,
      student.lastName,
      student.age, // Updated field
      student.dateOfBirth,
      student.motherName, // Updated field
      student.fatherName, // Updated field
      student.motherOccupation, // Updated field
      student.fatherOccupation, // Updated field
      student.grade,
      student.gender, // Updated field
      student.details, // Updated field
    ]);

    // Define the table columns
    const tableColumn = [
      "Student ID",
      "First Name",
      "Last Name",
      "Age", // Updated column
      "Date of Birth",
      "Mother Name", // Updated column
      "Father Name", // Updated column
      "Mother Occupation", // Updated column
      "Father Occupation", // Updated column
      "Grade",
      "Gender", // Updated column
      "Details", // Updated column
    ];

    // Create the table in the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableData,
      startY: 30, // Adjusted to avoid overlap with title
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: "linebreak",
        halign: "center",
      },
      headStyles: {
        fillColor: [22, 160, 133], // Customize header color
        textColor: [255, 255, 255], // Customize header text color
      },
    });

    // Save the PDF
    doc.save("students.pdf");
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isPreviousDisabled = currentPage === 1 || students.length === 0;
  const isNextDisabled = currentPage === totalPages || students.length === 0;

  const handleRowsPerPageChange = (e) => {
    setStudentsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="container">
      <h2 className="text-center">List Of Students</h2>
      <div className="mb-2">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleAddStudent}
          style={{ marginRight: "10px" }}
        >
          <i className="fas fa-plus me-2"></i>
          Add Student
        </button>

        <label className="btn btn-secondary d-flex align-items-center me-2">
          <i className="fas fa-upload me-2"></i>
          Upload Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleUploadExcel}
            style={{ display: "none" }}
          />
        </label>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleExportStudents}
          style={{ marginRight: "10px" }}
        >
          Export Students
        </button>
        <div className="dropdown-container">
          <select
            className="form-select dropdown-select"
            value={studentsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value="5">5 rows per page</option>
            <option value="10">10 rows per page</option>
            <option value="15">15 rows per page</option>
            <option value="20">20 rows per page</option>
          </select>
        </div>
      </div>
      <table className="table table-bordered table-striped">
        <thead className="text-center">
          <tr>
            <th>Student Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Birth</th>
            <th>Mother&apos;s Name</th>
            <th>Father&apos;s Name</th>
            <th>Mother&apos;s Occupation</th>
            <th>Father&apos;s Occupation</th>
            <th>Grade</th>
            <th>Gender</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr className="text-center" key={student.id}>
              <td>{student.id}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.age}</td>
              <td>{student.dateOfBirth}</td>
              <td>{student.motherName}</td>
              <td>{student.fatherName}</td>
              <td>{student.motherOccupation}</td>
              <td>{student.fatherOccupation}</td>
              <td>{student.grade}</td>
              <td>{student.gender}</td>
              <td>{student.details}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-secondary btn-sm me-2 d-flex align-items-center"
                    onClick={() => handleViewStudent(student)}
                  >
                    <i className="fas fa-eye me-2"></i>
                    View
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-2 d-flex align-items-center"
                    onClick={() => handleUpdateStudent(student.id)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Update
                  </button>

                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Modal to display student details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div className="student-details">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>
                      <strong>ID:</strong>
                    </td>
                    <td>{selectedStudent.id}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>First Name:</strong>
                    </td>
                    <td>{selectedStudent.firstName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Last Name:</strong>
                    </td>
                    <td>{selectedStudent.lastName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Age:</strong>
                    </td>
                    <td>{selectedStudent.age}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Date of Birth:</strong>
                    </td>
                    <td>{selectedStudent.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Mother&apos;s Name:</strong>
                    </td>
                    <td>{selectedStudent.motherName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Father&apos;s Name:</strong>
                    </td>
                    <td>{selectedStudent.fatherName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Mother&apos;s Occupation:</strong>
                    </td>
                    <td>{selectedStudent.motherOccupation}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Father&apos;s Occupation:</strong>
                    </td>
                    <td>{selectedStudent.fatherOccupation}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Grade:</strong>
                    </td>
                    <td>{selectedStudent.grade}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Gender:</strong>
                    </td>
                    <td>{selectedStudent.gender}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Details:</strong>
                    </td>
                    <td>{selectedStudent.details}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="pagination">
        <button
          className={`pagination-btn ${isPreviousDisabled ? "disabled" : ""}`}
          onClick={() =>
            !isPreviousDisabled && handlePageChange(currentPage - 1)
          }
        >
          &lt; Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-btn ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`pagination-btn ${isNextDisabled ? "disabled" : ""}`}
          onClick={() => !isNextDisabled && handlePageChange(currentPage + 1)}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default ListStudentComponent;
