import { DashboardNavBar } from "@/components/dashboard/DashboardNavbar";
import { SideBar } from "@/components/dashboard/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            enableSystem
            defaultTheme="system"
            disableTransitionOnChange
        >
            <SidebarProvider>
                <SideBar />
                <SidebarInset>
                    <DashboardNavBar />
                    <div className="dashboard-theme">
                        <main className="flex-1 space-y-4 p-8">{children}</main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
