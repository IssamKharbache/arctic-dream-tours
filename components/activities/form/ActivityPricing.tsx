import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";

interface ActivityPricingProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityPricing({ form }: ActivityPricingProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Pricing</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="adultPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adult Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            Number.parseFloat(e.target.value) ||
                                                0,
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="childPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Child Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value
                                                ? Number.parseFloat(
                                                      e.target.value,
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
    );
}
