import React, { Fragment } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <div>{children}</div>
      <Footer />
    </Fragment>
  );
};

export default Layout;
