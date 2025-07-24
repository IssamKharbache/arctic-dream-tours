import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";
import RichEditorText from "@/components/editor/RichTextEditor";

interface ActivityBasicInfoProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityBasicInfo({ form }: ActivityBasicInfoProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>

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
                            A brief summary that appears in activity listings
                            (max 200 characters).
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
                        <FormLabel>Full Description</FormLabel>

                        <FormControl>
                            <RichEditorText
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="Activity description ..."
                            />
                        </FormControl>
                        <FormDescription>
                            Detailed description that appears on the activity
                            page.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
