import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Mail = mongoose.model("Mail", mailSchema);
export default Mail;
