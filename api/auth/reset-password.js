import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/mongo.js";
import { cors } from "../../lib/cors.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const db = await connectDB();
  const users = db.collection("users");

  if (req.method === "POST" && !req.body.token) {
    const { email } = req.body;

    const user = await users.findOne({ email });

    if (!user) return res.json({ message: "If email exists" });

    const token = crypto.randomBytes(32).toString("hex");

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          "passwordReset.token": hashed,
          "passwordReset.expires": new Date(Date.now() + 3600000),
          "passwordReset.usedAt": null,
        },
      },
    );

    return res.json({ message: "Sent" });
  }

  if (req.method === "POST" && req.body.token) {
    const { token, password } = req.body;

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await users.findOne({
      "passwordReset.token": hashed,
      "passwordReset.expires": { $gt: new Date() },
      "passwordReset.usedAt": null,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const hash = await bcrypt.hash(password, 12);

    await users.updateOne(
      { _id: user._id },
      {
        $set: { passwordHash: hash },
        $unset: { passwordReset: "" },
      },
    );

    return res.json({ success: true });
  }

  res.status(405).end();
}
