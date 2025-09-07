import ActivityBooking from "@/components/activities/booking/ActivityBooking";
import { LiquidDifficultyIndicator } from "@/components/activities/LiquidDifficultyIndicator";
import RichTextViewer from "@/components/activities/RichTextViewer";
import { getData } from "@/lib/getData";
import { Activity } from "@/types/activity";
import { baseUrl } from "@/utils/baseUrl";
import { Clock, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const res = await getData<{ data: Activity }>(
    `${baseUrl}/api/activity/${slug}`
  );
  const activity = res.data;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activity Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={activity.imageUrl || "/placeholder.svg"}
                alt={activity.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activity.title}
                </h1>
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
