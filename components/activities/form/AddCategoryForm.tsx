"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Loader2, Plus } from "lucide-react";
import { generateSlug } from "@/utils/generateSlug";
import { baseUrl } from "@/utils/baseUrl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

interface AddCategoryFormProps {
    className?: string;
}

export default function AddCategoryForm({ className }: AddCategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const router = useRouter();
    const handleSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        // Auto-generate slug from name
        const slug = generateSlug(data.name);
        // Add slug to the data before submitting
        const dataWithSlug = { ...data, slug };
        try {
            const res = await fetch(`${baseUrl}/api/category/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataWithSlug),
            });
            if (!res.ok) {
                const error = await res.json();
                setApiError(error.message);
            } else {
                setApiError("");
                form.reset();
                toast.success("Category created successfully");
                router.push("/dashboard/category");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Category
                </CardTitle>
                <CardDescription>
                    Create a new category for organizing activities.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {apiError ? (
                            <p className="bg-red-500 text-white text-[14px] text-center font-semibold rounded p-2">
                                {apiError}
                            </p>
                        ) : null}
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
                                        A descriptive name for your category
                                        (e.g., "Outdoor Adventures", "Creative
                                        Arts")
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what this category is about..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Small description to help users
                                        understand what activities belong in
                                        this category.
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
                                        Creating Category...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Category
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
            </CardContent>
        </Card>
    );
}
