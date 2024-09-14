import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types"; // Import PropTypes
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const gradeToNumber = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

const KPIPieChart = ({ students }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Prepare data for the pie chart
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
          label: "Grade Distribution",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [students]);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Grade Distribution</h2>
      <div className="mt-4 d-flex justify-content-center">
        <div style={{ width: "300px", height: "300px" }}>
          <Pie
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
                      let label = context.label || "";
                      if (label) {
                        label += ": ";
                      }
                      label += context.raw;
                      return label;
                    },
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
KPIPieChart.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      grade: PropTypes.string.isRequired, // Grades are expected to be strings
    })
  ).isRequired,
};

export default KPIPieChart;
