import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkAccessToken = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Access token not provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired access token." });
    }

    req.user = { id: decoded.id };
    next();
  });
};
