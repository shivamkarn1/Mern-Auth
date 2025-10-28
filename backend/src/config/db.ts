import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URI);
    // console.log("The connection instance is : ", connectionInstance);
    console.log("MongoDB Connected Successfully 🌿");
  } catch (error) {
    console.log("MongoDB connection Error : ", error);
    process.exit(1);
  }
};

export { connectDB };
