import { Link } from "react-router-dom";
import * as Yup from "Yup";
import { useFormik } from "formik";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const initialValues = {
  name: "",
  email: "",
};

const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name must be at least 2 characters")
    .max(15, "Max 15 characters allowed"),
  email: Yup.string().required("Please enter your email"),
});

const SignUpForm = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [newUser, setNewUser] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      values.dob = selectedDate;
      // console.log(values);
      setNewUser(values);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/otprequest`,
          values
        );
        if (res.data.success) {
          setIsSuccess(true);
          setIsError(false);
          setSuccessMsg(res.data.message);
        }
        if (!res.data.success) {
          setErrorMsg(res.data.message);
        }
        console.log(res.data);
      } catch (error) {
        setIsSuccess(false);
        setIsError(true);
        console.log(error);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    },
  });

  const handleRegistration = async () => {
    if (otp.length != 4) {
      setErrorMsg("Please enter a valid OTP");
      setOtp("");
    } else {
      setIsLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/register/${otp}`,
          newUser
        );
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);

          setTimeout(() => {
            formik.resetForm();
            setSelectedDate(new Date());
            setNewUser({});
            setOtp("");
            setIsSuccess(false);
            setSuccessMsg(res.data.message);
            setErrorMsg("");
            setIsLoading(false);
            navigate("/dashboard");
          }, 2000);
        }
        console.log(res.data);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setIsLoading(false);
          setIsError(true);
          setErrorMsg("Something went wrong");
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
  }, [successMsg, errorMsg]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center w-full gap-2 pt-5 md:pt-0 md:justify-start">
        <img src="small_icon.svg" alt="icon" className="" />
        <h1 className="text-2xl ">HD</h1>
      </div>
      <div className="flex flex-col items-center w-full h-full sm:max-w-md sm:justify-center">
        <div className="justify-center w-full p-5 pl-10 text-center md:text-start">
          <div className="p-1 text-center h-7">
            <p className="font-semibold text-green-700">
              {successMsg != "" ? successMsg : null}
            </p>
            <p className="font-semibold text-red-600">
              {errorMsg != "" ? errorMsg : null}
            </p>
          </div>
          <h1 className="text-2xl font-bold">Sign up</h1>
          <span className="text-xs text-slate-400 ">
            Sign up to enjoy the feature of HD
          </span>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-1 w-[80%]">
          <div className="flex flex-col group/name">
            <label className="absolute px-1 translate-x-3 -translate-y-3 bg-white text-slate-400 group-focus-within/name:text-blue-500">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="px-4 py-2 border-2 rounded-md focus:outline-blue-500 "
            />
            <p className="text-xs text-red-500 h-7 sm:text-base">
              {formik.errors.name && formik.touched.name
                ? formik.errors.name
                : null}
            </p>
          </div>
          <div className="flex flex-col pb-4 group/dob">
            <label className="absolute px-1 translate-x-3 -translate-y-3 bg-white text-slate-400 group-focus-within/dob:text-blue-500">
              Date Of Birth
            </label>
            <div className="px-4 py-2 border-2 rounded-md focus-within:border-blue-500">
              <DatePicker
                showIcon
                toggleCalendarOnIconClick
                selected={selectedDate}
                onChange={(date: any) => setSelectedDate(date)}
                className="w-full outline-none"
                dateFormat="MMMM d, yyyy"
                required
              />
            </div>
          </div>
          <div className=" group/email">
            <label className="absolute px-1 translate-x-3 -translate-y-3 bg-white text-slate-400 group-focus-within/email:text-blue-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email.toLowerCase()}
              onChange={formik.handleChange}
              className="block w-full px-4 py-2 border-2 rounded-md focus:placeholder:invisible group/email focus:outline-blue-500"
            />
            <p className="text-xs text-red-500 h-7 sm:text-base">
              {formik.errors.email && formik.touched.email
                ? formik.errors.email
                : null}
            </p>
          </div>
          {isSuccess ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-between w-full border-2 rounded-md focus-within:border-blue-500 focus-within:border-2 ">
                <input
                  type={showOtp ? "text" : "password"}
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="w-full px-4 py-2 rounded-md outline-none focus:placeholder:invisible"
                />
                <span
                  onClick={() => setShowOtp(!showOtp)}
                  className="px-2 cursor-pointer text-slate-400"
                >
                  {showOtp ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex justify-center w-full py-4 rounded-xl">
              <Loader />
            </div>
          ) : null}

          {!isLoading && isSuccess ? (
            <div
              onClick={handleRegistration}
              className="w-full py-4 text-xs font-bold text-center text-white bg-blue-500 cursor-pointer rounded-xl sm:text-base hover:bg-blue-600"
            >
              Submit OTP
            </div>
          ) : null}
          {!isLoading && !isSuccess ? (
            <button
              type="submit"
              className="w-full py-4 text-xs font-bold text-center text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
            >
              Sign up
            </button>
          ) : null}
        </form>
        <p className="p-5 text-xs text-center sm:text-base text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
