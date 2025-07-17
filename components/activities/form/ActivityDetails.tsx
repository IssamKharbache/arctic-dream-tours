import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";

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

interface ActivityDetailsProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityDetails({ form }: ActivityDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Activity Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
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
                                    {difficultyOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {option.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {option.description}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

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
                                Does this activity include a live tour guide?
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

            <FormField
                control={form.control}
                name="bookingCutoffHours"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Booking Cutoff Hours (Optional)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="24"
                                value={field.value || ""}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value
                                            ? Number.parseInt(e.target.value)
                                            : 0,
                                    )
                                }
                            />
                        </FormControl>
                        <FormDescription>
                            How many hours before the activity should booking
                            close?
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
