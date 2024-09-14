import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the token exists in local storage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleHomePage = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");
    // Update the state
    setIsLoggedIn(false);
    // Redirect to login page
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div>
      <header>
        <nav
          className="navbar navbar-expand-md navbar-dark bg-dark fixed-top"
          style={{ paddingLeft: "5px", paddingRight: "5px" }}
        >
          <div>
            <a className="navbar-brand">Attendance Management Application</a>
          </div>
          <div className="ms-auto d-flex">
            <button className="btn btn-primary me-2" onClick={handleHomePage}>
              Home Page
            </button>
            {!isLoggedIn ? (
              <>
                <button className="btn btn-primary me-2" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn btn-secondary" onClick={handleSignUp}>
                  Sign Up
                </button>
              </>
            ) : (
              <button className="btn btn-primary me-2" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;
