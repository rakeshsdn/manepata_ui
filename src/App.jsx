import HeaderComponent from "./components/header/HeaderComponent";
import "./App.css";
import ListStudentComponent from "./components/student/ListStudentComponent";
import AddStudentComponent from "./components/student/AddStudentComponent";
import { Route, Routes, BrowserRouter, Navigate, HashRouter} from "react-router-dom";
import AddCenterComponent from "./components/center/AddCenterComponent";
import LoginComponent from "./components/login/LoginComponent";
import FooterComponent from "./components/footer/FooterComponent";
import ListCenterComponent from "./components/center/ListCenterComponent";
import HomePage from "./components/homepage/HomePage";
import HandleCenter from "./components/center/HandleCenter";
import Attendance from "./components/attendence/Attendance";
import PropTypes from "prop-types";
import AddUser from "./components/user/AddUser";
import ListUsers from "./components/user/ListUsers";
import UserContext, { UserProvider } from "./components/state/UserContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

// PrivateRoute Component to protect routes
const PrivateRoute = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(false); // null to represent loading state
  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const validateToken = async () => {
      try {
        //Make the API call to validate the token
        const response = await axios.post(
          "http://localhost:8080/api/login/validateToken",
          { token }
        );

        // Set token validity based on the response
        if (response.status === 200 && response.data.isValid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
        setIsValidToken(true);
      } catch (error) {
        console.error("Token validation failed", error);
        setIsValidToken(false);
      }
    };

    if (token) {
      validateToken(); // Only validate if the token exists
    } else {
      setIsValidToken(false); // If no token is found, set as invalid
    }
  }, [token]);

  // If the token is valid and user is logged in, render the children
  return user.isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <UserProvider>
      <div id="root">
        <div className="content">
          <div>
            <HashRouter>
              <HeaderComponent />
              <div className="container">
                <Routes>
                  <Route path="/login" element={<LoginComponent />} />

                  {/* Protected Routes */}
                  <Route
                    path="/list-student/:id"
                    element={
                      <PrivateRoute>
                        <ListStudentComponent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-student/:id"
                    element={
                      <PrivateRoute>
                        <AddStudentComponent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-student/:id/:id"
                    element={
                      <PrivateRoute>
                        <AddStudentComponent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-center/:id"
                    element={
                      <PrivateRoute>
                        <AddCenterComponent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-center"
                    element={
                      <PrivateRoute>
                        <AddCenterComponent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/list-center"
                    element={
                      <PrivateRoute>
                        <ListCenterComponent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/view-center/:id"
                    element={
                      <PrivateRoute>
                        <HandleCenter />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/list-attendance/:id"
                    element={
                      <PrivateRoute>
                        <Attendance />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <PrivateRoute>
                        <ListUsers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-user"
                    element={
                      <PrivateRoute>
                        <AddUser />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-user/:id"
                    element={
                      <PrivateRoute>
                        <AddUser />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </div>
            </HashRouter>
          </div>
        </div>
        <FooterComponent />
      </div>
    </UserProvider>
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children are passed and are React nodes
};

export default App;
