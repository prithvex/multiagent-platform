import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      default: "free"
    },
    credits: {
      type: Number,
      default: 100
    },
    totalCredits: {
      type: Number,
      default: 100
    },
    planExpiresAt: {
      type: Date,
      default: null
    },




  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;