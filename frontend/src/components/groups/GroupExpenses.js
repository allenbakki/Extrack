import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { ExpenseItem } from "./GroupsItem";
import {
  getGroupMembers,
  getEachExpenseOfGroup,
  getBalanceOfEachGroup,
} from "../../apis/index";
import { IoIosArrowBack } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import AddExpense from "./Addexpense.js";

export default function GroupExpenses({
  displayState,
  setDisplayState,
  groupId,
}) {
  const { accessToken } = useGlobalContext();
  const [groupMembers, setGroupMembers] = useState([]);
  const [state, setState] = useState(0);
  // const [scale, setIsScaled] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getGroupMembers(accessToken, groupId.groupId);
        console.log("response", response);
        setGroupMembers(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }

    getData();
  }, [accessToken]);

  const display = () => {
    switch (state) {
      case 1:
        return (
          <AddExpense
            setState={setState}
            Id={groupId.groupId}
            groupMembers={groupMembers}
          />
        );
      default:
        return (
          <ExpenseItem
            groupMembers={groupMembers}
            setState={setState}
            Id={groupId.groupId}
          />
        );
    }
  };

  return (
    <div>
      <div className="relative ">
        <div className="fixed pt-0 text-xl  ">
          <div className="relative flex">
            <div className="flex items-center">
              <div className="cursor-pointer ">
                <IoIosArrowBack
                  size="38"
                  color="gray"
                  onClick={() => {
                    setDisplayState(0);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between  ">
                  <div className="text-[18px] text-white first-letter:uppercase font-sans font-semibold 2xl:text-2xl xl:text-xl">
                    {groupId.groupName}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-3 ml-2 text-[12px] border-gray-200  ">{}</div> */}
        </div>
      </div>

      <div className="pt-10">{display()}</div>
    </div>
  );
}
