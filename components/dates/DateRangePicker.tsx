"use client";

import { CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ActivityAvailabilityProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityAvailability({ form }: ActivityAvailabilityProps) {
    const { control } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "departureHours",
    });

    return (
        <div className="space-y-8">
            <h3 className="text-lg font-medium">Activity Availability</h3>

            {/* Start & End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <FormField
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        {field.value
                                            ? format(field.value, "PPP")
                                            : "Pick a start date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* End Date */}
                <FormField
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        {field.value
                                            ? format(field.value, "PPP")
                                            : "Pick an end date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => {
                                            const startDate =
                                                control._formValues.startDate;
                                            return (
                                                date < new Date() ||
                                                (startDate &&
                                                    date <= startDate) ||
                                                date < new Date("1900-01-01")
                                            );
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Departure Hours */}
            <FormField
                control={control}
                name="departureHours"
                render={() => (
                    <FormItem className="space-y-3">
                        <FormLabel>Departure Hours</FormLabel>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex items-center gap-2"
                            >
                                <FormControl>
                                    <Input
                                        type="time"
                                        {...form.register(
                                            `departureHours.${index}.value`,
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
                            className="flex items-center gap-1"
                        >
                            <Clock className="h-4 w-4" />
                            Add Departure Hour
                        </Button>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
