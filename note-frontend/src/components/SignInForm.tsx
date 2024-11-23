import { Link } from "react-router-dom";
import * as Yup from "Yup";
import { useFormik } from "formik";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

const initialValues = {
  email: "",
  otp: "",
};

const signUpSchema = Yup.object().shape({
  email: Yup.string().required("Please enter your email"),
  otp: Yup.string().required("Please enter the OTP"),
});

const SignInForm = () => {
  const [showOtp, setShowOtp] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      formik.resetForm();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        values
      );
      console.log(res.data);
    },
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center w-full gap-2 pt-5 md:pt-0 md:justify-start">
        <img src="small_icon.svg" alt="icon" className="" />
        <h1 className="text-2xl ">HD</h1>
      </div>
      <div className="flex flex-col items-center w-full h-full sm:max-w-md sm:justify-center">
        <div className="justify-center w-full p-5 pl-10 text-center md:text-start">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <span className="text-xs text-slate-400 ">
            Please login to continue to your account
          </span>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-1 w-[80%]">
          <div className=" group/email">
            <label className="absolute px-1 translate-x-3 -translate-y-3 bg-white text-slate-400 group-focus-within/email:text-blue-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="block w-full px-4 py-2 border-2 rounded-md focus:placeholder:invisible group/email focus:outline-blue-500"
            />
            <p className="h-4 text-xs text-red-500 sm:h-7 sm:text-base">
              {formik.errors.email && formik.touched.email
                ? formik.errors.email
                : null}
            </p>
          </div>
          <div className="">
            <div className="flex items-center justify-between w-full border-2 rounded-md focus-within:border-blue-500 focus-within:border-2">
              <input
                type={showOtp ? "text" : "password"}
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 rounded-md outline-none focus:placeholder:invisible"
                placeholder="OTP"
              />

              <span
                onClick={() => setShowOtp(!showOtp)}
                className="px-2 cursor-pointer text-slate-400"
              >
                {showOtp ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            <p className="h-4 text-xs text-red-500 sm:h-7 sm:text-base">
              {formik.errors.otp && formik.touched.otp
                ? formik.errors.otp
                : null}
            </p>
          </div>
          <Link to="" className="text-xs text-blue-500 underline">
            Forgot Password ?
          </Link>
          <div className="flex gap-2 pb-2 text-xs">
            <input type="checkbox" name="" id="" />
            <span>Keep me logged in</span>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-xs font-bold text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
          >
            Sign in
          </button>
        </form>
        <p className="p-5 text-xs text-center sm:text-base text-slate-400">
          Need an account?{" "}
          <Link to="/" className="text-blue-500 underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
