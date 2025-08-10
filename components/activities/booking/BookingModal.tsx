"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingModalProps {
    activityId: string;
    onRequestBooking: (formData: BookingFormData) => void;
    onPayOnline: (formData: BookingFormData) => void;
}

export interface BookingFormData {
    customerEmail: string;
    customerPhone?: string;
}

export function BookingModal({
    activityId,
    onRequestBooking,
    onPayOnline,
}: BookingModalProps) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<BookingFormData>({
        customerEmail: "",
        customerPhone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRequestBooking = () => {
        onRequestBooking({ ...form });
        setOpen(false);
    };

    const handlePayOnline = () => {
        onPayOnline({ ...form });
        setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Book Now</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Your Booking</DialogTitle>
                        <DialogDescription>
                            Enter your details to proceed.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="customerEmail">Email Address</Label>
                            <Input
                                id="customerEmail"
                                name="customerEmail"
                                type="email"
                                placeholder="you@example.com"
                                value={form.customerEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="customerPhone">Phone Number</Label>
                            <Input
                                id="customerPhone"
                                name="customerPhone"
                                placeholder="+358 40 123 4567"
                                value={form.customerPhone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="secondary"
                            onClick={handleRequestBooking}
                        >
                            Request Booking
                        </Button>
                        <Button onClick={handlePayOnline}>Pay Online</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
