import nodemailer from "nodemailer";
import Mail from "../models/mail.model.js";
export const getMailCredentials = async () => {
  try {
    const mail = await Mail.findOne();
    if (!mail) {
      throw new Error("Mail credentials not found");
    }
    return {
      user: mail.email,
      pass: mail.pass,
    };
  } catch (error) {
    console.error("Error fetching mail credentials:", error);
    throw error;
  }
};
export const sendEmailNotification = async (name, email, subject, message) => {
  const { user, pass } = await getMailCredentials();
  if (!user || !pass) {
    throw new Error("Mail credentials are not set");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
  const mailOptions = {
    from: `${name} <${email}>`,
    to: "testproject7828@gmail.com",
    subject,
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  };
  return transporter.sendMail(mailOptions);
};
