"use client";

import { signOut, useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import React from "react";
import { Button } from "../ui/button";
import AuthDropDownMenu from "../auth/AuthDropDownMenu";
import LocaleSwitcher from "./LocaleSwitcher";
import { useAuthDialogsStore } from "@/store/zustand/store";
import { useTranslations } from "next-intl";

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

    const openSignUp = () => {
        setIsSignUpOpen(true);
        setIsSignInOpen(false);
    };

    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };

    return (
        <nav className="">
            <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                {/* logo */}
                <div>
                    <h1>Arctik</h1>
                </div>

                {/* middle menu */}
                <div className="flex items-center gap-5">
                    {menus.map((menu, idx) => (
                        <Link
                            key={idx}
                            href={menu.href as "/" | "/about" | "/contact"}
                        >
                            {t(menu.key)}
                        </Link>
                    ))}
                </div>

                {/* right menu */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <AuthDropDownMenu />
                    ) : (
                        <>
                            <Button
                                onClick={openSignUp}
                                variant="outline"
                                className="py-3 rounded-2xl"
                            >
                                {t("signUp")}
                            </Button>
                            <Button
                                onClick={openSignIn}
                                className="rounded-2xl"
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
