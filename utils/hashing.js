import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  const hashedPassoword = await bcrypt.hash(password, 10);
  return hashedPassoword;
}

export async function comparePassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
