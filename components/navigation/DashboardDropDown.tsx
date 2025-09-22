import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useUserInfoStore } from "@/store/zustand/userStore";

const DashboardDropDown = () => {
  const { data: session } = useSession();

  const { firstName, lastName, email } = useUserInfoStore();
  return (
    <div className="flex items-center justify-between gap-3">
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border-2 border-gray-300 dark:border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 glass-card border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 capitalize">
                {lastName} {firstName}
              </p>
              <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />
          <Link href={`/dashboard/profile/${session?.user.id}`}>
            <DropdownMenuItem className="py-3 hover:bg-red-500 dark:hover:bg-black/40">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />

          <Button asChild onClick={() => signOut()}>
            <DropdownMenuItem className="hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-900 text-red-600 dark:text-red-400 flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardDropDown;

function getInitials(
  firstName: string | undefined,
  lastName: string | undefined
): string {
  if (firstName === "" || lastName === "") {
    return "";
  }
  const firstInitial = firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "";
  return firstInitial + lastInitial;
}
