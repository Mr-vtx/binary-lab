export async function checkRateLimit(db, key, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const rl = db.collection("rate_limits");
  const record = await rl.findOne({ key });

  if (!record) {
    await rl.insertOne({ key, count: 1, expires: now + windowMs });
    return true;
  }
  if (record.expires < now) {
    await rl.updateOne(
      { key },
      { $set: { count: 1, expires: now + windowMs } },
    );
    return true;
  }
  if (record.count >= limit) return false;

  await rl.updateOne({ key }, { $inc: { count: 1 } });
  return true;
}
