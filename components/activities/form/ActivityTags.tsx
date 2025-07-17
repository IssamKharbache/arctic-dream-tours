import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";

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

interface ActivityTagsProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityTags({ form }: ActivityTagsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Tags & Categories</h3>
            </div>

            <FormField
                control={form.control}
                name="tags"
                render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Tags</FormLabel>
                            <FormDescription>
                                Select relevant tags for this activity.
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
                                                            ? field.onChange([
                                                                  ...field.value,
                                                                  category.name,
                                                              ])
                                                            : field.onChange(
                                                                  field.value?.filter(
                                                                      (value) =>
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

            {form.watch("tags").length > 0 && (
                <div className="space-y-2">
                    <FormLabel>Selected Tags:</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {form.watch("tags").map((tagName) => (
                            <Badge key={tagName} variant="secondary">
                                {tagName}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
