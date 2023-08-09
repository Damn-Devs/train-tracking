import React from "react";
import Layout from "../components/Layout/Layout";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  return token ? (
    location.pathname !== "/login" && location.pathname !== "/register" ? (
      <Layout>
        <Outlet />
      </Layout>
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
