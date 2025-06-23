import SignInDialog from "@/components/auth/dialogs/SignInDialog";
import SignupDialog from "@/components/auth/dialogs/SignupDialog";
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
    </div>
  );
}
