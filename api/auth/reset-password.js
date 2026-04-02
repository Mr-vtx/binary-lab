import bcrypt from "bcryptjs";
import { connectDB } from "../_lib/mongo.js";
import { cors } from "../_lib/cors.js";
import { signToken } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
      const db = await connectDB();
      const user = await db.collection("users").findOne({
        "passwordReset.token": token,
        "passwordReset.expires": { $gt: new Date() },
        "passwordReset.usedAt": null,
      });

      if (!user)
        return res
          .status(400)
          .json({ error: "Reset link is invalid or has expired." });
      return res.status(200).json({ valid: true, username: user.username });
    } catch (err) {
      console.error("Reset validate error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "token, password, and confirmPassword are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    try {
      const db = await connectDB();
      const users = db.collection("users");

      const user = await users.findOne({
        "passwordReset.token": token,
        "passwordReset.expires": { $gt: new Date() },
        "passwordReset.usedAt": null,
      });

      if (!user)
        return res
          .status(400)
          .json({ error: "Reset link is invalid or has expired." });

      const passwordHash = await bcrypt.hash(password, 12);

      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordHash,
            "passwordReset.usedAt": new Date(), 
          },
        },
      );

      const authToken = signToken({
        userId: user._id.toString(),
        username: user.username,
      });
      return res
        .status(200)
        .json({ message: "Password reset successfully.", token: authToken });
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
