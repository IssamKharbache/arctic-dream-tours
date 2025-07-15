"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/utils/generateSlug";
import { baseUrl } from "@/utils/baseUrl";
import { Loader2, Plus, Save } from "lucide-react";
export type CategoryFormInitialData = {
    id: string;
    name: string;
    description?: string;
};
const formSchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(100, "Name must be less than 100 characters"),
    description: z
        .string()
        .min(100, "Description must be 100 characters or more")
        .max(300, "Description must be less than 500 characters")
        .optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryFormProps {
    mode?: "create" | "edit";
    initialData?: {
        id: string;
        name: string;
        description?: string;
    };
    onSuccess?: () => void;
    className?: string;
}

export function CategoryForm({
    mode = "create",
    initialData,
    onSuccess,
    className,
}: CategoryFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        },
    });

    const handleSubmit = async (data: FormData) => {
        //checking on edit if the initial values are same as the new ones
        if (mode === "edit" && initialData) {
            const isSame =
                data.name === initialData.name &&
                (data.description || "") === (initialData.description || "");

            if (isSame) {
                toast.info("No changes detected.");
                return;
            }
        }
        //
        setIsSubmitting(true);
        const slug = generateSlug(data.name);
        //endpoints
        const endpoint =
            mode === "edit"
                ? `${baseUrl}/api/category/update/${initialData?.id}`
                : `${baseUrl}/api/category/create`;

        const method = mode === "edit" ? "PATCH" : "POST";
        //making the api call
        try {
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, slug }),
            });

            const result = await res.json();

            if (!res.ok) {
                setApiError(result.message || "Something went wrong");
                toast.error(result.message || "Failed");
            } else {
                router.push("/dashboard/category");
                setApiError("");
                toast.success(
                    mode === "edit"
                        ? "Category updated successfully"
                        : "Category created successfully",
                );
                form.reset();
                router.refresh();
                onSuccess?.();
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={className || "space-y-6"}
            >
                {apiError && (
                    <p className="bg-red-500 text-white text-[14px] text-center font-semibold rounded p-2">
                        {apiError}
                    </p>
                )}

                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter category name"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A descriptive name like "Outdoor Adventures"
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="What this category is about..."
                                    className="min-h-[100px] resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Helps users understand what belongs in this
                                category.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "edit"
                                    ? "Updating..."
                                    : "Creating..."}
                            </>
                        ) : (
                            <>
                                {mode === "edit" ? (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Category
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Category
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isSubmitting}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </Form>
    );
}
