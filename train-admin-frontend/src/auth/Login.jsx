import React, { useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setCredentials } from "../redux/features/authSlice";
import { POST, request } from "../api/ApiAdapter";
// import { toast } from 'react-toastify';
// import { useAuth } from "../context/authContext";

const Login = () => {
  // const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    // console.log("login");
    const result = await request("auth/login", POST, input);

    if (!result.error) {
      localStorage.setItem("token", result.token.toString());
      dispatch(setCredentials(result));
      if (result.roles.map((item) => item).includes("Super Admin")) {
        navigate("/dashboard");
      } else if (result.roles.map((item) => item).includes("Station Master")) {
        navigate("/locate");
      }
    } else {
      toast.error(result.error.response.data);
      if (result.error.response.status === 406) {
        toast.error("Please enter correct password");
      } else {
        toast.error(result.error.response.data.message);
      }
    }
  };

  console.log(localStorage.getItem("role"));

  const onChange = (e) => {
    setInput((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleEnterKeypress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  useEffect(() => {
    localStorage.setItem("activepage", "login");
  }, []);

  return (
    <div className="flex w-screen h-screen">
      <div className="signin-left flex justify-center items-center px-20">
        ttt
      </div>
      <div className="signin-right px-20 flex justify-center items-center">
        <div className="signin-login-content">
          <div className="signin-login-top">
            <div className="signin-user-icon mt-8">
              <Fa.FaUserCircle color="gray" size="5em" />
            </div>
            <div className="signin-login-heading mt-6">Shuttle Tracking</div>
            <div className="text-sm font-normal text-gray-600">
              Login To Your Account
            </div>
          </div>
          <div className="signin-login-body mt-6 px-10 space-y-4">
            <div className="signin-section flex flex-col">
              <label
                htmlFor="username"
                className="text-gray-600 text-sm mb-1 font-semibold select-none"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                onChange={(e) => onChange(e)}
                value={input.username}
                placeholder="Enter Username"
                type="text"
                className="bg-gray-100 px-4 py-2 rounded-lg shadow-md text-sm border-[1px] border-gray-300"
              />
            </div>
            <div className="signin-section relative flex flex-col">
              <label
                htmlFor="password"
                className="text-gray-600 text-sm mb-1 font-semibold select-none"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                value={input.password}
                onChange={(e) => onChange(e)}
                onKeyPress={(e) => handleEnterKeypress(e)}
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                className="bg-gray-100 px-4 py-2 rounded-lg shadow-md text-sm border-[1px] border-gray-300"
              />
              <div className="absolute buttom top-9 right-3">
                {showPassword ? (
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEyeSlash
                    className="cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => login()}
              className="px-10 py-2 bg-blue-600 text-white rounded-lg shadow-lg select-none"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
