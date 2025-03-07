import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Search from "../Acceuil/Search";  // Make sure you have the correct import path

const SearchWithExport = ({
  onSearch,
  exportToExcel,
  exportToPDF,
  printTable,
  Title,
}) => {

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      {/* Search and Export Section */}
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginTop: "15px" }}
      >
        <h3 className="titreColore">{Title}</h3>
        <div className="d-flex">
          <div style={{ width: "500px", marginRight: "20px" }}>
            <Search onSearch={onSearch} type="search" />
          </div>
          <div>
            <FontAwesomeIcon
              style={{
                cursor: "pointer",
                color: "grey",
                fontSize: "2rem",
              }}
              onClick={printTable}
              icon={faPrint}
              className="me-2"
            />
            <FontAwesomeIcon
              style={{
                cursor: "pointer",
                color: "red",
                fontSize: "2rem",
                marginLeft: "15px",
              }}
              onClick={exportToPDF}
              icon={faFilePdf}
            />
            <FontAwesomeIcon
              icon={faFileExcel}
              onClick={exportToExcel}
              style={{
                cursor: "pointer",
                color: "green",
                fontSize: "2rem",
                marginLeft: "15px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWithExport;