import crypto from "crypto";
import { connectDB } from "../_lib/mongo.js";
import { cors } from "../_lib/cors.js";
import { sendPasswordResetEmail } from "../_lib/email.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const SUCCESS = {
    message: "If that email exists, a reset link has been sent.",
  };

  try {
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(200).json(SUCCESS); 

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          "passwordReset.token": token,
          "passwordReset.expires": expires,
          "passwordReset.usedAt": null,
        },
      },
    );

    await sendPasswordResetEmail(user.email, user.username, token);

    return res.status(200).json(SUCCESS);
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(200).json(SUCCESS);
  }
}
