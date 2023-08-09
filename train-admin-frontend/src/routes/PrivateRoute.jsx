import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
