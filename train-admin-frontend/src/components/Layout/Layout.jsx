import React from "react";
// import Router from "../../routes/Router";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../TopNav/TopNav";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
