"use client";

import { ArrowLeft, Home, Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const BoredPersonIllustration = () => {
    return (
        <div className="relative w-64 h-64 mx-auto mb-8">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Desk */}
                <rect
                    x="20"
                    y="140"
                    width="160"
                    height="8"
                    fill="#e5e7eb"
                    rx="4"
                />

                {/* Chair */}
                <rect
                    x="85"
                    y="120"
                    width="30"
                    height="40"
                    fill="#d1d5db"
                    rx="4"
                />
                <rect
                    x="80"
                    y="115"
                    width="40"
                    height="8"
                    fill="#d1d5db"
                    rx="4"
                />

                {/* Person Body */}
                <ellipse cx="100" cy="130" rx="20" ry="25" fill="#f3f4f6" />

                {/* Person Head */}
                <circle cx="100" cy="90" r="18" fill="#fef3c7" />

                {/* Hair */}
                <path
                    d="M82 85 Q100 70 118 85 Q115 75 100 75 Q85 75 82 85"
                    fill="#92400e"
                />

                {/* Eyes (blinking animation) */}
                <g className="animate-blink">
                    <circle cx="94" cy="88" r="2" fill="#374151" />
                    <circle cx="106" cy="88" r="2" fill="#374151" />
                </g>

                {/* Mouth (bored expression) */}
                <path
                    d="M95 98 Q100 95 105 98"
                    stroke="#6b7280"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Arms */}
                <g className="animate-sway">
                    {/* Left arm */}
                    <ellipse
                        cx="78"
                        cy="115"
                        rx="8"
                        ry="20"
                        fill="#fef3c7"
                        transform="rotate(-20 78 115)"
                    />
                    {/* Right arm */}
                    <ellipse
                        cx="122"
                        cy="115"
                        rx="8"
                        ry="20"
                        fill="#fef3c7"
                        transform="rotate(20 122 115)"
                    />
                </g>

                {/* Hands on desk */}
                <circle
                    cx="75"
                    cy="140"
                    r="6"
                    fill="#fef3c7"
                    className="animate-tap"
                />
                <circle
                    cx="125"
                    cy="140"
                    r="6"
                    fill="#fef3c7"
                    className="animate-tap-delay"
                />

                {/* Computer/laptop */}
                <rect
                    x="90"
                    y="135"
                    width="20"
                    height="12"
                    fill="#374151"
                    rx="1"
                />
                <rect
                    x="91"
                    y="136"
                    width="18"
                    height="8"
                    fill="#1f2937"
                    rx="1"
                />

                {/* Thought bubble */}
                <g className="animate-float">
                    <circle
                        cx="140"
                        cy="60"
                        r="12"
                        fill="#f9fafb"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />
                    <circle
                        cx="130"
                        cy="75"
                        r="4"
                        fill="#f9fafb"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />
                    <circle
                        cx="125"
                        cy="82"
                        r="2"
                        fill="#f9fafb"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />
                    <text
                        x="140"
                        y="65"
                        textAnchor="middle"
                        fontSize="16"
                        fill="#9ca3af"
                    >
                        ?
                    </text>
                </g>
            </svg>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes blink {
                    0%,
                    90%,
                    100% {
                        transform: scaleY(1);
                    }
                    95% {
                        transform: scaleY(0.1);
                    }
                }

                @keyframes sway {
                    0%,
                    100% {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(2deg);
                    }
                }

                @keyframes tap {
                    0%,
                    50%,
                    100% {
                        transform: translateY(0);
                    }
                    25% {
                        transform: translateY(-2px);
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }

                .animate-blink {
                    animation: blink 4s infinite;
                }

                .animate-sway {
                    animation: sway 3s ease-in-out infinite;
                    transform-origin: center bottom;
                }

                .animate-tap {
                    animation: tap 2s ease-in-out infinite;
                }

                .animate-tap-delay {
                    animation: tap 2s ease-in-out infinite;
                    animation-delay: 1s;
                }

                .animate-float {
                    animation: float 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

const page = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[size:20px_20px]"></div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div
                    className={`w-full max-w-2xl transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-12 shadow-xl">
                        {/* Bored Person Illustration */}
                        <BoredPersonIllustration />

                        {/* Status and Title */}
                        <div className="text-center mb-8">
                            <div className="mb-6">
                                <span className="text-7xl font-bold text-gray-800 tracking-tight">
                                    401
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Access Denied
                            </h1>

                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                                <Coffee className="w-5 h-5" />
                                <span className="text-lg">
                                    {
                                        "Looks like you're not supposed to be here"
                                    }
                                </span>
                            </div>

                            <p className="text-gray-600 leading-relaxed max-w-md mx-auto text-lg">
                                {
                                    "This page is off-limits. You'll need the right permissions to access this content. Maybe grab a coffee while you figure this out?"
                                }
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02] bg-transparent"
                                >
                                    <Link
                                        href="/"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <Home className="w-4 h-4" />
                                        Home
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Go Back
                                </Button>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="text-center mt-8">
                            <p className="text-gray-500 text-sm">
                                Need help? Contact support or check your
                                permissions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
