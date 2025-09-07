import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";
import { Users } from "lucide-react";

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
        {/* Adult Price */}
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
                    field.onChange(Number.parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* isForChild Toggle */}
        <FormField
          control={form.control}
          name="isForChild"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1 md:col-span-2">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  For Children
                </FormLabel>
                <FormDescription>
                  Is this activity available for children?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      form.setValue("childPrice", 0); // reset price if disabled
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Child Price - Only show if isForChild is true */}
        {form.watch("isForChild") && (
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
                        e.target.value ? Number.parseFloat(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Private Tour Price */}
        <FormField
          control={form.control}
          name="privateTourPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Private Tour Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseFloat(e.target.value) || 0)
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
