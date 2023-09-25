import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone: string;
  age: string;
  answer: string;
  password: string;
  post: mongoose.Types.ObjectId[];
  generateJWTToken: () => Promise<string>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      lowercase: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    age: {
      type: String,
      required: [true, "Age is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    post: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateJWTToken = async function (): Promise<string> {
  return await jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET || "",
    { expiresIn: process.env.JWT_EXPIRY || "1h" }
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export { User };
