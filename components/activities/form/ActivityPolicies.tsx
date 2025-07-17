import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";

interface ActivityPoliciesProps {
    form: UseFormReturn<ActivityFormValues>;
}

export function ActivityPolicies({ form }: ActivityPoliciesProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Policies</h3>
            </div>

            <FormField
                control={form.control}
                name="cancellationPolicy"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cancellation Policy (Optional)</FormLabel>
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
    );
}
