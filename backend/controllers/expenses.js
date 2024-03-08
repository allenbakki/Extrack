import { db } from "../auth/db.js";
import admin, { auth, verifyToken } from "../auth/firebaseAuth.js";

export async function addExpenses(req, res) {
  const token = req.headers.authorization;

  const {
    members,
    groupId,
    strategy,
    amount,
    paidBy,
    individualAmounts,
    expenseName,
    category,
    date,
  } = req.body.expenseDetails;

  const expenseId = groupId + Date.now();

  let individualAmount;

  try {
    if (
      !amount ||
      !expenseName ||
      (members == [] && !members) ||
      !paidBy ||
      !strategy
    ) {
      throw "all fields are required";
    }
    if (individualAmounts) {
      const sum = Object.values(individualAmounts).reduce((acc, value) => {
        return acc + Number(value);
      }, 0);
      console.log(sum);
      if (sum != Number(amount)) {
        throw "total amount and sum of individual amounts are not equal";
      }
    }
    let paidby;
    const decodedToken = await verifyToken(token);
    if (paidBy === "You") {
      paidby = decodedToken.userId;
    } else {
      paidby = paidBy;
    }

    const ref = db.collection("groups");
    const expenseRef = ref.doc(groupId).collection("expenses");
    const expenseDoc = expenseRef.doc(expenseId);
    // const balanceRef = ref.collection("balances");

    let eachPersonExpense = {};
    if (strategy === "equally") {
      individualAmount = amount / members.length;
      members.forEach((element) => {
        eachPersonExpense[element] = individualAmount;
      });
    } else if (strategy !== "equally") {
      eachPersonExpense = individualAmounts;
    }

    await expenseDoc.set(
      {
        expenseName: expenseName,
        expenseId: expenseId,
        paidBy: paidby,
        amount: amount,
        participants: members,
        individualMemberAmount: eachPersonExpense,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        strategy: strategy,
        category: category,
        date: date,
      },
      { merge: true }
    );

    try {
      console.log("balances to be added");

      await balances(expenseId, groupId);
      console.log("balances to be added");
    } catch (error) {
      console.log(error);
    }
    await res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error(error);
    if (error === "all fields are required") {
      return res.status(400).json("All fields are required");
    } else if (
      error === "total amount and sum of individual amounts are not equal"
    ) {
      return res
        .status(400)
        .json("Total amount and sum of individual amounts are not equal");
    }

    res.status(500).json({ message: "Error in saving data" });
  }
}

export async function updateExpenses(req, res) {
  const token = req.headers.authorization;

  const {
    expenseId,
    members,
    groupId,
    strategy,
    amount,
    paidBy,
    individualAmounts,
    expenseName,
    category,
    date,
    createdAt,
  } = req.body.expenseDetails;

  let individualAmount;

  try {
    if (
      !amount ||
      !expenseName ||
      (members == [] && !members) ||
      !paidBy ||
      !strategy
    ) {
      throw "all fields are required";
    }

    if (individualAmounts) {
      const sum = Object.values(individualAmounts).reduce((acc, value) => {
        return acc + Number(value);
      }, 0);
      console.log(sum);
      if (sum != Number(amount)) {
        throw "total amount and sum of individual amounts are not equal";
      }
    }

    await updateBalnace(expenseId, groupId);
    let paidby;
    const decodedToken = await verifyToken(token);
    if (paidBy === "You") {
      paidby = decodedToken.userId;
    } else {
      paidby = paidBy;
    }

    const ref = db.collection("groups");
    const expenseRef = ref.doc(groupId).collection("expenses");
    const expenseDoc = expenseRef.doc(expenseId);
    const expenseDocget = (await expenseDoc.get()).data();

    let individualMemberAmount = expenseDocget.individualMemberAmount || {};
    individualMemberAmount = {};

    let eachPersonExpense = {};
    if (strategy === "equally") {
      individualAmount = amount / members.length;
      members.forEach((element) => {
        eachPersonExpense[element] = individualAmount;
      });
    } else if (strategy !== "equally") {
      eachPersonExpense = individualAmounts;
    }

    await expenseDoc.set({
      expenseName: expenseName,
      expenseId: expenseId,
      paidBy: paidby,
      amount: amount,
      participants: members,
      individualMemberAmount: eachPersonExpense,
      updatedAt: Date.now(),
      strategy: strategy,
      category: category,
      date: date,
      createdAt: createdAt,
    });

    let amounts = expenseDocget.individualMemberAmount || {};
    let memberss = expenseDocget.members || [];

    console.log("Amounts", amounts);
    console.log("Amounts", memberss);

    try {
      console.log("balances to be added");

      await balances(expenseId, groupId);
      console.log("balances to be added");
    } catch (error) {
      console.log(error);
    }
    await res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error(error);
    if (error === "all fields are required") {
      return res.status(400).json("All fields are required");
    } else if (
      error === "total amount and sum of individual amounts are not equal"
    ) {
      return res
        .status(400)
        .json("Total amount and sum of individual amounts are not equal");
    }
    res.status(500).json({ message: "Error in saving data" });
  }
}

