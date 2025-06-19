import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingButton = ({
    children,
    className,
    textColor,
    loading,
}: {
    className?: string;
    textColor?: string;
    children?: React.ReactNode;
    loading?: boolean;
}) => {
    return (
        <button
            className={cn(
                loading && "opacity-70",
                "flex w-full cursor-pointer items-center gap-4 justify-center bg-black hover:bg-black/80 duration-300 py-2 font-semibold rounded-sm",
                className,
            )}
        >
            {loading ? (
                <Loader2
                    className={`animate-spin ${!textColor ? "text-white" : textColor}`}
                />
            ) : (
                <span className={`${!textColor ? "text-white" : textColor}`}>
                    {children ? children : ""}
                </span>
            )}
        </button>
    );
};

export default LoadingButton;
