import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginComponent.css";
import UserContext from "../state/UserContext";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (token && tokenExpiration) {
      const now = new Date().getTime();
      if (now > tokenExpiration) {
        // Token expired, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
      } else {
        // Token is valid, redirect to home page
        navigate("/");
      }
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = "Username is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8080/api/login", {
          username,
          password,
        });

        if (response.ok) {
          setUser(response.data);
        }

        const { token, expiresIn } = response.data;

        // Set token and expiration time
        const expirationTime = new Date().getTime() + expiresIn * 1000; // expiresIn should be in seconds

        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expirationTime.toString());

        navigate("/");
      } catch (error) {
        console.error("Error logging in:", error);
        setErrors({ form: "Login failed. Please check your credentials." });
      }
    }
  };

  const handleCancel = () => {
    navigate("/"); // Redirect to home or previous page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          {errors.form && (
            <div className="alert alert-danger">{errors.form}</div>
          )}
          <div className="text-center">
            <button type="submit" className="btn btn-primary login-btn me-2">
              Login
            </button>
            <button
              type="button"
              className="btn btn-secondary cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
