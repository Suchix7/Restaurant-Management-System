import nodemailer from "nodemailer";
export const sendEmailNotification = async (name, email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "testproject7828@gmail.com",
      pass: "zvom ztjz onem hrjg",
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
