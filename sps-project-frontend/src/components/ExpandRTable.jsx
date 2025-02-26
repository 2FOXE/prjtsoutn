import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faList } from '@fortawesome/free-solid-svg-icons';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import "../style.css";

const ExpandRTable = ({
  columns,
  data,
  filteredData,
  searchTerm,
  highlightText,
  selectAll,
  selectedItems,
  handleSelectAllChange,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
  handleDeleteSelected,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  expandedRows,
  toggleRowExpansion,
  renderExpandedRow,
}) => {
  return (
    <>
      <table className="table table-bordered" style={{ marginTop: "-5px" }}>
        <thead className="text-center table-secondary" style={{ 
          position: 'sticky', 
          top: -1, 
          backgroundColor: '#00afaa', 
          zIndex: 1, 
          padding: '10px'
        }}>
          <tr className="tableHead">
            <th className="tableHead" style={{          backgroundColor: '#00afaa', 
}}>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
            </th>
            {columns.map((column) => (
              <th key={column.key} className="tableHead ">{column.label}</th>
            ))}
            <th className="tableHead">Action</th>
          </tr>
        </thead>
        <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
          {filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item) => (
            <React.Fragment key={item.id}>
              <tr>
                <td style={{ backgroundColor: "white" }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} style={{ backgroundColor: "white" }}>
                    {column.render ? column.render(item, searchTerm, toggleRowExpansion) : 
                    highlightText(item[column.key], searchTerm) || ''}
                  </td>
                ))}
                <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
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
              {expandedRows[item.id] && (
                <tr>
                  <td colSpan={columns.length + 2} style={{ padding: "0" }}>
                    {renderExpandedRow(item)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Button
        className="btn btn-danger btn-sm"
        onClick={handleDeleteSelected}
        disabled={selectedItems?.length === 0}
        style={{ borderRadius: "10px", fontWeight: "bold", fontSize: "17px", color: "white" }}
      >
        <FontAwesomeIcon icon={faTrash} style={{ marginRight: "0.5rem" }} />
        Supprimer selection
      </Button>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
        component="div"
        count={filteredData?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ExpandRTable;