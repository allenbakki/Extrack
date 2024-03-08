import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
const BASE_URL = "http://localhost:8000/";

const getIncome = async (uid) => {
  try {
    const response = await axios.get(`${BASE_URL}get-income/${uid}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteIncome = async (deleteDetails) => {
  try {
    const response = await axios.post(
      `${BASE_URL}delete-income`,
      deleteDetails
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const addIncome = async (income) => {
  try {
    const response = await axios.post(`${BASE_URL}add-income`, income);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const totalIncome = async (uid) => {
  const response = await axios.get(`${BASE_URL}total-income/`, uid);
  return response.totalIncome;
};

export { getIncome, deleteIncome, addIncome, totalIncome };
