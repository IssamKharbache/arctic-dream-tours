"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, X, MapPin, Clock, Users } from "lucide-react";
import {
    activityFormSchema,
    ActivityFormValues,
} from "@/lib/schema/validations/validation";
import { generateSlug } from "@/utils/generateSlug";

const tagsToChooseFrom = [
    { id: "1", name: "Adventure", slug: "adventure" },
    { id: "2", name: "Cultural", slug: "cultural" },
    { id: "3", name: "Family friendly", slug: "family" },
    { id: "4", name: "Water Sports", slug: "water-sports" },
    { id: "5", name: "Nature", slug: "nature" },
    { id: "6", name: "Group friendly", slug: "group-friendly" },
    { id: "7", name: "Outdoor", slug: "outdoor" },
    { id: "8", name: "Hiking", slug: "hiking" },
];

const difficultyOptions = [
    { value: "EASY", label: "Easy", description: "Suitable for beginners" },
    {
        value: "MODERATE",
        label: "Moderate",
        description: "Some experience required",
    },
    {
        value: "HARD",
        label: "Hard",
        description: "Challenging, good fitness required",
    },
    {
        value: "EXTREME",
        label: "Extreme",
        description: "Expert level, excellent fitness required",
    },
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
            location: "",
            duration: "",
            adultPrice: 0,
            childPrice: 0,
            tags: [],
            difficulty: "EASY" as const,
            cancellationPolicy: "",
            included: [{ value: "" }],
            bring: "",
            meetingPoints: [{ value: "" }],
            bookingCutoffHours: 0,
            liveTourGuide: false,
        },
    });
    const {
        fields: includedFields,
        append: appendIncluded,
        remove: removeIncluded,
    } = useFieldArray({
        control: form.control,
        name: "included",
    });

    const {
        fields: meetingPointFields,
        append: appendMeetingPoint,
        remove: removeMeetingPoint,
    } = useFieldArray({
        control: form.control,
        name: "meetingPoints",
    });
    const handleSubmit = async (data: ActivityFormValues) => {
        const fullData = {
            ...data,
            slug: generateSlug(data.title),
            imageUrl: image,
            childPrice: data.childPrice === 0 ? undefined : data.childPrice,
            bookingCutoffHours:
                data.bookingCutoffHours === 0
                    ? undefined
                    : data.bookingCutoffHours,
            cancellationPolicy: data.cancellationPolicy?.trim() || undefined,
            bring: data.bring?.trim() || undefined,
            included: data.included
                .filter((item) => item.value.trim() !== "")
                .map((item) => item.value),
            meetingPoints: data.meetingPoints
                .filter((point) => point.value.trim() !== "")
                .map((point) => point.value),
        };

        setIsSubmitting(true);
        try {
            console.log("Submitting:", fullData);
            // Your API call here
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Card className="w-full max-w-4xl mx-auto">
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
                        className="space-y-8"
                    >
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>
                            </div>

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

                            {/* Location */}
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter activity location"
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
                                            A brief summary that appears in
                                            activity listings (max 200
                                            characters).
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
                                            Detailed description that appears on
                                            the activity page.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Activity Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Activity Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Duration */}
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Duration
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Ex: 2h, 45min, 1d"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Difficulty */}
                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Difficulty Level
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {difficultyOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {
                                                                            option.description
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Live Tour Guide */}
                            <FormField
                                control={form.control}
                                name="liveTourGuide"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Live Tour Guide
                                            </FormLabel>
                                            <FormDescription>
                                                Does this activity include a
                                                live tour guide?
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Booking Cutoff Hours */}
                            <FormField
                                control={form.control}
                                name="bookingCutoffHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Booking Cutoff Hours (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="24"
                                                value={field.value || ""} // Add this line
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value
                                                            ? Number.parseInt(
                                                                  e.target
                                                                      .value,
                                                              )
                                                            : 0,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            How many hours before the activity
                                            should booking close?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Pricing Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Pricing
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Adult Price */}
                                <FormField
                                    control={form.control}
                                    name="adultPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Adult Price ($)
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
                                                    value={field.value || ""} // Add this line
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? Number.parseFloat(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : 0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* What's Included Section */}

                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    What's Included
                                </h3>
                            </div>

                            <FormField
                                control={form.control}
                                name="included"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Included Items</FormLabel>
                                        <FormDescription>
                                            List what's included in this
                                            activity (equipment, meals, etc.)
                                        </FormDescription>
                                        <div className="space-y-3">
                                            {includedFields.map(
                                                (field, index) => (
                                                    <div
                                                        key={field.id}
                                                        className="flex gap-2"
                                                    >
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., Professional guide, Safety equipment"
                                                                {...form.register(
                                                                    `included.${index}.value`,
                                                                )}
                                                            />
                                                        </FormControl>
                                                        {includedFields.length >
                                                            1 && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeIncluded(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    appendIncluded({
                                                        value: "",
                                                    })
                                                }
                                                className="w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Item
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Meeting Points Section - Updated */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">
                                        Meeting Points
                                    </h3>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="meetingPoints"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>
                                                Meeting Points
                                            </FormLabel>
                                            <FormDescription>
                                                Add one or more meeting points
                                                for this activity
                                            </FormDescription>
                                            <div className="space-y-3">
                                                {meetingPointFields.map(
                                                    (field, index) => (
                                                        <div
                                                            key={field.id}
                                                            className="flex gap-2"
                                                        >
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="e.g., Main entrance of Central Park, 123 Main St"
                                                                    {...form.register(
                                                                        `meetingPoints.${index}.value`,
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            {meetingPointFields.length >
                                                                1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        removeMeetingPoint(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        appendMeetingPoint({
                                                            value: "",
                                                        })
                                                    }
                                                    className="w-full"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Meeting Point
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator />

                            {/* What to Bring remains the same */}
                            <FormField
                                control={form.control}
                                name="bring"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            What to Bring (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="List items participants should bring (comfortable shoes, water bottle, etc.)"
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />

                        {/* Policies Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Policies
                                </h3>
                            </div>

                            {/* Cancellation Policy */}
                            <FormField
                                control={form.control}
                                name="cancellationPolicy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Cancellation Policy (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your cancellation and refund policy"
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Tags Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Tags & Categories
                                </h3>
                            </div>

                            {/* Image Upload Component */}
                            {/* <ImagesUploadButton
                                image={image}
                                setImage={setImage}
                                isImageUploading={isImageUploading}
                                setIsImageUploading={setIsImageUploading}
                                imageKey={imageKey}
                                setImageKey={setImageKey}
                            /> */}

                            {/* Tags */}
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
                                            {tagsToChooseFrom.map(
                                                (category) => (
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
                                                                    {
                                                                        category.name
                                                                    }
                                                                </FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ),
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Selected Tags Preview */}
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
                        </div>

                        {/* Submit Buttons */}
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
