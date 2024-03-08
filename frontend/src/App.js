import "./App.css";
import React, { useState } from "react";
import { useGlobalContext } from "./context/GlobalContext";
import Dashboard from "./components/Dashboard";
import Login from "../src/components/Login";
import SignUp from "../src/components/SignUp";
import LandingPage from "./LandingPage";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

function App() {
  const { isLogggedIn } = useGlobalContext();

  return (
    <div className="bg-cinder-500 text-slate-100">
      <BrowserRouter>
        <Routes>
          {!isLogggedIn && <Route path="/" element={<LandingPage />} />}
          {!isLogggedIn && <Route path="/signin" element={<Login />} />}
          {!isLogggedIn && <Route path="/signup" element={<SignUp />} />}
          {isLogggedIn && <Route path="/" element={<Dashboard />} exact />}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
