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
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      {/* Single Row with Filters (Left) & Icon + Add Button (Right) */}
      <Row className="align-items-center justify-content-between">
        {/* Left side: Filters (shown/hidden by showFilters) */}
        <Col>
          {showFilters && (
            <Row className="g-3 align-items-center">
              {filters.map((filter, index) => (
                <Col key={index} md="auto">
                  <Form.Group>
                    <Form.Label>{filter.label}</Form.Label>
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
                          height: "38px",
                          borderRadius: "4px",
                          minWidth: "130px",
                        }}
                      />
                    ) : (
                      <Form.Select
                        onChange={(e) =>
                          onFilterChange(filter.key, e.target.value)
                        }
                        style={{
                          height: "38px",
                          borderRadius: "4px",
                          minWidth: "130px",
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
                  </Form.Group>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Right side: Icon & "Add" button */}
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
    </div>
  );
};

export default DynamicFilter;
