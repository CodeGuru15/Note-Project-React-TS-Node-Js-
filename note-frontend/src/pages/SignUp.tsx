import SignUpForm from "../components/SignUpForm";

const SignUp = () => {
  return (
    <div className="flex flex-row justify-end w-screen h-screen p-5 overflow-hidden">
      <div className="flex justify-center grow">
        <SignUpForm />
      </div>

      <div className="hidden md:flex">
        <img src="pic.svg" alt="image" className="" />
      </div>
    </div>
  );
};

export default SignUp;
