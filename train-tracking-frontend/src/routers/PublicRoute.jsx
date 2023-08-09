import React from "react";
import Layout from "../components/Layout/Layout";
import { Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const location = useLocation();
  return location.pathname !== "/login" && location.pathname !== "/register" ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
