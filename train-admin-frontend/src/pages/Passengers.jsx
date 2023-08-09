import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Modal, Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import * as Bi from "react-icons/bi";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import ReactLoading from "react-loading";
import * as Yup from "yup";
import { useFormik } from "formik";
import * as Md from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request, GET, POST, PATCH, PUT } from "../api/ApiAdapter";
import Geocode from "react-geocode";

const Passengers = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [idDelete, setDeleteId] = useState();
  const [editMode, setEditMode] = useState("edit");
  const [openModal, setOpenModal] = useState(false);

  const schema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    nic: Yup.string().required(),
    contact: Yup.number().required(),
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  const user = {
    name: "",
    email: "",
    nic: "",
    contact: "",
    username: "",
    password: "",
  };

  const [loading, setLoading] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // setEnabledEdit(false);
    setLoading(false);
    resetForm();
    reload();
    setOpenModalDeleteConfirm(false);
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

  const styleConfirm = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    overflow: "hidden",
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const loadAllPassengerData = async () => {
    const res = await request(`passenger/get`, GET);
    if (!res.error) {
      setRows(res);
    }
    // else navigate("/page/unauthorized/access");
  };

  const reload = () => {
    setRows([]);
    loadAllPassengerData();
  };

  useEffect(() => {
    loadAllPassengerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteConfirmModel = (e, row) => {
    e.stopPropagation();
    setDeleteId(row.id);
    setOpenModalDeleteConfirm(true);
  };

  const onDelete = () => {
    deleteAccount(idDelete);
  };

  const deleteAccount = async (id) => {
    const res = await request(`passenger/delete`, PUT, {
      delete: true,
      id,
    });
    if (!res.error) {
      toast.success("Delete passenger successfully..!");
      setOpenModalDeleteConfirm(false);
      reload();
    } else {
      toast.error("Unable to delete passenger...!");
    }
  };

  const handleOpenModal = (e, row) => {
    e.stopPropagation();
    setValues(row);
    setOpenModal(true);
  };

  const createStation = async () => {
    setLoading(true);
    const res = await request("passenger/create", POST, {
      ...values,
    });
    if (!res.error) {
      toast.success("Create passenger successfully..!");
      handleCloseModal();
      setLoading(false);
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
    }
  };

  const updateStation = async () => {
    const res = await request(`passenger/update/${values.id}`, PUT, {
      ...values,
    });
    if (!res.error) {
      toast.success("Update passenger successfully..!");
      handleCloseModal();
      setLoading(false);
      reload();
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
    }
  };

  const submit = () => {
    if (editMode === "add") {
      createStation();
    } else {
      updateStation();
    }
  };

  const {
    resetForm,
    setValues,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: user,
    validationSchema: schema,
    onSubmit: submit,
  });

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Passengers</h2>
        <div>
          <div className="w-full mb-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={(e) => {
                setEditMode("add");
                handleOpenModal(e, values);
                // setEnabledEdit(true);
              }}
              className="px-2 py-1 bg-[#00A05E] rounded-md shadow-md cursor-pointer"
            >
              <Md.MdAdd color="white" />
            </button>
            <button
              type="button"
              onClick={() => reload()}
              className="px-2 py-1 bg-blue-400 rounded-md shadow-md cursor-pointer"
            >
              <AiOutlineReload color="white" />
            </button>
          </div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#30405D" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    Passenger Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    NIC
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                    align="center"
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                    align="center"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                    align="center"
                  >
                    Username
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
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
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      scope="row"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                    >
                      {row.nic}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.contact}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.username}
                    </TableCell>
                    <TableCell align="center" sx={{ paddingY: ".5em" }}>
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
                        <button
                          onClick={(e) => {
                            setOpenModalDeleteConfirm();
                            handleDeleteConfirmModel(e, row);
                          }}
                          type="button"
                          className="cursor-pointer rounded-md p-1 text-red-500"
                        >
                          <Md.MdDelete size="1.5em" />
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
                    {editMode === "add" ? "Add" : "Edit"} Passenger
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
                  <div className="flex mt-4 space-x-4 w-full">
                    <div className="flex flex-col w-full">
                      <label htmlFor="name" className="text-gray-500">
                        <div className="flex">
                          Full Name <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="name"
                        type="text"
                        placeholder="Enter Full Name"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.name && touched.name
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.name}
                      />
                      <div className="text-red-500">
                        {errors.name && touched.name && errors.name}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="address" className="text-gray-500">
                        <div className="flex mr-3">
                          Email Address <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="email"
                        onChange={handleChange}
                        name="email"
                        type="text"
                        onBlur={handleBlur}
                        placeholder="Enter Email Address"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.email && touched.email
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.email}
                      />
                      <div className="text-red-500">
                        {errors.email && touched.email && errors.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 space-x-4 w-full">
                    <div className="flex flex-col w-full">
                      <label htmlFor="name" className="text-gray-500">
                        <div className="flex">
                          NIC <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="nic"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="nic"
                        type="text"
                        placeholder="Enter NIC"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.nic && touched.nic
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.nic}
                      />
                      <div className="text-red-500">
                        {errors.nic && touched.nic && errors.nic}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="address" className="text-gray-500">
                        <div className="flex mr-3">
                          Contact Number <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="contact"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="contact"
                        type="text"
                        placeholder="Enter Contact Number"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.contact && touched.contact
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.contact}
                      />
                      <div className="text-red-500">
                        {errors.contact && touched.contact && errors.contact}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 space-x-4 w-full">
                    <div className="flex flex-col w-full">
                      <label htmlFor="name" className="text-gray-500">
                        <div className="flex">
                          Username <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="username"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="username"
                        type="text"
                        placeholder="Enter Username"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.username && touched.username
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.username}
                      />
                      <div className="text-red-500">
                        {errors.username && touched.username && errors.username}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="address" className="text-gray-500">
                        <div className="flex mr-3">
                          Password <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Password"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.password && touched.password
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.password}
                      />
                      <div className="text-red-500">
                        {errors.password && touched.password && errors.password}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-2 flex justify-end">
                <div className="space-x-4">
                  <button
                    onClick={handleSubmit}
                    type="button"
                    disabled={
                      Object.entries(errors).length !== 0 || loading === true
                    }
                    className={
                      Object.entries(errors).length !== 0 || loading === true
                        ? "bg-gray-200 p-2 rounded-md text-white text-xs hover:bg-gray-200 w-20"
                        : "bg-blue-500 p-2 text-white text-xs w-20 rounded-md shadow-md"
                    }
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    disabled={loading === true}
                    className="bg-red-500 p-2 text-xs text-white rounded-md w-20 shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={openModalDeleteConfirm}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleConfirm}>
              <div>
                <div className="p-6">
                  <div className="flex mb-4 items-center justify-between">
                    <div className="text-lg font-bold">
                      Do you want to delete this Passenger..!
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCloseModal()}
                      className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                    >
                      <Md.MdOutlineClose />
                    </button>
                  </div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div className="font-semibold">{`If you complete this, you can't reverse it.`}</div>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 flex justify-end rounded-b-xl">
                  <div className="space-x-4">
                    <button
                      onClick={() => {
                        onDelete();
                      }}
                      type="button"
                      className="bg-red-500 p-2 text-white text-xs rounded-md shadow-md mr-1 w-20"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleCloseModal}
                      type="button"
                      className=" bg-blue-500 p-2 text-xs text-white rounded-md shadow-md mr-4 w-20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default Passengers;
