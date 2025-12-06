import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  // Force pooler configuration for free tier
  const databaseUrl = process.env.DATABASE_URL;

  // Ensure it has pooler parameters
  let url = databaseUrl || "";
  if (!url.includes("pgbouncer=true")) {
    console.warn("⚠️ DATABASE_URL missing pgbouncer=true. Add ?pgbouncer=true");
  }
  if (!url.includes("pooler.supabase.com")) {
    console.warn("⚠️ DATABASE_URL not using pooler hostname");
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
    // Minimal logging for free tier
    log: ["error"], // Only errors to reduce overhead
    // Shorter timeouts for free tier
    transactionOptions: {
      maxWait: 1000, // 1 second max wait
      timeout: 3000, // 3 second timeout
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = (() => {
  // SINGLE instance for entire application lifecycle
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
    console.log("📦 PrismaClient created for Supabase Free Tier");
  }
  return globalForPrisma.prisma;
})();

// Free tier: Add automatic reconnection
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error: any) {
    // If connection error, try to reconnect once
    if (
      error.message?.includes("reach database server") ||
      error.message?.includes("pooler")
    ) {
      console.log("🔄 Attempting to reconnect to database...");
      await prisma.$disconnect();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await prisma.$connect();

      // Retry the operation once
      return await next(params);
    }
    throw error;
  }
});

export const db = prisma;
export default prisma;
