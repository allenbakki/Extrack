import { getDatabase } from "firebase-admin/database";
const db = getDatabase();
const ref = db.ref(`income`);

export async function addIncome(req, res) {
  const { title, amount, category, date, uid } = req.body;
  try {
    if (!title || !category || !date) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (amount < 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be positive number" });
    }
    const addIncomeRef = ref.child(uid);
    await addIncomeRef.push({
      title,
      amount,
      category,
      date,
    });
    res.status(200).json({ message: "Income Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getIncome(req, res) {
  const { uid } = req.params;
  try {
    const getIncomeDetails = ref.child(uid);
    const snapshot = await getIncomeDetails.once("value");
    const data = snapshot.val();
    const newData = Object.entries(data).map(([id, value]) => ({
      ...value,
      id,
    }));
    newData.forEach((obj) => {
      const date = obj.date.split("T")[0];
      obj.date = date;
    });
    newData.sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json(newData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in data fetch" });
  }
}

export async function deleteIncome(req, res) {
  const { id, uid } = req.body;
  console.log(id, uid);
  try {
    const reff = ref.child(uid);
    const deleteIncomes = reff.child(id);
    await deleteIncomes.remove();
    res.status(200).json({ message: "Deleted entry" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}

export async function totalIncome(req, res) {
  const { uid } = req.params;
  try {
    const getIncomeDetails = ref.child(uid);
    const snapshot = await getIncomeDetails.once("value");
    const data = snapshot.val();
    const newdata = Object.values(data);
    let totalAmount = 0;
    newdata.forEach((amount) => {
      totalAmount += amount.amount;
    });
    res.status(200).json({ totalIncome: totalAmount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}
