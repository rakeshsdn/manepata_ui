import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../state/UserContext";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const checkToken = () => {
      // Get the token from local storage
      const token = localStorage.getItem("token");

      // Check if the token exists and update state
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    // Call the checkToken function
    checkToken();
    // Optionally, you could add logic to clean up or recheck the token on certain intervals
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
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        isLoggedIn: false,
      };
      console.log("Updated user state:", updatedUser); // Log the updated user state here
      return updatedUser; // Return the updated state
    });
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div>
      <header>
        <nav
          className="navbar navbar-expand-md navbar-dark bg-dark fixed-top"
          style={{ paddingLeft: "5px", paddingRight: "5px" }}
        >
          <div>
            <a className="navbar-brand">KIF-MANEPATA</a>
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
