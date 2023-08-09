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
import * as Md from "react-icons/md";
import * as Bi from "react-icons/bi";
import Select from "react-select";
import ReactLoading from "react-loading";

import { AiOutlineReload } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request, GET, POST, PATCH, PUT } from "../api/ApiAdapter";
import * as Yup from "yup";
import { useFormik } from "formik";

const Promo = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   const navigate = useNavigate();
  const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [idDelete, setDeleteId] = useState();
  const [editMode, setEditMode] = useState("edit");
  const [openModal, setOpenModal] = useState(false);

  const schedule = {
    class: "",
    promo: "",
    rounds: "",
    discount: "",
  };

  const schema = Yup.object({
    class: Yup.object().required(),
    promo: Yup.string().required(),
    rounds: Yup.number().min(5).required(),
    discount: Yup.number().min(1).max(100).required(),
  });

  const [loading, setLoading] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  const loadAllScheduleData = async () => {
    const res = await request(`promo/findPromo`, GET);
    if (!res.error) {
      // console.log(res);
      setRows(res);
    }
    // else navigate("/page/unauthorized/access");
  };

  const reload = () => {
    setRows([]);
    loadAllScheduleData();
  };

  useEffect(() => {
    loadAllScheduleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    // setEnabledEdit(false);
    setLoading(false);
    resetForm();
    reload();
    setOpenModalDeleteConfirm(false);
  };

  const handleDeleteConfirmModel = (e, row) => {
    e.stopPropagation();
    setDeleteId(row.id);
    setOpenModalDeleteConfirm(true);
  };

  const onDelete = () => {
    deleteAccount(idDelete);
  };

  const deleteAccount = async (id) => {
    const res = await request(`promo/delete`, PATCH, {
      delete: true,
      id,
    });
    if (!res.error) {
      toast.success("Delete schedule successfully..!");
      setOpenModalDeleteConfirm(false);

      reload();
    } else {
      toast.error("Unable to delete schedule...!");
    }
  };

  const handleOpenModal = (e, row) => {
    e.stopPropagation();
    setValues(row);
    setOpenModal(true);
  };

  const createStation = async () => {
    const res = await request("promo/create", POST, {
      clas: values.class.value,
      code: values.promo,
      round: values.rounds,
      discount: values.discount,
    });
    if (!res.error) {
      toast.success("Create Promos successfully..!");
      handleCloseModal();
      setLoading(false);
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
      // console.log(res);
    }
  };

  const updateStation = async () => {
    const res = await request(`promo/update/${values.id}`, PUT, {
      clas: values.class.value,
      code: values.promo,
      round: values.rounds,
      discount: values.discount,
    });
    if (!res.error) {
      toast.success("Update Promo successfully..!");
      handleCloseModal();
      setLoading(false);
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      cursor: "pointer",
      minHeight: "37px",
      height: "37px",
      backgroundColor: "",
      boxShadow: state.isFocused ? null : null,
      // borderColor: state.isFocused ? '#30405D' : null,
      borderColor: "#E5E7EB",
      borderWidth: "medium",
      borderRadius: "0.6em",
      "&:hover": {
        borderColor: state.isFocused ? "#30405D" : null,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      backgroundColor: state.isSelected ? "#30405D" : "#EDF3FB",
      "&:hover": {
        backgroundColor: !state.isSelected ? "#dbe2e9" : null,
      },
    }),
  };

  const {
    setTouched,
    resetForm,
    setValues,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: schedule,
    validationSchema: schema,
  });

  const options = [
    { value: "First", label: "First Class" },
    { value: "Second", label: "Second Class" },
    { value: "Economy", label: "Economy Class" },
  ];

  console.log(values);

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Promotions</h2>
        <div>
          <div className="w-full mb-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={(e) => {
                setEditMode("add");
                handleOpenModal(e, schedule);
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
                    Promotion Code
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    Class
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
                    Number of Rounds
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
                    Discount
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
                      {row.code}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                    >
                      {row.clas}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.round}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.discount}
                      {/* {format(row.createdTime * 1000, "yyyy-MM-dd hh:mm")} */}
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
                    {editMode === "add" ? "Add" : "Edit"} Promos
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
                  <div className="flex mt-4 space-x-4 w-full pb-2">
                    <div className="flex-col w-full">
                      <label htmlFor="class" className=" text-gray-500">
                        <div className="flex">
                          Select Class <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <Select
                        options={options}
                        onBlur={handleBlur}
                        value={values.class}
                        onMenuOpen={() => {
                          setTouched({ ...touched, class: true });
                        }}
                        // isMulti
                        onChange={(e) => {
                          setValues({ ...values, class: e });
                        }}
                        styles={customStyles}
                        className={
                          errors.class && touched.class
                            ? "ring-1 ring-red-500"
                            : ""
                        }
                      />
                      <div className="text-red-500">
                        {errors.class && touched.class && errors.class}
                      </div>
                    </div>
                    <div className="flex-col w-full">
                      <label htmlFor="promo" className=" text-gray-500">
                        <div className="flex">
                          Promo Code <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="promo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="promo"
                        type="text"
                        placeholder="Enter Promo Code"
                        className={
                          "border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1 " +
                          (errors.promo && touched.promo
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.code}
                      />
                      <div className="text-red-500">
                        {errors.promo && touched.promo && errors.promo}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 space-x-4 w-full pb-2">
                    <div className="flex-col w-full">
                      <label htmlFor="rounds" className=" text-gray-500">
                        <div className="flex">
                          Number Of Rounds{" "}
                          <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="rounds"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="rounds"
                        type="number"
                        placeholder="Enter Rounds"
                        className={
                          "border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1 " +
                          (errors.rounds && touched.rounds
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.round}
                      />
                      <div className="text-red-500">
                        {errors.rounds && touched.rounds && errors.rounds}
                      </div>
                    </div>
                    <div className="flex-col w-full">
                      <label htmlFor="dis" className=" text-gray-500">
                        <div className="flex">
                          Discount (%) <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="discount"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="discount"
                        type="text"
                        placeholder="Enter Discount"
                        className={
                          "border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1 " +
                          (errors.discount && touched.discount
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.discount}
                      />
                      <div className="text-red-500">
                        {errors.discount && touched.discount && errors.discount}
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-4 space-x-4 w-full">
                    <div className="flex flex-col w-full">
                      <button
                        onClick={
                          editMode === "add" ? createStation : updateStation
                        }
                        type="button"
                        disabled={
                          Object.entries(errors).length !== 0 ||
                          loading === true
                        }
                        className={
                          Object.entries(errors).length !== 0 ||
                          loading === true
                            ? "bg-gray-200 p-2 rounded-md text-white text-xs hover:bg-gray-200 w-20"
                            : "bg-blue-500 p-2 text-white text-xs w-20 rounded-md shadow-md"
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
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
                      Do you want to delete this Promos..!
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
export default Promo;
