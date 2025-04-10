import jwt from "jsonwebtoken";

export function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token is required");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken?.id) {
      throw new Error("User ID not found in token");
    }
    return decodedToken.id;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
