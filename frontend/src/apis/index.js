import axios from "axios";

const BASE_URL = "http://localhost:8000/";

const signUpCred = async (signUpDetails) => {
  try {
    const response = await axios.post(`${BASE_URL}signUp`, signUpDetails);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log("error", error.response.data.error);
    return error.response.data.error;
  }
};

const createGroup = async (accessToken, createGroupDetails) => {
  try {
    const response = await axios.post(
      `${BASE_URL}createGroup`,
      { createGroupDetails },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const addExpense = async (accessToken, expenseDetails) => {
  console.log("ExpenseDetails", expenseDetails);
  try {
    const response = await axios.post(
      `${BASE_URL}addExpenses`,
      { expenseDetails },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

const updateExpense = async (accessToken, expenseDetails) => {
  console.log("ExpenseDetails", expenseDetails);
  try {
    const response = await axios.post(
      `${BASE_URL}updateExpenses`,
      { expenseDetails },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

const addExpenseEqually = async (
  accessToken,
  strategy,
  groupId,
  paidBy,
  amount,
  title
) => {
  console.log("ExpenseDetails");
  try {
    const response = await axios.post(
      `${BASE_URL}addExpense`,
      { strategy, groupId, paidBy, amount, title },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const sentFriendReq = async (accessToken, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}sentFriendreq`,
      { email },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data); // Access the response data using response.data
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error adding friend:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

const deleteFriendReq = async (accessToken, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}deleteFriendReq`,
      { email },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data); // Access the response data using response.data
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error adding friend:", error);
  }
};

const deleteFriend = async (accessToken, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}deleteFriend`,
      { email },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data); // Access the response data using response.data
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error adding friend:", error);
  }
};

const addFriends = async (accessToken, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}addFriend`,
      { email },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data); // Access the response data using response.data
    return response.data; // Return the response data
  } catch (error) {
    console.log("Error adding friend:", error);
  }
};

const getReceivedFriendReq = async (accessToken) => {
  const response = await axios.get(`${BASE_URL}friendReqReceived`, {
    headers: { Authorization: accessToken },
  });
  if (response.status === 403) {
  }
  return response.data;
};

const getFriends = async (accessToken) => {
  const response = await axios.get(`${BASE_URL}friends`, {
    headers: { Authorization: accessToken },
  });
  if (response.status === 403) {
  }
  return response.data;
};

const getGroups = async (accessToken) => {
  const response = await axios.get(
    `${BASE_URL}getGroups`,

    {
      headers: { Authorization: accessToken },
    }
  );
  if (response.status === 403) {
  }
  return response.data;
};

const getGroupMembers = async (accessToken, groupId) => {
  const response = await axios.post(
    `${BASE_URL}getGroupMembers`,
    { groupId: groupId },

    {
      headers: { Authorization: accessToken },
    }
  );
  if (response.status === 403) {
  }
  console.log("groupmeneber", response);
  return response;
};

const deleteFriends = async (deletionDetails) => {
  try {
    const response = await axios.post(`${BASE_URL}update/`, deletionDetails);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const loginCred = async (loginDetail) => {
  try {
    const response = await axios.post(`${BASE_URL}login`, loginDetail);

    return response.data;
  } catch (error) {
    console.log(error);
    return "Invalid Credentials";
  }
};

const getEachExpenseOfGroup = async (accessToken, groupId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}getEachExpenseOfGroup`,
      { groupId },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getEachExpense = async (accessToken, groupId, expenseId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}getEachExpense`,
      { groupId, expenseId },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getBalanceOfEachGroup = async (accessToken, groupId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}getBalanceOfEachGroup`,
      { groupId },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log("balance of group", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteExpense = async (accessToken, groupId, expenseId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}deleteExpense`,
      { groupId, expenseId },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const settleUpExpense = async (
  accessToken,
  groupId,
  personID,
  type,
  amount
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}settleup`,
      {
        groupId,
        personID,
        type,
        amount,
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getSettleUps = async (accessToken, groupId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}getSettleUps`,
      {
        groupId,
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getBalanceOfAllGroups = async (accessToken) => {
  try {
    const response = await axios.get(
      `${BASE_URL}getBalanceOfAllGroups`,

      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export {
  loginCred,
  getFriends,
  signUpCred,
  addFriends,
  sentFriendReq,
  getReceivedFriendReq,
  getGroups,
  getGroupMembers,
  createGroup,
  deleteFriendReq,
  deleteFriend,
  addExpense,
  getEachExpenseOfGroup,
  getBalanceOfEachGroup,
  deleteExpense,
  settleUpExpense,
  getSettleUps,
  getBalanceOfAllGroups,
  addExpenseEqually,
  getEachExpense,
  updateExpense,
};
