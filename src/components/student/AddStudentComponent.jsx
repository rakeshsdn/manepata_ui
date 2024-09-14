// AddStudentComponent.js
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createStudent,
  getStudent,
  updateStudent,
} from "../../services/StudentService";
import Form from "../forms/Form";

const AddStudentComponent = () => {
  const [initialValues, setInitialValues] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id, id: centerId } = useParams();

  useEffect(() => {
    if (id) {
      fetchStudentById(id, centerId);
    } else {
      setInitialValues({
        firstName: "",
        lastName: "",
        age: "",
        dateOfBirth: "",
        motherName: "",
        fatherName: "",
        motherOccupation: "",
        fatherOccupation: "",
        grade: "",
        gender: "",
        details: "",
      });
    }
  }, [id]);

  const fetchStudentById = async (id, centerId) => {
    try {
      const response = await getStudent(id, centerId);
      const studentData = response.data;
      setInitialValues(studentData);
      setIsEditMode(true);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleSubmit = async (formValues) => {
    try {
      if (isEditMode) {
        await updateStudent(id, formValues, centerId);
      } else {
        await createStudent(formValues, centerId);
      }
      navigate(`/list-student/${centerId}`);
    } catch (error) {
      console.error("Error saving student data:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/list-student/${centerId}`);
  };

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      required: true,
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter age",
      required: true,
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      placeholder: "Enter date of birth",
      required: true,
    },
    {
      name: "motherName",
      label: "Mother's Name",
      type: "text",
      placeholder: "Enter mother's name",
      required: true,
    },
    {
      name: "fatherName",
      label: "Father's Name",
      type: "text",
      placeholder: "Enter father's name",
      required: true,
    },
    {
      name: "motherOccupation",
      label: "Mother's Occupation",
      type: "text",
      placeholder: "Enter mother's occupation",
      required: false,
    },
    {
      name: "fatherOccupation",
      label: "Father's Occupation",
      type: "text",
      placeholder: "Enter father's occupation",
      required: false,
    },
    {
      name: "grade",
      label: "Grade/Class",
      type: "text",
      placeholder: "Enter grade/class",
      required: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["Male", "Female", "Other"], // Dropdown options
      placeholder: "Select gender",
      required: true,
    },
    {
      name: "details",
      label: "Additional Details",
      type: "textarea",
      placeholder: "Enter additional details",
      required: false,
    },
  ];

  return (
    <Form
      title={isEditMode ? "Edit Student" : "Add Student"}
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText={isEditMode ? "Update Student" : "Add Student"}
      cancelButtonText="Cancel"
    />
  );
};

export default AddStudentComponent;
