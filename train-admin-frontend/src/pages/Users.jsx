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

const Users = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   const navigate = useNavigate();
  const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [idDelete, setDeleteId] = useState();
  const [editMode, setEditMode] = useState("edit");
  const [openModal, setOpenModal] = useState(false);
  const [station, setStation] = useState({
    // name: "",
    // address: "",
    // lat: 0,
    // lng: 0,
    // contact: "",

    name: "",
    email: "",
    username: "",
    password: "",
    roleIds: ""
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

  const loadAllUserData = async () => {
    const res = await request(`user/getuser`, GET);
    if (!res.error) {
      setRows(res);
      console.log(res)
    }
    // else navigate("/page/unauthorized/access");
  };

  const reload = () => {
    setRows([]);
    loadAllUserData();
  };

  useEffect(() => {
    loadAllUserData();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    // setEnabledEdit(false);
    setLoading(false);
    setStation({
      // name: "",
      // address: "",
      // lat: 0,
      // lng: 0,
      // contact: "",

      name: "",
      email: "",
      username: "",
      password: "",
      roleIds: ""
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
    const res = await request(`user/delete`, PATCH, {
      delete: true,
      id,
    });
    if (!res.error) {
      toast.success("Delete user successfully..!");
      setOpenModalDeleteConfirm(false);

      reload();
    } else {
      toast.error("Unable to delete user...!");
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
    console.log(e.target.name)
    console.log(e.target.value)
    setStation((state) => ({
      ...state,
      // [e.target.name]: e.target.value.trim(),
      [e.target.name]: setStateValue(e),
    }));
  };

  const setStateValue = (e) => {
    if (e.target.name === "roleIds") {
      return new Array(e.target.value.trim())
    }
    return e.target.value.trim()
  };

  const createUser = async () => {
    console.log(station)

    setLoading(true);
    const res = await request("user/create", POST, {
      ...station,
    });
    if (!res.error) {
      toast.success("Create user successfully..!");
      handleCloseModal();
      setLoading(false);
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
      console.log(res);
    }

    // Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_KEY);
    // Geocode.setLanguage("en");
    // Geocode.setLocationType("ROOFTOP");
    // setLoading(true);

    // Geocode.fromAddress(station.address).then(
    //   async (response) => {
    //     if (errors.length === 0) {
    //       const { lat, lng } = response.results[0].geometry.location;

    //       const res = await request("station/create", POST, {
    //         ...station,
    //         lat,
    //         lng,
    //       });
    //       if (!res.error) {
    //         toast.success("Create station successfully..!");
    //         handleCloseModal();
    //         setLoading(false);
    //       } else {
    //         toast.error(res.error.response.data);
    //         setLoading(false);
    //         // console.log(res);
    //       }
    //     } else {
    //       toast.error("Required field cannot be empty");
    //     }
    //   },
    //   (error) => {
    //     toast.error("Plese enter valid address");
    //     setLoading(false);

    //     // eslint-disable-next-line no-console
    //     console.error(error);
    //   }
    // );

  };

  const updateStation = async () => {
    console.log(station)
    const res = await request(`user/update/${station.id}`, PUT, {
      ...station, 
      roleIds: station.roleIds.map(role => role.id)
    });
    if (!res.error) {
      toast.success("Update user successfully..!");
      handleCloseModal();
      setLoading(false);
      reload();
    } else {
      toast.error(res.error.response.data);
      setLoading(false);
      console.log(res)
    }
  };

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Users</h2>
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
                    Full Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    Email Address
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#D1F1F9",
                      fontSize: ".8em",
                      fontWeight: 800,
                      paddingY: ".5em",
                    }}
                  >
                    User Role
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
                      {row.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                    >
                      {row.username}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                      {row.roleIds[0].name}
                    </TableCell>

                    {/* <TableCell
                      sx={{
                        fontSize: ".7em",
                        color: "#d3d3dd3",
                        paddingY: ".5em",
                      }}
                      align="center"
                    >
                    </TableCell> */}

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
                        {editMode === "add" ? "Add" : "Edit"} User
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

                    {/* ----------------------------------------------- */}

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
                            name="name"
                            type="text"
                            onChange={(e) => onChange(e)}
                            placeholder="Enter Full Name"
                            className={
                              "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                              (errors.name
                                ? "ring-1 ring-red-500"
                                : "")
                            }
                            value={station.name}
                          />
                          <div className="text-red-500">
                            {errors.name}
                          </div>
                        </div>

                        <div className="flex flex-col w-full">
                          <label htmlFor="name" className="text-gray-500">
                            <div className="flex">
                              Email Address {" "}
                              <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="email"
                            onChange={(e) => onChange(e)}
                            name="email"
                            type="email"
                            placeholder="Enter Email Address"
                            className={
                              "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                              (errors.email
                                ? "ring-1 ring-red-500"
                                : "")
                            }
                            value={station.email}
                          />
                        </div>
                      </div>
                  
                      {/* --------------------------------------------------- */}

                      <div className="flex mt-4 space-x-4 w-full ">
                        <div className="flex flex-col w-full">
                          <label htmlFor="name" className="text-gray-500">
                            <div className="flex">
                              Username{" "}
                              <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <input
                            id="username"
                            onChange={(e) => onChange(e)}
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            className="border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm"
                            value={station.username}
                          />
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
                            onChange={(e) => onChange(e)}
                            placeholder="Enter Password"
                            className={
                              "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                              (errors.password
                                ? "ring-1 ring-red-500"
                                : "")
                            }
                            value={station.password}
                          />
                          <div className="text-red-500">
                            {errors.password}
                          </div>
                        </div>
                      </div>

                      {/* --------------------------------------------------- */}

                      <div className="flex mt-4 space-x-4 w-full ">
                        <div className="flex flex-col w-full">
                          <label htmlFor="name" className="text-gray-500">
                            <div className="flex">
                              User Role <span className="text-red-500">*</span>
                            </div>
                          </label>
                          <select
                          id="roleSelect"
                          //!
                          //! Fix this....
                          //!
                          value={station.roleIds}
                          onChange={(e) => onChange(e)}
                          name="roleIds"
                          className={
                            "border-2 p-2 mt-1 text-gray-600 rounded-md shadow-sm " +
                            (errors.roleIds
                              ? "ring-1 ring-red-500"
                              : "")
                          }
                          >
                            <option value="04007fb2-2b88-4f40-b1a9-5e5f88f205ea">Super Admin</option>
                            <option value="04007fb2-2b88-4f40-b1a9-5e5f88f205ec">Station master</option>
                          </select>
                          <div className="text-red-500">
                            {errors.roleIds}
                          </div>
                        </div>
                      </div>
                    </div>                     
                  </div>
                  <div className="bg-gray-100 p-2 flex justify-end">
                    <div className="space-x-4">
                      <button
                        onClick={
                          editMode === "add" ? createUser : updateStation
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
                      Do you want to delete this User..!
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
export default Users;
