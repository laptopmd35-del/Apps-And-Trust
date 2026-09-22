import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const isDatabaseConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

function createPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured) {
    return null;
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (err) {
    console.warn('[HushAPK DB] Failed to instantiate PrismaClient. Database features will fall back gracefully:', err);
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalThis.prismaGlobal = prisma;
}

/**
 * Checks whether PostgreSQL database connectivity is currently available.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!prisma) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    console.warn('[HushAPK DB] Database health check failed (PostgreSQL unavailable):', err);
    return false;
  }
}

/**
 * Safe database query wrapper.
 * Guarantees that ANY Prisma exception (connection timeout, missing table, syntax error, network drop)
 * NEVER throws an uncaught error and NEVER crashes the application into a white screen.
 */
export async function safePrismaQuery<T>(
  queryFn: (client: PrismaClient) => Promise<T>,
  fallback: T,
  operationName = 'Database Query'
): Promise<{ data: T; success: boolean; error?: string }> {
  if (!prisma) {
    return {
      data: fallback,
      success: false,
      error: 'DATABASE_URL is not configured on this server.',
    };
  }

  try {
    const result = await queryFn(prisma);
    return { data: result, success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[HushAPK DB Error] ${operationName} failed safely:`, errorMsg);
    return {
      data: fallback,
      success: false,
      error: 'Database query failed or database is temporarily unavailable.',
    };
  }
}

export default prisma;
