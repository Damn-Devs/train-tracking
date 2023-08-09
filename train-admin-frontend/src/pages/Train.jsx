import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Modal, Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import * as Md from "react-icons/md";
import * as Bi from "react-icons/bi";
import ReactLoading from "react-loading";

import { AiOutlineReload } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request, GET, POST, PATCH, PUT } from "../api/ApiAdapter";

const Train = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   const navigate = useNavigate();
  const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [idDelete, setDeleteId] = useState();
  const [editMode, setEditMode] = useState("edit");
  const [openModal, setOpenModal] = useState(false);
  const [train, setTrain] = useState({
    name: "",
    firstClassCount: "",
    secondClassCount: "",
    thirdClassCount: "",
    station: [],
  });

  const schema = Yup.object({
    name: Yup.string().required(),
    firstClassCount: Yup.number().min(1).max(50).required(),
    secondClassCount: Yup.number().min(1).max(50).required(),
    thirdClassCount: Yup.number().min(1).max(50).required(),
    station: Yup.array().min(1).required(),
  });

  const [loading, setLoading] = useState();
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);

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

  const loadAllTrainData = async () => {
    const res = await request(`train/getutrain`, GET);
    if (!res.error) {
      console.log(res);
      setRows(res);
    }
    // else navigate("/page/unauthorized/access");
  };

  const loadAllStationData = async () => {
    const res = await request(`station/getustation`, GET);
    if (!res.error) {
      const newStations = [];
      const options = [];
      res.forEach((item) => {
        // console.log(item.name);
        options.push({ label: item.name, value: item });
        newStations.push({ id: item.id, value: item.name });
      });
      setStations(options);
    }
  };

  console.log(train);

  const reload = () => {
    setRows([]);
    loadAllTrainData();
  };

  useEffect(() => {
    loadAllTrainData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStations([]);
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
    const res = await request(`train/delete`, PATCH, {
      delete: true,
      id,
    });
    if (!res.error) {
      toast.success("Delete train successfully..!");
      setOpenModalDeleteConfirm(false);

      reload();
    } else {
      toast.error("Unable to delete train...!");
    }
  };

  const handleOpenModal = (e, row) => {
    e.stopPropagation();
    loadAllStationData();
    const newSelectedStation = [];
    if (row?.stations?.length > 0) {
      row.stations?.forEach((trainStation) => {
        newSelectedStation.push({
          label: trainStation.station.name,
          value: trainStation.station,
        });
      });
      setSelectedStations(newSelectedStation);
    }

    setValues({ ...row, station: newSelectedStation });
    setOpenModal(true);
  };

  const createStation = async () => {
    const newStationList = [];
    selectedStations.forEach((stat, i) => {
      newStationList.push({ id: stat.value.id, order: i });
    });
    const res = await request("train/create", POST, {
      name: values.name,
      firstClassCount: values.firstClassCount,
      secondClassCount: values.secondClassCount,
      thirdClassCount: values.thirdClassCount,
      station: newStationList,
    });
    if (!res.error) {
      toast.success("Create train successfully..!");
      handleCloseModal();
      setLoading(false);
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
      // console.log(res);
    }
  };

  const updateStation = async () => {
    const newStationList = [];
    selectedStations.forEach((stat, i) => {
      newStationList.push({ id: stat.value.id, order: i });
    });
    const res = await request(`train/update/${values.id}`, PUT, {
      name: values.name,
      firstClassCount: values.firstClassCount,
      secondClassCount: values.secondClassCount,
      thirdClassCount: values.thirdClassCount,
      station: newStationList,
    });
    if (!res.error) {
      toast.success("Update train successfully..!");
      handleCloseModal();
      setLoading(false);
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
    }
  };

  const handleStationChange = (stations) => {
    // console.log("stations", stations);
    setTouched({ ...touched, station: true });
    setSelectedStations(stations);
    if (stations.length === 0) {
      setValues({ ...values, station: [] });
    } else {
      const newStations = [];
      stations.forEach((item) => {
        newStations.push(item.id);
      });
      setValues({ ...values, station: newStations });
    }
  };

  const submit = () => {
    if (editMode === "edit") {
      updateStation();
    } else {
      createStation();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Update the train object
    setTrain({
      ...train,
      [name]: value,
    });
  };

  const {
    setTouched,
    resetForm,
    setValues,
    values,
    errors,
    touched,
    handleBlur,
    // handleChange,
  } = useFormik({
    initialValues: train,
    validationSchema: schema,
    onSubmit: submit,
  });

  useEffect(() => {
    console.log(values);
    console.log(errors);
  }, [errors]);

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Train</h2>
        <div>
          <div className="w-full mb-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={(e) => {
                setEditMode("add");
                handleOpenModal(e, train);
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
                    Train Name
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
                    First Class Seat Count
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
                    Second Class Seat Count
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
                    Economy Class Seat Counts
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
                      align="center"
                    >
                      {row.firstClassCount}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.secondClassCount}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.thirdClassCount}
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
                    {editMode === "add" ? "Add" : "Edit"} Train
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
                      <label htmlFor="name" className="text-gray-500">
                        <div className="flex">
                          Train Name <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="name"
                        type="text"
                        placeholder="Enter Name"
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
                      <label
                        htmlFor="firstClassCount"
                        className="text-gray-500"
                      >
                        <div className="flex">
                          First Class Seat Count{" "}
                          <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="firstClassCount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="firstClassCount"
                        type="text"
                        placeholder="Enter First Class Seat Count"
                        className={
                          "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                          (errors.firstClassCount && touched.firstClassCount
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.firstClassCount}
                      />
                      <div className="text-red-500">
                        {errors.firstClassCount &&
                          touched.firstClassCount &&
                          errors.firstClassCount}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 space-x-4 w-full ">
                    <div className="flex-col w-full">
                      <label
                        htmlFor="secondClassCount"
                        className="text-gray-500"
                      >
                        <div className="flex">
                          Second Class Seat Count{" "}
                          <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="secondClassCount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="secondClassCount"
                        type="text"
                        placeholder="Enter Second Class Seat Count"
                        className={
                          "border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1 " +
                          (errors.secondClassCount && touched.secondClassCount
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.secondClassCount}
                      />
                      <div className="text-red-500">
                        {errors.secondClassCount &&
                          touched.secondClassCount &&
                          errors.secondClassCount}
                      </div>
                    </div>
                    <div className="flex-col w-full">
                      <label
                        htmlFor="thirdClassCount"
                        className="text-gray-500"
                      >
                        <div className="flex">
                          Economy Class Seat Count{" "}
                          <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        id="thirdClassCount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="thirdClassCount"
                        type="text"
                        placeholder="Enter Economy Class Seat Count"
                        className={
                          "border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1 " +
                          (errors.thirdClassCount && touched.thirdClassCount
                            ? "ring-1 ring-red-500"
                            : "")
                        }
                        value={values.thirdClassCount}
                      />
                      <div className="text-red-500">
                        {errors.thirdClassCount &&
                          touched.thirdClassCount &&
                          errors.thirdClassCount}
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-4 space-x-4 w-full ">
                    <div className="flex-col w-full">
                      <label htmlFor="station" className="text-gray-500">
                        <div className="flex">
                          Select Station Train Pass{" "}
                          <span className="text-red-500 mb-2">*</span>
                        </div>
                      </label>
                      <Select
                        isMulti={true}
                        onBlur={handleBlur}
                        placeholder="Train Stations"
                        options={stations}
                        onChange={handleStationChange}
                        value={selectedStations}
                        className={
                          errors.station && touched.station
                            ? "ring-1 ring-red-500"
                            : ""
                        }
                      />
                      <div className="text-red-500">
                        {errors.station && touched.station && errors.station}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-2 flex justify-end">
                <div className="space-x-4">
                  <button
                    onClick={submit}
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
                      Do you want to delete this Train..!
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
export default Train;
