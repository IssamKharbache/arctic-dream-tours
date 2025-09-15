"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, User2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

const AuthDropDownMenu = () => {
  const { data: session } = useSession();
  const t = useTranslations("Navbar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Trigger />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-3 min-w-[180px]">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
              {session?.user.lastName} {session?.user.firstName}
            </p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
              {session?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem className="cursor-pointer">
                    {t("account")}
                </DropdownMenuItem> */}

        <DropdownMenuItem className="cursor-pointer">
          {t("bookings")}
        </DropdownMenuItem>

        {session?.user.role === "ADMIN" && (
          <Link locale="false" href="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              {t("dashboard")}
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator />

        <Button
          variant="destructive"
          className="w-full mt-1"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {t("logout")}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropDownMenu;

const Trigger = () => {
  return (
    <div className="flex  max-w-sm gap-3 rounded-full border py-2 px-4 hover:shadow-lg hover:bg-gray-100 duration-200 cursor-pointer text-black ">
      <MenuIcon />
      <User2 />
    </div>
  );
};
