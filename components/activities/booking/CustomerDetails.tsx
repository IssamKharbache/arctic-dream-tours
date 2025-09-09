"use client";

import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { BookingCustomerFormData } from "@/lib/schema/validations/validation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface CustomerDetailsProps {
  register: UseFormRegister<BookingCustomerFormData>;
  errors: FieldErrors<BookingCustomerFormData>;
  setValue: UseFormSetValue<BookingCustomerFormData>;
  watch: UseFormWatch<BookingCustomerFormData>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  register,
  errors,
  setValue,
}) => {
  const [pickupType, setPickupType] = useState<string>("");
  const [dropoffType, setDropoffType] = useState<string>("");

  const t = useTranslations("booking.form");

  const handlePickupChange = (value: string) => {
    setPickupType(value);

    if (value === "no-pickup") {
      setValue("pickUpLocation", t("pickup.options.noPickup"));
    } else if (value === "office") {
      setValue("pickUpLocation", t("pickup.options.office"));
    } else if (value === "custom") {
      setValue("pickUpLocation", "");
    }
  };

  const handleDropoffChange = (value: string) => {
    setDropoffType(value);

    if (value === "no-dropoff") {
      setValue("dropOffLocation", t("dropoff.options.noDropoff"));
    } else if (value === "office") {
      setValue("dropOffLocation", t("dropoff.options.office"));
    } else if (value === "custom") {
      setValue("dropOffLocation", "");
    }
  };

  const getErrorMessage = (field: keyof BookingCustomerFormData) => {
    const message = errors[field]?.message;
    return message || "";
  };

  return (
    <div>
      {/* First row */}
      <div className="flex flex-col md:flex-row items-center p-5 gap-5 justify-center w-full">
        <div className="w-full">
          <Label htmlFor="fname" className="mb-4 block">
            {t("firstName.label")}
          </Label>
          <Input
            id="fname"
            {...register("firstName")}
            placeholder={t("firstName.placeholder")}
            className="w-full"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{t("firstName.error")}</p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="lname" className="mb-4 block">
            {t("lastName.label")}
          </Label>
          <Input
            id="lname"
            {...register("lastName")}
            placeholder={t("lastName.placeholder")}
            className="w-full"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{t("lastName.error")}</p>
          )}
        </div>
      </div>

      {/* Second row */}
      <div className="flex flex-col md:flex-row items-center p-5 gap-5 justify-center w-full">
        <div className="w-full">
          <Label htmlFor="customerEmail" className="mb-4 block">
            {t("email.label")}
          </Label>
          <Input
            id="customerEmail"
            {...register("email")}
            placeholder={t("email.placeholder")}
            className="w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{t("email.error")}</p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="customerPhone" className="mb-4 block">
            {t("phone.label")}
          </Label>
          <Input
            id="customerPhone"
            {...register("phone")}
            placeholder={t("phone.placeholder")}
            className="w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">
              {errors.phone.type === "max"
                ? t("phone.error.max")
                : t("phone.error.min")}
            </p>
          )}
        </div>
      </div>

      {/* Third row */}
      <div className="flex flex-col md:flex-row items-start p-5 gap-5 justify-center w-full">
        <div className="w-full">
          <Label htmlFor="pickupSelect" className="mb-4 block">
            {t("pickup.label")}
          </Label>
          <Select onValueChange={handlePickupChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("pickup.placeholderSelect")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-pickup">
                {t("pickup.options.noPickup")}
              </SelectItem>
              <SelectItem value="office">
                {t("pickup.options.office")}
              </SelectItem>
              <SelectItem value="custom">
                {t("pickup.options.custom")}
              </SelectItem>
            </SelectContent>
          </Select>

          {pickupType === "custom" && (
            <div className="mt-3">
              <Input
                {...register("pickUpLocation")}
                placeholder={t("pickup.customPlaceholder")}
                className="w-full"
              />
            </div>
          )}

          {errors.pickUpLocation && (
            <p className="text-red-500 text-sm mt-1">{t("pickup.error")}</p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="dropoffSelect" className="mb-4 block">
            {t("dropoff.label")}
          </Label>
          <Select onValueChange={handleDropoffChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("dropoff.placeholderSelect")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-dropoff">
                {t("dropoff.options.noDropoff")}
              </SelectItem>
              <SelectItem value="office">
                {t("dropoff.options.office")}
              </SelectItem>
              <SelectItem value="custom">
                {t("dropoff.options.custom")}
              </SelectItem>
            </SelectContent>
          </Select>

          {dropoffType === "custom" && (
            <div className="mt-3">
              <Input
                {...register("dropOffLocation")}
                placeholder={t("dropoff.customPlaceholder")}
                className="w-full"
              />
            </div>
          )}

          {errors.dropOffLocation && (
            <p className="text-red-500 text-sm mt-1">{t("dropoff.error")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
