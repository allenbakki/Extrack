import React, { useEffect, useState, useRef } from "react";
import { sentFriendReq, getFriends } from "../../apis/index";
import { useGlobalContext } from "../../context/GlobalContext";
import { useDashboardContext } from "../../context/DashboardContext";
import { FriendItems } from "../friends/friendsItem";

export default function Friends() {
  const { accessToken } = useGlobalContext();
  const { friends, setFriends } = useDashboardContext();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [displayError, setDisplayError] = useState(null);

  const formRef = useRef();

  useEffect(() => {
    async function getData() {
      try {
        const response = await getFriends(accessToken);
        console.log("response", response);
        setFriends(response);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }

    getData();
  }, [accessToken]);

  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setOpen(false);
      setDisplayError(null); // Reset the error when closing the form
    }
  };
  const sentFriendReqs = async (e) => {
    e.preventDefault();
    const response = await sentFriendReq(accessToken, email);
    if (response.error) {
      setDisplayError(response.error);
    } else {
      setEmail("");
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-filter backdrop-blur-md z-50">
          <div
            ref={formRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-white p-5 rounded-xl">
              <form
                onSubmit={sentFriendReqs}
                className="flex flex-col text-slate-900"
              >
                <label>Enter friend email</label>
                <div className="flex justify-center  gap-2">
                  <input
                    type="email"
                    className="border border-black rounded-xl w-[450px] p-1 pl-2 text-slate-900"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="border bg-green-500 hover:bg-green-400 transition ease-in hover:scale-95 w-20 rounded-xl"
                  >
                    Ok
                  </button>
                </div>
                <div>
                  {displayError && (
                    <p className="text-red-400 font-bold ml-3 mt-2">
                      {displayError}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="">
        {friends.length === 0 ? (
          <div>
            <div className="flex flex-row-reverse ml-5 p-3">
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setOpen(true)}
                  className=" transition ease-in border hover:-translate-y-1 hover:scale-95  rounded-lg hover:bg-cinder-600 p-3 font-medium  text-[12px]"
                >
                  Add Friend
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <p className="text-[18px] font-sans font-semibold ">
                No friends found!!!
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between p-3">
              <div className="font-sans font-semibold xl:text-xl 2xl:text-2xl ">
                Friends
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setOpen(true)}
                  className=" transition ease-in border hover:-translate-y-1 hover:scale-95  rounded-lg  hover:bg-cinder-600 px-4 p-2 font-medium  text-[12px]"
                >
                  Add Friend
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-2 mt-2 p-3">
              {friends.map((dataItem) => {
                const { displayName, email } = dataItem;
                console.log(dataItem);
                return (
                  <FriendItems
                    key={email}
                    name={displayName}
                    email={email}
                    status="friend"
                    friends={friends}
                    setFriends={setFriends}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
