import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
      type: String,
      enum: ["customer", "admin"], // only allow these values
      default: "customer",
    },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
