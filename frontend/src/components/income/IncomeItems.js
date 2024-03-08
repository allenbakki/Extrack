import React from "react";
import {
  FaBook,
  FaCreditCard,
  FaDollarSign,
  FaKitMedical,
  FaTrash,
  FaYoutube,
} from "react-icons/fa6";
import { AiOutlineStock } from "react-icons/ai";
import { HiUsers } from "react-icons/hi";
import { GoGraph } from "react-icons/go";
import { FaCalendarTimes, FaCommentAlt, FaWallet } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";
import { TiSocialYoutube } from "react-icons/ti";
import { FaRegCreditCard } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { RiBitCoinFill } from "react-icons/ri";
import { PiBowlFoodFill, PiPiggyBank } from "react-icons/pi";
import { FaBriefcaseMedical } from "react-icons/fa";
import { RiTakeawayFill } from "react-icons/ri";
import { GiClothes, GiFoodChain, GiLoincloth, GiWorld } from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { useGlobalContext } from "../../context/GlobalContext";
function IncomeItem({
  id,
  title,
  amount,
  date,
  category,
  deleteItem,
  type,
  setIncomes,
  incomes,
}) {
  const { uid } = useGlobalContext();
  console.log(id, amount);
  console.log(typeof incomes);

  const removeIncome = () => {
    deleteItem({ uid, id })
      .then((response) => {
        const updatedIncome = Object.values(incomes).filter(
          (income) => income.id !== id
        );
        setIncomes(updatedIncome);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const categoryIcon = () => {
    switch (category) {
      case "salary":
        return <FaMoneyBill size="48" />;
      case "freelancing":
        return <GiWorld size="48" />;
      case "investments":
        return <AiOutlineStock size="48" />;
      case "stocks":
        return <HiUsers size="48" />;
      case "bitcoin":
        return <RiBitCoinFill size="48" />;
      case "bank":
        return <FaCreditCard size="48" />;
      case "youtube":
        return <FaYoutube size="48" />;
      case "other":
        return <PiPiggyBank size="48" />;
      default:
        return <GiWorld size="48" />;
    }
  };

  const expenseCatIcon = () => {
    switch (category) {
      case "education":
        return <FaBook size="48" />;
      case "groceries":
        return <GiFoodChain size="48" />;
      case "health":
        return <FaKitMedical size="48" />;
      case "subscriptions":
        return <PiTelevisionSimpleFill size="48" />;
      case "takeaways":
        return <RiTakeawayFill size="48" />;
      case "clothing":
        return <GiClothes size="48" />;
      case "travelling":
        return <GiWorld size="48" />;
      case "other":
        return <GiWorld size="48" />;
      default:
        return <GiWorld size="48" />;
    }
  };

  return (
    <div className="border-2 border-cyan-400 rounded-xl mb-2 bg-white flex items-center justify-between p-4 mt-5">
      <div className="flex gap-8 items-center">
        <div className=" w-fit h-fit p-1 border border-black rounded-xl">
          {type === "expense" ? expenseCatIcon() : categoryIcon()}{" "}
        </div>

        <div className="flex flex-col gap-2">
          <div className=" font-bold text-xl text-green-900 flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div>{title}</div>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div>
                <FaDollarSign />
              </div>
              <div>{amount}</div>
              <div>
                <FaMoneyBill />
              </div>
              <div>{category}</div>
            </div>
            <div className="flex items-center gap-2 ">
              <div>
                <FaCalendarTimes />
              </div>
              <div> {date}</div>
            </div>
          </div>
        </div>
      </div>

      <button className="self-end" onClick={removeIncome}>
        <FaTrash />
      </button>
    </div>
  );
}

export default IncomeItem;
