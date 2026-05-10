import crypto from "crypto";
import { connectDB } from "../../lib/mongo.js";
import { cors } from "../../lib/cors.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: "No token provided" });

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await users.findOne({
      "emailVerification.token": hashed,
      "emailVerification.expires": { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ error: "Link is invalid or has expired. Please register again." });

    await users.updateOne(
      { _id: user._id },
      {
        $set: { emailVerified: true },
        $unset: { emailVerification: "" },
      }
    );

    return res.json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
