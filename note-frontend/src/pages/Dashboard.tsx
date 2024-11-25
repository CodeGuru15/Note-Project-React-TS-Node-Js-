import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface myUser {
  name: string;
  email: string;
  dob: string;
  id: number;
  token: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState<myUser>({
    name: "",
    email: "",
    dob: "",
    id: 0,
    token: "",
  });
  const [isLogged, setIsLogged] = useState(false);

  const handleSignOut = () => {
    setIsLogged(false);
    localStorage.clear();
    setLoggedUser({
      name: "",
      email: "",
      dob: "",
      id: 0,
      token: "",
    });
  };

  useEffect(() => {
    const user: any = localStorage.getItem("loggedUser");
    if (user != null) {
      setLoggedUser(JSON.parse(user));
      setIsLogged(true);
    } else {
      navigate("/login");
    }
  }, [isLogged]);
  return (
    <div className="flex flex-col items-center w-screen p-5">
      <div className="flex items-center justify-between w-full gap-2 pt-5 md:pt-0">
        <div className="flex gap-3">
          <img src="small_icon.svg" alt="icon" className="" />
          <h1 className="text-2xl ">Dashboard</h1>
        </div>
        {isLogged ? (
          <button
            onClick={handleSignOut}
            className="text-blue-500 underline underline-offset-2"
          >
            Sign Out
          </button>
        ) : null}
      </div>
      {isLogged ? (
        <>
          <div className="flex flex-col items-start w-[80%] sm:w-[60%] md:w-[40%] justify-center px-5 py-6 mt-10 border rounded-lg shadow-sm border-slate-300 shadow-slate-400">
            <h1 className="text-2xl font-bold ">
              Welcome, <span>{loggedUser.name}!</span>
            </h1>
            <p className="py-2">
              Email: <span>{loggedUser.email}</span>
            </p>
          </div>
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className=" w-[80%] sm:w-[60%] md:w-[30%] py-4 mt-5 font-semibold text-center text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
            >
              Create Note
            </button>
          </div>
          <div className="w-full mt-5">
            <p className="text-xl font-semibold">Notes</p>
          </div>
        </>
      ) : (
        <div>Unauthorized User</div>
      )}
    </div>
  );
};

export default Dashboard;
