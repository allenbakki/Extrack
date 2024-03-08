import { app } from "./firebaseAuth.js";
import { getFirestore } from "firebase-admin/firestore";
export const db = getFirestore(app);


