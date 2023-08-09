import React from "react";
import Helmet from "../components/Helmet/Helmet";
import LoginForm from "../components/UI/LoginForm";
import "../styles/login.css";

const Login = () => {
  return (
    <Helmet title="Login">
      <div
        class="px-4 py-2 px-md-4 text-center text-lg-start min-vh-100 d-flex justify-content-center align-items-center find__trains-left"
        //style={{ background: "hsl(0, 0%, 96%)" }}
      >
        <div class=" rounded-4 px-md-4">
          <div class="row gx-lg-5 align-items-center">
            <div class="col-lg-8 mb-8 mb-lg-0">
              <h1 class="my-5 display-3 fw-bold ls-tight text-red-400">
                Rail Way <br />
                <span class="text-primary">Management System</span>
              </h1>
              <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                quibusdam tempora at cupiditate quis eum maiores libero
                veritatis? Dicta facilis sint aliquid ipsum atque?
              </p>
            </div>
            <div className="col">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default Login;
