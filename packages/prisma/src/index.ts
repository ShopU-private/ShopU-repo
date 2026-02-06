import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Getting the DATABASE_URL from the env through dotenv package
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '../.env') });

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error('DATABASE_URL is required in your environment variable');
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// created the prisma client here
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: DB_URL,
    }),
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
