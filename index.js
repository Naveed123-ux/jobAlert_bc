import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/routes.js";
const port = process.env.PORT || 3000;

connectDB();
dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.get("*", (req, res) => {
  res.send("Route not found");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
