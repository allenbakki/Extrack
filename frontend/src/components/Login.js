import React, { useState } from "react";
import { loginCred } from "../apis/index";
import { useGlobalContext } from "../context/GlobalContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { BsBarChart } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";

export default function Login({ active, setActive }) {
  const { updateUserDetails } = useGlobalContext();
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [loginDetails, setLoginDetails] = useState({
    email: "reshma2001d@gmail.com",
    password: "reshma@1412",
  });

  const { email, password } = loginDetails;
  const handleChange = (name) => (e) => {
    setLoginDetails((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    loginCred(loginDetails)
      .then((response) => {
        if (response.status === 200) {
          const newUserDetails = {
            isLogggedIn: true,
            ...response.data,
          };
          updateUserDetails(newUserDetails);
          history("/dashboard");
          return <Navigate to="/dashboard" />;
        } else {
          setError("*Invalid Credentials");
        }
      })
      .catch((error) => {
        console.error("An error occurred during login:", error);
        setError("*Invalid Credentials");
      });
  };
  return (
    <div className="flex h-screen w-full  justify-around">
      <div className="hidden lg:block lg:w-1/2">
        <SideHeader />
      </div>
      <div className=" h-screen  flex flex-col items-center lg:w-1/2 bg-slate-100 text-slate-900 w-full px-4">
        <div className="flex justify-center ">
          <BsBarChart
            size="15"
            width={50}
            className="text-slate-950 hover:text-slate-800 mt-1"
          />
          <div className="text-[16px] text-slate-900 font-Garamond ">
            Extrack
          </div>
        </div>
        <form onSubmit={handleSubmit} className="h-full w-full max-w-[600px]">
          <div className="flex flex-col items-center justify-center h-full ">
            <div className="flex flex-col gap-1 mb-2 md:justify-center w-full ">
              <div className="text-[40px]  font-Garamond text-slate-900  flex justify-center">
                Welcome Back
              </div>
              <div className="flex justify-center w-full text-[16px] text-slate-500 ">
                Enter your email and password to access your account.
              </div>
            </div>
            <div className="mt-10 flex flex-col justify-center items-center w-full ">
              <div className="flex flex-col gap-1 w-full">
                {error && (
                  <div className="flex justify-center text-red-600">
                    {error}
                  </div>
                )}
                <label className="font-sans text-[16px]">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  className=" w-full rounded-lg p-2 bg-gray-50 outline-transparent	"
                  placeholder="Enter your email"
                  onChange={handleChange("email")}
                />
                <label className="font-sans text-[16px]">Password</label>
                <div className="flex items-center">
                  <input
                    required
                    type={open === false ? "password" : "text"}
                    value={password}
                    className=" max-w-[570px] w-full rounded-l-lg p-2 bg-gray-50 outline-transparent	"
                    placeholder="Enter your password"
                    onChange={handleChange("password")}
                  />

                  <div
                    className="bg-gray-50 p-3 rounded-r-lg "
                    onClick={() => {
                      setOpen(!open);
                    }}
                  >
                    {open ? (
                      <IoEyeOutline className="hover:scale-110" />
                    ) : (
                      <IoEyeSharp className="hover:scale-110" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8  ">
                <button
                  type="submit"
                  className=" transition ease-in border hover:-translate-y-1 hover:scale-95 border-black rounded-lg bg-black hover:bg-slate-700 px-4 h-[40px] text-white text-[16px]"
                >
                  Sign In
                </button>
              </div>

              <div className="flex justify-center items-center gap-1 text-[16px] mt-8">
                <button className="underline text-cyan-500 hover:text-cyan-600 text-[16px]">
                  <Link to="/signup"> Click here </Link>
                </button>{" "}
                to Register!
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SideHeader() {
  return (
    <div>
      <div className=" h-screen flex flex-col items-center justify-center">
        <div>
          <h1 className="xl:text-7xl md:text-5xl font-Garamond font-medium">
            Save money,
            <br />
            without thinking
            <br />
            about it.
          </h1>
          <div className="mt-2 text-white text-[16px]">
            <p className="w-[300px]">Extrack analyses your spending and</p>
            <p className="">
              automatically saves the perfect amount every day.
            </p>
            <p className="w-[300px]">so you don't have to think about it</p>
          </div>
        </div>
      </div>
    </div>
  );
}
