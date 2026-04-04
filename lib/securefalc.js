import crypto from "crypto";

export const generateToken = () => crypto.randomBytes(40).toString("hex");
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const getFingerprint = (req) => {
  const ua = req.headers["user-agent"] || "";
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "";
  return crypto
    .createHash("sha256")
    .update(ua + ip)
    .digest("hex");
};
