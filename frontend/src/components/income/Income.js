import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addIncome, getIncome, deleteIncome } from "../../apis/income";
import { useGlobalContext } from "../../context/GlobalContext";
import IncomeItem from "./IncomeItems";
export default function Income() {
  const { uid } = useGlobalContext();

  const [income, SetIncome] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    uid: uid,
  });

  const [incomes, setIncomes] = useState([]);

  const { title, amount, category, date } = income;
  console.log(typeof income);

  const handleChange = (name) => (e) => {
    SetIncome({ ...income, [name]: e.target.value });
  };

  useEffect( () => {
    console.log(uid);
    getIncome(uid).then((response) => {
      const list = response;
      setIncomes(list);
    });
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();
    addIncome(income).then((response) => {
      SetIncome({
        title: "",
        category: "",
        amount: "",
        date: "",
        uid: uid,
      });
    });
  };
  return (
    <div>
      <div className="border border-white bg-white rounded-xl p-5 text-3xl flex justify-center font-bold">
        Total Income : 50000
      </div>
      <div className=" flex justify-between">
        <div className="flex flex-col border border-white bg-white mt-5 pt-10 pb-10 w-[800px] items-center  rounded-2xl ">
          <form onsubmit={handleSubmit}>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-bold">Title</label>
              <input
                type="text"
                value={title}
                name="title"
                className="border border-black w-[500px] h-10 rounded-xl p-3 "
                onChange={handleChange("title")}
              />
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-bold">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(event) => {
                  SetIncome({ ...income, amount: event.target.value });
                }}
                className="border border-black w-[500px] h-10 rounded-xl p-3 "
              />
            </div>

            <div className="flex flex-col gap-2 text-xl">
              <label className="font-bold">Category</label>

              <select
                required
                className="border border-black w-[300px] p-2 rounded-xl"
                value={category}
                name="category"
                id="category"
                onChange={handleChange("category")}
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="salary">Salary</option>
                <option value="freelancing">Freelancing</option>
                <option value="investments">Investments</option>
                <option value="stocks">Stocks</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="bank">Bank Transfer</option>
                <option value="youtube">Youtube</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col text-xl gap-2">
              <label className="font-bold">Date</label>
              <DatePicker
                selected={date}
                onChange={(date) => {
                  SetIncome({ ...income, date: date });
                }}
                className="border border-black w-48 h-10 p-3 rounded-xl"
              />
            </div>
            <div className="flex justify justify-center mt-10">
              <button
                type="submit"
                onClick={handleSubmit}
                className="border bg-green-600 rounded-xl p-2 transition ease-out hover:scale-105 hover:bg-green-400 mt-2  delay-75"
              >
                Add Income
              </button>
            </div>
          </form>
        </div>
        <div className=" w-[1000px] h-40 overscroll-none">
          {console.log("hello", incomes)}
          {incomes.map((incomess) => {
            console.log("hi", incomes);
            const { id, title, amount, date, category } = incomess;
            return (
              <IncomeItem
                id={id}
                title={title}
                amount={amount}
                date={date}
                type="income"
                category={category}
                deleteItem={deleteIncome}
                setIncomes={setIncomes}
                incomes={incomes}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
