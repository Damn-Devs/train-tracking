import React, { useEffect, useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { Container } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../../redux/features/authSlice";
import "../../styles/header.css";
import { AccessAlarm, AccessTime } from "@mui/icons-material";

const navLinks = [
  {
    path: "/home",
    display: "Home",
    safe: false,
  },
  {
    path: "/about",
    display: "About",
    safe: false,
  },
  {
    path: "/activities",
    display: "You're Activities",
    safe: true,
  },

  {
    path: "/blogs",
    display: "Blog",
    safe: false,
  },
  {
    path: "/contact",
    display: "Contact",
    safe: false,
  },
];
var stompClient = null;
const Header = () => {
  const menuRef = useRef(null);
  const token = localStorage.getItem("token");
  const [notification, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchor = "right";
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const open = Boolean(anchorEl);
  const authUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    dispatch(logOut());
    localStorage.clear();
    navigate("/login");
  };

  const profile = () => {
    handleClose();
    navigate("/profile");
  };

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const connect = () => {
    let Sock = new SockJS(`http://localhost:39388/tracker/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, () => {
      console.error("fail");
    });
  };

  const onConnected = () => {
    stompClient.subscribe(`/specific/${authUser?.username}/notify`, onNotify);
  };

  const onNotify = (payload) => {
    const newNotifications = [...notification];
    console.log(payload.body);
    newNotifications.push(payload.body);
    setNotifications(newNotifications);
  };

  useEffect(() => {
    connect();
  }, []);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="w-100 bg-gray-400 text-white shadow-lg p-4 font-bold">
        Notifications
      </div>
      <div className="p-2">
        <List>
          {
            <>
              {notification.map((notify) => (
                <ListItem
                  className="bg-orange-400 rounded-lg mt-2"
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <AccessAlarm />
                    </ListItemIcon>
                    <ListItemText className="text-gray-100" primary={notify} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          }
        </List>
      </div>
    </Box>
  );

  return (
    <>
      <header className="header">
        {/* ========== main navigation =========== */}

        <div className="main__navbar">
          <Container>
            <div className="navigation__wrapper d-flex align-items-center justify-content-between">
              <span className="mobile__menu">
                <i class="ri-menu-line" onClick={toggleMenu}></i>
              </span>

              <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <div className="menu">
                  {navLinks
                    .filter((item) => (token ? true : !item.safe))
                    .map((item, index) => (
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive
                            ? "nav__active nav__item"
                            : "nav__item"
                        }
                        key={index}
                      >
                        {item.display}
                      </NavLink>
                    ))}
                </div>
              </div>
              <div className="px-3 px-md-0 flex gap-4">
                {token ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <Badge
                        color="primary"
                        badgeContent={notification.length}
                        showZero
                      >
                        <IconButton
                          size="small"
                          sx={{ ml: 2 }}
                          onClick={toggleDrawer(anchor, true)}
                        >
                          <MailIcon sx={{ color: "white" }} />
                        </IconButton>
                      </Badge>
                      <Tooltip title="Account settings">
                        <IconButton
                          size="small"
                          sx={{ ml: 2 }}
                          onClick={handleClick}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {authUser.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={profile}>
                        <Avatar /> My account
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="nav__item">
                      Login
                    </NavLink>
                    <NavLink to="/register" className="nav__item">
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>
      </header>
      <SwipeableDrawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
      >
        {list(anchor)}
      </SwipeableDrawer>
    </>
  );
};

export default Header;
