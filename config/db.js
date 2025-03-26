import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    console.error("MongoDB connection failed");
  }
}
