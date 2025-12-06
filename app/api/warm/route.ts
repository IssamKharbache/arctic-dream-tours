import { db } from "@/lib/database/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ warmed: true });
  } catch {
    // First connection after pause takes longer
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await db.$queryRaw`SELECT 1`;
    return Response.json({ warmed: true });
  }
}
