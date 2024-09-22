import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Form.css";

const Form = ({
  title,
  fields,
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText,
  cancelButtonText,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (
        field.validation &&
        !field.validation.regex.test(formValues[field.name])
      ) {
        newErrors[field.name] = field.validation.message;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  return (
    <div className="add-student-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="card col-md-8 shadow-lg">
            <h2 className="text-center mt-4 mb-4">{title}</h2>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                  <div className="row mb-3" key={field.name}>
                    <div className={field.colClass || "col-md-12"}>
                      <label className="form-label">{field.label}:</label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          className={`form-control ${
                            errors[field.name] ? "is-invalid" : ""
                          }`}
                          value={formValues[field.name] || ""}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            --Select {field.label}--
                          </option>
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          name={field.name}
                          className={`form-control ${
                            errors[field.name] ? "is-invalid" : ""
                          }`}
                          value={formValues[field.name] || ""}
                          onChange={handleChange}
                        />
                      )}
                      {errors[field.name] && (
                        <div className="invalid-feedback">
                          {errors[field.name]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    {submitButtonText}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={onCancel}
                  >
                    {cancelButtonText}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Form.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      validation: PropTypes.shape({
        regex: PropTypes.instanceOf(RegExp),
        message: PropTypes.string,
      }),
      colClass: PropTypes.string,
    })
  ).isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string.isRequired,
};

export default Form;
