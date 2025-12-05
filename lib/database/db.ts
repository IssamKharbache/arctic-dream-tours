import { PrismaClient } from "@prisma/client";

// For development: reuse client via global
// For production: module-level singleton (resets per Lambda but works within execution)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create the PrismaClient with optimized settings
const createPrismaClient = () => {
  return new PrismaClient({
    // Only log errors in production to reduce noise
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Error formatting
    errorFormat: "minimal",
    // Add transaction timeouts for serverless
    transactionOptions: {
      maxWait: 2000,
      timeout: 5000,
    },
  });
};

// Different strategy for dev vs prod
export const prisma = (() => {
  // In production (Vercel): always create new instance per Lambda execution
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  // In development: reuse the same client via global
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
})();

// Optional: Add error handling middleware
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    // Type guard for error
    if (error instanceof Error) {
      console.error("Prisma error:", {
        model: params.model,
        action: params.action,
        error: error.message,
      });
    } else {
      console.error("Unknown Prisma error:", error);
    }
    throw error;
  }
});

// Handle clean shutdown
if (process.env.NODE_ENV === "development") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export const db = prisma;
export default prisma;
