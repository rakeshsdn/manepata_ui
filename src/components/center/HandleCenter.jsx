import { useNavigate, useParams } from "react-router-dom";
import "./../homepage/HomePage.css"; // Import the CSS file for styling

const HandleCenter = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNavigate = (path) => {
    navigate(`${path}/${id}`);
  };

  return (
    <div className="homepage-wrapper">
      <div className="homepage-card-container">
        <div
          className="homepage-card"
          onClick={() => handleNavigate("/list-student")}
        >
          <i className="fas fa-user-graduate homepage-card-icon"></i>
          <h3 className="homepage-card-title">Students</h3>
          <p className="homepage-card-description">Manage student details.</p>
        </div>
        <div
          className="homepage-card"
          onClick={() => handleNavigate("/list-attendance")}
        >
          <i className="fas fa-calendar-check homepage-card-icon"></i>
          <h3 className="homepage-card-title">Attendance</h3>
          <p className="homepage-card-description">Track student attendance.</p>
        </div>
      </div>
    </div>
  );
};

export default HandleCenter;
