"use client";

import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import React from "react";
import { Button } from "../ui/button";
import AuthDropDownMenu from "../auth/AuthDropDownMenu";
import { useTranslations } from "next-intl";
import { useAuthDialogsStore } from "@/store/zustand/authStore";
import Image from "next/image";

const menus = [
    {
        key: "home",
        href: "/",
    },
    {
        key: "about",
        href: "/about",
    },
    {
        key: "contact",
        href: "/contact",
    },
];

const NavBar = () => {
    const t = useTranslations("Navbar");
    const { data: session } = useSession();
    const { setIsSignUpOpen, setIsSignInOpen } = useAuthDialogsStore();
    // open the sign up dialog
    const openSignUp = () => {
        setIsSignUpOpen(true);
        setIsSignInOpen(false);
    };

    // open the sign in dialog
    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };

    return (
        <nav className="max-w-[1700px] mx-auto">
            <div className="px-4 sm:px-6  py-5 flex items-center justify-between">
                {/* logo */}
                <div>
                    <Image
                        src="/logoArctic.png"
                        alt="Logo"
                        width={400}
                        height={400}
                        className="w-full h-16"
                    />
                </div>

                {/* middle menu */}
                <div className="flex items-center gap-5">
                    {menus.map((menu, idx) => (
                        <Link
                            className="font-semibold hover:text-primary hover:text-prima duration-300"
                            key={idx}
                            href={menu.href as "/" | "/about" | "/contact"}
                        >
                            {t(menu.key)}
                        </Link>
                    ))}
                </div>

                {/* right menu */}
                <div className="flex items-center gap-4">
                    <Button>Book now</Button>
                    {session ? (
                        <AuthDropDownMenu />
                    ) : (
                        <>
                            <Button
                                onClick={openSignIn}
                                variant="outline"
                                className="py-3 rounded-2xl"
                            >
                                {t("logIn")}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
