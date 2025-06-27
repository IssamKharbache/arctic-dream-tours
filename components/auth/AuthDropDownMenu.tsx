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
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const AuthDropDownMenu = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const t = useTranslations("Navbar");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Trigger />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-3 min-w-[180px]">
                <DropdownMenuLabel className="text-center">
                    {t("myProfile")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="cursor-pointer"
                >
                    {t("account")}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/bookings")}
                    className="cursor-pointer"
                >
                    {t("bookings")}
                </DropdownMenuItem>

                {session?.user.role === "ADMIN" && (
                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                        className="cursor-pointer"
                    >
                        {t("dashboard")}
                    </DropdownMenuItem>
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
        <div className="flex items-center gap-3 rounded-full border py-2 px-4 hover:shadow-lg hover:bg-gray-100 duration-200 cursor-pointer">
            <MenuIcon />
            <User2 />
        </div>
    );
};
