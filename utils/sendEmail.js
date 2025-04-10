import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";
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

export async function sendNotification(reciever, subject, body) {
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

export async function sendSlackMessage(webhookUrl, message) {
  try {
    const payload = { text: message };
    const response = await axios.post(webhookUrl, payload);
    if (response.status === 200) {
      console.log("Slack notification sent successfully");
    } else {
      console.error("Failed to send Slack notification:", response.data);
    }
  } catch (error) {
    console.error("Error sending Slack notification:", error.message);
  }
}
