import { Link } from "react-router-dom";
import * as Yup from "Yup";
import { useFormik } from "formik";

const initialValues = {
  name: "",
  dob: "",
  email: "",
  otp: "",
};

const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name must be at least 2 characters")
    .max(15, "Max 15 characters allowed"),
  dob: Yup.string().required("Please enter your DOB"),
  email: Yup.string().required("Please enter your email"),
  otp: Yup.number().required("Please endter the OTP"),
});

const SignUpForm = () => {
  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      formik.resetForm();
      console.log("Form values", values);
    },
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center w-full gap-2 md:justify-start">
        <img src="small_icon.svg" alt="icon" className="" />
        <h1 className="text-2xl ">HD</h1>
      </div>
      <div className="flex flex-col items-center w-full h-full sm:max-w-md sm:justify-center">
        <div className="justify-center w-full p-5 text-center md:text-start">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <span className="text-xs text-slate-400 ">
            Sign up to enjoy the feature of HD
          </span>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-1 w-[80%]">
          <div className="flex flex-col">
            <label className="text-xs text-gray-700 sm:text-base">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="px-4 py-2 border rounded-md"
            />
            <p className="h-4 text-xs text-red-500 sm:h-7 sm:text-base">
              {formik.errors.name && formik.touched.name
                ? formik.errors.name
                : null}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-700 sm:text-base">
              Date Of Birth
            </label>
            <input
              type="text"
              name="dob"
              id="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              className="px-4 py-2 border rounded-md"
            />
            <p className="h-4 text-xs text-red-500 sm:h-7 sm:text-base">
              {formik.errors.dob && formik.touched.dob
                ? formik.errors.dob
                : null}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-700 sm:text-base">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="px-4 py-2 border rounded-md"
            />
            <p className="h-4 text-xs text-red-500 sm:h-7 sm:text-base">
              {formik.errors.email && formik.touched.email
                ? formik.errors.email
                : null}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-700 sm:text-base">OTP</label>
            <input
              type="password"
              name="otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              className="px-4 py-2 border rounded-md"
            />
            <p className="h-4 text-xs text-red-500 sm:h-7 sm:text-base">
              {formik.errors.otp && formik.touched.otp
                ? formik.errors.otp
                : null}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-xs font-bold text-white bg-blue-500 rounded-md sm:text-base hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <p className="p-5 text-xs text-center sm:text-base text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
