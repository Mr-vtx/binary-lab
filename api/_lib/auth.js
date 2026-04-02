import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export function requireAuth(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
