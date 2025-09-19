"use client";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

// Define TypeScript interfaces based on your schema
interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  difficulty: string;
  duration: string;
  location: string;
  adultPrice: number;
  childPrice?: number;
  privateTourPrice: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  departureHours: string[];
  createdAt: string;
}

interface BookingWithActivity {
  id: string;
  activityId: string;
  activity: Activity;
  date: string;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  departureHour: string;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  createdAt: string;
}

const DashboardHomePage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<BookingWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch activities
        const activitiesRes = await getData<{ data: Activity[] }>(
          `${baseUrl}/api/activity/get-all`
        );
        setActivities(activitiesRes.data);

        // Fetch bookings
        const bookingsRes = await getData<{ data: BookingWithActivity[] }>(
          `${baseUrl}/api/booking/get-all`
        );
        setBookings(bookingsRes.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [baseUrl]);

  // Calculate dashboard metrics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.date) > new Date()
  ).length;
  const totalActivities = activities.length;

  // Get recent bookings
  const recentBookings = bookings
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Get popular activities
  const activityBookingCount: Record<string, number> = {};
  bookings.forEach((booking) => {
    activityBookingCount[booking.activityId] =
      (activityBookingCount[booking.activityId] || 0) + 1;
  });

  const popularActivities = Object.entries(activityBookingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([activityId, count]) => {
      const activity = activities.find((a) => a.id === activityId);
      return activity ? { ...activity, bookingCount: count } : null;
    })
    .filter(Boolean) as (Activity & { bookingCount: number })[];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl dark:text-white">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Total Bookings
          </h2>
          <p className="text-3xl font-bold dark:text-white">{totalBookings}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Total Revenue
          </h2>
          <p className="text-3xl font-bold dark:text-white">
            €{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Upcoming Bookings
          </h2>
          <p className="text-3xl font-bold dark:text-white">
            {upcomingBookings}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            Total Activities
          </h2>
          <p className="text-3xl font-bold dark:text-white">
            {totalActivities}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.bookingRef}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {booking.firstName} {booking.lastName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      €{booking.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Popular Activities
          </h2>
          <div className="space-y-4">
            {popularActivities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <h3 className="font-medium dark:text-white">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.bookingCount} bookings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
