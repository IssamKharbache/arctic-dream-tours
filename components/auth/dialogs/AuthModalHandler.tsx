"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { useAuthDialogsStore } from "@/store/zustand/authStore";

export function AuthModalTrigger() {
    const { setIsSignInOpen } = useAuthDialogsStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check both URL param and cookie
        const shouldShowModal =
            searchParams.get("showAuthModal") === "true" ||
            getCookie("show-auth-modal");

        if (shouldShowModal) {
            setIsSignInOpen(true);

            // Clean up
            deleteCookie("show-auth-modal");

            // Remove URL param without reload
            if (window.location.search.includes("showAuthModal")) {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("showAuthModal");
                window.history.replaceState({}, "", newUrl.toString());
            }
        }
    }, [searchParams, setIsSignInOpen]);

    return null;
}
