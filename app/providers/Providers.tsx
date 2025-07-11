"use client";

import SyncUserInfo from "@/lib/user/SyncUserInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: ReactNode }) {
    // Create client only once per app lifecycle
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <SyncUserInfo />
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
