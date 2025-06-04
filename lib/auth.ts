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


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}


export function generateToken(user:any): string {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { userId: number } {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
} 