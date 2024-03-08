import React from "react";
import { BsBarChart } from "react-icons/bs";
import LandingPageImg from "./components/changedFinalImg.png";
import { Link } from "react-router-dom";
import { MdOutlineSegment } from "react-icons/md";
import { FcMoneyTransfer } from "react-icons/fc";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <div className="hidden sm:block  ">
        <div className=" flex justify-evenly items-center  h-[calc(100vh-80px)] w-screen ">
          <div className="flex flex-col  ">
            <h1 className="text-7xl font-Garamond">Save money,</h1>
            <h1 className="text-7xl font-Garamond  ">without thinking</h1>
            <h1 className="text-7xl font-Garamond  ">about it.</h1>
            <div className="mt-2  text-[16px]">
              <p className="w-[300px]">Extrack analysis your spending and</p>
              <p className="">
                automatically saves the perfect amount every day.
              </p>
              <p className="w-[300px]">so you don't have to think about it</p>
            </div>
            <div className="mt-10">
              <button className="border border-cinder-700 bg-cinder-700 w-[150px] p-2 rounded-full items-center hover:scale-95 transition easein delay-100 duration-150 ">
                <Link to="/signup"> SIGN UP NOW</Link>
              </button>
            </div>
          </div>
          <div className=" ">
            <img
              src={LandingPageImg}
              alt="langingpageimg"
              className=" lg:h-[500px] md:h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <div className="h-20 border-b border-b-slate-200 hidden sm:block text-slate-200">
      <div className="flex   items-center h-full xl:px-36 lg:px-10  justify-between 2xl:px-72  bg-cinder-500 ">
        <div className="flex gap-2 ">
          <BsBarChart size="38" width={50} />
          <div className="text-4xl font-Garamond mt-1">Extrack</div>
        </div>

        <div className="flex gap-5 ">
          <button className="  border-cinder-700 items-center hover:scale-95 transition easein delay-100 duration-150">
            <Link to="/signin">Sign in</Link>
          </button>
          <button className="border bg-cinder-700  p-2 px-8  rounded-full items-center hover:scale-95 ">
            <Link to="/signup"> Sign up</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
