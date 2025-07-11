"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import {
    activityFormSchema,
    ActivityFormValues,
} from "@/lib/schema/validations/validation";
import ImagesUploadButton from "@/components/upload/ImagesUploadButton";

const tagsToChooseFrom = [
    { id: "1", name: "Adventure", slug: "adventure" },
    { id: "2", name: "Cultural", slug: "cultural" },
    { id: "3", name: "Family friendly", slug: "family" },
    { id: "4", name: "Water Sports", slug: "water-sports" },
    { id: "5", name: "Nature", slug: "nature" },
    { id: "6", name: "Group friendly", slug: "group-friendly" },
    { id: "7", name: "Outdoor", slug: "group-friendly" },
    { id: "8", name: "Hiking", slug: "hiking" },
];

export function ActivityForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState("");
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [imageKey, setImageKey] = useState("");

    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activityFormSchema),
        defaultValues: {
            title: "",
            description: "",
            shortDescription: "",
            duration: "",
            adultPrice: 0,
            childPrice: 0,
            tags: [],
        },
    });

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleSubmit = async (data: ActivityFormValues) => {
        const fullData = {
            ...data,
            imageUrl: image,
        };
        console.log(fullData);
        setIsSubmitting(true);
        try {
            console.log(data);
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Activity
                </CardTitle>
                <CardDescription>
                    Fill in the details below to create a new activity listing.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter activity title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Short Description */}
                        <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Brief description for listings"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A brief summary that appears in activity
                                        listings (max 200 characters).
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
                                    <FormLabel>Full Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed description of the activity"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Detailed description that appears on the
                                        activity page.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Duration */}
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Ex : 2h, 45min, 1d"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Adult Price */}
                            <FormField
                                control={form.control}
                                name="adultPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adult Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number.parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Child Price */}
                            <FormField
                                control={form.control}
                                name="childPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Child Price ($) - Optional
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number.parseFloat(
                                                            e.target.value,
                                                        ) || undefined,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <ImagesUploadButton
                            image={image}
                            setImage={setImage}
                            isImageUploading={isImageUploading}
                            setIsImageUploading={setIsImageUploading}
                            imageKey={imageKey}
                            setImageKey={setImageKey}
                        />
                        {/* Categories*/}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">
                                            Tags
                                        </FormLabel>
                                        <FormDescription>
                                            Select relevant tags for this
                                            activity.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {tagsToChooseFrom.map((category) => (
                                            <FormField
                                                key={category.id}
                                                control={form.control}
                                                name="tags"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(
                                                                    category.name,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) => {
                                                                    return checked
                                                                        ? field.onChange(
                                                                              [
                                                                                  ...field.value,
                                                                                  category.name,
                                                                              ],
                                                                          )
                                                                        : field.onChange(
                                                                              field.value?.filter(
                                                                                  (
                                                                                      value,
                                                                                  ) =>
                                                                                      value !==
                                                                                      category.name,
                                                                              ),
                                                                          );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">
                                                            {category.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Selected Categories Preview */}
                        {form.watch("tags").length > 0 && (
                            <div className="space-y-2">
                                <FormLabel>Selected Tags:</FormLabel>
                                <div className="flex flex-wrap gap-2">
                                    {form.watch("tags").map((tagName) => (
                                        <Badge
                                            key={tagName}
                                            variant="secondary"
                                        >
                                            {tagName}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Activity"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