export async function getExpenseOfGroup(req, res) {
  const token = req.headers.authorization;
  const { groupId } = req.body;
  try {
    const decodedToken = await verifyToken(token);
    const ref = db.collection("groups");
    const groupRef = ref.doc(groupId);
    const expenses = groupRef.collection("expenses");
    const expenseData = await expenses.get();
    let ledger = {};

    expenseData.docs.forEach((expense) => {
      const eachExpenseDoc = expense.data();
      let payerName = eachExpenseDoc.paidBy;
      const amount = eachExpenseDoc.amount;
      const individualAmount = eachExpenseDoc.individualMemberAmount || {};

      let payerExpense = individualAmount[payerName];

      if (ledger[payerName]) {
        ledger[payerName].netExpense += payerExpense;
        ledger[payerName].amountPaid += Number(amount);
      } else {
        ledger[payerName] = {
          amountPaid: Number(amount),
          netExpense: payerExpense,
          owesTo: {},
          owedBy: {},
        };
      }

      for (const key in individualAmount) {
        if (key !== payerName) {
          let payeeName = key;
          let payeeExpense = individualAmount[key];

          if (!ledger[payeeName]) {
            ledger[payeeName] = {
              netExpense: 0,
              owesTo: {},
              owedBy: {},
              amountPaid: 0,
            };
          }

          if (ledger[payerName].owedBy[payeeName]) {
            ledger[payerName].owedBy[payeeName] += payeeExpense;
          } else {
            ledger[payerName].owedBy[payeeName] = payeeExpense;
          }

          if (ledger[payeeName].owesTo[payerName]) {
            ledger[payeeName].owesTo[payerName] += payeeExpense;
          } else {
            ledger[payeeName].owesTo[payerName] = payeeExpense;
          }

          ledger[payeeName].netExpense -= payeeExpense;
        }
      }
    });

    const userGroupData = ledger[decodedToken.userId];
    const owesTo = userGroupData.owesTo;
    const owedBy = userGroupData.owedBy;
    const owesToIds = Object.keys(owesTo);
    const owedByIds = Object.keys(owedBy);

    for (let key in owesTo) {
      if (owedBy.hasOwnProperty(key)) {
        if (owesTo[key] > owedBy[key]) {
          owesTo[key] = owesTo[key] - owedBy[key];
          owedBy[key] = 0;
        } else {
          owedBy[key] = owedBy[key] - owesTo[key];
          owesTo[key] = 0;
        }
      }
    }

    const mergedSet = new Set([...owedByIds, ...owesToIds]);
    const mergedList = Array.from(mergedSet);

    const transformIds = mergedList.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        displayName: user.displayName,
      };
    });

    const convertedObject = filteredUserRecords.reduce((acc, user) => {
      acc[user.uid] = user.displayName;
      return acc;
    }, {});

    const updatedOwesTo = replaceIdsWithDisplayNames(owesTo, convertedObject);
    const updatedOwedBy = replaceIdsWithDisplayNames(owedBy, convertedObject);

    const updatedUserGroupData = {
      amountPaid: userGroupData.amountPaid,
      netExpense: userGroupData.netExpense,
      owesTo: updatedOwesTo,
      owedBy: updatedOwedBy,
    };

    console.log("updatedUserGroupData", updatedUserGroupData);
    res.json(updatedUserGroupData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the expenses." });
  }
}

