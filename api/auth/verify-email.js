import crypto from "crypto";
import { connectDB } from "../../lib/mongo.js";

export default async function handler(req, res) {
  const db = await connectDB();
  const users = db.collection("users");

  const { token } = req.query;

  if (!token) return res.status(400).json({ error: "No token" });

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await users.findOne({
    "emailVerification.token": hashed,
    "emailVerification.expires": { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ error: "Invalid token" });

  await users.updateOne(
    { _id: user._id },
    {
      $set: { emailVerified: true },
      $unset: { emailVerification: "" },
    },
  );

  res.json({ success: true });
}
