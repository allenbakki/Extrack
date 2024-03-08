import React, { useEffect, useState } from "react";
import { createGroup, getFriends } from "../../apis";
import { useGlobalContext } from "../../context/GlobalContext";
import { IoIosArrowBack } from "react-icons/io";

export default function CreateGroup({ displayState, setDisplayState }) {
  const { accessToken } = useGlobalContext();
  const [friends, setFriends] = useState([]);
  const [createGroupDetails, setCreateGrouDetails] = useState({
    groupName: "",
    friendIds: [],
  });
  const { groupName } = createGroupDetails;
  const handleChange = (e) => {
    setCreateGrouDetails((prev) => {
      return { ...prev, friendIds: [...prev.friendIds, e.target.value] };
    });
  };

  useEffect(() => {
    async function getFriendsData() {
      try {
        const response = await getFriends(accessToken);
        console.log("response", response);
        setFriends(response);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
    getFriendsData();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createGroup(accessToken, createGroupDetails);
    if (response.status === 200) setDisplayState(0);

    console.log(createGroupDetails, response);
  };
  return (
    <div>
      <div className="flex flex-col">
        <div className="w-full ">
          <div className="flex items-center text-[18px]  font-semibold p-3 text-white  ">
            <IoIosArrowBack
              size="28"
              onClick={() => {
                setDisplayState(0);
              }}
            />
            Create Group
          </div>
        </div>

        <div className="flex justify-center mt-10 ">
          <div className=" flex justify-center items-center border border-slate-200 p-5 rounded-3xl ">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 mt-5 ">
                <label className="text-[16px] ">Group name</label>
                <input
                  required
                  type="text"
                  className=" w-[600px] rounded-lg p-2 bg-slate-200 outline-transparent	"
                  value={groupName}
                  placeholder="Enter group name"
                  onChange={(e) => {
                    setCreateGrouDetails((prev) => {
                      return { ...prev, groupName: e.target.value };
                    });
                  }}
                />
                <label className="text-[16px] border-b-2 mb-2 border-slate-200">
                  Add friends
                </label>
              </div>
              {friends.map((item) => {
                const { displayName, uid } = item;
                return (
                  <div className="overflow-y-auto h-[50px] ml-2">
                    <div className=" flex items-center  h-10 gap-2">
                      <input
                        type="checkbox"
                        value={uid}
                        id={uid}
                        onChange={handleChange}
                      />
                      <label for={uid} className="text-[12px] ">
                        {displayName}
                      </label>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-center items-center mt-14">
                <button className="border text-slate-900 hover:scale-95 px-6 rounded-lg p-2 bg-slate-200 text-[12px]  ">
                  Ok
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
