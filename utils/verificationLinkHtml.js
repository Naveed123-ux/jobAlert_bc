export function verificationHtml(token) {
  const verificationLink = `${process.env.BASE_URL}/auth/verifyEmail?token=${token}`;
  return `<div style="text-align: center; font-family: Arial, sans-serif;">
    <h2>Email Verification</h2>
    <p>Click the button below to verify your email address:</p>
    <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If you did not request this, ignore this email.</p>
    <p>&copy; 2025 Your Company</p>
</div>`;
}
