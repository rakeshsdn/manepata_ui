import PropTypes from "prop-types";
import { createContext, useState } from "react";

// Create UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userName: "asif",
    isLoggedIn: true,
    isAdmin: false,
  }); // This will hold the user data after login

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
