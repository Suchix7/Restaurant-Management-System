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

const MailConfig = mongoose.model("MailConfig", mailSchema);
export default MailConfig;