const replaceIdsWithDisplayNames = (obj, convertedObject) => {
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const displayName = convertedObject[key] || key;
      newObj[displayName] = obj[key];
    }
  }
  return newObj;
};

export const replaceIdsWithDisplayNamesString = (obj, convertedObject) => {
  console.log(convertedObject, obj);
  console.log(convertedObject[obj]);
  const displayName = convertedObject[obj] || obj;
  console.log(displayName);

  return displayName;
};

export async function getEachExpenseOfGroup(req, res) {
  const token = req.headers.authorization;
  const { groupId } = req.body;
  try {
    const decodedToken = await verifyToken(token);
    const ref = db.collection("groups");
    const groupRef = ref.doc(groupId);
    const groupDocData = await groupRef.get();
    const groupData = groupDocData.data();
    const groupMembers = groupData.members || [];
    const expenses = groupRef.collection("expenses");
    const snapshot = await expenses.orderBy("createdAt", "desc").get();

    const transformIds = groupMembers.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        displayName: user.displayName,
      };
    });

    const idDisplayName = filteredUserRecords.reduce((acc, user) => {
      acc[user.uid] = user.displayName;
      return acc;
    }, {});

    const expensesData = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log("data", data);
      let paidBy, amountLent, borrowed;
      if (data.paidBy === decodedToken.userId) {
        paidBy = "You";
        amountLent =
          data.amount -
          Number(
            data.individualMemberAmount.hasOwnProperty(decodedToken.userId)
              ? data.individualMemberAmount[decodedToken.userId]
              : 0
          );
        borrowed = 0;
      } else {
        amountLent = 0;
        borrowed = Number(
          data.individualMemberAmount.hasOwnProperty(decodedToken.userId)
            ? data.individualMemberAmount[decodedToken.userId]
            : 0
        );
        paidBy = replaceIdsWithDisplayNamesString(data.paidBy, idDisplayName);
      }
      expensesData.push({
        id: data.expenseId,
        name: data.expenseName,
        paidBy: paidBy,
        amount: data.amount,
        lent: amountLent,
        borrowed: borrowed,
      });
    });

    console.log("expensesData", expensesData);
    res.json(expensesData);
  } catch (error) {}
}

async function updateBalnace(expenseId, groupId) {
  const ref = db.collection("groups");

  const groupRef = ref.doc(groupId);

  const expenses = groupRef.collection("expenses");
  const expenseDoc = await expenses.doc(expenseId).get();
  const expenseData = expenseDoc.data();
  const balanceRef = groupRef.collection("balances");

  const paidBy = expenseData.paidBy || "";
  const amountPaid = expenseData.amount || 0;
  const individualMemberAmount = expenseData.individualMemberAmount || {};

  const payerDocRef = balanceRef.doc(paidBy);
  const payersDocData = await payerDocRef.get();
  const payerData = payersDocData.data();
  console.log(payerData, paidBy);
  const paidByPayer =
    payerData && payerData.hasOwnProperty(paidBy) ? payerData[paidBy] : 0;
  const paidByPayerExpense = payerData.expense || 0;

  console.log(paidByPayer, paidByPayer);
  await payerDocRef.set(
    {
      [paidBy]: Number(paidByPayer) - Number(amountPaid),
      expense:
        Number(paidByPayerExpense) -
        Number(
          individualMemberAmount.hasOwnProperty(paidBy)
            ? individualMemberAmount[paidBy]
            : 0
        ),
    },
    { merge: true }
  );

  Object.keys(individualMemberAmount).forEach(async (ids) => {
    if (ids !== paidBy && ids != "expense") {
      const participantDocRef = balanceRef.doc(ids);
      const participantDocRefData = await participantDocRef.get();
      const participantData = participantDocRefData.data();
      const pacipantDebt =
        participantData && participantData.hasOwnProperty(paidBy)
          ? participantData[paidBy]
          : 0;
      const paidBypayerDebt =
        payerData && payerData.hasOwnProperty(ids) ? payerData[ids] : 0;
      const pacipantDebtExpense = participantData.expense || 0;

      await participantDocRef.set(
        {
          [paidBy]: Number(pacipantDebt) - Number(individualMemberAmount[ids]),
          expense:
            Number(pacipantDebtExpense) - Number(individualMemberAmount[ids]),
        },
        { merge: true }
      );
      await payerDocRef.set(
        {
          [ids]: Number(paidBypayerDebt) + Number(individualMemberAmount[ids]),
        },
        { merge: true }
      );
    }
  });
}

