import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { FaMoneyBill, FaRupeeSign } from "react-icons/fa";
import AddExpense from "./Addexpense.js";

import { UpdateExpense } from "./Addexpense.js";

import { FaTrash } from "react-icons/fa";
import {
  getBalanceOfEachGroup,
  getEachExpenseOfGroup,
  deleteExpense,
  settleUpExpense,
  getSettleUps,
} from "../../apis/index.js";
import { BsReceipt } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";

export const GroupItems = ({ name, id, setGroupId, setDisplayState }) => {
  const { accessToken } = useGlobalContext();
  const [groupMembers, setGroupMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false); // State to control visibility

  const groupDetails = async () => {
    setGroupId({
      groupId: id,
      groupName: name,
    });
    setDisplayState(2);

    // setShowMembers(!showMembers); // Toggle visibility
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex border border-slate-100  p-6 h-10  rounded-xl justify-between items-center hover:bg-cinder-600 cursor-pointer"
        onClick={groupDetails}
      >
        <div>
          <div className="font-semibold text-[16px]  first-letter:uppercase">
            {name ? name : "Group Name"}
          </div>
        </div>
        {/* <div className="flex gap-1">
          <button onClick={groupDetails} className="cursor-pointer">
            <HiDotsVertical size="30" />
          </button>
        </div> */}
      </div>
      <div>
        {showMembers && (
          <ul className="flex flex-col rounded-lg ">
            {groupMembers.map((dataItem) => {
              const { displayName, email } = dataItem;
              console.log(dataItem);
              return (
                <GroupMemberItem key={email} name={displayName} email={email} />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export const GroupMemberItem = ({ name, email }) => {
  const { displayName } = useGlobalContext();

  return (
    <div className="flex flex-col gap-2 ">
      <div className=" border border-gray bg-slate-200 rounded-xl p-2 pl-4 ">
        <div className="font-semibold font-sans text-[16px] text-slate-900 ">
          {name === displayName ? "You" : name}
        </div>
        <div className="text-[10px] font-sans  text-cyan-600">{email}</div>
      </div>
    </div>
  );
};

export const ExpenseItem = ({ groupMembers, setState, Id }) => {
  const { accessToken } = useGlobalContext();
  const [data, setData] = useState({});
  const [expense, setExpense] = useState([]);
  const [settleups, setSettleups] = useState([]);
  const [expenseId, setExpenseId] = useState("");

  const [expenseState, setExpenseState] = useState("balance");

  useEffect(() => {
    async function getBalanceExpenseOfEachGroup() {
      try {
        const response = await getBalanceOfEachGroup(accessToken, Id);
        console.log("responseBalance", response);
        setData(response ? response : {});

        const responseSettle = await getSettleUps(accessToken, Id);
        console.log(responseSettle, responseSettle.settleUpData);
        setSettleups(responseSettle.settleUpData);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
    const getExpenses = async () => {
      const response = await getEachExpenseOfGroup(accessToken, Id);
      setExpense(response);
    };
    if (expenseState === "balance") {
      getBalanceExpenseOfEachGroup();
    }
    if (expenseState === "expense") {
      getExpenses();
    }
  }, [expenseState, Id, accessToken]);

  const handleDelete = async (id) => {
    const response = await deleteExpense(accessToken, Id, id);
    if (response.status === 200) {
      const updatedFriends = expense.filter((friend) => friend.id !== id);
      setExpense(updatedFriends);
    }
  };

  const handleState = (id) => {
    setExpenseState("update Expense");
    console.log("id", id);
    setExpenseId(id);
  };

  const display = () => {
    switch (expenseState) {
      case "members":
        return (
          <ul className="flex flex-col rounded-lg gap-2  ">
            {groupMembers.map((dataItem) => {
              const { displayName, email } = dataItem;
              console.log(dataItem);
              return (
                <GroupMemberItem key={email} name={displayName} email={email} />
              );
            })}
          </ul>
        );

      case "Add Expense":
        return (
          <AddExpense
            setState={setState}
            Id={Id}
            groupMembers={groupMembers}
            setExpenseState={setExpenseState}
          />
        );

      case "update Expense":
        return (
          <UpdateExpense
            setState={setState}
            Id={Id}
            expenseId={expenseId}
            groupMembers={groupMembers}
            setExpenseState={setExpenseState}
          />
        );
      case "expense":
        return (
          <div className="flex flex-col gap-1 text-slate-900">
            {" "}
            {expense && expense.length > 0 ? (
              expense.map((exp) => {
                const { amount, paidBy, lent, name, borrowed, id } = exp;
                return (
                  <div className="">
                    <div className="  border-b-2 border-slate-200 bg-slate-200 p-2 pl-8 rounded-xl flex justify-between">
                      <div className="flex gap-4">
                        <div className="border-2 border-gray-500 w-14 h-14 rounded-xl  ">
                          <div className=" flex items-center justify-center">
                            <BsReceipt size="44" className="mt-1" />
                          </div>
                        </div>
                        <div className="">
                          <div className="text-[16px] font-medium first-letter:uppercase">
                            {name ? name : "Expense title"}
                          </div>
                          <div className="flex items-center text-[10px] text-green-600 font-medium">
                            {paidBy === "You" ? "You paid " : paidBy + " paid "}
                            <div className="flex items-center ml-1">
                              <FaRupeeSign />

                              {amount}
                            </div>
                          </div>
                          <div className="flex items-center text-[10px] gap-1 text-red-500 font-medium">
                            <div>
                              {paidBy === "You" ? `You lent` : `You borrowed  `}
                            </div>

                            <div className="flex items-center">
                              <FaRupeeSign />

                              {paidBy === "You"
                                ? Number(lent).toFixed(2)
                                : Number(borrowed).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="pr-3 hover:scale-95"
                          onClick={() => handleState(id)}
                        >
                          <MdModeEdit size="20" color="black" />
                        </button>
                        <button
                          className="pr-3 hover:scale-95"
                          onClick={() => handleDelete(id)}
                        >
                          <FaTrash size="20" color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="  font-semibold text-[18px] text-slate-200 flex justify-center">
                No expenses ! Add expenses to get started
              </div>
            )}{" "}
          </div>
        );
      case "settleUp":
        return (
          <div className="flex flex-col gap-1">
            {data.getBackAmount &&
              data.getBackAmount.map((person) => {
                const { name, amount, id } = person;
                console.log("personID", id);
                return (
                  <GetBackAmountItems
                    name={name}
                    amount={amount}
                    settle={true}
                    id={id}
                    Id={Id}
                    setExpenseState={setExpenseState}
                  />
                );
              })}
            {data.YouOweAmount &&
              data.YouOweAmount.map((person) => {
                const { name, amount, id } = person;
                return (
                  <YouOweAmountItems
                    name={name}
                    amount={amount}
                    settle={true}
                    id={id}
                    Id={Id}
                    setExpenseState={setExpenseState}
                  />
                );
              })}
            {(!data.YouOweAmount || data.YouOweAmount.length === 0) &&
              (!data.getBackAmount || data.getBackAmount.length === 0) && (
                <div className="flex justify-center w-full  font-semibold text-[18px]  ">
                  Nothing to settle up!
                </div>
              )}
          </div>
        );
      default:
        return (
          <div>
            <div className="flex items-center justify-center">
              <div className="border w-full max-w-[1000px] p-3 rounded-3xl">
                <div className=" pl-12 text-xl mb-2 ">Overview</div>
                <div className=" flex justify-around">
                  <div className="flex flex-col">
                    <div className="flex items-center text-xl font-medium text-white">
                      <FaRupeeSign color="white" size="28" />
                      {/* console.log("amountPaid",data.amountPaid) */}
                      {data.amountPaid ? data.amountPaid : 0}
                    </div>

                    <div className="text-[12px] font-thin text-white mt-3">
                      Total amount you paid
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center text-xl font-medium text-white">
                      <FaRupeeSign color="white" size="28" />
                      {data.expense ? data.expense.toFixed(2) : 0}
                    </div>

                    <div className="text-[12px] font-thin text-white mt-3">
                      Total expense
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center text-xl font-medium text-white">
                      <FaRupeeSign color="white" size="28" />
                      {data.getBack ? data.getBack.toFixed(2) : 0}
                    </div>

                    <div className="text-[12px] font-thin text-white mt-3 ">
                      You get back
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center text-xl font-medium text-white">
                      <FaRupeeSign color="white" size="28" />
                      {data.youOwe ? data.youOwe.toFixed(2) : 0}
                    </div>

                    <div className="text-[12px] font-thin text-white mt-3">
                      You owe
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center text-xl font-medium text-white">
                      <FaRupeeSign color="white" size="28" />
                      {data.settleUp ? data.settleUp.toFixed(2) : 0}
                    </div>

                    <div className="text-[12px] font-thin text-white mt-3">
                      Settled up
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col  mt-5">
              <div className="flex flex-col gap-2 ">
                {settleups &&
                  settleups.map((person) => {
                    const { amount, personID, paidBy, type } = person;
                    return (
                      <SettleUpsData
                        amount={amount}
                        paidBy={paidBy}
                        personID={personID}
                        type={type}
                      />
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2 mt-2 ">
                {data.getBackAmount &&
                  data.getBackAmount.map((person) => {
                    const { name, amount, id } = person;
                    return (
                      <GetBackAmountItems
                        name={name}
                        amount={amount}
                        settle={false}
                        id={id}
                        Id={Id}
                        setExpenseState={setExpenseState}
                      />
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {data.YouOweAmount &&
                  data.YouOweAmount.map((person) => {
                    const { name, amount, id } = person;
                    return (
                      <YouOweAmountItems
                        name={name}
                        amount={amount}
                        settle={false}
                        id={id}
                        Id={Id}
                        setExpenseState={setExpenseState}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="">
      <div className="flex items-center">
        <div
          className={`text-[16px]  p-2 items-center flex justify-center  ${
            expenseState === "balance"
              ? "border-b-4 border-slate-200 text-[16px] font-semibold transition ease-out  duration-100"
              : ""
          } cursor-pointer`}
          onClick={() => setExpenseState("balance")}
        >
          Balance
        </div>
        <div
          className={`text-[16px]  w-[px] p-2 font-sansitems-center flex justify-center ${
            expenseState === "expense" || expenseState === "update Expense"
              ? "border-b-4 border-slate-200 text-[16px] font-semibold transition ease-out  duration-100"
              : ""
          } cursor-pointer`}
          onClick={() => setExpenseState("expense")}
        >
          Expenses
        </div>
        <div
          className={`text-[16px]  w-[px] p-2 font-sans items-center flex justify-center ${
            expenseState === "members"
              ? "border-b-4 border-slate-200 text-[16px] font-semibold transition ease-out  duration-100"
              : ""
          } cursor-pointer `}
          onClick={() => {
            setExpenseState("members");
          }}
        >
          Members
        </div>
        <div
          className={`text-[16px]  w-[px] p-2 font-sans items-center flex justify-center ${
            expenseState === "Add Expense"
              ? "border-b-4 border-slate-200 text-[16px] font-semibold transition ease-out  duration-100"
              : ""
          } cursor-pointer `}
          onClick={() => {
            setExpenseState("Add Expense");
          }}
        >
          Add Expense
        </div>
        <div
          className={`text-[16px]  w-[px] p-2 font-sansitems-center flex justify-center ${
            expenseState === "settleUp"
              ? "border-b-4 border-slate-200 text-[16px] font-semibold transition ease-out  duration-100"
              : ""
          } cursor-pointer`}
          onClick={() => setExpenseState("settleUp")}
        >
          Settle Up
        </div>
      </div>
      <div className=" bg-gray-100 "></div>
      <div className="  border border-slate-200  md:h-[700px] xl:h-[700px] 2xl:h-[700px] rounded-b-xl  p-10 pb-0 pt-15 flex flex-col gap-2 overflow-auto scrollbar-thin  scrollbar-thumb-slate-100 scrollbar-track-slate-200">
        {display()}
      </div>
    </div>
  );
};

const GetBackAmountItems = ({
  name,
  amount,
  settle,
  id,
  Id,
  setExpenseState,
}) => {
  console.log("GroupId", Id);
  console.log("here", id);
  const type = "lent";
  const { accessToken } = useGlobalContext();

  const handleSettleup = async () => {
    const response = await settleUpExpense(accessToken, Id, id, type, amount);
    setTimeout(() => {
      setExpenseState("balance");
    }, 2000);

    console.log(response);
  };
  return (
    <div className="border border-slate-200 bg-slate-100 rounded-xl  p-2 pl-3 flex items-center justify-between pr-3">
      <div className="flex items-center gap-1">
        <FaMoneyBill size="28" color="green" />
        <div className="flex items-center gap-1 text-green-500 text-[12px] pl-3">
          {name} Owes you <FaRupeeSign size="12" />
          {amount.toFixed(2)}
        </div>
      </div>
      <div>
        {settle && (
          <button
            className="text-[12px] border bg-green-500 p-1 rounded-lg  hover:scale-105 transition duration-75 "
            onClick={handleSettleup}
          >
            Settle up
          </button>
        )}
      </div>
    </div>
  );
};

const YouOweAmountItems = ({
  name,
  amount,
  settle,
  id,
  Id,
  setExpenseState,
}) => {
  const { accessToken } = useGlobalContext();

  console.log("here", id);
  const type = "owe";
  const handleSettleup = async () => {
    const response = await settleUpExpense(accessToken, Id, id, type, amount);
    setTimeout(() => {
      setExpenseState("balance");
    }, 1000);

    console.log(response);
  };
  return (
    <div className="border border-slate-200 bg-slate-100 rounded-xl  p-2 pl-3 flex items-center justify-between pr-3">
      <div className="flex items-center gap-1">
        <FaMoneyBill size="28" color="red" />
        <div className="flex items-center gap-1 text-red-500 text-[12px] pl-3">
          You Owe {name} <FaRupeeSign size="12" />
          {amount.toFixed(2)}
        </div>
      </div>
      <div>
        {settle && (
          <button
            className="text-[12px] border bg-green-500 p-1 rounded-lg  hover:scale-105 transition duration-75 "
            onClick={handleSettleup}
          >
            Settle up
          </button>
        )}
      </div>
    </div>
  );
};

const SettleUpsData = ({ paidBy, amount, personID, type }) => {
  return (
    <div className="border border-slate-200 bg-slate-100 rounded-xl  p-2 pl-3 flex items-center justify-between pr-3">
      <div className="flex items-center gap-1">
        <FaMoneyBill size="28" color="green" />
        <div className="flex items-center gap-1 text-cyan-900 text-[12px] pl-3">
          {type === "lent"
            ? `${personID} paid ${paidBy}`
            : `${paidBy} paid ${personID}`}
          <FaRupeeSign size="12" />
          {amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
