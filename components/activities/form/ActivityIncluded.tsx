import { useFieldArray } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";

interface ActivityIncludedProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityIncluded({ form }: ActivityIncludedProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "included",
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">What's Included</h3>
            </div>

            <FormField
                control={form.control}
                name="included"
                render={() => (
                    <FormItem>
                        <FormLabel>Included Items</FormLabel>
                        <FormDescription>
                            List what's included in this activity (equipment,
                            meals, etc.)
                        </FormDescription>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Professional guide, Safety equipment"
                                            {...form.register(
                                                `included.${index}.value`,
                                            )}
                                        />
                                    </FormControl>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ value: "" })}
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
        </div>
    );
}
