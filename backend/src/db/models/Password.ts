import mongoose, { Schema, Document } from "mongoose";

interface IPassword extends Document {
  Website: string;
  Password: Buffer;
}

const passwordSchema = new Schema<IPassword>(
  {
    Website: {
      type: String,
      required: true,
    },
    Password: {
      type: Buffer,
      required: true,
    },
  },
  {
    collection: "Passwords",
  }
);

export default mongoose.model<IPassword>("Password", passwordSchema);