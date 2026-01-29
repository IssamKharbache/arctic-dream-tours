export const dynamic = "force-dynamic";
import ActivityBooking from "@/components/activities/booking/ActivityBooking";
import { LiquidDifficultyIndicator } from "@/components/activities/LiquidDifficultyIndicator";
import RichTextViewer from "@/components/activities/RichTextViewer";
import GalleryDialog from "@/components/GalleryDialog";
import { getData } from "@/lib/getData";
import type { Activity } from "@/types/activity";
import { baseUrl } from "@/utils/baseUrl";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const res = await getData<{ data: Activity }>(
      `${baseUrl}/api/activity/${slug}`,
    );
    const activity = res.data;
    return {
      title: activity.title,
      description: activity.shortDescription,
      openGraph: {
        title: activity.title,
        description: activity.shortDescription,
        images: [
          {
            url: activity.imageUrl || "",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Not found",
      description: "The page you are looking for does not exist",
    };
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${baseUrl}/api/activity/get-all`);
    if (!res.ok) {
      throw new Error(`Fetch failed :${res.statusText}`);
    }
    const data = await res.json();
    const activities: Activity[] = data?.data || [];
    if (activities.length === 0) return [];
    return activities.map((activity) => ({
      slug: activity.slug,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const res = await getData<{ data: Activity }>(
    `${baseUrl}/api/activity/${slug}`,
  );
  const activity = res.data;

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activity Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <Image
                  width={500}
                  height={500}
                  src={activity.imageUrl || "/placeholder.svg"}
                  alt={activity.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <GalleryDialog />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {activity.title}
                  </h1>
                </div>
                <p className="text-gray-600 mb-4">
                  {activity.shortDescription}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin />
                    {activity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock />
                    {activity.duration}
                  </span>
                  <span className="flex items-center gap-1 ">
                    <LiquidDifficultyIndicator
                      difficulty={activity.difficulty}
                    />
                    {activity.difficulty}
                  </span>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  <RichTextViewer content={activity.description} />
                </div>
              </div>
            </div>
            {activity.departureHours && activity.departureHours.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Departure Times
                </h3>

                <div className="flex flex-wrap gap-2">
                  {activity.departureHours.map((hour, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium shadow-sm hover:bg-gray-200 transition"
                    >
                      {hour}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6">
              <div className="border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 text-sm sm:text-base text-green-900 dark:text-green-300">
                  <span className="font-medium">Pick-Up & Drop-Off: </span>
                  We offer pick-up and drop-off from your location within the
                  city of the activity.
                </div>
              </div>
            </div>
            {/* What's Included */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <ul className="space-y-2">
                {activity.included.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Meeting Points */}
            {activity.meetingPoints && activity.meetingPoints.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Meeting Points</h3>
                <ul className="space-y-2">
                  {activity.meetingPoints.map((point, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-blue-500">📍</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activity.tags && activity.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* What to Bring */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">What to Bring</h3>
              <p className="text-gray-700">{activity.bring}</p>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">
                Cancellation Policy
              </h3>
              <p className="text-gray-700">{activity.cancellationPolicy}</p>
            </div>
          </div>

          {/* Booking Component */}
          <div className="lg:sticky lg:top-8">
            <ActivityBooking activity={activity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
