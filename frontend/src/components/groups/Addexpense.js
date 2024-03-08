import React, { useState, useEffect } from "react";
import { addExpense, getEachExpense, updateExpense } from "../../apis/index.js";
import { useGlobalContext } from "../../context/GlobalContext.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsReceipt } from "react-icons/bs";

export default function AddExpense({
  setState,
  Id,
  groupMembers,
  setExpenseState,
}) {
  const { accessToken, displayName } = useGlobalContext();
  const name = displayName;
  const [error, setError] = useState("");

  const [expenseDetails, setExpenseDetails] = useState({
    groupId: Id,
    members: [],
    amount: "",
    expenseName: "",
    individualAmounts: {},
    selectAll: false,
    strategy: "equally",
    paidBy: "You",
    date: "",
    category: "",
  });

  const {
    expenseName,
    amount,
    individualAmounts,
    strategy,
    paidBy,
    selectAll,
    date,
    category,
  } = expenseDetails;

  const handleAmountChange = (uid, newAmount) => {
    setExpenseDetails((prevExpenseDetails) => ({
      ...prevExpenseDetails,
      individualAmounts: {
        ...prevExpenseDetails.individualAmounts,
        [uid]: newAmount,
      },
    }));
  };

  // const handleChange = (e) => {
  //   setExpenseDetails((prev) => {
  //     const updatedMembers = prev.members.includes(e.target.value)
  //       ? prev.members.filter((id) => id !== e.target.value)
  //       : [...prev.members, e.target.value];

  //     return {
  //       ...prev,
  //       members: updatedMembers,
  //     };
  //   });
  // };

  const handleChange = (e) => {
    const memberId = e.target.value;
    setExpenseDetails((prev) => {
      const updatedMembers = prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId];

      return {
        ...prev,
        members: updatedMembers,
        selectAll: false, // Unselect "Select All" when individual checkboxes are selected
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(expenseDetails);
    const response = await addExpense(accessToken, expenseDetails);
    if (response.status === 400) setError(response.data);
    else {
      setExpenseState("expense");
    }
    // setState(3);
  };

  const handleSelectAllChange = () => {
    setExpenseDetails((prev) => ({
      ...prev,
      members: selectAll ? [] : groupMembers.map((mem) => mem.uid),
      selectAll: !selectAll,
    }));
  };

  return (
    <div className="flex  gap-2  justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {/* <div className="border border-slate-200 p-2 rounded-xl flex items-center">
              <BsReceipt size="44" className="mt-1" />
            </div> */}
            <div className="flex flex-col gap-2">
              {error && (
                <div className=" pb-[10px] flex w-full justify-center text-red-600">
                  {error}
                </div>
              )}

              <label className="text-[16px]">Expense</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter expense title"
                  className="border-b-2 border-slate-700  rounded-lg w-[600px] p-1 pl-2 outline-transparent"
                  value={expenseName}
                  onChange={(event) => {
                    setExpenseDetails((prev) => ({
                      ...prev,
                      expenseName: event.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex flex-col">
              <label className="text-[16px]">Amount</label>

              <input
                className="border-b-2 border-slate-700 rounded-lg w-[400px] p-1 pl-2  outline-transparent"
                type="Number"
                value={amount}
                placeholder="Enter the amount"
                onChange={(e) =>
                  setExpenseDetails((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-6">
              <DatePicker
                id="date"
                placeholderText="Select Date"
                selected={date}
                className="w-[180px] border-b-2 pl-1 p-1 border-slate-700 rounded-lg outline-transparent"
                dateFormat="dd-MM-yyyy"
                onChange={(date) => {
                  setExpenseDetails({ ...expenseDetails, date: date });
                }}
              />
            </div>
          </div>
          <div className="flex items-center ml-5 mt-2">
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                <label className="text-[12px]">PaidBy</label>
                <select
                  className="border border-slate-200 bg-slate-200  text-slate-900 w-28 rounded-lg"
                  name="members"
                  id="members"
                  value={paidBy}
                  onChange={(e) => {
                    setExpenseDetails((prev) => ({
                      ...prev,
                      paidBy: e.target.value,
                    }));
                  }}
                >
                  {groupMembers.map((mem) => {
                    const { displayName, uid } = mem;
                    return (
                      <option
                        key={uid}
                        value={uid}
                        className="text-[10px] font-sans"
                      >
                        {displayName === name ? "You" : displayName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label className="text-[12px]">Split</label>
              <select
                className="border border-slate-200 bg-slate-200 rounded-lg text-slate-900"
                value={strategy}
                onChange={(e) => {
                  setExpenseDetails((prev) => ({
                    ...prev,
                    strategy: e.target.value,
                  }));
                }}
              >
                <option className="text-[12px] font-sans" value="equally">
                  equally
                </option>
                <option className="text-[12px] font-sans" value="unequally">
                  unequally
                </option>
              </select>
              <label className="text-[12px]">Category</label>
              <div className="flex w-20 ">
                <select
                  required
                  selected={category}
                  name="category"
                  id="category"
                  className="rounded-lg border border-slate-200 bg-slate-300 text-slate-900 "
                  onChange={(e) => {
                    setExpenseDetails({
                      ...expenseDetails,
                      category: e.target.value,
                    });
                  }}
                >
                  <option
                    className="text-[10px] flex w-full font-sans items-center "
                    value=""
                  >
                    --Select--
                  </option>
                  <option className="text-[12px] font-sans" value="food">
                    food
                  </option>
                  <option className="text-[12px] font-sans" value="cloths">
                    cloths
                  </option>
                  <option className="text-[12px] font-sans" value="adventure">
                    adventure
                  </option>
                  <option className="text-[12px] font-sans" value="sports">
                    sports
                  </option>
                  <option className="text-[12px] font-sans" value="gadgets">
                    gadgets
                  </option>
                  <option className="text-[12px] font-sans" value="bank">
                    Bank Transfer
                  </option>
                  <option className="text-[12px] font-sans" value="other">
                    Other
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[16px] mt-10 flex  border-b gray">Members</div>

        {strategy === "unequally" ? (
          <div>
            {groupMembers.map((item) => {
              const { displayName, uid } = item;
              console.log("item", item);
              return (
                <div
                  key={uid}
                  className="mt-5 overflow-auto h-[30px] pl-5 pr-10 scrollbar-thin scrollbar-track-purple-200"
                >
                  <div className="flex justify-between ">
                    <label className="text-[12px]">
                      {" "}
                      {displayName === name ? "You" : displayName}
                    </label>
                    <input
                      value={expenseDetails.individualAmounts[uid] || ""}
                      type="number"
                      className="border-b border-black text-slate-900"
                      onChange={(e) => {
                        setExpenseDetails((prev) => ({
                          ...prev,
                          individualAmounts: {
                            ...prev.individualAmounts,
                            [uid]: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {groupMembers.map((ele) => {
              const { displayName, uid } = ele;
              return (
                <div
                  key={uid}
                  className="overflow-auto h-[30px] pl-5 scrollbar-thin scrollbar-track-purple-100"
                >
                  <div className="flex items-center h-5 gap-1">
                    <input
                      type="checkbox"
                      value={uid}
                      id={uid}
                      onChange={handleChange}
                      checked={expenseDetails.members.includes(uid)}
                    />
                    <label htmlFor={uid} className="text-[12px]">
                      {displayName === name ? "You" : displayName}
                    </label>
                  </div>
                </div>
              );
            })}

            <div className="text-[28px] flex border-b gray pl-5 pb-2">
              <div className="flex items-center h-3 gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label className="text-[12px]">All</label>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-10">
          <button className="border border-slate-200 bg-slate-200 text-slate-900 text-lg  p-1 px-6 rounded-lg hover:scale-90">
            Ok
          </button>
        </div>
      </form>
    </div>
  );
}

export function UpdateExpense({
  setState,
  Id,
  groupMembers,
  setExpenseState,
  expenseId,
}) {
  const { accessToken, displayName } = useGlobalContext();
  const name = displayName;

  const [expenseDetails, setExpenseDetails] = useState({
    groupId: Id,
    expenseId: expenseId,
    members: [],
    amount: "",
    expenseName: "",
    individualAmounts: {},
    selectAll: false,
    strategy: "equally",
    paidBy: "You",
    date: "",
    category: "",
    createdAt: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      const response = await getEachExpense(accessToken, Id, expenseId);
      // setExpenseDetails(response);
      const {
        amount,
        category,
        individualMemberAmount,
        paidBy,
        strategy,
        expenseName,
        participants,
        date,
        createdAt,
      } = response;

      setExpenseDetails({
        ...expenseDetails,
        amount,
        category,
        paidBy,
        strategy,
        expenseName,
        individualAmounts: individualMemberAmount,
        date: new Date(date),
        members: participants,
        createdAt,
      });
    }
    getData();
  }, []);
  const {
    expenseName,
    amount,
    individualAmounts,
    strategy,
    paidBy,
    selectAll,
    date,
    category,
  } = expenseDetails;

  const handleAmountChange = (uid, newAmount) => {
    setExpenseDetails((prevExpenseDetails) => ({
      ...prevExpenseDetails,
      individualAmounts: {
        ...prevExpenseDetails.individualAmounts,
        [uid]: newAmount,
      },
    }));
  };

  // const handleChange = (e) => {
  //   setExpenseDetails((prev) => {
  //     const updatedMembers = prev.members.includes(e.target.value)
  //       ? prev.members.filter((id) => id !== e.target.value)
  //       : [...prev.members, e.target.value];

  //     return {
  //       ...prev,
  //       members: updatedMembers,
  //     };
  //   });
  // };

  const handleChange = (e) => {
    const memberId = e.target.value;
    setExpenseDetails((prev) => {
      const updatedMembers = prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId];

      return {
        ...prev,
        members: updatedMembers,
        selectAll: false, // Unselect "Select All" when individual checkboxes are selected
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(expenseDetails);
    const response = await updateExpense(accessToken, expenseDetails);
    if (response.status === 400) {
      setError(response.data);
    } else {
      setExpenseState("expense");
    }
  };

  const handleSelectAllChange = () => {
    setExpenseDetails((prev) => ({
      ...prev,
      members: selectAll ? [] : groupMembers.map((mem) => mem.uid),
      selectAll: !selectAll,
    }));
  };
  console.log("erorr", error);

  return (
    <div className="flex justify-center gap-2 ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 text-slate-200">
          <div>
            {error && (
              <div className=" pb-[10px] flex w-full justify-center text-red-600">
                {error}
              </div>
            )}
            <label className="text-[16px]">Expense</label>
            <div>
              <input
                type="text"
                placeholder="Enter expense title"
                className="border-b-2 border-slate-700  rounded-lg w-[600px] p-1 pl-2 outline-transparent text-slate-900 "
                value={expenseName}
                onChange={(event) => {
                  setExpenseDetails((prev) => ({
                    ...prev,
                    expenseName: event.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex flex-col">
              <label className="text-[16px]">Amount</label>

              <input
                className="border-b-2 border-slate-700 rounded-lg w-[400px] p-1 pl-2  outline-transparent text-slate-900 "
                type="Number"
                value={amount}
                placeholder="Enter the amount"
                onChange={(e) =>
                  setExpenseDetails((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-6">
              <DatePicker
                id="date"
                placeholderText="Select Date"
                selected={date}
                value={date}
                className="w-[180px] border-b-2 pl-1 p-1 border-slate-700 rounded-lg outline-transparent text-slate-900 "
                dateFormat="dd-MM-yyyy"
                onChange={(date) => {
                  setExpenseDetails({ ...expenseDetails, date: date });
                }}
              />
            </div>
          </div>
          <div className="flex items-center ml-5 mt-2">
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                <label className="text-[12px]">PaidBy</label>
                <select
                  className="border border-slate-600 bg-slate-300  w-28 rounded-lg text-slate-900 "
                  name="members"
                  id="members"
                  value={paidBy}
                  onChange={(e) => {
                    setExpenseDetails((prev) => ({
                      ...prev,
                      paidBy: e.target.value,
                    }));
                  }}
                >
                  {groupMembers.map((mem) => {
                    const { displayName, uid } = mem;
                    return (
                      <option
                        key={uid}
                        value={uid}
                        className="text-[10px] font-sans"
                      >
                        {displayName === name ? "You" : displayName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label className="text-[12px]">Split</label>
              <select
                className="border border-slate-200 bg-slate-200 rounded-lg text-slate-900 "
                value={strategy}
                onChange={(e) => {
                  setExpenseDetails((prev) => ({
                    ...prev,
                    strategy: e.target.value,
                  }));
                }}
              >
                <option className="text-[12px] font-sans" value="equally">
                  equally
                </option>
                <option className="text-[12px] font-sans" value="unequally">
                  unequally
                </option>
              </select>
              <label className="text-[12px]">Category</label>
              <div className="flex w-20 ">
                <select
                  required
                  selected={category}
                  value={category}
                  name="category"
                  id="category"
                  className="rounded-lg border border-slate-200 bg-slate-200  text-slate-900 "
                  onChange={(e) => {
                    setExpenseDetails({
                      ...expenseDetails,
                      category: e.target.value,
                    });
                  }}
                >
                  <option
                    className="text-[10px] flex w-full font-sans items-center "
                    value=""
                  >
                    --Select--
                  </option>
                  <option className="text-[12px] font-sans" value="food">
                    food
                  </option>
                  <option className="text-[12px] font-sans" value="cloths">
                    cloths
                  </option>
                  <option className="text-[12px] font-sans" value="adventure">
                    adventure
                  </option>
                  <option className="text-[12px] font-sans" value="sports">
                    sports
                  </option>
                  <option className="text-[12px] font-sans" value="gadgets">
                    gadgets
                  </option>
                  <option className="text-[12px] font-sans" value="bank">
                    Bank Transfer
                  </option>
                  <option className="text-[12px] font-sans" value="other">
                    Other
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[16px] mt-10 flex  border-b gray">Members</div>

        {strategy === "unequally" ? (
          <div>
            {groupMembers.map((item) => {
              const { displayName, uid } = item;
              console.log("item", item);
              return (
                <div
                  key={uid}
                  className="mt-5 overflow-auto h-[30px] pl-5 pr-10 scrollbar-thin scrollbar-track-purple-200 "
                >
                  <div className="flex justify-between ">
                    <label className="text-[12px]">
                      {" "}
                      {displayName === name ? "You" : displayName}
                    </label>
                    <input
                      value={expenseDetails.individualAmounts[uid] || ""}
                      type="number"
                      className="border-b border-black text-slate-900"
                      onChange={(e) => {
                        setExpenseDetails((prev) => ({
                          ...prev,
                          individualAmounts: {
                            ...prev.individualAmounts,
                            [uid]: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {groupMembers.map((ele) => {
              const { displayName, uid } = ele;
              return (
                <div
                  key={uid}
                  className="overflow-auto h-[30px] pl-5 scrollbar-thin scrollbar-track-purple-100"
                >
                  <div className="flex items-center h-5 gap-1">
                    <input
                      type="checkbox"
                      value={uid}
                      id={uid}
                      onChange={handleChange}
                      checked={expenseDetails.members.includes(uid)}
                    />
                    <label htmlFor={uid} className="text-[12px]">
                      {displayName === name ? "You" : displayName}
                    </label>
                  </div>
                </div>
              );
            })}

            <div className="text-[28px] flex border-b gray pl-5 pb-2">
              <div className="flex items-center h-3 gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label className="text-[12px]">All</label>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-10 gap-2">
          <button
            className="border border-slate-200 bg-slate-200 text-slate-900  text-lg p-1 px-6 rounded-lg hover:scale-90"
            onClick={() => setExpenseState("expense")}
          >
            Cancel
          </button>
          <button className="border border-slate-200 bg-slate-200 text-slate-900  text-lg p-1 px-6 rounded-lg hover:scale-90">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
