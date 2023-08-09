import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
// import Selltrain from "../pages/TrainRevenue";
import Station from "../pages/Station";
import PrivateRout from "../routes/PrivateRoute";
import Settings from "../pages/Settings";
import TrainRevenue from "../pages/TrainRevenue";
import Passengers from "../pages/Passengers";
import Users from "../pages/Users";
import Train from "../pages/Train";
import Delay from "../pages/Delay";
import Locate from "../pages/Locate";
import Ticket from "../pages/Ticket";
import Promo from "../pages/Promo";
import UpdateLocate from "../pages/UpdateLocate";
// import TClass from "../pages/TClass";
import Schedule from "../pages/Schedule";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/station" element={<Station />} />
          <Route path="/train" element={<Train />} />
          {/* <Route path="/class" element={<TClass />} /> */}
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/delay" element={<Delay />} />
          <Route path="/locater" element={<UpdateLocate />} />
          <Route path="/locate" element={<Locate />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/promo" element={<Promo />} />

          <Route path="/passengers" element={<Passengers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/sell-train" element={<TrainRevenue />} />
          <Route path="/sell-train/:slug" element={<TrainRevenue />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;