export async function deleteExpense(req, res) {
  const token = req.headers.authorization;
  const { expenseId, groupId } = req.body;
  try {
    const decodedToken = await verifyToken(token);
    await updateBalnace(expenseId, groupId);
    const ref = db.collection("groups");

    const groupRef = ref.doc(groupId);

    const expenses = groupRef.collection("expenses");
    // const expenseDoc = await expenses.doc(expenseId).get();
    // const expenseData = expenseDoc.data();

    // const balanceRef = groupRef.collection("balances");

    // const paidBy = expenseData.paidBy || "";
    // const amountPaid = expenseData.amount || 0;
    // const individualMemberAmount = expenseData.individualMemberAmount || {};

    // const payerDocRef = balanceRef.doc(paidBy);
    // const payersDocData = await payerDocRef.get();
    // const payerData = payersDocData.data();
    // console.log(payerData, paidBy);
    // const paidByPayer =
    //   payerData && payerData.hasOwnProperty(paidBy) ? payerData[paidBy] : 0;
    // const paidByPayerExpense = payerData.expense || 0;

    // console.log(paidByPayer, paidByPayer);
    // await payerDocRef.set(
    //   {
    //     [paidBy]: Number(paidByPayer) - Number(amountPaid),
    //     expense:
    //       Number(paidByPayerExpense) - Number(individualMemberAmount[paidBy]),
    //   },
    //   { merge: true }
    // );

    // Object.keys(individualMemberAmount).forEach(async (ids) => {
    //   if (ids !== paidBy && ids != "expense") {
    //     const participantDocRef = balanceRef.doc(ids);
    //     const participantDocRefData = await participantDocRef.get();
    //     const participantData = participantDocRefData.data();
    //     const pacipantDebt =
    //       participantData && participantData.hasOwnProperty(paidBy)
    //         ? participantData[paidBy]
    //         : 0;
    //     const paidBypayerDebt =
    //       payerData && payerData.hasOwnProperty(ids) ? payerData[ids] : 0;
    //     const pacipantDebtExpense = participantData.expense || 0;

    //     await participantDocRef.set(
    //       {
    //         [paidBy]: pacipantDebt - Number(individualMemberAmount[ids]),
    //         expense: pacipantDebtExpense - Number(individualMemberAmount[ids]),
    //       },
    //       { merge: true }
    //     );
    //     await payerDocRef.set(
    //       {
    //         [ids]: paidBypayerDebt + Number(individualMemberAmount[ids]),
    //       },
    //       { merge: true }
    //     );
    //   }
    // });
    await expenses.doc(expenseId).delete();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error !!! Expense not deleted" });
  }
}

async function balances(expenseId, groupId) {
  console.log(expenseId, groupId);
  const ref = db.collection(`groups`);
  const groupRef = ref.doc(groupId);
  const balanceRef = groupRef.collection("balances");
  const expenseRef = groupRef.collection(`expenses`);
  const expenseDocRef = await expenseRef.doc(expenseId).get();
  const expenseData = expenseDocRef.data();
  const paidBy = expenseData.paidBy || "";
  const amountPaid = expenseData.amount || 0;
  const individualMemberAmount = expenseData.individualMemberAmount || {};

  const payerDocRef = balanceRef.doc(paidBy);
  const payersDocData = await payerDocRef.get();
  const payerData = payersDocData.data();
  console.log(payerData, paidBy);
  const paidByPayer =
    payerData && payerData.hasOwnProperty(paidBy) ? payerData[paidBy] : 0;
  const paidByPayerExpense =
    payerData && payerData.hasOwnProperty("expense") ? payerData.expense : 0;

  console.log(paidByPayer, paidByPayer);
  await payerDocRef.set(
    {
      [paidBy]: Number(paidByPayer) + Number(amountPaid),
      expense:
        Number(paidByPayerExpense) +
        Number(
          individualMemberAmount.hasOwnProperty(paidBy)
            ? individualMemberAmount[paidBy]
            : 0
        ),
    },
    { merge: true }
  );

  Object.keys(individualMemberAmount).forEach(async (ids) => {
    if (ids !== paidBy) {
      const participantDocRef = balanceRef.doc(ids);
      const participantDocRefData = await participantDocRef.get();
      const participantData = participantDocRefData.data();
      const pacipantDebt =
        participantData && participantData.hasOwnProperty(paidBy)
          ? participantData[paidBy]
          : 0;
      const pacipantDebtExpense =
        participantData && participantData.hasOwnProperty("expense")
          ? participantData.expense
          : 0;

      const paidBypayerDebt =
        payerData && payerData.hasOwnProperty(ids) ? payerData[ids] : 0;

      await participantDocRef.set(
        {
          [paidBy]: Number(pacipantDebt) + Number(individualMemberAmount[ids]),
          expense:
            Number(pacipantDebtExpense) + Number(individualMemberAmount[ids]),
        },
        { merge: true }
      );
      await payerDocRef.set(
        {
          [ids]: Number(paidBypayerDebt) - Number(individualMemberAmount[ids]),
        },
        { merge: true }
      );
    }
  });
}

