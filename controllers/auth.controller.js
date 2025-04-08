import { hashPassword, comparePassword } from "../utils/hashing.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendEmail.js";
import { verificationHtml } from "../utils/verificationLinkHtml.js";

export async function signUp(req, res) {
  try {
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
      verificationExpiryDate: Date.now() + 24 * 60 * 60 * 1000,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const html = verificationHtml(token);
    const subject = "Verify your email address";
    const emailResponse = await sendMail(email, subject, html);
    if (emailResponse.success) {
      return res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    }
    res.status(400).json({ success: false, message: emailResponse.message });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function verifyEmail(req, res) {
  console.log("verifyEmail");
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.verificationExpiryDate < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const html = verificationHtml(token);
    const subject = "Verify your email address";
    user.verificationExpiryDate = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const emailResponse = await sendMail(email, subject, html);
    if (emailResponse.success) {
      return res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    }
    res.status(400).json({ success: false, message: emailResponse.message });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify your email" });
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.refreshToken = refreshToken;

    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ success: true, data: { accessToken, user } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.refreshToken = "";

    await user.save();
    res.clearCookie("refreshToken");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refershToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.refreshToken = refershToken;
    await user.save();
    res.clearCookie("refreshToken");
    res.cookie("refreshToken", refershToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function updateName(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.userName = name;
    await user.save();
    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.error("Update Name Error:", error);
    res.status(500).json({ success: false, message: "erroe updating name" });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res
      .status(500)
      .json({ success: false, message: "error updating password" });
  }
}
