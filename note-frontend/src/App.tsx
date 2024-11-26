import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/dashboard");
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
