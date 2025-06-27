import SignInDialog from "@/components/auth/dialogs/SignInDialog";
import SignupDialog from "@/components/auth/dialogs/SignupDialog";
import LocaleSwitcher from "@/components/navigation/LocaleSwitcher";
import NavBar from "@/components/navigation/NavBar";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <NavBar />
            <SignupDialog />
            <SignInDialog />
            {children}
            <div className="fixed bottom-4 right-4 z-50">
                <LocaleSwitcher />
            </div>
        </div>
    );
}
