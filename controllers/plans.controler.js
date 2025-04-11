import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

export const getAllPlans = async (req, res) => {
  try {
    // Ensure DB is connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    const plans = await mongoose.connection.db
      .collection("plans")
      .find({})
      .toArray();

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Error fetching plans", error });
  }
};
