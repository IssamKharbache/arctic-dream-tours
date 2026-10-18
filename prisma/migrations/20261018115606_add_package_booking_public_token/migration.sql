/*
  Warnings:

  - A unique constraint covering the columns `[publicToken]` on the table `PackageBooking` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicToken` was added to the `PackageBooking` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `departureHour` on table `PackageBookingActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PackageBooking" ADD COLUMN     "publicToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PackageBookingActivity" ALTER COLUMN "departureHour" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PackageBooking_publicToken_key" ON "PackageBooking"("publicToken");
