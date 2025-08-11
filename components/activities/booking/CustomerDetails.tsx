"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BookingCustomerFormData } from "@/lib/schema/validations/validation";

interface CustomerDetailsProps {
    register: UseFormRegister<BookingCustomerFormData>;
    errors: FieldErrors<BookingCustomerFormData>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
    register,
    errors,
}) => {
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
        </div>
    );
};

export default CustomerDetails;
