import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { listCenters, deleteCenter } from "../../services/CenterService"; // Import the service functions

const ListCenterComponent = () => {
  const duumycenters = [
    {
      id: 1,
      name: "banglore",
      address: "whitefield",
    },
  ];

  const [centers, setCenters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [centersPerPage, setCentersPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch centers from the API on component mount
    listCenters()
      .then((response) => {
        setCenters(response.data); // Set the centers state with the fetched data
      })
      .catch((error) => {
        console.error("There was an error fetching the centers!", error);
      });
    setCenters(duumycenters);
  }, []);

  const handleAddCenter = () => {
    navigate("/add-center");
  };

  const handleUpdateCenter = (id) => {
    navigate(`/edit-center/${id}`);
  };

  const handleViewCenter = (id) => {
    navigate(`/view-center/${id}`);
  };

  const handleDeleteCenter = (id) => {
    if (window.confirm("Are you sure you want to delete this center?")) {
      deleteCenter(id)
        .then(() => {
          setCenters(centers.filter((center) => center.id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the center!", error);
        });
    }
  };

  const handleUploadExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const mappedCenters = jsonData.map((row, index) => ({
        id: index + 1,
        name: row["Center Name"],
        address: row["Center Address"],
      }));

      setCenters(mappedCenters);
    };

    reader.readAsBinaryString(file);
  };

  // Pagination logic
  const indexOfLastCenter = currentPage * centersPerPage;
  const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
  const currentCenters = centers.slice(indexOfFirstCenter, indexOfLastCenter);
  const totalPages = Math.ceil(centers.length / centersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isPreviousDisabled = currentPage === 1 || centers.length === 0;
  const isNextDisabled = currentPage === totalPages || centers.length === 0;

  const handleRowsPerPageChange = (e) => {
    setCentersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  return (
    <div className="container">
      <h2 className="text-center">List Of Centers</h2>
      <div className="mb-2">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleAddCenter}
          style={{ marginRight: "10px" }}
        >
          <i className="fas fa-plus me-2"></i>
          Add Center
        </button>

        <label className="btn btn-secondary d-flex align-items-center">
          <i className="fas fa-upload me-2"></i>
          Upload Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleUploadExcel}
            style={{ display: "none" }}
          />
        </label>
        <div className="dropdown-container">
          <select
            className="form-select dropdown-select"
            value={centersPerPage}
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
            <th>Center Id</th>
            <th>Center Name</th>
            <th>Center Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCenters.map((center) => (
            <tr className="text-center" key={center.id}>
              <td>{center.id}</td>
              <td>{center.name}</td>
              <td>{center.address}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-secondary btn-sm me-2 d-flex align-items-center"
                    onClick={() => handleViewCenter(center.id)}
                  >
                    <i className="fas fa-eye me-2"></i>
                    View
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-2 d-flex align-items-center"
                    onClick={() => handleUpdateCenter(center.id)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Update
                  </button>

                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={() => handleDeleteCenter(center.id)}
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

export default ListCenterComponent;
