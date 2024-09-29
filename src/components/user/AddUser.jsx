import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createUser,
  fetchUserById,
  updateUser,
} from "../../services/UserService";
import Form from "../forms/Form";

const AddUser = () => {
  const [initialValues, setInitialValues] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    DOB: "",
    gender: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    secondaryPhoneNumber: "",
    isActive: true,
    enabled: true,
    isAdmin: false, // New field
    centerId: "", // New field
    role: "teacher", // New field with default value
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getUserById(id);
    }
  }, [id]);

  const getUserById = async (id) => {
    try {
      const response = await fetchUserById(id);
      const userData = response.data;
      setInitialValues({
        username: userData.username || "",
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        password: userData.password || "",
        DOB: userData.DOB || "",
        gender: userData.gender || "",
        phoneNumber: userData.phoneNumber || "",
        country: userData.country || "",
        state: userData.state || "",
        city: userData.city || "",
        address: userData.address || "",
        postalCode: userData.postalCode || "",
        secondaryPhoneNumber: userData.secondaryPhoneNumber || "",
        isActive: userData.isActive ?? true,
        enabled: userData.enabled ?? true,
        isAdmin: userData.isAdmin ?? false,
        centerId: userData.centerId || "", // Set centerId
        role: userData.role || "teacher", // Set role
      });
      setIsEditMode(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (formValues) => {
    try {
      const userData = {
        id: isEditMode ? id : null,  // Include id when editing
        username: formValues.username,
        password: formValues.password,
        email: formValues.email,
        firstName: formValues.firstname, // Match the backend field names
        lastName: formValues.lastname,     // Match the backend field names
        dateOfBirth: formValues.DOB,       // Match the backend field names
        centerId: formValues.isAdmin ? null : formValues.centerId, // Conditional handling
        gender: formValues.gender,
        country: formValues.country,
        state: formValues.state,
        city: formValues.city,
        address: formValues.address,
        postalCode: formValues.postalCode,
        phoneNumber: formValues.phoneNumber,
        secondaryPhoneNumber: formValues.secondaryPhoneNumber,
        isActive: formValues.isActive ?? null,  // Use null if the value is falsy
        enabled: formValues.enabled,
        isAdmin: formValues.isAdmin,
        role: formValues.role,
      };

      if (isEditMode) {
        await updateUser(id, userData);
      } else {
        await createUser(userData);
      }

      navigate("/users");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };


  const handleCancel = () => {
    navigate("/users");
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter username",
      required: true,
    },
    {
      name: "firstname",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      required: true,
    },
    {
      name: "lastname",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
    },
    {
      name: "DOB",
      label: "Date of Birth",
      type: "date",
      required: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
      ],
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
      required: true,
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      placeholder: "Enter country",
      required: true,
    },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Enter state",
      required: true,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter city",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter address",
      required: true,
    },
    {
      name: "postalCode",
      label: "Postal Code",
      type: "text",
      placeholder: "Enter postal code",
      required: true,
    },
    {
      name: "secondaryPhoneNumber",
      label: "Secondary Phone Number",
      type: "text",
      placeholder: "Enter secondary phone number",
    },
    {
      name: "isActive",
      label: "Is Active",
      type: "select",
      options: [
        { label: "True", value: true },
        { label: "False", value: false },
      ],
      required: true,
    },
    {
      name: "enabled",
      label: "Enabled",
      type: "select",
      options: [
        { label: "True", value: true },
        { label: "False", value: false },
      ],
      required: true,
    },
    {
      name: "isAdmin",
      label: "Is Admin",
      type: "select",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      required: true,
    },
    {
      name: "centerId",
      label: "Center ID",
      type: "number",
      placeholder: "Enter center ID (optional)",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [{ label: "Teacher", value: "teacher" }],
      required: true,
    },
  ];

  return (
    <Form
      title={isEditMode ? "Edit User" : "Add User"}
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText={isEditMode ? "Update User" : "Add User"}
      cancelButtonText="Cancel"
    />
  );
};

export default AddUser;