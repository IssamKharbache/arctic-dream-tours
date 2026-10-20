import { Prisma } from "@prisma/client";

export type PackageBookingWithActivities =
  Prisma.PackageBookingGetPayload<{
    include: {
      activities: {
        include: {
          activity: true;
        };
      };
    };
  }>;