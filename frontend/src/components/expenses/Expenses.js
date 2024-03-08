import React, { useState } from "react";
import AddExpense from "../groups/Addexpense";
import GroupExpenses from "./GroupExpenses";

export default function Expenses() {
  const [state, setState] = useState(0);
  function Display() {
    switch (state) {
      case 1:
        return "hello";
      default:
        return "hiii";
    }
  }
  return <div>{Display()}</div>;
}
