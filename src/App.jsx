import HeaderComponent from "./components/header/HeaderComponent";
import "./App.css";
import ListStudentComponent from "./components/student/ListStudentComponent";
import AddStudentComponent from "./components/student/AddStudentComponent";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import AddCenterComponent from "./components/center/AddCenterComponent";
import LoginComponent from "./components/login/LoginComponent";
import FooterComponent from "./components/footer/FooterComponent";
import ListCenterComponent from "./components/center/ListCenterComponent";
import HomePage from "./components/homepage/HomePage";
import HandleCenter from "./components/center/HandleCenter";
import Attendance from "./components/attendence/Attendance";
import PropTypes from "prop-types";

// PrivateRoute Component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div id="root">
      <div className="content">
        <div>
          <BrowserRouter>
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
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children are passed and are React nodes
};

export default App;
