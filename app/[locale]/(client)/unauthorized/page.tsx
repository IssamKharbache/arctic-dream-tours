"use client";
import {
    ShieldOff,
    Lock,
    AlertTriangle,
    Shield,
    Home,
    ArrowLeft,
    HelpCircle,
    AlertCircle,
} from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const page = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 -top-20 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -right-20 top-1/3 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Security shield decoration */}
            <div className="absolute top-1/4 right-1/4 opacity-5">
                <ShieldOff className="w-[400px] h-[400px] text-gray-300" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div
                    className={`w-full max-w-2xl transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* Glassmorphism Card */}
                    <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-12 shadow-2xl">
                        {/* Status Illustration */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-red-100 rounded-full opacity-60 animate-pulse"></div>
                                <div className="relative bg-red-500 p-6 rounded-full text-white">
                                    <Lock className="w-12 h-12" />
                                </div>
                            </div>
                        </div>

                        {/* Status and Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                Access Restricted
                            </h1>

                            <div className="flex items-center justify-center gap-3 text-gray-600 mb-6">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                <span className="text-lg font-medium">
                                    Unauthorized Access Attempt
                                </span>
                            </div>

                            <p className="text-gray-600 leading-relaxed max-w-md mx-auto text-lg mb-6">
                                You don't have permission to view this page.
                                This incident has been logged for security
                                purposes.
                            </p>

                            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                                <Shield className="w-4 h-4 mr-2" />
                                Error Code: 403_FORBIDDEN
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Button
                                asChild
                                variant="outline"
                                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-50 transition-all flex-1"
                            >
                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Home className="w-5 h-5" />
                                    Return Home
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-50 transition-all flex-1"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
