import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Import the CSS file for styling

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage-wrapper">
      <div className="homepage-card-container">
        <div
          className="homepage-card"
          onClick={() => handleNavigate("/list-center")}
        >
          <i className="fas fa-building homepage-card-icon"></i>
          <h3 className="homepage-card-title">Centers</h3>
          <p className="homepage-card-description">Manage center details.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
