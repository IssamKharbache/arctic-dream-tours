export const dynamic = "force-dynamic";

import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import { MessagesTable } from "./MessagesTable";
import { Emails } from "@/types/prisma";

const page = async () => {
  const res = await getData<{ data: Emails[] }>(
    `${baseUrl}/api/emails/get-all`
  );
  const messages = res.data;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Messages Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and view all contact form submissions
        </p>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  );
};

export default page;
