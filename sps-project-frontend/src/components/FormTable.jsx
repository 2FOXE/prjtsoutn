import React from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import TablePagination from '@mui/material/TablePagination';
import Fab from '@mui/material/Fab';
const FormTable = ({
    // Props de style
    formContainerStyle,
    tableContainerStyle,
  
    // États de validation
    hasSubmitted,
  
    // États des modaux
    showEditModalDesignation,
    showAddDesignation,
    showAddCategory,
  
    // Setters des modaux
    setShowEditModalDesignation,
    setShowAddDesignation,
    setShowAddCategory,
  
    // États des formulaires
    newDesignation,
    setNewDesignation,
    newTypeRepas,
    setNewTypeRepas,
  
    // Validation des erreurs
    tarifRepasErrors,
  
    // Handlers des opérations
    handleSaveRepas,
    handleAddTypeRepas,
    handleEditTypeRepas,
    handleDeleteTypeRepas,
    handleSaveDesignation,
    handleAddDesignation,
    handleEditDesignation,
    handleDeleteDesignation,
  
    // Reste des props
    showForm,
    formData,
    errors,
    selectedItems,
    filteredTarifrepas,
    rowsPerPage,
    page,
    selectAll,
    searchTerm,
    tarifs,
    types,
    handleSubmit,
    handleChange,
    handleCheckboxChange,
    handleSelectAllChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage,
    handleShowFormButtonClick,
    handleShowTarif,
    handleEdit,
    handleDelete,
    closeForm,
    editingTarif,

    // Ajouter ces deux lignes
  showEditModal,
  setShowEditModal,
  }) => {
  // Ajouter la fonction highlightText ici
  const highlightText = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="container-d-flex justify-start sm:justify-between">
            <div className="container-d-flex justify-start sm:justify-between">
          <div style={{ display: "flex", alignItems: "center", marginTop: '-12px', padding: '15px' }}>

            <button
              onClick={handleShowFormButtonClick}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#329982",
                color: "white",
                borderRadius: "10px",
                fontWeight: "bold",
                marginLeft: "96%",  // Keep your marginLeft for large screens
                padding: "6px 15px",
                border: "none",
                height: "40px",
              }}
              className="gap-2 AjouteBotton sm:ml-0 md:ml-auto" // Add responsive margin class
            >

                <FontAwesomeIcon
                    icon={faPlus}
                    className=" AjouteBotton"
                    style={{ cursor: "pointer" ,color: "white"}}
                  />
              </button>
            </div>
            <div className="filters" 
            >
       
