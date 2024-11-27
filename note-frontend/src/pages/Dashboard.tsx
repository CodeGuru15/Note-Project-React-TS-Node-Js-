import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";

interface myUser {
  id: number;
  name: string;
  email: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNote, setIsNote] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loggedUser, setLoggedUser] = useState<myUser>({
    id: 0,
    name: "",
    email: "",
  });
  const [isLogged, setIsLogged] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignOut = () => {
    setIsLogged(false);
    localStorage.clear();
    setLoggedUser({
      id: 0,
      name: "",
      email: "",
    });
  };

  const handleSubmitNote = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/addnote`,
          { user_id: loggedUser.id, title: newNote },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.data.success) {
          setSuccessMsg(res.data.message);
        } else {
          setErrorMsg(res.data.message);
        }
      } catch (error) {
        setErrorMsg("Something Went Wrong");
        console.error(error);
      }
    }

    setIsNote(false);
    setNewNote("");
  };

  const getUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/getuser`,
          null,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (res.data.success) {
          if (res.data.user === null) {
            handleSignOut();
          } else {
            // console.log(res.data.user);
            setIsLogged(true);
            setLoggedUser(res.data.user);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Access Denied");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getUser();
    } else {
      navigate("/login");
    }
  }, [isLogged]);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
  }, [successMsg, errorMsg]);

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
            <h1 className="font-bold sm:text-2xl ">
              Welcome, <span>{loggedUser.name.toUpperCase()}!</span>
            </h1>
            <p className="py-2">
              Email: <span>{loggedUser.email}</span>
            </p>
          </div>
          {isNote ? (
            <div className="flex gap-2 pt-5 text-xs sm:text-base">
              <input
                type="text"
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="block w-full px-4 py-2 border-2 rounded-md border-slate-300 focus:placeholder:invisible group/email focus:outline-blue-500"
              />
              <button
                onClick={handleSubmitNote}
                className="px-3 font-semibold text-center text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
              >
                ADD
              </button>
              <button
                onClick={() => {
                  setIsNote(false);
                  setNewNote("");
                }}
                className="px-2 font-semibold text-center text-blue-500 border-2 rounded-full sm:px-3 sm:text-base hover:border-blue-500"
              >
                <RxCross1 />
              </button>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setIsNote(true)}
                className=" w-[80%] sm:w-[60%] md:w-[30%] py-4 mt-5 font-semibold text-center text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
              >
                Create Note
              </button>
            </div>
          )}
          <div className="mt-5 text-center h-7">
            <p className="font-semibold text-green-700">
              {successMsg != "" ? successMsg : null}
            </p>
            <p className="font-semibold text-red-600">
              {errorMsg != "" ? errorMsg : null}
            </p>
          </div>

          <div className="w-full">
            <p className="text-xl font-semibold">Notes</p>
          </div>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default Dashboard;
