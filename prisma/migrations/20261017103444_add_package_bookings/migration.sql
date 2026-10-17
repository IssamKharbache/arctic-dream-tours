-- CreateTable
CREATE TABLE "PackageBooking" (
    "id" UUID NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "bookingRef" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pickUpLocation" TEXT NOT NULL,
    "dropOffLocation" TEXT NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "Booking_Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageBookingActivity" (
    "id" UUID NOT NULL,
    "packageBookingId" UUID NOT NULL,
    "activityId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isBonus" BOOLEAN NOT NULL DEFAULT false,
    "activityTitle" TEXT NOT NULL,
    "adultPrice" DOUBLE PRECISION NOT NULL,
    "childPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageBookingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageBooking_bookingRef_key" ON "PackageBooking"("bookingRef");

-- CreateIndex
CREATE INDEX "PackageBooking_email_idx" ON "PackageBooking"("email");

-- CreateIndex
CREATE INDEX "PackageBooking_createdAt_idx" ON "PackageBooking"("createdAt");

-- CreateIndex
CREATE INDEX "PackageBookingActivity_packageBookingId_idx" ON "PackageBookingActivity"("packageBookingId");

-- CreateIndex
CREATE INDEX "PackageBookingActivity_activityId_idx" ON "PackageBookingActivity"("activityId");

-- CreateIndex
CREATE INDEX "PackageBookingActivity_date_idx" ON "PackageBookingActivity"("date");

-- AddForeignKey
ALTER TABLE "PackageBookingActivity" ADD CONSTRAINT "PackageBookingActivity_packageBookingId_fkey" FOREIGN KEY ("packageBookingId") REFERENCES "PackageBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBookingActivity" ADD CONSTRAINT "PackageBookingActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
