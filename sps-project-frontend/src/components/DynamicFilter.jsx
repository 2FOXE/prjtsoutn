import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

const DynamicFilter = ({
  filters, // [{ label: "Choose Category", key: "category", options: [{ value, label }, ...] }]
  onFilterChange, // function to handle dropdown changes
  onAddClick, // callback for the "Add" button (optional)
  addButtonLabel = "Add Product", // label for the add button
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div
      className="filter-container"
      style={{
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <Row className="align-items-center justify-content-end">
        {/* Filter Icon (Left of Add Button) */}
        <Col md="auto" className="mb-2">
          <FontAwesomeIcon
            icon={showFilters ? faTimes : faFilter}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: "#007bff",
              marginRight: "10px", // Ensure spacing before button
            }}
            onClick={() => setShowFilters(!showFilters)}
          />
        </Col>

        {/* Add Button (Right of Filter Icon) */}
        <Col md="auto" className="mb-2">
          <button
            onClick={onAddClick}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#329982",
              color: "white",
              borderRadius: "10px",
              fontWeight: "bold",
              padding: "6px 15px",
              border: "none",
              height: "40px",
            }}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
            {addButtonLabel}
          </button>
        </Col>
      </Row>

      {/* Filter Dropdowns (show/hide) */}
      {showFilters && (
        <Row
          className="mt-3"
          style={{
            display: "flex",
            flexDirection: "row-reverse", // Reverse the order of dropdowns
            justifyContent: "flex-start", // Align dropdowns to the right
            gap: "10px", // Add spacing between dropdowns
          }}
        >
          {filters.map((filter, index) => (
            <Col key={index} md={2} className="mb-2">
              <Form.Select
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
              >
                <option value="">Select {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DynamicFilter;