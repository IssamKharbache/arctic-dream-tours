"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ThemeSwitcher from "../themes/ThemeSwitcher";
import DashboardDropDown from "../navigation/DashboardDropDown";
export function DashboardNavBar() {
    return (
        <header className="border-b sticky top-0 z-50 w-full py-3 bg-white dark:bg-sidebar">
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
                    <DashboardDropDown />
                </div>
            </div>
        </header>
    );
}
