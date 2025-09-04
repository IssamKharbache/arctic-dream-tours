import { UseFormReturn } from "react-hook-form";
import { ActivityFormValues } from "@/lib/schema/validations/validation";

export interface ActivityFormSectionProps {
  form: UseFormReturn<ActivityFormValues>;
}