</div>

        <div style={{ marginTop:"0px",}}>
        <div id="formContainer" className="" style={{...formContainerStyle,marginTop:'0px',maxHeight:'700px',overflow:'auto',padding:'0'}}>
              <Form className="d-flex flex-column align-items-start" onSubmit={handleSubmit}>
                <Form.Label className="w-100 text-center">
                <h4
                     style={{
                      fontSize: "25px", 
                      fontFamily: "Arial, sans-serif", 
                      fontWeight: "bold", 
                      color: "black",
                      borderBottom: "2px solid black", 
                      paddingBottom: "5px",
              
                    }}
                    >
                      {editingTarif ? "Modifier" : "Ajouter"} un Tarif</h4>
                </Form.Label>

                 {/* // Type Repas  //     */}

                 <Form.Group className="form-group">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-primary"
                      style={{ cursor: "pointer", marginRight: "8px" }}
                      onClick={handleShowTarif}
                    />
                    <Form.Label>Tarif Repas</Form.Label>
                    <div style={{ flexGrow: 1, position: "relative" }}>
                      <Form.Select
                        name="designation"
                        value={formData.designation}
                        isInvalid={hasSubmitted && errors.designation}
                        onChange={handleChange}
                        style={{ minWidth: "100%" , marginRight: "15px" }}
                      >
                        <option value="">Sélectionner un Tarif Repas</option>
                        {tarifs?.map((tarif) => (
                          <option key={tarif.id} value={tarif.id}>
                            {tarif.designation}
                          </option>
                        ))}
                      </Form.Select>
                      {hasSubmitted && errors.designation && (
                        <Form.Control.Feedback type="invalid">
                          Required
                        </Form.Control.Feedback>
                      )}
                    </div>
                  </Form.Group>


                <Modal show={showEditModalDesignation} onHide={() => setShowEditModalDesignation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Tarif de Repas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!tarifRepasErrors.photo}
                    onChange={(e) => setNewDesignation({ ...newDesignation, photo: e.target.files[0] })}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                isInvalid={!!tarifRepasErrors.designation}
                // isValid={!tarifRepasErrors.designation}
                value={newDesignation.designation}
                onChange={(e) => setNewDesignation({ ...newDesignation, designation: e.target.value })}
                />
            </Form.Group>
      </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveDesignation}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalDesignation(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
      <Modal show={showAddDesignation} onHide={() => setShowAddDesignation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter Tarif de Repas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!tarifRepasErrors.photo}
                    onChange={(e) => setNewDesignation({ ...newDesignation, photo: e.target.files[0] })}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                // isValid={!errors.designationAdd}
                isInvalid={!!tarifRepasErrors.designationAdd}
                onChange={(e) => setNewDesignation({ ...newDesignation, designation: e.target.value })}
              />
            </Form.Group>
      </Form>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3" style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Designation</th>
                  <th>Photo</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tarifs?.map(categ => (
                  <tr>
                    <td>{categ?.designation}</td>
                    <td>  
                    <img
                        decoding="async"
                        src={categ.photo ? `http://127.0.0.1:8000/storage/${categ.photo}` : "http://localhost:8000/storage/repas-img.webp"}
                        alt={categ.designation}
                        loading="lazy"
                        aria-hidden="true"
                        className={`rounded-circle category-img`}
                      />
                    </td>
                    <td>
                        <FontAwesomeIcon
                                  onClick={() => handleEditDesignation(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteDesignation(categ?.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddDesignation}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddDesignation(false)}
  >
    Annuler
  </Fab>
  </Form.Group>
      </Modal.Body>
      </Modal>
      <Form.Group className="form-group">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-primary"
              style={{ cursor: "pointer", marginRight: "8px" }}
              onClick={() => setShowAddCategory(true)}
            />
            <Form.Label>Type Repas</Form.Label>
            <div style={{ flexGrow: 1, position: "relative" }}>
              <Form.Select
                name="type_repas"
                value={formData.type_repas}
                isInvalid={hasSubmitted && errors.type_repas}
                onChange={handleChange}
                style={{ minWidth: "100%" , marginRight: "15px"}}
              >
                <option value="">Sélectionner Type de Repas</option>
                {types?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_repas}
                  </option>
                ))}
              </Form.Select>
              {hasSubmitted && errors.type_repas && (
                <Form.Control.Feedback type="invalid">
                  Required
                </Form.Control.Feedback>
              )}
            </div>
      </Form.Group>

                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Type de Repas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                name="code"
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, code: e.target.value })}
                value={newTypeRepas.code}
                />
              <Form.Text className="text-danger">{errors.code}</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Type Repas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type Repas"
                name="type_repas"
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, type_repas: e.target.value })}
                value={newTypeRepas.type_repas}
                />
              <Form.Text className="text-danger">{errors.type_repas}</Form.Text>
            </Form.Group>
      </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveRepas}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModal(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
                <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Type Repas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group>
              <Form.Label>Code Repas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code Repas"
                name="code"
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, code: e.target.value })}
              />
            </Form.Group>
          <Form.Group>
              <Form.Label>Type Repas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type Repas"
                name="type_repas"
                value={newTypeRepas.type_repas}
                onChange={(e) => setNewTypeRepas({ ...newTypeRepas, type_repas: e.target.value })}
              />
            </Form.Group>
      </Form>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3" style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                <th>Code Repas</th>
                  <th>Type Repas</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {types?.map(categ => (
                  <tr>
                    <td>{categ.code}</td>
                    <td>{categ.type_repas}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditTypeRepas(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteTypeRepas(categ?.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddTypeRepas}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddCategory(false)}
  >
    Annuler
  </Fab>
  </Form.Group>
      </Modal.Body>
      </Modal>

      {/* // Montant //  */}
      
      <Form.Group className="form-group" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
  {/* Placeholder for the "+" icon */}
  <div style={{ width: "18px" }}></div> 

  <Form.Label style={{ minWidth: "170px", fontWeight: "bold", marginRight: "0" }}>
    Montant
  </Form.Label>

  <div style={{ flexGrow: 1, position: "relative" }}>
    <Form.Control
      type="number"
      name="montant"
      value={formData.montant}
      isInvalid={hasSubmitted && errors.montant}
      onChange={handleChange}
      style={{ minWidth: "100%", maxWidth: "400px" }} // Ensures the width is consistent
    />
    {hasSubmitted && errors.montant && (
      <Form.Control.Feedback type="invalid" style={{ fontSize: "12px", position: "absolute", top: "100%", left: "0" }}>
        Required
      </Form.Control.Feedback>
    )}
  </div>
</Form.Group>



<Form.Group className="mt-5 tarif-button-container">
  <div className="button-container">
    <Fab
      variant="extended"
      className="btn-sm Fab mb-2 mx-2"
      type="submit"
    >
      Valider
    </Fab>
    <Fab
      variant="extended"
      className="btn-sm FabAnnule mb-2 mx-2"
      onClick={closeForm}
    >
      Annuler
    </Fab>
  </div>
</Form.Group>
              </Form>
            </div>
        </div>
            <div className="">
              <div
                id="tableContainer"
                className="table-responsive"
                style={{...tableContainerStyle, overflowX: 'auto', minWidth: '650px',
                  maxHeight: '700px', overflow: 'auto',

                  marginTop:'0px',
                }}
              >
                 <table className="table table-bordered" id="tarifRepasTable" style={{ marginTop: "-5px", }}>
  <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1,padding:'10px'}}>
    <tr className="tableHead">
      <th className="tableHead">
        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
      </th>
      <th className="tableHead">Type Repas</th>
      <th className="tableHead">Montant</th>
      <th className="tableHead">Action</th>
    </tr>
  </thead>
  <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
    {filteredTarifrepas
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ?.map((tarifRepas) => {
      return(
        <React.Fragment>
          <tr>
      
            <td style={{ backgroundColor: "white" }}>
              <input
                type="checkbox"
                checked={selectedItems.includes(tarifRepas?.id)}
                onChange={() => handleCheckboxChange(tarifRepas?.id)}
              />
            </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(tarifRepas?.type_repas.type_repas, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(String(tarifRepas.montant), searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <FontAwesomeIcon
      onClick={() => handleEdit(tarifRepas)}
      icon={faEdit}
      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
    />
    <FontAwesomeIcon
      onClick={() => handleDelete(tarifRepas?.id)}
      icon={faTrash}
      style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }}
    />
  </div>  
</td>
          </tr>

        </React.Fragment>
      )
       
})}
  </tbody>
</table>

                {/* )} */}
               
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
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Supprimer selection
                </Button>
                </a>
                <TablePagination
                  rowsPerPageOptions={[5, 10,15,20, 25]}
                  component="div"
                  count={filteredTarifrepas?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
          </div>
    </div>
  );
};

export default FormTable;