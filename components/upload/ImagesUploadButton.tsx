"use client";

import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/utils/uploadthing";
import { X } from "lucide-react";

import Image from "next/image";

interface UploadImageButtonProps {
    image?: string;
    setImage: (image: string) => void;
    isImageUploading?: boolean;
    setIsImageUploading: (isImageUploading: boolean) => void;
    imageKey?: string;
    setImageKey: (imageKey: string) => void;
}

const ImagesUploadButton = ({
    image,
    setImage,
    setIsImageUploading,
    setImageKey,
}: UploadImageButtonProps) => {
    const handleRemoveImage = () => {
        setImage("");
        setImageKey("");
    };
    return (
        <>
            {image ? (
                <div className="relative mt-8">
                    <Button
                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center p-0"
                        onClick={handleRemoveImage}
                    >
                        <X />
                    </Button>
                    <Image
                        src={image}
                        alt="Activity image"
                        width={1000}
                        height={667}
                        className="w-full h-72 object-cover rounded-md"
                    />
                </div>
            ) : (
                <UploadDropzone
                    appearance={{
                        container:
                            "border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-gray-50 dark:bg-sidebar hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200",
                        label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                        uploadIcon: "text-blue-500 dark:text-blue-400",
                        allowedContent:
                            "text-xs text-gray-500 dark:text-gray-400",
                        button: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium px-4 py-2 mt-4 rounded-md transition-colors duration-200",
                    }}
                    onUploadBegin={() => {
                        setIsImageUploading(true);
                    }}
                    onUploadProgress={() => console.log("Uploading")}
                    className="border-2 rounded-lg border-dashed border-slate-300 cursor-pointer  hover:bg-slate-100 duration-300"
                    onClientUploadComplete={(res) => {
                        setImageKey(res[0].key);
                        setImage(res[0].url);
                        setIsImageUploading(false);
                    }}
                    endpoint={"activityImage"}
                    onUploadError={(error) => {
                        console.log(`ERROR! ${error.message}`);
                    }}
                />
            )}
        </>
    );
};

export default ImagesUploadButton;
