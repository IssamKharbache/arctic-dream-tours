"use client";
import {
  MapPin,
  Home,
  Users,
  Ticket,
  TrendingUp,
  Waves,
  Mountain,
  Mail,
  FilePenIcon,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
      },
      // {
      //   title: "Analytics",
      //   url: "/dashboard/analytics",
      //   icon: TrendingUp,
      // },
    ],
  },
  {
    title: "Bookings",
    items: [
      {
        title: "All Bookings",
        url: "/dashboard/bookings",
        icon: Ticket,
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: Users,
      },
    ],
  },
  {
    title: "Informations",
    items: [
      {
        title: "All Messages",
        url: "/dashboard/messages",
        icon: Mail,
      },
      {
        title: "All Blogs",
        url: "/dashboard/blogs",
        icon: FilePenIcon,
      },
    ],
  },
  {
    title: "Activities",
    items: [
      {
        title: "All activities",
        url: "/dashboard/activities",
        icon: Mountain,
      },
    ],
  },
];

export function SideBar() {
  const pathname = usePathname();
  const isActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(itemUrl);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/10 p-5">
        <div className="w-full h-16">
          <Image
            src="/logoArctic.png"
            alt="Arctic Dream Tours Logo"
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-6">
            <SidebarGroupLabel className="text-gray-400 dark:text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="text-gray-700 dark:text-gray-300 hover:text-black hover:bg-slate-200 dark:hover:bg-black/50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/30 data-[active=true]:to-purple-500/30 data-[active=true]:text-black data-[active=true]:border-l-4 data-[active=true]:border-blue-400 rounded-lg p-3 duration-300"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
