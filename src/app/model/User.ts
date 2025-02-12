import mongoose, { Model } from "mongoose";

export interface IUser {
  name?: string;
  email: string;
  password: string;
  dob: Date;
  role: "admin" | "publisher" | "reviewer" | "moderator";
  status: "active" | "inactive" | "suspend";
  createdAt?: Date; // Add this field explicitly for TypeScript
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    role: {
      type: String,
      enum: ["admin", "publisher", "reviewer", "moderator"],
      default: "reviewer",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspend"],
      default: "inactive",
    },
  },
  { timestamps: true } 
);

// Named export
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
