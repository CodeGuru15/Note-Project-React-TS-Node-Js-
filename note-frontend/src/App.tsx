import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface myUser {
  name: string;
  email: string;
  dob: string;
  id: number;
  token: string;
}

const App = () => {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState<myUser>({
    name: "",
    email: "",
    dob: "",
    id: 0,
    token: "",
  });

  useEffect(() => {
    const storedObjectString: any = localStorage.getItem("loggedUser");
    const user = JSON.parse(storedObjectString);
    if (user != null) {
      navigate("/dashboard");
      setIsUser(user);
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<SignUp />}></Route>
      <Route path="/login" element={<SignIn />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
    </Routes>
  );
};

export default App;
