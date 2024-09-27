import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { deleteUser, fetchUserList } from "../../services/UserService";
import SearchCategory from "../search/Searchcategory";

const ListUsers = () => {
  const categories = [
    "All",
    "ID",
    "Username",
    "First Name",
    "Last Name",
    "Email",
  ];

  /*
  const dummyData = [
    //... (existing dummy data)
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
  */

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    //Fetch users from the API on component mount
    fetchUserList()
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  useEffect(() => {
    // Filter users based on search term and category
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) => {
        switch (selectedCategory) {
          case "ID":
            return user.id.toString().includes(searchTerm);
          case "Username":
            return user.username
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "First Name":
            return user.firstname
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "Last Name":
            return user.lastname
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "Email":
            return user.email.toLowerCase().includes(searchTerm.toLowerCase());
          case "All":
            return (
              user.id.toString().includes(searchTerm) || // Check ID
              user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
          default:
            return (
              user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, selectedCategory, users]);

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
      deleteUser(id)
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the user!", error);
        });
    }
  };

  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSelectedCategory(category);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isPreviousDisabled = currentPage === 1 || filteredUsers.length === 0;
  const isNextDisabled =
    currentPage === totalPages || filteredUsers.length === 0;

  const handleRowsPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h2 className="text-center">List of Users</h2>
      <div className="mb-2">
        <button className="btn btn-primary me-2" onClick={handleAddUser}>
          <i className="fas fa-plus me-2"></i>
          Add User
        </button>
        <SearchCategory
          className="me-2"
          categories={categories}
          onSearch={handleSearch}
        />
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
                  {/* Add more fields as necessary */}
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

      {/* Pagination */}
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
