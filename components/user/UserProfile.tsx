"use client";

import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProfileContent from "./ProfileContent";
import ProfileContentSkeleton from "../skeletons/ProfileUpdateSkeleton";
interface UserData {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
}

interface ApiResponse {
    data: UserData;
}

interface UserProfileProps {
    userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
    const url = process.env.NEXT_PUBLIC_URL;

    // Fetching the user data
    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: ["user", userId],
        queryFn: () =>
            getData<ApiResponse>(`${url}/api/user/getdata/${userId}`),
    });

    // Loading state
    if (isLoading) {
        return <ProfileContentSkeleton />;
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="glass-card max-w-md">
                    <CardContent className="p-6 text-center">
                        <div className="text-red-400 text-lg font-semibold mb-2">
                            Error Loading Profile
                        </div>
                        <p className="text-gray-300">
                            Unable to load user data. Please try again later.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Ensure data exists before rendering
    if (!data?.data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="glass-card max-w-md">
                    <CardContent className="p-6 text-center">
                        <div className="text-yellow-400 text-lg font-semibold mb-2">
                            No Data Available
                        </div>
                        <p className="text-gray-300">No user data found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            {/* Profile Header */}
            <Card className="glass-card hover-glow">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white/20">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                                    {data.data.fullName
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {data.data.fullName}
                            </h1>
                            <p className="text-gray-300 text-lg">
                                {data.data.email}
                            </p>
                            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                                Active Account
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Profile Content - Now using the separated component */}
            <ProfileContent userData={data.data} />
        </div>
    );
};

export default UserProfile;
