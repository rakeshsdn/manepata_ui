import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { deleteUser } from "../../services/UserService";
// Import service functions if needed
// import { listUsers, deleteUser } from "../../services/UserService";

const ListUsers = () => {
  const dummyData = [
    {
      id: 1,
      username: "john_doe",
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      DOB: "1990-05-15",
      gender: "Male",
      phoneNumber: "+919876543210",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      address: "123, Main Street, Mumbai",
      postalCode: "400001",
      secondaryPhoneNumber: "+919876543211",
      isActive: true,
      enabled: true,
    },
    {
      id: 2,
      username: "jane_smith",
      firstname: "Jane",
      lastname: "Smith",
      email: "jane.smith@example.com",
      password: "password456",
      DOB: "1985-08-22",
      gender: "Female",
      phoneNumber: "+919832165432",
      country: "India",
      state: "Karnataka",
      city: "Bangalore",
      address: "456, Elm Street, Bangalore",
      postalCode: "560001",
      secondaryPhoneNumber: "+919832165433",
      isActive: true,
      enabled: true,
    },
  ];

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from the API on component mount
    // listUsers()
    //   .then((response) => {
    //     setUsers(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the users!", error);
    //   });
    setUsers(dummyData);
  }, []);

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const handleUpdateUser = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      //Uncomment when implementing delete functionality
      deleteUser(id)
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the user!", error);
        });
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isPreviousDisabled = currentPage === 1 || users.length === 0;
  const isNextDisabled = currentPage === totalPages || users.length === 0;

  const handleRowsPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  return (
    <div className="container">
      <h2 className="text-center">List of Users</h2>
      <div className="mb-2">
        <button className="btn btn-primary" onClick={handleAddUser}>
          <i className="fas fa-plus me-2"></i>
          Add User
        </button>

        <div className="dropdown-container">
          <select
            className="form-select dropdown-select"
            value={usersPerPage}
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
            <th>Id</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Is Active</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr className="text-center" key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.isActive ? "Yes" : "No"}</td>
              <td>{user.enabled ? "Yes" : "No"}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-secondary btn-sm me-2 d-flex align-items-center"
                    onClick={() => handleViewUser(user)}
                  >
                    <i className="fas fa-eye me-2"></i>
                    View
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-2 d-flex align-items-center"
                    onClick={() => handleUpdateUser(user.id)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={() => handleDeleteUser(user.id)}
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

      {/* Modal to display user details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="user-details">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>
                      <strong>ID</strong>
                    </td>
                    <td>{selectedUser.id}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Username</strong>
                    </td>
                    <td>{selectedUser.username}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>First Name</strong>
                    </td>
                    <td>{selectedUser.firstname}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Last Name</strong>
                    </td>
                    <td>{selectedUser.lastname}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email</strong>
                    </td>
                    <td>{selectedUser.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Gender</strong>
                    </td>
                    <td>{selectedUser.gender}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Date of Birth</strong>
                    </td>
                    <td>{selectedUser.DOB}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Phone Number</strong>
                    </td>
                    <td>{selectedUser.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Country</strong>
                    </td>
                    <td>{selectedUser.country}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>State</strong>
                    </td>
                    <td>{selectedUser.state}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>City</strong>
                    </td>
                    <td>{selectedUser.city}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Address</strong>
                    </td>
                    <td>{selectedUser.address}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Postal Code</strong>
                    </td>
                    <td>{selectedUser.postalCode}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Secondary Phone Number</strong>
                    </td>
                    <td>{selectedUser.secondaryPhoneNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Is Active</strong>
                    </td>
                    <td>{selectedUser.isActive ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Enabled</strong>
                    </td>
                    <td>{selectedUser.enabled ? "Yes" : "No"}</td>
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

export default ListUsers;
