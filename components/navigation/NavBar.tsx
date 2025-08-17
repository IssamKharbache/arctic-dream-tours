"use client";

import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AuthDropDownMenu from "../auth/AuthDropDownMenu";
import { useTranslations } from "next-intl";
import { useAuthDialogsStore } from "@/store/zustand/authStore";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menus = [
    { key: "home", href: "/" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
];

const NavBar = () => {
    const t = useTranslations("Navbar");
    const { data: session } = useSession();
    const { setIsSignUpOpen, setIsSignInOpen } = useAuthDialogsStore();

    const [scrolled, setScrolled] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const pathName = usePathname();
    const localePath = pathName?.split("/")[1] ?? "";
    const routeWithoutLocale = pathName.replace(`/${localePath}`, "") || "/";

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openSignIn = () => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };

    if (!hasMounted) return null;

    // Check if not the home page
    const isNotHomePage = routeWithoutLocale !== "/";

    // Determine navbar styles
    const navbarClasses =
        isNotHomePage || scrolled
            ? "bg-white text-gray-900 shadow-md py-3"
            : "bg-transparent text-white py-5";

    const logoSrc =
        isNotHomePage || scrolled ? "/logoArctic.png" : "/arcticLogoDark.png";

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${navbarClasses}`}
        >
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <Image
                        src={logoSrc}
                        alt="Logo"
                        width={400}
                        height={400}
                        className="w-full h-16"
                    />
                </Link>

                {/* Middle Menu */}
                <div className="flex items-center gap-5">
                    {menus.map((menu, idx) => (
                        <Link
                            className={`font-semibold hover:text-primary duration-300 ${isNotHomePage || scrolled ? "text-gray-800" : "text-white"}`}
                            key={idx}
                            href={menu.href as "/" | "/about" | "/contact"}
                        >
                            {t(menu.key)}
                        </Link>
                    ))}
                </div>

                {/* Right Menu */}
                <div className="flex items-center gap-4">
                    <Button
                        className={
                            isNotHomePage || scrolled
                                ? ""
                                : "bg-white/20 hover:bg-white/30 text-white"
                        }
                    >
                        {t("bookNow")}
                    </Button>
                    {session ? (
                        <AuthDropDownMenu />
                    ) : (
                        <Button
                            onClick={openSignIn}
                            variant={
                                isNotHomePage || scrolled ? "outline" : "ghost"
                            }
                            className={`py-3 rounded-2xl ${isNotHomePage || scrolled ? "" : "text-white hover:bg-white/10"}`}
                        >
                            {t("logIn")}
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
