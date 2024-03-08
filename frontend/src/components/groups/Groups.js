import React, { useEffect } from "react";
import { getGroups } from "../../apis/index";
import { useGlobalContext } from "../../context/GlobalContext";
import { GroupItems } from "./GroupsItem";
import { useDashboardContext } from "../../context/DashboardContext";
import { FiPlus } from "react-icons/fi";

export default function Groups({ displayState, setDisplayState, setGroupId }) {
  const { accessToken } = useGlobalContext();
  const { groups, setGroups } = useDashboardContext();

  useEffect(() => {
    async function getData() {
      try {
        const response = await getGroups(accessToken);
        console.log("response", response);
        setGroups(response);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }

    getData();
  }, [accessToken]);

  return (
    <div className="">
      <div className=" ">
        {groups.length === 0 ? (
          <div>
            <div className="flex flex-row-reverse ml-5 p-3 items-center">
              <div className="flex items-center justify-end">
                <button
                  className=" flex items-center  border hover:scale-95 border-slate-200 rounded-lg bg-cinder-500 px-4 hover:bg-cinder-700 p-1  font-medium text-sm"
                  onClick={() => {
                    setDisplayState(1);
                  }}
                >
                  <FiPlus size="12" />
                  Group
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center text-[18px] font-sans font-semibold">
              <p>No Groups found!!!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col  ">
            <div className="flex justify-between  p-3 items-center">
              <div className=" font-sans font-semibold 2xl:text-2xl xl:text-xl p-2  ">
                Groups
              </div>
              <div className="flex items-center justify-end">
                <button
                  className=" flex items-center  border hover:scale-95 border-slate-200 rounded-lg bg-cinder-500 px-4 hover:bg-cinder-700 p-1  font-medium text-sm"
                  onClick={() => {
                    setDisplayState(1);
                  }}
                >
                  <FiPlus size="12" />
                  Group
                </button>
              </div>
            </div>

            <ul className="flex flex-col p-3 gap-3 ">
              {groups.map((dataItem) => {
                const { groupName, groupId } = dataItem;
                console.log(dataItem);
                return (
                  <GroupItems
                    name={groupName}
                    id={groupId}
                    setGroupId={setGroupId}
                    setDisplayState={setDisplayState}
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
