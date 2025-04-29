import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingButton = ({
  children,
  className,
  textColor,
}: {
  className?: string;
  textColor?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 justify-center bg-black py-2 rounded-md opacity-70",
        className
      )}
    >
      <span className={`${!textColor ? "text-white" : textColor}`}>
        {children ? children : ""}
      </span>
      <Loader2
        className={`animate-spin ${!textColor ? "text-white" : textColor}`}
      />
    </div>
  );
};

export default LoadingButton;
