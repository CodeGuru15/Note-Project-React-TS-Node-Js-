import { Link } from "react-router-dom";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [useremail, setUserEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleOtpRequest = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signinotp`,
        { email: useremail }
      );
      if (res.data.success) {
        setIsSuccess(true);
        setIsError(false);
        setTimeout(() => {
          setSuccessMsg(res.data.message);
        }, 1500);
      }
      if (!res.data.success) {
        setErrorMsg(res.data.message);
      }
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
      console.log(error);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleLogin = async () => {
    if (userOtp.length != 4) {
      setErrorMsg("Please enter a valid OTP");
      setUserOtp("");
    } else {
      setIsLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/login/${userOtp}`,
          { email: useremail }
        );
        if (res.data.success) {
          localStorage.setItem("accessToken", res.data.accessToken);

          setTimeout(() => {
            setUserEmail("");
            setUserOtp("");
            setIsSuccess(false);
            setSuccessMsg(res.data.message);
            setErrorMsg("");
            setIsLoading(false);
            navigate("/dashboard");
          }, 2000);
        }
        if (!res.data.success) {
          setTimeout(() => {
            setErrorMsg("Wrong OTP");
            setUserOtp("");
            setIsLoading(false);
          }, 1000);
        }
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
      <div className="mt-5 text-center h-7">
        <p className="font-semibold text-green-700">
          {successMsg != "" ? successMsg : null}
        </p>
        <p className="font-semibold text-red-600">
          {errorMsg != "" ? errorMsg : null}
        </p>
      </div>
      <div className="flex flex-col items-center w-full h-full gap-2 sm:max-w-md sm:justify-center">
        <div className="justify-center w-full p-5 pl-10 text-center md:text-start">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <span className="text-xs text-slate-400 ">
            Please login to continue to your account
          </span>
        </div>

        <form onSubmit={handleOtpRequest} className="space-y-5 w-[80%]">
          <div className=" group/email">
            <label className="absolute px-1 translate-x-3 -translate-y-3 bg-white text-slate-400 group-focus-within/email:text-blue-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={useremail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="block w-full px-4 py-2 border-2 rounded-md focus:placeholder:invisible group/email focus:outline-blue-500"
            />
          </div>

          {!isLoading && isSuccess ? (
            <div className="flex items-center justify-between w-full border-2 rounded-md focus-within:border-blue-500 focus-within:border-2">
              <input
                type={showOtp ? "text" : "password"}
                name="otp"
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
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
          ) : null}

          <Link to="" className="text-xs text-blue-500 underline">
            Forgot Password ?
          </Link>
          <div className="flex gap-2 pb-2 text-xs">
            <input type="checkbox" name="" id="" />
            <span>Keep me logged in</span>
          </div>
          {isLoading && !isError ? (
            <div className="flex justify-center w-full py-4 rounded-xl">
              <Loader />
            </div>
          ) : null}
          {!isLoading && isSuccess ? (
            <div
              onClick={handleLogin}
              className="w-full py-4 text-xs font-bold text-center text-white bg-blue-500 cursor-pointer rounded-xl sm:text-base hover:bg-blue-600"
            >
              Submit OTP
            </div>
          ) : null}
          {!isLoading && !isSuccess ? (
            <button
              type="submit"
              className="w-full py-4 text-xs font-bold text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
            >
              Sign in
            </button>
          ) : null}
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
