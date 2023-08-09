import React from "react";
import Helmet from "../components/Helmet/Helmet";
import RegisterForm from "../components/UI/RegisterForm";

const Register = () => {
  return (
    <Helmet title="Login">
      <div class="px-4 py-2 px-md-4 text-center text-lg-start min-vh-100 d-flex justify-content-center align-items-center login__find__trains-left">
        <div class=" rounded-4 px-md-4">
          <div class="row gx-lg-5 align-items-center">
            <div class="col-lg-6 mb-6 mb-lg-0">
              <h1 class="my-5 display-3 fw-bold ls-tight text-red-400">
                The best offer <br />
                <span class="text-primary">for your business</span>
              </h1>
              <p
                className="hidden md:block"
                style={{ color: "hsl(217, 10%, 50.8%)" }}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                quibusdam tempora at cupiditate quis eum maiores libero
                veritatis? Dicta facilis sint aliquid ipsum atque?
              </p>
            </div>
            <div className="col">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default Register;
