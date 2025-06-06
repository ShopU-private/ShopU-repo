<<<<<<< HEAD
=======
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

// utils/jwt.ts
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server";

export function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role === "admin") return decoded;
    return null;
  } catch (e) {
    return null;
  }
}


>>>>>>> 0dcb071c85bcf80f8a3e0863feabb28a6c4ccf44
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

<<<<<<< HEAD
=======

export function generateToken(user:any): string {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { userId: number } {
>>>>>>> 0dcb071c85bcf80f8a3e0863feabb28a6c4ccf44
  try {
    const decoded = verifyToken(token);
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

export function generateToken(user: any): string {
  return jwt.sign({ userId: user.id, role: user.role, phoneNumber: user.phoneNumber }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
