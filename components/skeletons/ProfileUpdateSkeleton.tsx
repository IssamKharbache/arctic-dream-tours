import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Lock } from "lucide-react";

const ProfileContentSkeleton = () => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Left Card - Profile Information */}
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 text-gray-400" />
                                <Skeleton className="h-6 w-32 bg-white/10" />
                            </div>
                            <Skeleton className="h-4 w-48 bg-white/5" />
                        </div>
                        <Skeleton className="h-8 w-16 bg-white/10" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <Skeleton className="h-5 w-24 bg-white/10" />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <Skeleton className="h-5 w-28 bg-white/10" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28 bg-white/10" />
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <Skeleton className="h-5 w-48 bg-white/10" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Card - Security Settings */}
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="h-5 w-5 text-gray-400" />
                                <Skeleton className="h-6 w-32 bg-white/10" />
                            </div>
                            <Skeleton className="h-4 w-52 bg-white/5" />
                        </div>
                        <Skeleton className="h-8 w-20 bg-white/10" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Single Password Display or Multiple Password Inputs */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16 bg-white/10" />
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <Skeleton className="h-5 w-32 bg-white/10" />
                        </div>
                    </div>

                    {/* Additional skeleton fields for when in edit mode */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-white/10" />
                        <div className="relative">
                            <div className="p-3 bg-white/10 rounded-lg border border-white/20 pr-10">
                                <Skeleton className="h-5 w-36 bg-white/10" />
                            </div>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Skeleton className="h-4 w-4 bg-white/10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28 bg-white/10" />
                        <div className="relative">
                            <div className="p-3 bg-white/10 rounded-lg border border-white/20 pr-10">
                                <Skeleton className="h-5 w-32 bg-white/10" />
                            </div>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Skeleton className="h-4 w-4 bg-white/10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36 bg-white/10" />
                        <div className="relative">
                            <div className="p-3 bg-white/10 rounded-lg border border-white/20 pr-10">
                                <Skeleton className="h-5 w-40 bg-white/10" />
                            </div>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Skeleton className="h-4 w-4 bg-white/10" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileContentSkeleton;
