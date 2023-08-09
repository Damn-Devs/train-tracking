import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Modal, Box } from "@mui/material";
import ReactLoading from "react-loading";
import * as Md from "react-icons/md";
import * as Bi from "react-icons/bi";
import { toast } from "react-toastify";

import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { request, GET, PUT } from "../api/ApiAdapter";

const Ticket = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState();
  const [editMode, setEditMode] = useState("edit");
  const [value, setValue] = useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadAllTicket = async () => {
    const res = await request(`price/findPrice`, GET);
    if (!res.error) {
      console.log(res);
      setRows(res);
    }
  };

  useEffect(() => {
    loadAllTicket();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = (e, row) => {
    // loadAllStationData(row);
    e.stopPropagation();
    setValue(row);
    setOpenModal(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    borderRadius: 1,
    boxShadow: 24,
    overflow: "hidden",
  };

  const createTrain = async (id, price) => {
    const res = await request(`price/update/${id}/${price}`, PUT);
    if (!res.error) {
      toast.success("Create train successfully..!");
      handleCloseModal();
      setLoading(false);
      loadAllTicket();
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
      // console.log(res);
    }
  };

  const submit = () => {
    createTrain(value.id, value.price);
  };

  const onChange = (e) => {
    setValue((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  console.log(value);
  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Ticket Management</h2>
        <div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#30405D" }}>
                <TableRow>
                  <TableCell sx={{ color: "#D1F1F9", fontWeight: 800 }}>
                    Price Class
                  </TableCell>
                  <TableCell
                    sx={{ color: "#D1F1F9", fontWeight: 800 }}
                    align="center"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{ color: "#D1F1F9", fontWeight: 800 }}
                    align="center"
                  >
                    Created Date
                  </TableCell>
                  <TableCell
                    sx={{ color: "#D1F1F9", fontWeight: 800 }}
                    align="center"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "#EDF3FB" }}>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.clas}</TableCell>
                    <TableCell align="center">{row.price}</TableCell>
                    <TableCell align="center">{row.createdDate}</TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center space-x-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            setEditMode("edit");
                            handleOpenModal(e, row);
                            // setEditEnabled(false);
                          }}
                          className="cursor-pointer rounded-md p-1 text-yellow-500"
                        >
                          <Bi.BiEdit size="1.5em" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{
              ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-displayedRows, .MuiTablePagination-actions, .MuiTablePagination-menuItem":
                {
                  fontSize: "0.8em",
                  color: "white",
                },
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {loading && (
              <ReactLoading
                className="z-50 absolute right-[40%] top-1/2"
                type="bubbles"
                color="#30405D"
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">
                  {editMode === "add" ? "Add" : "Edit"} Ticket
                </div>
                <button
                  type="button"
                  onClick={() => handleCloseModal()}
                  disabled={loading === true}
                  className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                >
                  <Md.MdOutlineClose />
                </button>
              </div>

              <div className="  text-xs">
                {/* <h3></h3> */}
                <div className="flex mt-4 space-x-4 w-full">
                  <div className="flex flex-col w-full">
                    <label htmlFor="price" className="text-gray-500">
                      <div className="flex">
                        {value?.clas} Class{" "}
                        <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input
                      id="price"
                      onChange={(e) => onChange(e)}
                      // onBlur={handleBlur}
                      name="price"
                      type="text"
                      placeholder="Enter Price"
                      className={
                        "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm "
                      }
                      value={value?.price}
                    />
                    {/* <div className="text-red-500">
                      {errors.name && touched.name && errors.name}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-2 flex justify-end">
              <div className="space-x-4">
                <button
                  onClick={submit}
                  type="button"
                  // disabled={
                  //   Object.entries(errors).length !== 0 || loading === true
                  // }
                  className={
                    "bg-blue-500 p-2 text-white text-xs w-20 rounded-md shadow-md"
                  }
                >
                  Save
                </button>
                <button
                  // onClick={handleCloseModal}
                  type="button"
                  // disabled={loading === true}
                  className="bg-red-500 p-2 text-xs text-white rounded-md w-20 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Ticket;
