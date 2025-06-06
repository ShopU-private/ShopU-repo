const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

type TokenPayload = {
  userId: string;
  role: string;
  phoneNumber: string;
};

export function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;

  try {
    const decoded = verifyToken(token);
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

export function generateToken(user: any): string {
  return jwt.sign(
    { userId: user.id, role: user.role, phoneNumber: user.phoneNumber },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
