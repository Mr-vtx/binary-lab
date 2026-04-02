import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/mongo.js';
import { signToken } from '../_lib/auth.js';
import { cors } from '../_lib/cors.js';
import { getDailyKey } from '../_lib/progression.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'email, username and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 2–20 characters' });
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const existing = await users.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username';
      return res.status(409).json({ error: `${field} already taken` });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const now = new Date();
    const user = {
      email: email.toLowerCase().trim(),
      username: username.trim(),
      passwordHash,
      createdAt: now,
      xp: 0,
      streak: {
        current: 0,     
        best: 0,        
        daily: 0,    
        lastActiveDate: null,
      },
      stats: {
        totalAnswered: 0,
        totalCorrect: 0,
        byCategory: {},
      },
      stageHistory: [],
    };

    const result = await users.insertOne(user);
    const token = signToken({ userId: result.insertedId.toString(), username });

    const { passwordHash: _, ...safeUser } = user;
    return res.status(201).json({ token, user: { ...safeUser, _id: result.insertedId } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
