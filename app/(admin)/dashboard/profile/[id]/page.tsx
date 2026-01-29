import UserProfile from "@/components/user/UserProfile";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <UserProfile userId={id} />;
};

export default page;
