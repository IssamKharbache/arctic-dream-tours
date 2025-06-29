"use client";

import * as React from "react";
import { Search, User, Settings, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ThemeSwitcher from "../themes/ThemeSwitcher";
import { useSession } from "next-auth/react";
export function DashboardNavBar() {
    const { data: session } = useSession();
    return (
        <header className="border-b sticky top-0 z-50 w-full py-3">
            <div className="flex h-16 items-center justify-between gap-4 px-6">
                <div>
                    <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
                    <Separator
                        orientation="vertical"
                        className="h-6 bg-white/20"
                    />
                </div>
                {/* left side */}
                <div className="flex items-center gap-5">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search activities, bookings..."
                                className="pl-10  text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400"
                            />
                        </div>
                    </div>
                    <ThemeSwitcher />
                    <div className="flex items-center justify-between gap-3">
                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8 border-2 border-gray-300 dark:border-gray-700">
                                        <AvatarImage
                                            src="/placeholder.svg?height=32&width=32"
                                            alt="User"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {getTwoInitials(session?.user.name)}
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
                                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                            {session?.user.name}
                                        </p>
                                        <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                                            {session?.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />
                                <DropdownMenuItem className="py-3 hover:bg-red-500 dark:hover:bg-black/40">
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />

                                <DropdownMenuItem className="hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-100 dark:focus:bg-red-900 text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}

function getTwoInitials(fullName?: string) {
    if (!fullName) return "";

    // Split the name by spaces
    const words = fullName.trim().split(/\s+/);

    // Get the first letter of the first two words (if available)
    const initials = words
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");

    return initials;
}
