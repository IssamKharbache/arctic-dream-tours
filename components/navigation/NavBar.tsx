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
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    const [mobileOpen, setMobileOpen] = useState(false);

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

    const isNotHomePage = routeWithoutLocale !== "/";
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

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-5">
                    {menus.map((menu, idx) => (
                        <Link
                            className={`font-semibold hover:text-primary duration-300 ${
                                isNotHomePage || scrolled
                                    ? "text-gray-800"
                                    : "text-white"
                            }`}
                            key={idx}
                            href={menu.href as "/" | "/about" | "/contact"}
                        >
                            {t(menu.key)}
                        </Link>
                    ))}
                </div>

                {/* Desktop Right Menu */}
                <div className="hidden md:flex items-center gap-4">
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
                            className={`py-3 rounded-2xl ${
                                isNotHomePage || scrolled
                                    ? ""
                                    : "text-white hover:bg-white/10"
                            }`}
                        >
                            {t("logIn")}
                        </Button>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Animated Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4"
                    >
                        {menus.map((menu, idx) => (
                            <Link
                                key={idx}
                                href={menu.href as "/" | "/about" | "/contact"}
                                className="font-semibold text-gray-800 hover:text-primary"
                                onClick={() => setMobileOpen(false)}
                            >
                                {t(menu.key)}
                            </Link>
                        ))}
                        <Button className="w-full">{t("bookNow")}</Button>
                        {session ? (
                            <AuthDropDownMenu />
                        ) : (
                            <Button
                                onClick={() => {
                                    openSignIn();
                                    setMobileOpen(false);
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                {t("logIn")}
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NavBar;
