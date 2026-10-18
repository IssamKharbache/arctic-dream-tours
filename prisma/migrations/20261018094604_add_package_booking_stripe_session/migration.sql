/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `PackageBooking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PackageBooking" ADD COLUMN     "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PackageBooking_stripeSessionId_key" ON "PackageBooking"("stripeSessionId");
