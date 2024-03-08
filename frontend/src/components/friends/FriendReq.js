import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { getReceivedFriendReq } from "../../apis/index";
import { FriendRequestItems } from "../friends/friendsItem";

export default function FriendReq() {
  const { accessToken } = useGlobalContext();
  const [recievedReq, setReceivedReq] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getReceivedFriendReq(accessToken);
        console.log("response", response);
        setReceivedReq(response);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }

    getData();
  }, [accessToken]);

  return (
    <div className="relative">
      <div className="mt-10">
        {recievedReq.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className=" text-[18px] font-sans font-semibold ">
              No friend requests found!!!
            </p>
          </div>
        ) : (
          <div>
            <div className=" font-sans font-semibold 2xl:text-2xl xl:text-xl p-3 ">
              Friends Requests
            </div>
            <ul className="flex flex-col gap-2 mt-2 p-3">
              {recievedReq.map((dataItem) => {
                const { displayName, email } = dataItem;
                console.log(dataItem);
                return (
                  <FriendRequestItems
                    key={email}
                    name={displayName}
                    email={email}
                    status="Pending"
                    role="received"
                    recievedReq={recievedReq}
                    setReceivedReq={setReceivedReq}
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
