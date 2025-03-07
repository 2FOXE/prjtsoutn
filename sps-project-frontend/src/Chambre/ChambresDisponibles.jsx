import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker } from 'antd';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useOpen } from "../Acceuil/OpenProvider";
import "../style.css";
import ExpandRTable from '../components/ExpandRTable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SearchWithExport from '../components/SearchWithExport';
import CarouselSelector from '../components/CarouselSelector';

const { RangePicker } = DatePicker;

const ChambresDisponibles = () => {
  const [dateRange, setDateRange] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedVue, setSelectedVue] = useState(null);
  const [selectedEtage, setSelectedEtage] = useState(null);
  const [types, setTypes] = useState([]);
  const [vues, setVues] = useState([]);
  const [etages, setEtages] = useState([]);
  const { dynamicStyles } = useOpen();
  const [searchTerm, setSearchTerm] = useState(""); // Déclaration de searchTerm
  const [filteredChambres, setFilteredChambres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/types-chambre");
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching chambre types:", error);
      }
    };
    const fetchVues = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/vues");
        if (response.data && Array.isArray(response.data.vues)) {
          setVues(response.data.vues);
        } else {
          console.error("Error: Vues data is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching vues:", error);
      }
    };
    const fetchEtages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/etages");
        if (response.data && Array.isArray(response.data.etages)) {
          setEtages(response.data.etages);
        } else {
          console.error("Error: Etages data is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching etages:", error);
      }
    };
    fetchTypes();
    fetchVues();
    fetchEtages();
  }, []);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      fetchAvailableChambres(dates);
    }
  };

  const fetchAvailableChambres = async () => {
    if (!dateRange || dateRange.length < 2) return;

    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/api/chambres/available", {
        params: {
          start_date: startDate,
          end_date: endDate,
          type_chambre: selectedType,
          vue_id: selectedVue,
          etage_id: selectedEtage,
        },
      });
      setChambres(response.data);
    } catch (error) {
      setError("Une erreur s'est produite lors de la récupération des chambres.");
      console.error("Erreur lors de la récupération des chambres disponibles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableChambres();
  }, [dateRange, selectedType, selectedVue, selectedEtage]);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase()); // Utilisation de searchTerm
  };

  useEffect(() => {
    setFilteredChambres(
      chambres.filter(chambre => {
        const numChambre = chambre.num_chambre ? String(chambre.num_chambre).toLowerCase() : "";
        const typeChambre = chambre.type_chambre ? String(chambre.type_chambre).toLowerCase() : "";

        return numChambre.includes(searchTerm) || typeChambre.includes(searchTerm);
      })
    );
  }, [chambres, searchTerm]);

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Liste des chambres disponibles</title>
          <style>
            table { width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Liste des Chambres Disponibles</h1>
          <table>
            <thead>
              <tr>
                <th>Code Chambre</th>
                <th>Type</th>
                <th>Etage</th>
                <th>Vue</th>
                <th>Nombre de list</th>
                <th>Nombre de salle</th>
                <th>Climat</th>
                <th>Wifi</th>
              </tr>
            </thead>
            <tbody>
              ${filteredChambres.map(chambre => `
                <tr>
                  <td>${chambre.num_chambre || ''}</td>
                  <td>${chambre.type_chambre || ''}</td>
                  <td>${chambre.etage_id || ''}</td>
                  <td>${chambre.vue_id || ''}</td>
                  <td>${chambre.nb_lit || ''}</td>
                  <td>${chambre.nb_salle || ''}</td>
                  <td>${chambre.climat || ''}</td>
                  <td>${chambre.wifi || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToExcel = () => {
    const table = document.getElementById('chambresTable');
    if (table) {
      const workbook = XLSX.utils.table_to_book(table, { sheet: 'Chambres' });
      XLSX.writeFile(workbook, 'chambres_table.xlsx');
    } else {
      console.error("Table not found for Excel export");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = 'Table Chambres Disponibles';
    doc.text(title, 14, 16);
    doc.autoTable({
      head: [['Code Chambre', 'Type', 'Etage', 'Vue', 'Nombre de lit', 'Nombre de salle', 'Climat', 'Wifi']],
      body: filteredChambres.map(chambre => [
        chambre.num_chambre || '',
        chambre.type_chambre || '',
        chambre.etage_id || '',
        chambre.vue_id || '',
        chambre.nb_lit || '',
        chambre.nb_salle || '',
        chambre.climat || '',
        chambre.wifi || '',
      ]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: '#007bff' }
    });
    doc.save('chambres_disponibles_table.pdf');
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
          <SearchWithExport
            onSearch={handleSearch}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
            printTable={printTable}
            Title="Liste des Chambres Disponibles"
          />
          <div className="container" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-5px', marginRight: '5px', marginBottom: '5px' }}>
              <div style={{ width: '33%' }}>
              <CarouselSelector
                title="Types de Chambre"
                options={types.map(type => ({ id: type.id, label: type.type_chambre }))}
                selectedOption={selectedType}
                onSelectOption={setSelectedType}
              />
              </div>
              <div  style={{ width: '33%' }}>
              <CarouselSelector
                title="Vues de Chambre"
                options={vues.map(vue => ({ id: vue.id, label: vue.vue }))}
                selectedOption={selectedVue}
                onSelectOption={setSelectedVue}
              />
              </div>
              <div  style={{ width: '33%' }}>
              <CarouselSelector
                title="Etages de Chambre"
                options={etages.map(etage => ({ id: etage.id, label: etage.etage }))}
                selectedOption={selectedEtage}
                onSelectOption={setSelectedEtage}
              />
              </div>
              
            </div>
            <div className="mb-3" style={{ marginLeft: '82%', width: '30%', display: 'flex' }}>
              <h5>Periode:</h5>
              <RangePicker onChange={handleDateChange} />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <ExpandRTable
                columns={[
                  { key: 'num_chambre', label: 'Num Chambre', render: (item) => item.num_chambre },
                  { key: 'type_chambre', label: 'Type', render: (item) => item.type_chambre },
                  { key: 'etage', label: 'Étage', render: (item) => item.etage },
                  { key: 'vue', label: 'Vue', render: (item) => item.vue },
                  { key: 'nb_lit', label: 'Nombre de lits', render: (item) => item.nb_lit },
                  { key: 'nb_salle', label: 'Nombre de salles', render: (item) => item.nb_salle },
                  { key: 'climat', label: 'Climat', render: (item) => item.climat },
                  { key: 'wifi', label: 'Wifi', render: (item) => item.wifi  },
                ]}
                data={filteredChambres}
                filteredData={filteredChambres}
                searchTerm={searchTerm}
                highlightText={(text, searchTerm) => {
                  if (!searchTerm) return text;
                  const regex = new RegExp(`(${searchTerm})`, 'gi');
                  return text.toString().replace(regex, '<span style="background-color: yellow;">$1</span>');
                }}
                rowsPerPage={rowsPerPage}
                page={page}
                handleChangePage={(event, newPage) => setPage(newPage)}
                handleChangeRowsPerPage={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                expandedRows={expandedRows}
                toggleRowExpansion={(id) => {
                  setExpandedRows((prev) => ({
                    ...prev,
                    [id]: !prev[id],
                  }));
                }}
                renderExpandedRow={(item) => (
                  <div>
                    <p>Détails supplémentaires pour la chambre {item.num_chambre}</p>
                  </div>
                )}
              />
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChambresDisponibles;