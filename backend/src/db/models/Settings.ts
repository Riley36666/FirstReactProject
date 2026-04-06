import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  darkMode: boolean;
}

const settingsSchema = new Schema<ISettings>(
  {
    darkMode: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    collection: "Settings",
  }
);

export default mongoose.model<ISettings>("Settings", settingsSchema);