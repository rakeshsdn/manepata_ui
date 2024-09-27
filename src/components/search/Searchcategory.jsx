import { useState } from "react";
import PropTypes from "prop-types"; // For type checking (optional but recommended)

// Reusable Component
const SearchCategory = ({ categories, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Inline styles to remove focus outline and shadow
  const noFocusStyle = {
    outline: "none",
    boxShadow: "none",
    maxWidth: 250,
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, selectedCategory);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="input-group">
        {/* Category Dropdown */}
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ ...noFocusStyle, maxWidth: "100px", marginRight: "1px" }} // Remove focus outline
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{ ...noFocusStyle, minWidth: "300px", maxWidth: "500px" }} // Remove focus outline
        />

        {/* Search Button */}
        <button type="submit" className="btn btn-primary" style={noFocusStyle}>
          <i className="fa fa-search"></i> {/* Bootstrap search icon */}
        </button>
      </div>
    </form>
  );
};

// PropTypes for the component to ensure reusability
SearchCategory.propTypes = {
  categories: PropTypes.array.isRequired, // An array of categories (strings)
  onSearch: PropTypes.func.isRequired, // Function to handle search logic
};

export default SearchCategory;
