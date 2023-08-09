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
import Geocode from "react-geocode";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { AiOutlineReload } from "react-icons/ai";
import ReactLoading from "react-loading";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import * as Bi from "react-icons/bi";
import * as Md from "react-icons/md";
// import { Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { selectCurrentUser } from '../../redux/features/authSlice';
import { request, GET, POST, PATCH, PUT } from "../api/ApiAdapter";

const Station = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [idDelete, setDeleteId] = useState();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState("edit");
  // const [enabledEdit, setEnabledEdit] = useState(false);
  const [loading, setLoading] = useState();
  const station = {
    name: "",
    address: "",
    contact: "",
  };
  const [autocomplete, setAutocomplete] = useState(null);
  const [adr, setAdr] = useState(true);

  const schema = Yup.object({
    name: Yup.string().required(),
    address: Yup.string().required(),
    contact: Yup.number().required(),
  });

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

  const loadAllStationData = async () => {
    const res = await request(`station/getustation`, GET);
    if (!res.error) {
      setRows(res);
      // console.log(res);
    }
    // else navigate("/");
  };

  const handleDeleteConfirmModel = (e, row) => {
    e.stopPropagation();
    setDeleteId(row.id);
    setOpenModalDeleteConfirm(true);
  };
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    componentRestrictions: { country: "ca" },
    libraries,
  });

  const reload = () => {
    setRows([]);
    loadAllStationData();
  };

  const deleteStation = async (id) => {
    const res = await request(`station/delete`, PATCH, {
      delete: true,
      id,
    });
    if (!res.error) {
      toast.success("Delete station successfully..!");
      setOpenModalDeleteConfirm(false);

      reload();
    } else {
      toast.error("Unable to delete station...!");
    }
  };

  const onDelete = () => {
    deleteStation(idDelete);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // eslint-disable-next-line no-shadow
  const onLoad = (autocomplete) => {
    // console.log('autocomplete: ', autocomplete);
    if (adr === true) {
      setAutocomplete(autocomplete);
    }
  };

  const onPlaceChanged = () => {
    if (adr === true) {
      setAutocomplete(autocomplete);

      if (autocomplete !== null) {
        setValues({
          ...values,
          address: autocomplete?.getPlace()?.formatted_address,
        });
        // setStation((state) => ({
        //   ...state,
        //   address: autocomplete?.getPlace()?.formatted_address,
        // }));
      } else {
        console.log("Autocomplete is not loaded yet!");
      }
    }
  };

  const handleEnterKeypress = (e) => {
    if (e.key === "Backspace") {
      setAdr(false);
      setValues((state) => ({
        ...state,
        address: "",
      }));
      autocomplete.set("place", null);
    } else {
      // console.log(station.address);
      // console.log(autocomplete);
    }

    if (adr === false) {
      if (e.key !== "Backspace") {
        setAdr(true);
      }
    }
  };

  const handleOpenModal = (e, row) => {
    e.stopPropagation();
    setValues(row);
    setOpenModal(true);
  };

  const setEditEnabled = (e) => {
    // setEnabledEdit(e.target.checked);
    // if (editMode === 'edit') {
    //   if (enabledEdit !== false) {
    //     // console.log('double');
    //     station.contact = '';
    //     station.password = '';
    //     station.appkey = '';
    //     station.appSecret = '';
    //   }
    // }
  };

  const createStation = () => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_KEY);
    Geocode.setLanguage("en");
    Geocode.setLocationType("ROOFTOP");
    // setLoading(true);

    Geocode.fromAddress(values.address).then(
      async (response) => {
        if (Object.entries(errors).length === 0) {
          const { lat, lng } = response.results[0].geometry.location;
          console.log({ ...values, lat, lng });

          const res = await request("station/create", POST, {
            ...values,
            lat,
            lng,
          });
          if (!res.error) {
            toast.success("Create station successfully..!");
            handleCloseModal();
            setLoading(false);
          } else {
            toast.error(res.error.response.data);
            setLoading(false);
            // console.log(res);
          }
        } else {
          toast.error("Required field cannot be empty");
        }
      },
      (error) => {
        toast.error("Plese enter valid address");
        setLoading(false);

        // eslint-disable-next-line no-console
        console.error(error);
      }
    );
  };

  const updateStation = async () => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_KEY);
    Geocode.setLanguage("en");
    Geocode.setLocationType("ROOFTOP");
    setLoading(true);
    console.log(values);
    Geocode.fromAddress(values.address).then(
      async (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        const res = await request(`station/update/${values.id}`, PUT, {
          ...values,
          lat,
          lng,
        });
        if (!res.error) {
          toast.success("Update station successfully..!");
          handleCloseModal();
          setLoading(false);
        } else {
          toast.error(res.error.response.data);
          setLoading(false);
        }
      },
      (error) => {
        toast.error("Plese enter valid address");
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    );
  };

  const submit = () => {
    if (editMode === "edit") {
      updateStation();
    } else {
      createStation();
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
  } = useFormik({
    initialValues: station,
    validationSchema: schema,
    onSubmit: submit,
  });

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Stations</h2>
        <div>
          <div className="w-full mb-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={(e) => {
                setEditMode("add");
                handleOpenModal(e, station);
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
                    Station Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    Location
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
                      {row.address}
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
                    <TableCell align="center" sx={{ paddingY: ".5em" }}>
                      <div className="flex justify-center space-x-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            setEditMode("edit");
                            handleOpenModal(e, row);
                            setEditEnabled(false);
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
                        {/* </Tooltip> */}
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
          {isLoaded ? (
            <>
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
                        {editMode === "add" ? "Add" : "Edit"} Station
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
                              Station Name{" "}
                              <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="name"
                            onChange={handleChange}
                            name="name"
                            type="text"
                            placeholder="Enter Station Name"
                            onBlur={handleBlur}
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
                        <Autocomplete
                          onPlaceChanged={onPlaceChanged}
                          onLoad={onLoad}
                          className="w-full"
                        >
                          <div className="flex flex-col w-full">
                            <label htmlFor="address" className="text-gray-500">
                              <div className="flex mr-3">
                                Address <span className="text-red-500">*</span>
                              </div>
                            </label>
                            <input
                              id="address"
                              onChange={onPlaceChanged}
                              onBlur={handleBlur}
                              name="address"
                              type="text"
                              onKeyDown={(e) => handleEnterKeypress(e)}
                              placeholder="Enter Station Address"
                              className={
                                "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                                (errors.address && touched.address
                                  ? "ring-1 ring-red-500"
                                  : "")
                              }
                              value={values.address}
                            />
                            <div className="text-red-500">
                              {errors.address &&
                                touched.address &&
                                errors.address}
                            </div>
                          </div>
                        </Autocomplete>
                      </div>

                      <div className="flex mt-4 space-x-4 w-full ">
                        <div className="flex-col w-full">
                          <label htmlFor="contact" className="text-gray-500">
                            <div className="flex">
                              Contact Number{" "}
                              <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="contact"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="contact"
                            maxLength={"10"}
                            type="text"
                            placeholder="Enter Contact Number"
                            className={
                              "border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1 " +
                              (errors.contact && touched.contact
                                ? "ring-1 ring-red-500"
                                : "")
                            }
                            value={values.contact}
                          />
                          <div className="text-red-500">
                            {errors.contact &&
                              touched.contact &&
                              errors.contact}
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
            </>
          ) : (
            <></>
          )}
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
                      Do you want to delete this Station..!
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

export default Station;