const getGroupMembers = async (groupId) => {
  try {
    const ref = db.collection("groups");
    const groupsRef = await ref.doc(groupId).get();
    const groupData = groupsRef.data();
    const members = groupData.members || [];
    const transformIds = members.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        displayName: user.displayName,
      };
    });

    const idDisplayName = filteredUserRecords.reduce((acc, user) => {
      acc[user.uid] = user.displayName;
      return acc;
    }, {});

    return idDisplayName;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export async function getBalanceOfEachGroup(req, res) {
  const token = req.headers.authorization;
  const { groupId } = req.body;
  try {
    const decodedToken = await verifyToken(token);
    const id = decodedToken.userId;
    console.log("id", id);

    const ref = db.collection("groups");
    const settleRef = ref.doc(groupId).collection("settleUps");

    console.log("settleUp");

    const balanceRef = ref.doc(groupId).collection("balances");

    const balanceDoc = await balanceRef.doc(decodedToken.userId).get();
    const balanceData = balanceDoc.data();
    const settleUpUserData = (
      await settleRef.doc(decodedToken.userId).get()
    ).data();
    const getDataOfGroupMembers = await getGroupMembers(groupId);
    console.log("getDataOfGroupMembers", getDataOfGroupMembers);
    if (!balanceDoc) {
      throw "No expense Added";
    }
    const amountPaid = Number(balanceData[id]) || 0;

    const expense = Number(balanceData.expense) || 0;
    let getBack = Number(0);
    let youOwe = Number(0);
    let settleUp = Number(0);

    for (const key in settleUpUserData) {
      settleUp += Number(settleUpUserData[key]);
    }

    for (const key in balanceData) {
      if (Object.hasOwnProperty(id)) {
      }
      if (Number(balanceData[key] <= 0) && key != id && key != "expense") {
        getBack += Math.abs(Number(balanceData[key]));
      } else if (
        Number(balanceData[key] >= 0) &&
        key != id &&
        key != "expense"
      ) {
        youOwe += Number(balanceData[key]);
      }
    }
    const getBackAmount = [];
    const YouOweAmount = [];

    Object.keys(balanceData).forEach((key) => {
      if (key != id && balanceData[key] < 0 && key != "expense") {
        console.log(key);
        let name = replaceIdsWithDisplayNamesString(key, getDataOfGroupMembers);
        console.log(name);
        const amount = Number(balanceData[key]);
        getBackAmount.push({
          id: key,
          name: name,
          amount: Math.abs(amount),
        });
      }
      if (key != id && balanceData[key] > 0 && key != "expense") {
        console.log(key);
        let name = replaceIdsWithDisplayNamesString(key, getDataOfGroupMembers);
        console.log(name);
        const amount = balanceData[key];
        YouOweAmount.push({
          id: key,
          name: name,
          amount: amount,
        });
      }
    });

    console.log(
      "amountPaid",
      amountPaid,
      "getBack",
      getBack,
      "YouOwe",
      youOwe,
      "getBackAmount",
      getBackAmount,
      YouOweAmount
    );

    res.status(200).json({
      expense,
      amountPaid,
      getBack,
      youOwe,
      getBackAmount,
      YouOweAmount,
      settleUp,
    });
  } catch (error) {
    console.log(error);
    if (error === "No expense Added") {
      return res.status(400).json({ message: "No expense Added" });
    }
    res.status(500).json({ message: "Server error" });
  }
}

