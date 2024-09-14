import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCenter,
  listCentersById,
  updateCenter,
} from "../../services/CenterService";
import Form from "../forms/Form";

const AddCenterComponent = () => {
  const [initialValues, setInitialValues] = useState({
    centerName: "",
    centerAddress: "",
    createdDateTime: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCenterById(id);
    }
  }, [id]);

  const fetchCenterById = async (id) => {
    try {
      const response = await listCentersById(id);
      const centerData = response.data;
      // Make sure to map the data to match the initialValues structure
      setInitialValues({
        centerName: centerData.name || "",
        centerAddress: centerData.address || "",
        createdDateTime: centerData.createdDateTime || "",
      });
      setIsEditMode(true);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };

  const handleSubmit = async (formValues) => {
    try {
      const centerData = {
        name: formValues.centerName,
        address: formValues.centerAddress,
        createdDateTime: new Date().toISOString(),
      };

      if (isEditMode) {
        console.log(centerData);
        await updateCenter(id, centerData);
      } else {
        await createCenter(centerData);
      }

      // Redirect to the center list page after submission
      navigate("/list-center");
    } catch (error) {
      console.error("Error saving center data:", error);
    }
  };

  const handleCancel = () => {
    navigate("/list-center"); // Navigate to the center list page on cancel
  };

  const fields = [
    {
      name: "centerName",
      label: "Center Name",
      type: "text",
      placeholder: "Enter center name",
      required: true,
    },
    {
      name: "centerAddress",
      label: "Center Address",
      type: "text",
      placeholder: "Enter center address",
      required: true,
    },
  ];

  return (
    <Form
      title={isEditMode ? "Edit Center" : "Add Center"}
      fields={fields}
      initialValues={initialValues} // Pass object to Form
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText={isEditMode ? "Update Center" : "Add Center"}
      cancelButtonText="Cancel"
    />
  );
};

export default AddCenterComponent;
