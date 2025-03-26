import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transpoter = await nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER_MAIL,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

export async function sendMail(reciever, subject, body) {
  console.log(process.env.EMAIL_SENDER_PASSWORD, process.env.EMAIL_SENDER_MAIL);
  try {
    transpoter.verify((error, success) => {
      if (error) {
        console.log(error);
        return {
          success: false,
          message: "Error in sending email",
        };
      } else {
        console.log("Ready for sending");
      }
    });
    const mailOptions = {
      from: `JobPortal ${process.env.EMAIL_SENDER_MAIL}`,
      to: reciever,
      subject,
      html: body,
    };
    await transpoter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
