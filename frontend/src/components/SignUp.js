import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { signUpCred } from "../apis/index";
import { useNavigate } from "react-router-dom";
import { SideHeader } from "./Login";
import { BsBarChart } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function SignUp({ active, setActive }) {
  const { updateUserDetails } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const Navigate = useNavigate();
  const [signUpDetails, setSignUpDetails] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = signUpDetails;

  const handleChange = (name) => (e) => {
    setSignUpDetails((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpCred(signUpDetails)
      .then((response) => {
        if (response.status === 200) {
          const newUserDetails = {
            isLogggedIn: true,
            ...response.data,
          };
          updateUserDetails(newUserDetails);
          Navigate("/dashboard");
        } else {
          setError("*" + response);
        }
      })
      .catch((error) => {
        console.log("An error occurred during SignUp:", error);
        setError(error);
      });
  };
  return (
    <div className=" flex h-screen w-full  justify-around ">
      <div className="hidden lg:block lg:w-1/2 ">
        <SideHeader />
      </div>
      <div className=" bg-slate-100 h-screen text-slate-900 flex flex-col items-center lg:w-1/2 w-full px-4">
        <div className="flex justify-center ">
          <BsBarChart
            size="15"
            width={50}
            className=" hover:text-slate-800 mt-1"
          />
          <div className="text-[16px]  font-Garamond ">Extrack</div>
        </div>
        <form onSubmit={handleSubmit} className="h-full max-w-[600px] w-full">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col gap-1 mb-2 justify-center  ">
              <div className="text-[40px]  font-Garamond  w-full flex justify-center ">
                Welcome
              </div>
              <div className="flex justify-center w-full text-[16px] text-slate-500 ">
                Complete the signup process to gain access to Extract.
              </div>
            </div>
            <div className="mt-10 w-full ">
              <div className="flex flex-col gap-1  justify-stretch">
                {error && (
                  <div className=" pb-[10px] flex w-full justify-center text-red-600">
                    {error}
                  </div>
                )}
                <label className="font-sans text-[16px]">Username</label>
                <input
                  required
                  type="text"
                  value={username}
                  className="  w-full rounded-lg p-2 bg-gray-50 outline-transparent "
                  placeholder="Enter your username"
                  onChange={handleChange("username")}
                />
                <label className="font-sans text-[16px]">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  className="  w-full rounded-lg p-2 bg-gray-50 outline-transparent	"
                  placeholder="Enter your email"
                  onChange={handleChange("email")}
                />
                <label className="font-sans text-[16px]">Password</label>
                <div className="flex items-center">
                  <input
                    required
                    type={open === false ? "password" : "text"}
                    value={password}
                    className=" w-full rounded-l-lg p-2 bg-gray-50 outline-transparent	"
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
              <div className="flex flex-row-reverse gap-2 justify-center mt-8 ">
                <button
                  type="submit"
                  className=" transition ease-in border hover:-translate-y-1 hover:scale-95 border-black rounded-lg bg-black hover:bg-slate-700 px-4 h-[40px] text-white text-[16px]"
                >
                  Sign up
                </button>
              </div>

              <div className="flex items-center justify-center mt-8 gap-1 text-[16px]">
                Already have an account !{" "}
                <button className="underline text-cyan-500 hover:text-cyan-600 text-[16px]">
                  <Link to="/signin"> Sign in </Link>
                </button>{" "}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
