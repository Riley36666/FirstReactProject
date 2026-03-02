import mongoose from "mongoose";
import Password from "./models/Password.js";

export async function connectDB(MONGO_URI: string): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "PasswordManager",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("MongoDB connection failed:", err.message);
    }
    process.exit(1);
  }
}