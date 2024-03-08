import { Router } from "express";

import { getLogin, getUserDetails } from "../auth/login.js";
import { userRegister } from "../auth/register.js";
import {
  addExpenses,
  getExpenseOfGroup,
  getEachExpenseOfGroup,
  getBalanceOfEachGroup,
  deleteExpense,
  settleup,
  getSettleUps,
  getBalanceOfAllGroups,
  addExpense,
  getEachExpense,
  updateExpenses,
} from "../controllers/expenses.js";
import {
  addFriendRequest,
  sendFriendRequest,
  getFriendReceivedReq,
  getFriends,
  getFriendSentReq,
  deleteFriendRequest,
  deleteFriend,
} from "../controllers/friends.js";
import {
  createGroup,
  updateGroup,
  getGroups,
  getGroupMembers,
} from "../controllers/groups.js";
// import { addIncome, getIncome, totalIncome } from "../controllers/income.js";
// import { deleteIncome } from "../controllers/income.js";
import { refreshAccessToken } from "../auth/firebaseAuth.js";

const router = Router();

router.post("/login", getLogin).post("/signUp", userRegister);
router.post("/add", sendFriendRequest);
router.post("/sentFriendreq", sendFriendRequest);
router.post("/addFriend", addFriendRequest);
router.get("/friendReqReceived", getFriendReceivedReq);
router.get("/friends", getFriends);
router.post("/friendReqSent", getFriendSentReq);
router.post("/deleteFriendReq", deleteFriendRequest);
router.post("/createGroup", createGroup);
router.post("/updateGroup", updateGroup);
router.get("/getGroups", getGroups);
router.post("/getGroupMembers", getGroupMembers);
router.post("/refreshToken", refreshAccessToken);
router.post("/deleteFriend", deleteFriend);
router.post("/addExpenses", addExpenses);
router.post("/getExpenseOfGroup", getExpenseOfGroup);
router.post("/getEachExpenseOfGroup", getEachExpenseOfGroup);
router.post("/getBalanceOfEachGroup", getBalanceOfEachGroup);
router.post("/deleteExpense", deleteExpense);
router.post("/settleup", settleup);
router.post("/getSettleUps", getSettleUps);
router.get("/getBalanceOfAllGroups", getBalanceOfAllGroups);
router.post("/addExpense", addExpense);
router.post("/getEachExpense", getEachExpense);
router.post("/updateExpenses", updateExpenses);

export default router;
