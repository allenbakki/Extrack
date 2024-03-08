import React, { useEffect, useState } from "react";
import { FaRupeeSign, FaMoneyBill } from "react-icons/fa";
import {
  getBalanceOfAllGroups,
  getGroups,
  getGroupMembers,
  addExpenseEqually,
} from "../apis/index";
import { useGlobalContext } from "../context/GlobalContext";
import { chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
export default function DashboardContent() {
  const { accessToken } = useGlobalContext();
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function getBalance() {
      const response = await getBalanceOfAllGroups(accessToken);
      setData(response);
    }

    async function getData() {
      const response = await getGroups(accessToken);
      setGroups(response);
    }

    getBalance();
    getData();
  }, [accessToken]);

  const dataExpense = data.eachGroupExpense;

  return (
    <div className="relative">
      <div className="ml-5 p-3 font-sans font-semibold 2xl:text-2xl xl:text-xl">
        Dashboard{" "}
      </div>

      <div className="flex md:flex-col xl:flex-row  gap-4">
        <div className="flex flex-col md:flex-col xl:w-[640px] 2xl:w-[1100px]">
          <div className="border border-slate-200 rounded-3xl p-5  font-semibold mb-3 pl-8 text-xl  2xl:h-[150px]">
            Overview
            <div className="flex justify-between  2xl:mt-5">
              <div className=" items-center justify-center flex flex-col gap-1">
                <div className="flex items-center">
                  <FaRupeeSign size="18" color="white" />
                  <div className="text-xl font-mono font-bold">
                    {data.amountPaid ? data.amountPaid.toFixed(2) : 0}
                  </div>
                </div>
                <div className="text-sm font-medium "> Total amount paid</div>
              </div>
              <div className="  items-center justify-center  flex flex-col gap-1">
                <div className="flex items-center">
                  <FaRupeeSign size="18" color="white" />
                  <div className="text-xl font-mono font-bold">
                    {data.expense ? data.expense.toFixed(2) : 0}
                  </div>
                </div>
                <div className="text-sm font-medium "> Total spend</div>
              </div>

              <div className="   items-center justify-center  flex flex-col gap-1">
                <div className="flex items-center">
                  <FaRupeeSign size="18" color="white" />
                  <div className="text-xl font-sans  font-bold">
                    {data.getBack ? data.getBack.toFixed(2) : 0}
                  </div>
                </div>
                <div className="text-sm font-medium "> You get back</div>
              </div>
              <div className=" items-center justify-center  flex flex-col gap-1">
                <div className="flex items-center">
                  <FaRupeeSign size="18" color="white" />
                  <div className="text-xl font-sans  font-bold">
                    {data.youOwe ? data.youOwe.toFixed(2) : 0}
                  </div>
                </div>
                <div className="text-sm font-semibold "> You owe</div>
              </div>
            </div>
          </div>
          <div className="flex items-center  w-full">
            <div className="w-full">
              {data.eachGroupExpense && (
                <GraphComponentGroupExpense
                  eachGroupExpense={data.eachGroupExpense}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-full xl:w-[500px] 2xl:w-[450px]">
          <div className="2xl:h-[calc(100vh-200)] border border-slate-200 rounded-3xl p-5 scrollbar-track-slate-200">
            <div className="  font-sans font-medium xl:text-[16px] 2xl:text-xl">
              Friends
            </div>
            <div className="flex flex-col gap-3 justify-center mt-2  ">
              <div className=" flex flex-col gap-2 justify-center overflow-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
                {data.getBackAmount &&
                  data.getBackAmount.map((element) => {
                    const { id, name, amount } = element;
                    return (
                      <YougettBackAmount id={id} name={name} amount={amount} />
                    );
                  })}
                {data.YouOweAmount &&
                  data.YouOweAmount.map((element) => {
                    const { id, name, amount } = element;
                    if (amount > 0)
                      return (
                        <YouOweAmountItems
                          id={id}
                          name={name}
                          amount={amount}
                        />
                      );
                  })}
              </div>
            </div>
          </div>

          <div className="mt-4 w-full ">
            <GroupsComponent groups={groups} />
          </div>
        </div>
      </div>
    </div>
  );
}

const GroupsComponent = ({ groups }) => {
  return (
    <div>
      <div className="border border-slate-200 rounded-3xl p-5 flex 2xl:h-[calc(100vh-475px)] xl:h-[calc(100vh-470px)]  md:h-[200px] h-full  ">
        <div className="flex flex-col w-full">
          <div className="xl:text-[16px] 2xl:text-xl pt-3  font-sans font-semibold ">
            {" "}
            Groups
          </div>
          <div className=" mt-2 flex flex-col gap-1 overflow-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent ">
            {groups &&
              groups.map((item) => {
                const { groupName, createdBy } = item;
                return (
                  <div className="flex gap-3 text-[12px] items-center border border-slate-200   hover:bg-cinder-600 p-2 rounded-xl">
                    <div className="text-[16px] first-letter:uppercase font-sans ">
                      {groupName}
                      <div className="text-[12px] text-slate-900 font-bold">
                        created by {createdBy}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GraphComponentGroupExpense = ({ eachGroupExpense }) => {
  console.log(eachGroupExpense);
  const options = {
    aspectRatio: 2, // Adjust the aspect ratio as needed to fit the width
    maintainAspectRatio: false, // Allow the chart to adjust to the container size

    plugins: {
      title: {
        text: "Expense",
        font: {
          size: 16, // Set the font size for the title
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          width: 10,
        },
        label: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white", // Customize the color of the y-axis labels
        },
      },
    },
    legend: {
      display: false, // Set to false to hide the legend
    },
    responsive: true,
    animation: {
      duration: 2000,
    },
    color: "white",
  };

  return (
    <div className=" 2xl:h-[calc(100vh-264px)] xl:h-[calc(100vh-240px)]  border border-slate-200 rounded-3xl  p-8 flex justify-center overflow-hidden scrollbar-thin scrollar-track-gray">
      <Bar
        data={{
          labels: eachGroupExpense
            ? eachGroupExpense.map((data) => data.groupName)
            : ["g1", "g2", "g3"],
          datasets: [
            {
              label: "Expense Statistics",

              data: eachGroupExpense
                ? eachGroupExpense.map((data) => data.expense)
                : [10, 10, 0, 0],
              backgroundColor: [
                "rgba(197, 138, 209)",
                "rgba(29, 43, 125)",
                "rgba(50, 209, 227)",
                "rgba(227, 221, 50)",
              ],
              // borderColor: "black", // Set the border color to black
              // borderWidth: 1,
              borderRadius: 5,
            },
          ],
        }}
        options={options} // Pass the options object here
      />
    </div>
  );
};

const DonutGarpg = () => {
  return (
    <div className="h-[385px] w-full border rounded-lg p-3 flex justify-center items-center bg-white flex-col  ">
      <div className="text-[16px] font-sans font-semibold">
        Category-wise expenses
      </div>
      <Doughnut
        data={{
          labels: ["ice-cream", "food", "ride", "hotel"],
          datasets: [
            {
              label: "expense",
              data: ["123.40", "10000", "5000", "400"],
              backgroundColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
              borderColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: "Revenue Sources",
            },
          },
        }}
      />
    </div>
  );
};

const YouOweAmountItems = ({ name, amount, id }) => {
  return (
    <div className=" flex border border-slate-200 rounded-xl p-2 gap-3">
      <div className=" rounded-lg p-2 bg-slate-200 items-center flex">
        <FaMoneyBill size="28" color="f20a38" />
      </div>

      <div className="flex flex-col gap-1   ">
        <div className="flex items-center text-sm ">{name}</div>

        <div className="flex items-center gap-1">
          <div className="flex  font-sans text-sm">You owe</div>
          <div className="flex items-center  text-sm ">
            <div className="mt-1 ">
              <FaRupeeSign size="14" color="white" />
            </div>
            {amount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

const YougettBackAmount = ({ name, amount, id }) => {
  return (
    <div className=" flex border border-slate-200 rounded-xl p-2 gap-3">
      <div className=" rounded-lg p-2 bg-slate-200 items-center flex">
        <FaMoneyBill size="28" color="green" />
      </div>

      <div className="flex flex-col gap-1   ">
        <div className="flex items-center text-sm ">{name}</div>

        <div className="flex items-center gap-1">
          <div className="flex  font-sans text-sm">You get back</div>
          <div className="flex items-center  text-sm ">
            <div className="mt-1 ">
              <FaRupeeSign size="14" color="white" />
            </div>
            {amount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddExpense = ({ groups }) => {
  const { accessToken, displayName } = useGlobalContext();
  const name = displayName;
  const [groupMembers, setGroupMembers] = useState([]);

  const [paidBy, setPaidBy] = useState("");
  const [strategy, setStrategy] = useState("equally");
  const [group, setGroup] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const response = await getGroupMembers(accessToken, group);
        console.log("response", response);
        setGroupMembers(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
    if (group !== "" && group !== "Group Name") {
      getData();
    }
  }, [accessToken, group]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(strategy, group, paidBy, amount, title);
    // setAmount("");
    // setAmount(" ");
    if (strategy && group && strategy && amount && title) {
      const response = await addExpenseEqually(
        accessToken,
        strategy,
        group,
        paidBy,
        amount,
        title
      );

      setAmount("");
      setTitle("");
      setStrategy("equally");
      setGroup("");
      setPaidBy("");
      setError("");
    } else {
      setError("All fields are required");
    }
  }

  return (
    <div className="border border-xl rounded-3xl 2xl:h-[280px]  p-3">
      <div className="xl:text-[16px] 2xl:text-xl  pl-8">Add Expenses</div>
      <div className="flex gap-14 items-center xl:mt-5">
        <div className="pl-8 mt-5 flex gap-3">
          <div className="border p-2 rounded-full flex items-center justify-center">
            <FaMoneyBill size="30" color="gray" />
          </div>
          <select
            className="border border-slate-600 bg-slate-300  xl:w-36 2xl:w-44 rounded-lg text-slate-700 2xl:text-[16px] xl:text-[12px] xl:p-2 2xl:p-3 md:text-[12px] outline-none"
            name="members"
            id="members"
            value={group}
            onChange={(e) => {
              setGroup(e.target.value);
            }}
          >
            <option
              className="xl:text-[10px] 2xl:text-[12px] flex w-full font-sans  items-center "
              value=""
            >
              <div className="xl:text-[10px] 2xl:text-[20px]">Group Name</div>
            </option>{" "}
            {groups.map((mem) => {
              const { groupName, groupId } = mem;
              return (
                <option
                  key={groupId}
                  value={groupId}
                  className="xl:text-[10px] 2xl:text-[12px] md:text-[10px] font-sans "
                >
                  <div className="first-letter:uppercase">
                    {groupName === "" ? "Group Name" : groupName}
                  </div>
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <div className="flex flex-col gap-3">
            {error && <div>{error}</div>}
            <div className="flex gap-3 mt-8 items-center">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  className="border-b-2 border-slate-200 outline-none  p-1 xl:w-60 2xl:w-[400px] h-6 bg-transparent text-slate-200"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <select
                className="border border-slate-200 bg-slate-100  w-28 rounded-lg text-slate-900 text-[12px] p-1 outline-none"
                name="members"
                id="members"
                value={paidBy}
                onChange={(e) => {
                  setPaidBy(e.target.value);
                }}
              >
                <option
                  className="text-[10px] flex w-full font-sans items-center "
                  value=""
                >
                  <div>PaidBy</div>
                </option>{" "}
                {groupMembers &&
                  groupMembers.map((mem) => {
                    const { displayName, uid } = mem;
                    return (
                      <option
                        key={uid}
                        value={uid}
                        className="text-[10px] font-sans "
                      >
                        <div className="first-letter:uppercase">
                          {displayName === name ? "You" : displayName}
                        </div>
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 xl:ml-[285px] 2xl:ml-[315px] mt-5 md:ml-[305px]">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          className="border-b-2 border-slate-200 outline-none bg-transparent p-1 xl:w-60 2xl:w-[400px] h-6 appearance-none text-slate-200"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <select
          className="border border-slate-200 bg-slate-100 rounded-lg w-40 outline-none text-slate-900 text-[12px] p-1"
          value={strategy}
          onChange={(e) => {
            setStrategy(e.target.value);
          }}
        >
          <option
            className="text-[10px] flex w-full font-sans text-white items-center "
            value=""
          >
            <div>Split equally</div>
          </option>{" "}
          {/* <option className="text-[12px] font-sans" value="equally">
            equally
          </option> */}
          {/* <option className="text-[12px] font-sans" value="unequally">
            unequally
          </option> */}
        </select>
      </div>
      <div className="flex items-center justify-center xl:mt-5 2xl:mt-10 md:mt-5">
        <button
          className="text-slate-300 text-[12px] border border-slate-800 bg-slate-600 p-1 w-20 rounded-lg hover:scale-95"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};
