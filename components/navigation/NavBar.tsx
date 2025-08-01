"use client";

import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import React, { useEffect, useState } from "react";
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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
        >
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* logo */}
                <Link href="/">
                    <Image
                        src={
                            scrolled ? "/logoArctic.png" : "/arcticLogoDark.png"
                        }
                        alt="Logo"
                        width={400}
                        height={400}
                        className="w-full h-16"
                    />
                </Link>

                {/* middle menu */}
                <div className="flex items-center gap-5">
                    {menus.map((menu, idx) => (
                        <Link
                            className={`font-semibold hover:text-primary duration-300 ${scrolled ? "text-gray-800" : "text-white"}`}
                            key={idx}
                            href={menu.href as "/" | "/about" | "/contact"}
                        >
                            {t(menu.key)}
                        </Link>
                    ))}
                </div>

                {/* right menu */}
                <div className="flex items-center gap-4">
                    <Button
                        className={
                            scrolled
                                ? ""
                                : "bg-white/20 hover:bg-white/30 text-white"
                        }
                    >
                        {t("bookNow")}
                    </Button>
                    {session ? (
                        <AuthDropDownMenu />
                    ) : (
                        <>
                            <Button
                                onClick={openSignIn}
                                variant={scrolled ? "outline" : "ghost"}
                                className={`py-3 rounded-2xl ${scrolled ? "" : "text-white hover:bg-white/10"}`}
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
