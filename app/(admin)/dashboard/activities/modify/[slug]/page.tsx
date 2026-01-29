import { ActivityForm } from "@/components/activities/form/ActivityForm";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { Activity } from "@prisma/client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const activityData = await getData<{ data: Activity }>(
    `${baseUrl}/api/activity/${slug}`,
  );

  return <ActivityForm mode={"edit"} initialData={activityData.data} />;
};

export default page;