export async function getBalanceOfAllGroups(req, res) {
  const token = req.headers.authorization;
  try {
    const decodedToken = await verifyToken(token);
    const id = decodedToken.userId;
    console.log("id", id);
    const userRefDoc = db.collection("users");
    const userRef = userRefDoc.doc(decodedToken.userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const groupIds = userData.groupIds || [];
    console.log(groupIds);

    if (groupIds.length === 0) {
      return res.json({ message: "No groups found" });
    }

    const ref = db.collection("groups");
    let getBack = 0;
    let youOwe = 0;
    let settleUp = 0;
    let expense = 0;
    let amountPaid = 0;
    const getBackAmount = [];
    const YouOweAmount = [];
    const eachGroupExpense = [];

    for (const groupId of groupIds) {
      const eachGroup = await ref.doc(groupId).get();
      const eacgGroupRef = eachGroup.data();
      const eachGroupName = eacgGroupRef.groupName || "";
      console.log("eachGroupName", eachGroupName);
      const settleRef = ref.doc(groupId).collection("settleUps");
      const balanceRef = ref.doc(groupId).collection("balances");

      const [balanceDoc, settleUpUserData, getDataOfGroupMembers] =
        await Promise.all([
          balanceRef.doc(decodedToken.userId).get(),
          settleRef.doc(decodedToken.userId).get(),
          getGroupMembers(groupId),
        ]);

      if (!balanceDoc.exists) {
        continue;
      }

      const balanceData = balanceDoc.data();
      let groupExpense = Number(balanceData.expense) || 0;

      amountPaid += Number(balanceData[id]) || 0;
      expense += Number(balanceData.expense) || 0;
      settleUp += Object.values(settleUpUserData.data() || {}).reduce(
        (acc, val) => acc + Number(val),
        0
      );
      eachGroupExpense.push({
        groupName: eachGroupName,
        expense: groupExpense,
      });

      for (const [key, value] of Object.entries(balanceData)) {
        if (key !== id && key !== "expense") {
          if (value < 0) {
            getBack += Math.abs(Number(value));
            let name = replaceIdsWithDisplayNamesString(
              key,
              getDataOfGroupMembers
            );
            const existingBackIndex = getBackAmount.findIndex(
              (obj) => obj.id === key
            );
            if (existingBackIndex !== -1) {
              getBackAmount[existingBackIndex].amount += Math.abs(value);
            } else {
              getBackAmount.push({ id: key, name, amount: Math.abs(value) });
            }
          } else if (value > 0 && key != id && key != "expense") {
            youOwe += Number(value);
            let name = replaceIdsWithDisplayNamesString(
              key,
              getDataOfGroupMembers
            );
            const existingOweIndex = YouOweAmount.findIndex(
              (obj) => obj.id === key
            );
            if (existingOweIndex !== -1) {
              YouOweAmount[existingOweIndex].amount += value;
            } else {
              YouOweAmount.push({ id: key, name, amount: value });
            }
          }
        }
      }
    }
    console.log(
      "amountPaid",
      amountPaid,
      "getBack",
      getBack,
      "youOwe",
      youOwe,
      "getBackAmount",
      getBackAmount,
      "YouOweAmount",
      YouOweAmount
    );
    updateAmounts(getBackAmount, YouOweAmount);

    res.status(200).json({
      expense,
      amountPaid,
      getBack,
      youOwe,
      getBackAmount,
      YouOweAmount,
      settleUp,
      eachGroupExpense,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No expense added") {
      return res.status(400).json({ message: "No expense added" });
    }
    res.status(500).json({ message: "Server error" });
  }
}

function updateAmounts(getBackAmount, YouOweAmount) {
  for (let i = 0; i < getBackAmount.length; i++) {
    for (let j = 0; j < YouOweAmount.length; j++) {
      if (getBackAmount[i].id === YouOweAmount[j].id) {
        let difference = Math.min(
          getBackAmount[i].amount,
          YouOweAmount[j].amount
        );
        getBackAmount[i].amount -= difference;
        YouOweAmount[j].amount -= difference;
      }
    }
  }
}

//done
export async function settleup(req, res) {
  const token = req.headers.authorization;
  const { personID, groupId, type, amount } = req.body;
  console.log(personID);
  try {
    const decodedToken = await verifyToken(token);
    const paidBy = decodedToken.userId;
    const ref = db.collection("groups");

    const groupRef = ref.doc(groupId);
    const balanceRef = groupRef.collection("balances");

    const payerDocRefs = balanceRef.doc(paidBy);

    const payerDocRef = await balanceRef.doc(paidBy).get();
    const lenderDocRefs = balanceRef.doc(personID);

    const lenderDocRef = await balanceRef.doc(personID).get();
    const payerLenderDoc = lenderDocRef.data();
    const payerLenderData = payerLenderDoc[paidBy] || 0;
    let payerLenderAmount = Number(0);
    console.log("payerLenderData", payerLenderData);

    const lenderPayerDoc = payerDocRef.data();
    const lenderPayerData = lenderPayerDoc[personID] || 0;
    console.log("lenderPayerData", lenderPayerData);
    let lenderPayerDataAmount = Number(0);

    if (type === "owe") {
      payerLenderAmount = payerLenderData + amount;
      lenderPayerDataAmount = lenderPayerData - amount;
    } else {
      payerLenderAmount = Math.abs(payerLenderData) - amount;
      lenderPayerDataAmount = lenderPayerData + amount;
    }
    await payerDocRefs.set(
      {
        [personID]: lenderPayerDataAmount,
      },
      { merge: true }
    );

    await lenderDocRefs.set(
      {
        [paidBy]: payerLenderAmount,
      },
      { merge: true }
    );

    const settleUpRef = groupRef.collection("settleUps");
    const paidsettleUpDocRef = settleUpRef.doc(paidBy);
    const paidsettleUpDocRefGet = await paidsettleUpDocRef.get();
    const paidsettleUpDocRefData = paidsettleUpDocRefGet.data();
    const paidByamount =
      paidsettleUpDocRefData && paidsettleUpDocRefData.hasOwnProperty(personID)
        ? paidsettleUpDocRefData[personID]
        : 0;
    const finalPAidByAmount = Number(paidByamount) + Number(amount);

    const lentsettleUpDocRef = settleUpRef.doc(personID);
    const lentsettleUpDocRefGet = await lentsettleUpDocRef.get();
    const lentsettleUpDocRefData = lentsettleUpDocRefGet.data();
    const lentByamount =
      lentsettleUpDocRefData && lentsettleUpDocRefData.hasOwnProperty(paidBy)
        ? lentsettleUpDocRefData[paidBy]
        : 0;
    const finalLentByAmount = Number(lentByamount) + Number(amount);

    await paidsettleUpDocRef.set(
      {
        [personID]: finalPAidByAmount,
      },
      { merge: true }
    );

    await lentsettleUpDocRef.set(
      {
        [paidBy]: finalLentByAmount,
      },
      { merge: true }
    );

    const settleUpId = groupId + "settleUps" + Date.now();
    const settleUpDataRef = groupRef.collection("settleUpData");
    const settleUpDataDoc = settleUpDataRef.doc(settleUpId);
    await settleUpDataDoc.set(
      {
        paidBy: paidBy,
        personID: personID,
        type: type,
        amount: amount,
        paidAt: Date.now(),
      },
      { merge: true }
    );

    console.log("settled");

    res.status(200).json({ message: "Setlled up" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error !!! Expense not settled" });
  }
}

export async function getSettleUps(req, res) {
  const token = req.headers.authorization;
  const { groupId } = req.body;

  try {
    const decodedToken = await verifyToken(token);
    const paidBy = decodedToken.userId;
    const ref = db.collection("groups");
    const groupRef = ref.doc(groupId);
    const groupDocData = await groupRef.get();
    const groupData = groupDocData.data();
    const groupMembers = groupData.members || [];
    const settleUpDataRef = groupRef.collection("settleUpData");
    const snapshot = await settleUpDataRef.orderBy("paidAt", "desc").get();

    const transformIds = groupMembers.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        displayName: user.displayName,
      };
    });

    const idDisplayName = filteredUserRecords.reduce((acc, user) => {
      acc[user.uid] = user.displayName;
      return acc;
    }, {});

    const settleUpData = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let paidBy;
      if (data.paidBy === decodedToken.userId) {
        paidBy = "You";
      } else {
        paidBy = replaceIdsWithDisplayNamesString(data.paidBy, idDisplayName);
      }
      const personID = replaceIdsWithDisplayNamesString(
        data.personID,
        idDisplayName
      );
      settleUpData.push({
        amount: data.amount,
        paidBy: paidBy,
        personID: personID,
        type: data.type,
      });
    });
    res.status(200).json({ settleUpData });
  } catch (error) {
    console.log(error);
  }
}

