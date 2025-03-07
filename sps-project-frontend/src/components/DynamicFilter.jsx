import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

const DynamicFilter = ({
  filters,
  onFilterChange,
  onDateFilterChange,
  onAddClick,
  addButtonLabel = "Add Product",
  selectedDate,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div
      className="filter-container"
      style={{
        backgroundColor: "#fff",
        padding: "10px",
        marginTop: '10px',
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <Row className="align-items-center justify-content-between">
        <Col>
          {showFilters && (
            <Row className="g-3 align-items-center">
              {filters.map((filter, index) => (
                <Col key={index} md="auto">
                  <div className="d-flex align-items-center">
                    <Form.Label 
                      style={{
                        marginRight: "10px", 
                        marginBottom: "0",
                        minWidth: "80px",
                        fontWeight: "500",
                        color: "#444",
                      }}
                    >
                      {filter.label}
                    </Form.Label>
                    {filter.key === "date" ? (
                      <Form.Control
                        type="date"
                        value={
                          selectedDate
                            ? selectedDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => onDateFilterChange(e.target.value)}
                        style={{
                          height: "40px",
                          borderRadius: "8px",
                          minWidth: "140px",
                          border: "1px solid #eaeaea",
                          background: "#f9f9f9",
                          boxShadow: "none",
                          padding: "0 12px",
                          transition: "all 0.2s ease",
                          fontSize: "14px",
                        }}
                      />
                    ) : (
                      <Form.Select
                        onChange={(e) =>
                          onFilterChange(filter.key, e.target.value)
                        }
                        style={{
                          height: "40px",
                          borderRadius: "8px",
                          minWidth: "140px",
                          border: "1px solid #eaeaea",
                          background: "#f9f9f9",
                          boxShadow: "none",
                          padding: "0 12px",
                          appearance: "none",
                          transition: "all 0.2s ease",
                          fontSize: "14px",
                        }}
                      >
                        <option value="">Select {filter.label}</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        <Col xs="auto" className="d-flex align-items-center">
          <FontAwesomeIcon
            icon={showFilters ? faTimes : faFilter}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: "#007bff",
              marginRight: "15px",
            }}
            onClick={() => setShowFilters(!showFilters)}
          />

          <button
            onClick={onAddClick}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              background: "linear-gradient(90deg, #329982 0%, #2a7d6c 100%)",
              color: "white",
              borderRadius: "10px",
              fontWeight: "bold",
              padding: "6px 15px",
              border: "none",
              height: "40px",
              boxShadow: "0 4px 10px rgba(50,153,130,0.3)",
              transition: "all 0.3s ease"
            }}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
            {addButtonLabel}
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default DynamicFilter;