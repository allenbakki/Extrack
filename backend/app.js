import express, { json } from "express";
import cors from "cors";
// import path from "path";

import mainRoute from "./routes/routes.js";
const app = express();
const port = process.env.PORT || 8000;
app.use(json());
app.use(cors());

app.use("/", mainRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