export async function addExpense(req, res) {
  const token = req.headers.authorization;

  const { groupId, strategy, amount, paidBy, title } = req.body;

  const expenseId = groupId + Date.now();

  let individualAmount;

  try {
    if (!amount || !title || !paidBy || !strategy || !groupId) {
      throw "all fields are required";
    }
    const decodedToken = await verifyToken(token);

    const date = new Date(Date.now());
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;

    // `${day < 10 ? "0" + day : day}-${
    //   month < 10 ? "0" + month : month
    // }-`;

    const ref = db.collection("groups");
    const membersref = await ref.doc(groupId).get();
    const membersDoc = membersref.data();
    const members = membersDoc.members || [];
    const expenseRef = ref.doc(groupId).collection("expenses");
    const expenseDoc = expenseRef.doc(expenseId);
    // const balanceRef = ref.collection("balances");

    let eachPersonExpense = {};
    if (strategy === "equally") {
      individualAmount = amount / members.length;
      members.forEach((element) => {
        eachPersonExpense[element] = individualAmount;
      });
    }

    await expenseDoc.set(
      {
        expenseName: title,
        expenseId: expenseId,
        paidBy: paidBy,
        category: "other",
        amount: amount,
        participants: members,
        individualMemberAmount: eachPersonExpense,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        strategy: strategy,
        category: "other",
        date: formattedDate,
      },
      { merge: true }
    );
    try {
      console.log("balances to be added");

      await balances(expenseId, groupId);
      console.log("balances to be added");
    } catch (error) {
      console.log(error);
    }
    await res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error(error);
    if (error === "all fields are required") {
      return res.status(400).json("All fields are required");
    }
    res.status(500).json({ message: "Error in saving data" });
  }
}

