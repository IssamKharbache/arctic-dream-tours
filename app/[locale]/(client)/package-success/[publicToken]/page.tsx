
import PackageSuccess from "@/components/activities/booking/activitiesPicker/PackageSuccess";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ publicToken: string; locale: string }>;
  
}

export default async function Page({
  params,
}: PageProps) {
  const { publicToken, locale } = await params;

  if (!publicToken) {
    redirect(`/${locale}`);
  }

  return (
    <PackageSuccess
      publicToken={publicToken}
    />
  );
}
