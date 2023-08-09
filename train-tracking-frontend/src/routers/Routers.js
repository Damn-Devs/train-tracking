import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import TrainListing from "../pages/TrainListing";
import TrainDetails from "../pages/TrainDetails";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import Activities from "../pages/Activities";
import ViewMap from "../pages/VIewMap";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/viewMap" element={<ViewMap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            path="/trains/list/:clas/:st/:end/:count/:date"
            element={<TrainListing />}
          />
          <Route
            path="/trains/:slug/:cla/:star/:ende/:per/:cou/:shed"
            element={<TrainDetails />}
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;
