import {
  auth,
  generateAccessToken,
  generateRefreshToken,
} from "./firebaseAuth.js";
import express from "express";
import { db } from "./db.js";

const app = express();

export async function getUserDetails(req, res) {
  const { userId } = req.params;
  console.log(userId);

  try {
    const userRecord = await auth.getUser(userId);
    console.log(userRecord);
  } catch (error) {}
}

export async function getLogin(req, res) {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.getUserByEmail(email);

    console.log(userRecord);
    const { uid, displayName, email: userEmail } = userRecord;
    const collectionRef = db.collection("users");
    const userDoc = await collectionRef.doc(uid).get();
    const userData = userDoc.data();
    const passwordref = userData.password || "";

    if (passwordref === password) {
      // Return user information or custom response

      const accessToken = generateAccessToken(uid);
      const refreshToken = generateRefreshToken(uid);
      res.status(200).json({
        message: "Login successful",
        status: 200,

        data: { email: userEmail, displayName, accessToken, refreshToken },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid credentials", status: 401 });
    }
  } catch (error) {
    console.error(`Error fetching user data:${error}`);
    res.status(401).json({ message: "Invalid credentials" });
  }
}
