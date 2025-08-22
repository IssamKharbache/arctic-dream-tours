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
    watch,
}) => {
    const [pickupType, setPickupType] = useState<string>("");
    const [dropoffType, setDropoffType] = useState<string>("");

    // Handle pickup selection
    const handlePickupChange = (value: string) => {
        setPickupType(value);

        if (value === "no-pickup") {
            setValue("pickUpLocation", "no need for pick up");
        } else if (value === "office") {
            setValue("pickUpLocation", "Arctic Dream Tours office");
        } else if (value === "custom") {
            setValue("pickUpLocation", "");
        }
    };

    // Handle dropoff selection
    const handleDropoffChange = (value: string) => {
        setDropoffType(value);

        if (value === "no-dropoff") {
            setValue("dropOffLocation", "no need for drop off");
        } else if (value === "office") {
            setValue("dropOffLocation", "Arctic Dream Tours office");
        } else if (value === "custom") {
            setValue("dropOffLocation", "");
        }
    };

    return (
        <div>
            {/* First row */}
            <div className="flex items-center p-5 gap-5 justify-center w-full">
                <div className="w-full">
                    <Label htmlFor="fname" className="mb-4 block">
                        First name
                    </Label>
                    <Input
                        id="fname"
                        {...register("firstName")}
                        placeholder="John"
                        className="w-full"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    <Label className="mb-4 block" htmlFor="lname">
                        Last name
                    </Label>
                    <Input
                        id="lname"
                        {...register("lastName")}
                        placeholder="Doe"
                        className="w-full"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Second row */}
            <div className="flex items-center p-5 gap-5 justify-center w-full">
                <div className="w-full">
                    <Label htmlFor="customerEmail" className="mb-4 block">
                        Email Address
                    </Label>
                    <Input
                        id="customerEmail"
                        {...register("email")}
                        placeholder="you@example.com"
                        className="w-full"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    <Label className="mb-4 block" htmlFor="customerPhone">
                        Phone Number
                    </Label>
                    <Input
                        id="customerPhone"
                        {...register("phone")}
                        placeholder="+358 40 123 4567"
                        className="w-full"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">
                            {errors.phone.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-start p-5 gap-5 justify-center w-full">
                <div className="w-full">
                    <Label htmlFor="pickupSelect" className="mb-4 block">
                        Pick up location
                    </Label>
                    <Select onValueChange={handlePickupChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select pickup option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no-pickup">
                                I don't need pick up
                            </SelectItem>
                            <SelectItem value="office">
                                Arctic Dream Tours office
                            </SelectItem>
                            <SelectItem value="custom">
                                Specify my own location
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Show input only when custom location is selected */}
                    {pickupType === "custom" && (
                        <div className="mt-3">
                            <Input
                                {...register("pickUpLocation")}
                                placeholder="Type your pick up location"
                                className="w-full"
                            />
                        </div>
                    )}

                    {errors.pickUpLocation && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.pickUpLocation.message}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    <Label className="mb-4 block" htmlFor="dropoffSelect">
                        Drop off location
                    </Label>
                    <Select onValueChange={handleDropoffChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select dropoff option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no-dropoff">
                                I don't need drop off
                            </SelectItem>
                            <SelectItem value="office">
                                Arctic Dream Tours office
                            </SelectItem>
                            <SelectItem value="custom">
                                Specify my own location
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Show input only when custom location is selected */}
                    {dropoffType === "custom" && (
                        <div className="mt-3">
                            <Input
                                {...register("dropOffLocation")}
                                placeholder="Type your drop off location"
                                className="w-full"
                            />
                        </div>
                    )}

                    {errors.dropOffLocation && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.dropOffLocation.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
