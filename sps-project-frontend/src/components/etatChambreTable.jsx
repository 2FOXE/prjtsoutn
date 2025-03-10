import React from 'react';
import { Button } from 'react-bootstrap';

const ChambreTable = ({ 
  filteredChambres, 
  handleEditClick, 
  handleMarkAsClean 
}) => {
  const customTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };
  
  const theadStyle = {
    backgroundColor: '#00afaa',
    color: '#fff',
    textAlign: 'center',
  };
  
  const tdThStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  };

  return (
    <table id="exportTable" style={customTableStyle} className="table table-bordered">
      <thead>
        <tr style={theadStyle}>
          <th style={tdThStyle}>Numéro de chambre</th>
          <th style={tdThStyle}>Status</th>
          <th style={tdThStyle}>Date Nettoyage</th>
          <th style={tdThStyle}>Nettoyée Par</th>
          <th style={tdThStyle}>Maintenance</th>
          <th style={tdThStyle}>Type Maintenance</th>
          <th style={tdThStyle}>Début Maintenance</th>
          <th style={tdThStyle}>Fin Maintenance</th>
          <th style={tdThStyle}>Commentaire</th>
          <th style={tdThStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredChambres.map((record) => (
          <tr key={record.num_chambre}>
            <td style={tdThStyle}>{record.num_chambre}</td>
            <td style={tdThStyle}>
              {record.status.toLowerCase() === 'nettoyée' ? (
                <span className="badge bg-success">{record.status.toUpperCase()}</span>
              ) : (
                <span className="badge bg-danger">{record.status.toUpperCase()}</span>
              )}
            </td>
            <td style={tdThStyle}>{record.date_nettoyage}</td>
            <td style={tdThStyle}>{record.nettoyée_par}</td>
            <td style={tdThStyle}>
              {record.maintenance === 'oui' ? (
                <span className="badge bg-danger">OUI</span>
              ) : (
                <span className="badge bg-success">NON</span>
              )}
            </td>
            <td style={tdThStyle}>{record.types_maintenance}</td>
            <td style={tdThStyle}>{record.date_debut_maintenance}</td>
            <td style={tdThStyle}>{record.date_fin_maintenance}</td>
            <td style={tdThStyle}>{record.commentaire}</td>
            <td style={tdThStyle}>
              <div className="action-buttons d-flex justify-content-center gap-2">
                <Button variant="link" onClick={() => handleEditClick(record)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                  </svg>
                </Button>
                <Button variant="link" className="text-danger" onClick={() => handleMarkAsClean(record)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="green" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                  </svg>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChambreTable;
