import logger from './logger';
import { Prisma, PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prismaClientSingleton: any = globalForPrisma.prisma || new PrismaClient({
  errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ]
})

prismaClientSingleton.$on('info' as never, (e: Prisma.LogEvent) => {
  logger.info(e);
});
prismaClientSingleton.$on('warn' as never, (e: Prisma.LogEvent) => {
  logger.warn(e);
});
prismaClientSingleton.$on('error' as never, (e: Prisma.LogEvent) => {
  logger.error(e);
});

export const prisma = prismaClientSingleton;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;