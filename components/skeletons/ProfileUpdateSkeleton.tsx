import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileContentSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            {/* Profile Header Skeleton */}
            <Card className="bg-background border">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                            <Skeleton className="h-24 w-24 rounded-full border-4 border-muted" />
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                            <Skeleton className="h-8 w-3/4 mx-auto sm:mx-0 sm:w-64 bg-muted" />
                            <Skeleton className="h-6 w-full max-w-[280px] mx-auto sm:mx-0 bg-muted" />
                            <div className="flex justify-center sm:justify-start space-x-2">
                                <Skeleton className="h-6 w-16 bg-muted" />
                                <Skeleton className="h-6 w-20 bg-muted" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Form Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information Card Skeleton */}
                <Card className="bg-background border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40 bg-muted" />
                                <Skeleton className="h-4 w-56 bg-muted" />
                            </div>
                            <Skeleton className="h-8 w-16 bg-muted rounded-md" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="space-y-2">
                                <Skeleton className="h-4 w-24 bg-muted" />
                                <Skeleton className="h-12 w-full bg-muted rounded-lg" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Security Settings Card Skeleton */}
                <Card className="bg-background border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40 bg-muted" />
                                <Skeleton className="h-4 w-56 bg-muted" />
                            </div>
                            <Skeleton className="h-8 w-20 bg-muted rounded-md" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="space-y-2">
                                <Skeleton className="h-4 w-32 bg-muted" />
                                <div className="relative">
                                    <Skeleton className="h-12 w-full bg-muted rounded-lg pr-10" />
                                    <Skeleton className="absolute right-3 top-3 h-6 w-6 rounded-full bg-muted" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