export async function getEachExpense(req, res) {
  const token = req.headers.authorization;
  const { groupId, expenseId } = req.body;
  try {
    const decodedToken = await verifyToken(token);
    const ref = db.collection("groups");
    const groupRef = ref.doc(groupId);
    const groupDocData = await groupRef.get();
    const groupData = groupDocData.data();
    const groupMembers = groupData.members || [];
    const expenses = groupRef.collection("expenses");
    const expenseRefDoc = await expenses.doc(expenseId).get();
    const expenseData = expenseRefDoc.data();

    const transformIds = groupMembers.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        displayName: user.displayName,
      };
    });

    const idDisplayName = filteredUserRecords.reduce((acc, user) => {
      acc[user.uid] = user.displayName;
      return acc;
    }, {});

    console.log("data", expenseData);

    // const expensesData = [];
    // console.log("data", data);
    // let paidBy, amountLent, borrowed;
    // if (data.paidBy === decodedToken.userId) {
    //   paidBy = "You";
    //   amountLent =
    //     data.amount - data.individualMemberAmount[decodedToken.userId];
    //   borrowed = 0;
    // } else {
    //   amountLent = 0;
    //   borrowed = data.individualMemberAmount[decodedToken.userId];
    //   paidBy = replaceIdsWithDisplayNamesString(data.paidBy, idDisplayName);
    // }
    // expensesData.push({
    //   id: data.expenseId,
    //   name: data.expenseName,
    //   paidBy: paidBy,
    //   amount: data.amount,
    //   lent: amountLent,
    //   borrowed: borrowed,
    // });

    // console.log("expensesData", expensesData);
    res.json(expenseData);
  } catch (error) {}
}
