import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TablePagination, Button } from '@mui/material';

// Utility function to safely access nested properties
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Utility function to highlight search terms
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return String(text).split(regex).map((part, index) =>
    regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
  );
};

const ReusableTable = ({
  data,
  columns,
  selectAll,
  handleSelectAllChange,
  selectedItems,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
  handleDeleteSelected,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  searchTerm,
}) => {
  console.log(data); // Debugging: Log data to verify structure

  return (
    <div>
      <table className="table table-bordered" style={{ marginTop: "-5px" }}>
        <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1, padding: '10px' }}>
          <tr className="tableHead">
            <th className="tableHead">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </th>
            {columns.map((column, index) => (
              <th className="tableHead" key={index}>{column.label}</th>
            ))}
            <th className="tableHead">Action</th>
          </tr>
        </thead>
        <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
          {data
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            ?.map((item) => (
              <tr key={item.id}>
                <td style={{ backgroundColor: "white" }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                {columns.map((column, index) => (
                  <td style={{ backgroundColor: "white" }} key={index}>
                    {highlightText(getNestedValue(item, column.field), searchTerm)}
                  </td>
                ))}
                <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FontAwesomeIcon
                      onClick={() => handleEdit(item)}
                      icon={faEdit}
                      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
                    />
                    <FontAwesomeIcon
                      onClick={() => handleDelete(item.id)}
                      icon={faTrash}
                      style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <a href="#">
        <Button
          className="btn btn-danger btn-sm"
          onClick={handleDeleteSelected}
          disabled={selectedItems?.length === 0}
          style={{
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "17px",
            color: "white",
          }}
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: "0.5rem" }} />
          Supprimer selection
        </Button>
      </a>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
        component="div"
        count={data?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ReusableTable;