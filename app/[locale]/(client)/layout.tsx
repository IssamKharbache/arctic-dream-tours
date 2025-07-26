import { AuthModalTrigger } from "@/components/auth/dialogs/AuthModalHandler";
import SignInDialog from "@/components/auth/dialogs/SignInDialog";
import SignupDialog from "@/components/auth/dialogs/SignupDialog";
import CookieBanner from "@/components/main/CookieBanner";
import LocaleSwitcher from "@/components/navigation/LocaleSwitcher";
import NavBar from "@/components/navigation/NavBar";

import { Quicksand } from "next/font/google";
const quickSand = Quicksand({
    subsets: ["latin"],
    display: "swap",
});
export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <NavBar />
            <AuthModalTrigger />
            <SignupDialog />
            <SignInDialog />
            {children}
            <div className="fixed bottom-4 right-4 z-50">
                <LocaleSwitcher />
            </div>
            <CookieBanner />
        </div>
    );
}
