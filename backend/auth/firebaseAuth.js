import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import serviceAccount from "./authCredentials.json" assert { type: "json" };

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "your-database-url",
  serviceAccountId: "your-service-account-id",
});

const firebaseConfig = {
  clientEmail: "firebase-client-email",
  privateKey: "your-private-key",
};
const secretKey = process.env.JWT_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

export const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        reject(err);
        return res.status(403);
      } else {
        resolve(user);
      }
    });
  });
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "5d" });
};

// Function to generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, refreshSecretKey, { expiresIn: "30d" });
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user.userId);

    res.json({ accessToken: newAccessToken });
  });
};

export const firestore = admin.firestore();
export default admin;
export const auth = admin.auth(app);
