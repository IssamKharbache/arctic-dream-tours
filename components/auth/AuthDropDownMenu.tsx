import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthDialogsStore } from "@/store/zustand/store";
import { MenuIcon, User2 } from "lucide-react";

const AuthDropDownMenu = () => {
  const { setIsSignUpOpen, setIsSignInOpen } = useAuthDialogsStore();

  const openSignUp = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  const openSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Trigger />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 w-full">
        <DropdownMenuLabel>My Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={openSignIn}>Sign in</DropdownMenuItem>
        <DropdownMenuItem onClick={openSignUp}>Sign up</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropDownMenu;

const Trigger = () => {
  return (
    <div className="flex items-center gap-3 rounded-full border py-3 px-4 hover:shadow-2xl hover:bg-slate-100 duration-300 hover:cursor-pointer">
      <MenuIcon />
      <User2 />
    </div>
  );
};
