import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types"; // Import PropTypes
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define grade mapping
const gradeToNumber = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

const KPIComponent = ({ students }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Prepare data for the bar chart
    const gradeCounts = students.reduce((acc, student) => {
      const gradeValue = gradeToNumber[student.grade];
      if (gradeValue !== undefined) {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
      }
      return acc;
    }, {});

    const labels = Object.keys(gradeCounts);
    const data = labels.map((label) => gradeCounts[label]);

    setChartData({
      labels,
      datasets: [
        {
          label: "Grade Counts",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [students]);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Grade Distribution</h2>
      <div className="mt-4 d-flex justify-content-center">
        <div style={{ width: "400px", height: "300px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      let label = context.dataset.label || "";
                      if (label) {
                        label += ": ";
                      }
                      label += context.raw;
                      return label;
                    },
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Grade",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Count",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for validation
KPIComponent.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      grade: PropTypes.string.isRequired, // Grades are expected to be strings
    })
  ).isRequired,
};

export default KPIComponent;
