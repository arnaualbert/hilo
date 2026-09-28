import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Evita crear múltiples instancias en dev con hot-reload (nodemon/tsx).
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}