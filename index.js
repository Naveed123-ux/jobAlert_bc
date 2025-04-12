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
const allowedOrigins = ["http://localhost:4001"]; // Add all allowed origins here

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies if you're using them
  })
);

app.use(cookieParser());
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
app.use("/api", routes);

app.get("*", (req, res) => {
  res.send("Route not found");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
