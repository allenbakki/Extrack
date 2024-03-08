import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import Friends from "./friends/Friends";
import DashboardContent from "./DashboardContent";
import FriendReq from "./friends/FriendReq";
import GroupDisplay from "./groups/GroupDisplay";
import Expenses from "./expenses/Expenses";
import { BsBarChart } from "react-icons/bs";
import { MdOutlineDashboard } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { IoMdArrowDropup } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";

export default function SideNavbar() {
  const { signOut } = useGlobalContext();

  const [nav, setNav] = useState("dashboard");
  const [isOpen, SetIsOpen] = useState("true");
  const [open, setOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showData = () => {
    console.log("Rendering showData"); // Add this line for debugging

    switch (nav) {
      case "friends":
        return <Friends />;
      case "dashboard":
        return <DashboardContent />;
      case "friendsReq":
        return <FriendReq />;
      case "groups":
        return <GroupDisplay />;
      case "expenses":
        return <Expenses />;
      default:
        return <DashboardContent />;
    }
  };
  const containerRef = useRef(null);

  return (
    <div className="flex gap-0">
      <div
        className={`  ${
          isOpen
            ? "hidden"
            : "block bg-gradient-to-b from-slate-400 to-slate-500 "
        } transition delay-300 duration-300`}
      >
        <MdOutlineKeyboardDoubleArrowRight
          size="28"
          className="hover:scale-95 border-4 border-purple-100 rounded-b-lg "
          onClick={() => {
            SetIsOpen(true);
          }}
        />
      </div>
      <div
        className={`flex flex-col scale-100  border-r border-b-slate-100 w-[400px] h-screen   font-Sans-serif	 justify-between  ${
          isOpen ? "block" : "hidden transition-transform	duration-300 delay-5s"
        } `}
      >
        <div className="flex flex-col gap-8">
          <div className="border-b">
            <div className="p-4 pl-3">
              <div className="flex">
                <div className="fixed right-2 mt-2"></div>
                <div className="flex items-center gap-1 pl-6">
                  <BsBarChart size="29" width={50} color="" />
                  <div className=" text-2xl self-end font-Garamond   mt-3">
                    Extrack
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 p-8 pt-0 ">
            <ul className="text-xl flex flex-col gap-3 cursor-pointer">
              <li
                className="flex  gap-3 hover:scale-95  text-xl font-sans items-center"
                id="dashboard"
                onClick={() => setNav("dashboard")}
              >
                <MdOutlineDashboard size="20" />
                Dashboard
              </li>

              <li
                className=" flex gap-3   hover:scale-95 text-xl font-sans  items-center"
                id="groups"
                onClick={() => setNav("groups")}
              >
                <MdGroups size="20" />
                Groups
              </li>
              <div className="flex flex-col">
                <li
                  className=" flex gap-3  hover:scale-95 text-xl font-sans  items-center"
                  id="friends"
                  onClick={() => setOpen(!open)}
                >
                  <FaUserFriends size="20" />
                  Connections{" "}
                  {open ? (
                    <IoMdArrowDropup size="24" />
                  ) : (
                    <MdArrowDropDown size="24" />
                  )}
                </li>

                <div
                  ref={containerRef}
                  className={`bg-white flex  items-center ml-5 p-2 rounded-b-lg w-[150px] ${
                    open ? "block" : "hidden"
                  }`}
                >
                  <ul className="text-[12px] text-black font-semibold ">
                    <li
                      onClick={() => setNav("friends")}
                      className={`border-b border-gray-200 w-[130px] ${
                        nav === "friends"
                          ? " border bg-gray-200 rounded-lg pl-1 w-[130px]  "
                          : ""
                      }`}
                    >
                      Friends
                    </li>
                    <li
                      onClick={() => setNav("friendsReq")}
                      className={` ${
                        nav === "friendsReq"
                          ? " border bg-gray-200 rounded-lg pl-1 w-[130px]  "
                          : ""
                      }`}
                    >
                      Friend Request
                    </li>
                  </ul>
                </div>
              </div>

              {/* <li
                className=" flex gap-5  hover:scale-95 text-[22px] items-center"
                id="friendsReq"
                onClick={() => setNav("friendsReq")}
              >
                <FaUserFriends size="28" />
                FRIENDS REQ
              </li> */}
            </ul>
          </div>
        </div>
        <div
          onClick={signOut}
          className="flex  gap-3  text-xl font-sans  p-8 hover:scale-95 cursor-pointer items-center"
        >
          <IoIosLogOut size="20" />
          Log Out
        </div>
      </div>
      <div className="relative   overflow-auto  h-screen w-full p-5">
        <div className={` ${isOpen ? "pl-0" : "pl-42"}`}>{showData()}</div>
      </div>
    </div>
  );
}
