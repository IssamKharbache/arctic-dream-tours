"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import AuthDropDownMenu from "../auth/AuthDropDownMenu";
import { toast } from "react-toastify";

const menus = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

const NavBar = () => {
    const { data: session } = useSession();
    return (
        <nav className="border-b-2">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* logo */}
                <div>
                    <h1>Arctik</h1>
                    <h2>Dream</h2>
                    <h1>Tours</h1>
                </div>
                {/* right menu */}
                <div className="flex items-center gap-5">
                    {menus.map((menu, idx) => (
                        <Link key={idx} href={menu.href}>
                            {menu.name}
                        </Link>
                    ))}
                </div>
                <button onClick={() => toast("test")}>Trigger</button>
                {session ? (
                    <Button onClick={() => signOut()}>Logout</Button>
                ) : (
                    <AuthDropDownMenu />
                )}
            </div>
        </nav>
    );
};

export default NavBar;
