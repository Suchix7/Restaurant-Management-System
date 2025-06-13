import mongoose from "mongoose";

const userAccessSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    permissions: [String],
  },
  { timestamps: true }
);
const UserAccess = mongoose.model("UserAccess", userAccessSchema);
export default UserAccess;
