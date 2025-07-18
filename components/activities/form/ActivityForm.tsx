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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import {
    activityFormSchema,
    ActivityFormValues,
} from "@/lib/schema/validations/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ImagesUploadButton from "@/components/upload/ImagesUploadButton";
import {
    ActivityBasicInfo,
    ActivityDetails,
    ActivityPricing,
    ActivityIncluded,
    ActivityMeetingPoints,
    ActivityPolicies,
    ActivityTags,
} from "@/components/activities/form/index";
import { baseUrl } from "@/utils/baseUrl";
import { Textarea } from "@/components/ui/textarea";

export function ActivityForm() {
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
            difficulty: "EASY",
            cancellationPolicy: "",
            included: [{ value: "" }],
            bring: "",
            meetingPoints: [{ value: "" }],
            bookingCutoffHours: 0,
            liveTourGuide: false,
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: ActivityPayload) => {
            const res = await fetch(`${baseUrl}/api/activity/create`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const error = await res.json();
                console.log(error);
            }
            return;
        },
        onSuccess: () => {
            toast.success("Activity created successfully!");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["activities"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
            console.error(error);
        },
    });

    type ActivityPayload = ActivityFormValues & { imageUrl: string };

    const onSubmit = (data: ActivityFormValues) => {
        const fullData: ActivityPayload = {
            ...data,
            imageUrl: image,
            childPrice: data.childPrice,
            bookingCutoffHours:
                data.bookingCutoffHours === 0
                    ? undefined
                    : data.bookingCutoffHours,
            cancellationPolicy: data.cancellationPolicy?.trim() || undefined,
            bring: data.bring?.trim() || undefined,
            included: data.included,
            meetingPoints: data.meetingPoints,
        };
        mutate(fullData);
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
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <ActivityBasicInfo form={form} />
                        <Separator />

                        <ActivityDetails form={form} />
                        <Separator />

                        <ActivityPricing form={form} />
                        <Separator />

                        <ActivityIncluded form={form} />
                        <Separator />

                        <ActivityMeetingPoints form={form} />
                        <Separator />

                        <ActivityPolicies form={form} />
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
                        <ActivityTags form={form} />

                        <ImagesUploadButton
                            image={image}
                            setImage={setImage}
                            isImageUploading={isImageUploading}
                            setIsImageUploading={setIsImageUploading}
                            imageKey={imageKey}
                            setImageKey={setImageKey}
                        />

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                disabled={isPending}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
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
