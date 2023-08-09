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
import Geocode from "react-geocode";

import * as Md from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request, GET, POST, PATCH, PUT } from "../api/ApiAdapter";

const TClass = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   const navigate = useNavigate();
  const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [idDelete, setDeleteId] = useState();
  const [editMode, setEditMode] = useState("edit");
  const [openModal, setOpenModal] = useState(false);
  const [station, setStation] = useState({
    name: "",
    address: "",
    lat: 0,
    lng: 0,
    contact: "",
  });
  const [loading, setLoading] = useState();
  const [autocomplete, setAutocomplete] = useState(null);
  const [adr, setAdr] = useState(true);
  const [errors, setErrors] = useState([]);

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

  const loadAllClassData = async () => {
    const res = await request(`class/getAll`, GET);
    if (!res.error) {
      setRows(res);
    }
    // else navigate("/page/unauthorized/access");
  };

  const reload = () => {
    setRows([]);
    loadAllClassData();
  };

  useEffect(() => {
    const newErrors = [];
    if (station.name === "") {
      newErrors.push({ label: "station.name", value: "Required" });
    }
    if (station.address === "") {
      newErrors.push({ label: "station.address", value: "Required" });
    }
    if (station.contact === "") {
      newErrors.push({ label: "station.contact", value: "Required" });
    }
    setErrors([...newErrors]);
    loadAllClassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    // setEnabledEdit(false);
    setLoading(false);
    setStation({
      name: "",
      address: "",
      lat: 0,
      lng: 0,
      contact: "",
    });
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
    const res = await request(`class/delete`, PATCH, {
      delete: true,
      id,
    });
    if (!res.error) {
      toast.success("Delete class successfully..!");
      setOpenModalDeleteConfirm(false);

      reload();
    } else {
      toast.error("Unable to delete class...!");
    }
  };

  const handleOpenModal = (e, row) => {
    e.stopPropagation();
    setStation(row);
    setOpenModal(true);
  };

  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    componentRestrictions: { country: "ca" },
    libraries,
  });

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
        setStation((state) => ({
          ...state,
          address: autocomplete?.getPlace()?.formatted_address,
        }));
      } else {
        // console.log('Autocomplete is not loaded yet!');
      }
    }
  };

  const handleEnterKeypress = (e) => {
    if (e.key === "Backspace") {
      setAdr(false);
      setStation((state) => ({
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

  const onChange = (e) => {
    setStation((state) => ({
      ...state,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const createStation = () => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_KEY);
    Geocode.setLanguage("en");
    Geocode.setLocationType("ROOFTOP");
    setLoading(true);

    Geocode.fromAddress(station.address).then(
      async (response) => {
        if (errors.length === 0) {
          const { lat, lng } = response.results[0].geometry.location;

          const res = await request("station/create", POST, {
            ...station,
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

    Geocode.fromAddress(station.address).then(
      async (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        const res = await request(`station/update/${station.id}`, PUT, {
          name: station.name,
          address: station.address,
          contact: station.contact,
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

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Class</h2>
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
                    Class Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    Seat Count
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                    align="center"
                  >
                    Contact
                  </TableCell> */}
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                    align="center"
                  >
                    Created Date
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
                      {row.seatCount}
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.contact}
                    </TableCell> */}
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {/* {row.createdTime} */}
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
                      {/* <h3></h3> */}
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
                            onChange={(e) => onChange(e)}
                            name="name"
                            type="text"
                            placeholder="Enter Name"
                            className="border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm"
                            value={station.name}
                          />
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
                              name="address"
                              type="text"
                              onKeyDown={(e) => handleEnterKeypress(e)}
                              placeholder="Enter Station Address"
                              className="border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm"
                              value={station.address}
                            />
                          </div>
                        </Autocomplete>
                      </div>
                      {/* <div className="text-sm flex mt-4 font-bold ml-0">
                        <div
                          className={`text-input flex -mt-[0.2em] -ml-3 ${
                            editMode === "edit" ? "visible" : "hidden"
                          }`}
                        >
                          <Checkbox
                            name="enableEdit"
                            id="enableEdit"
                            onChange={(e) => setEditEnabled(e)}
                          />
                        </div>
                        <label htmlFor="enableEdit" className="pt-2 text-sm">
                          {editMode === "edit" ? "Edit " : null} Tracker Account
                        </label>
                      </div> */}

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
                            onChange={(e) => onChange(e)}
                            name="contact"
                            type="text"
                            placeholder="Enter Tracker Account Contact"
                            className="border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1"
                            value={station.contact?.trim()}
                          />
                        </div>
                        {/* <div className="flex-col w-full">
                          <label htmlFor="password" className="text-gray-500">
                            <div className="flex pr-2">
                              Password <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="password"
                            // onChange={(e) => onChange(e)}
                            name="password"
                            placeholder="Enter Tracker Account Password"
                            className="border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1"
                            // value={station.password?.trim()}
                          />
                          <div
                            className={`absolute buttom pt-7 pr-2 right-8 ${
                              editMode === "edit" ? "top-[17em]" : "top-[16em]"
                            }`}
                          ></div>
                        </div> */}
                      </div>
                      {/* ttt */}
                      {/* <div
                        className={`flex mt-4 space-x-4 w-full ${
                          editMode === "edit" && enabledEdit === false
                            ? "hidden"
                            : "visible"
                        }`}
                      >
                        <div className="flex-col w-full">
                          <label htmlFor="appkey" className="text-gray-500">
                            <div className="flex">
                              App Key <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="appkey"
                            onChange={(e) => onChange(e)}
                            name="appkey"
                            type="text"
                            placeholder="Enter Tracker Account App Key"
                            className="border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1"
                            value={station.appkey?.trim()}
                          />
                        </div>
                        <div className="flex-col w-full">
                          <label htmlFor="appSecret" className="text-gray-500">
                            <div className="flex">
                              App Secret <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="appSecret"
                            onChange={(e) => onChange(e)}
                            name="appSecret"
                            type="text"
                            placeholder="Enter Tracker Account App Secret"
                            className="border-2 p-2 text-gray-600 rounded-md shadow-sm w-full mt-1"
                            value={station.appSecret?.trim()}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="bg-gray-100 p-2 flex justify-end">
                    <div className="space-x-4">
                      <button
                        onClick={
                          editMode === "add" ? createStation : updateStation
                        }
                        type="button"
                        disabled={errors.length !== 0 || loading === true}
                        className={
                          errors.length !== 0 || loading === true
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
                      Do you want to delete this Class..!
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
export default TClass;
