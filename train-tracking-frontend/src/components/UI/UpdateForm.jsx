import React, { useState, useEffect } from "react";
import { request, PUT, GET } from "../../api/ApiAdapter";
import { selectCurrentUser } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const UpdateForm = () => {
  const authUser = useSelector(selectCurrentUser);
  const userSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    nic: Yup.string().required(),
    contact: Yup.number().required(),
    username: Yup.string().required(),
    password: Yup.string().required(),
  });
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    nic: "",
    contact: "",
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setUser((state) => ({
      ...state,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const getAllShuttles = async (e) => {
    console.log(e);
    const res = await request(`/passenger/get?passengerId=${e}`, GET);
    if (!res.error) {
      setValues({
        id: res?.id,
        name: res?.name,
        email: res?.email,
        nic: res?.nic,
        contact: res?.contact,
        username: res?.username,
        password: res?.password,
      });
    } else {
      console.log(res);
      // toast.error('Unable to load shuttle data..!');
    }
  };

  const updateAccount = async () => {
    const res = await request(`/passenger/update/${user.id}`, PUT, {
      ...values,
    });
    if (!res.error) {
      toast.success("Successfully update account");
      // toast.success("Updated");
      handleCloseModal();
    } else {
      // toast.error(res.error.response.data);
    }
  };

  // useEffect(() => {
  //   const newErrors = [];
  //   if (user.name === "") {
  //     newErrors.push({ label: "user.name", value: "Required" });
  //   }
  //   if (user.email === "") {
  //     newErrors.push({ label: "user.email", value: "Required" });
  //   }
  //   if (user.contact === "") {
  //     newErrors.push({ label: "user.contact", value: "Required" });
  //   }
  //   if (user.username === "") {
  //     newErrors.push({ label: "user.username", value: "Required" });
  //   }
  //   setErrors([...newErrors]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  useEffect(() => {
    getAllShuttles(authUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    resetForm,
    setValues,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: user,
    validationSchema: userSchema,
    onSubmit: updateAccount,
  });

  return (
    <div class="mb-4 mb-lg-0 w-100">
      <div class="card">
        <div class="card-body py-5 px-md-5">
          <h1 className="mb-4">Edit your account</h1>
          <form action="">
            <div className="md:flex md:justify-between md:gap-4">
              <div class="mb-3 w-full">
                <label for="exampleInputEmail1" class="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="name"
                  name="name"
                  aria-describedby="emailHelp"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500">
                  {errors.name && touched.name && errors.name}
                </div>
              </div>
              <div class="mb-3 w-full">
                <label for="exampleInputEmail1" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control form-control-sm"
                  id="email"
                  name="email"
                  aria-describedby="emailHelp"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500">
                  {errors.email && touched.email && errors.email}
                </div>
              </div>
            </div>
            <div className="md:flex md:justify-between md:gap-4">
              <div class="mb-3 w-full">
                <label
                  for="exampleInputEmail1"
                  class="form-label form-label-sm"
                >
                  NIC
                </label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="nic"
                  name="nic"
                  aria-describedby="emailHelp"
                  value={values.nic}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500">
                  {errors.nic && touched.nic && errors.nic}
                </div>
              </div>
              <div class="mb-3 w-full">
                <label
                  for="exampleInputEmail1"
                  class="form-label form-label-sm"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="contact"
                  name="contact"
                  aria-describedby="emailHelp"
                  value={values.contact}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500">
                  {errors.contact && touched.contact && errors.contact}
                </div>
              </div>
            </div>
            <div className="md:flex md:justify-between md:gap-4">
              <div class="mb-3 w-full">
                <label for="exampleInputEmail1" class="form-label">
                  Username
                </label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="username"
                  name="username"
                  aria-describedby="emailHelp"
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500">
                  {errors.username && touched.username && errors.username}
                </div>
              </div>
              <div class="mb-3 w-full">
                <label for="exampleInputEmail1" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control form-control-sm"
                  id="password"
                  name="password"
                  aria-describedby="emailHelp"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500">
                  {errors.password && touched.password && errors.password}
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              type="button"
              className={
                "bg-blue-500 p-2 text-white text-xs w-20 rounded-md shadow-md"
              }
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
