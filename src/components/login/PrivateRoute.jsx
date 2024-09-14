import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token is not found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is available, render the child components (the protected route)
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children are passed and are React nodes
};

export default PrivateRoute;
