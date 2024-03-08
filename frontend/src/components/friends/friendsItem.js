import React from "react";
import { addFriends, deleteFriendReq, deleteFriend } from "../../apis/index";
import { useGlobalContext } from "../../context/GlobalContext";
import { FaTrash } from "react-icons/fa";

export const FriendItems = ({ name, email, status, friends, setFriends }) => {
  const { accessToken } = useGlobalContext();

  const removeFriend = async () => {
    const response = await deleteFriend(accessToken, email);
    if (response.status === 200) {
      const updatedFriends = friends.filter((friend) => friend.email !== email);
      setFriends(updatedFriends);
    }
  };
  return (
    <div className=" flex border border-slate-200   p-6 h-14 rounded-lg justify-between  items-center">
      <div>
        <div className="font-semibold text-[16px]">
          {name ? name : "Username"}
        </div>
        <div className="text-[12px] font-semibold text-slate-900">{email}</div>
      </div>
      <div className="flex gap-1 ">
        {/* <div className="border bg-slate-700 w-[100px] p-1 rounded-lg  text-slate-300 cursor-default flex justify-center text-[12px] font-bold ">
          {status}
        </div> */}
        <button onClick={removeFriend} className="hover:scale-95">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// const { accessToken } = useGlobalContext();

// const removeFriend = () => {
//   deleteFriends({
//     emailId: email,
//     userID: uid,
//     status: "Rejected",
//   })
//     .then((response) => {
//       const updatedFriends = acceptedFriends.filter(
//         (friend) => friend.email !== email
//       );
//       setAcceptedFriends(updatedFriends);
//     })
//     .catch((error) => {});
// };

export const FriendRequestItems = ({
  name,
  role,
  email,
  status,
  recievedReq,
  setReceivedReq,
}) => {
  const { accessToken } = useGlobalContext();

  const removeFriend = async () => {
    const response = await deleteFriendReq(accessToken, email);
    if (response.status === 200) {
      const updatedFriends = recievedReq.filter(
        (friend) => friend.email !== email
      );
      setReceivedReq(updatedFriends);
    }
  };
  const addFriend = async () => {
    const response = await addFriends(accessToken, email);
    if (response.status === 200) {
      const updatedFriends = recievedReq.filter(
        (friend) => friend.email !== email
      );
      setReceivedReq(updatedFriends);
    }
  };

  return (
    <div className=" flex border border-slate-200 p-3 h-20 rounded-xl justify-between  items-center">
      <div className="flex gap-[600px] items-center">
        <div>
          <div className="font-bold">{name ? name : "Username"}</div>
          <div className="text-[12px] font-semibold text-slate-900">
            {email}
          </div>
        </div>
      </div>
      {/* <div className="border bg-[#fbcfe8] w-[100px] p-1 rounded-lg cursor-default flex justify-center ">
        {status}
      </div> */}
      <div>
        {role === "received" ? (
          <div className="flex gap-1">
            <button
              onClick={addFriend}
              className="border bg-cinder-500 px-8 text-[12px] p-2 rounded-lg ease-in transition translate-y-1 hover:scale-95 flex justify-center "
            >
              Add
            </button>
            <button
              onClick={removeFriend}
              className="border bg-cinder-600 px-7 text-[12px] p-2 rounded-lg ease-in transition translate-y-1 hover:scale-95 flex justify-center "
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="border bg-green-500 px-6 text-[12px] p-1 rounded-lg cursor-default flex justify-center ">
            sent request
          </div>
        )}
      </div>
    </div>
  );
};
