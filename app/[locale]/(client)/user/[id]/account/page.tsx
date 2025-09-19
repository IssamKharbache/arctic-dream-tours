import UserProfile from "@/components/user/UserProfile";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mt-24">
          {/* You could add a title here if needed */}
          <UserProfile userId={id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
