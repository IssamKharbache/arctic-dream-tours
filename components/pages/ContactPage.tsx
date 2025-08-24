"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Mail, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { motion } from "framer-motion";
import { useState } from "react";

const contactFormSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
    privacyPolicy: z
        .boolean()
        .refine((val) => val === true, "You must agree to the privacy policy"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const submitContactForm = async (data: ContactFormData) => {
    const response = await fetch(`${baseUrl}/api/emails/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return response.json();
};

const ContactPage = () => {
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            message: "",
            privacyPolicy: false,
        },
    });

    const [confirmation, setConfirmation] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const contactMutation = useMutation({
        mutationFn: submitContactForm,
        onSuccess: () => {
            setConfirmation("Thank you! We have received your message.");
            setErrorMessage(null);
            toast.success("Message sent successfully!");
            form.reset();
        },
        onError: (error: any) => {
            setErrorMessage("Failed to send message. Please try again.");
            setConfirmation(null);
            toast.error("Failed to send message. Please try again.");
            console.error("Contact form error:", error);
        },
    });

    const onSubmit = (data: ContactFormData) => {
        contactMutation.mutate(data);
    };

    return (
        <div className="min-h-screen relative">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/contact.jpg')",
                    minHeight: "100vh",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-slate-900/80" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 ">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-24 ">
                    {/* Left Column */}
                    <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                Get In Touch!
                            </h1>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-200 mb-4 sm:mb-6 drop-shadow-md">
                                We're Here to Help
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed drop-shadow-sm">
                                Got questions or need assistance? Reach out to
                                us using the form below or via the contact
                                details provided.
                            </p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                                <div className="bg-blue-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                                    <Mail className="text-white" size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-blue-100 text-xs sm:text-sm font-medium">
                                        Email Us
                                    </p>
                                    <a
                                        href="mailto:Arcticdreamtours@gmail.com"
                                        className="text-sm sm:text-lg lg:text-xl font-semibold text-white hover:text-blue-200 transition-colors break-all"
                                    >
                                        Arcticdreamtours@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                                <div className="bg-blue-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                                    <Phone className="text-white" size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-blue-100 text-xs sm:text-sm font-medium">
                                        Call Us
                                    </p>
                                    <p className="text-sm sm:text-lg lg:text-xl font-semibold text-white">
                                        +358 40 0408538
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Form) */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-white/20"
                        >
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                    Send us a Message
                                </h3>
                                <p className="text-sm sm:text-base text-blue-100">
                                    We'll get back to you within 24 hours
                                </p>
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    {/* Full Name */}
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-wide">
                                                    Full Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your full name"
                                                        className="border border-white/30 placeholder:text-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 rounded-lg py-2 sm:py-3 text-base sm:text-lg text-white bg-white/5 transition-all"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email & Phone */}
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-wide">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            className="border border-white/30 placeholder:text-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 rounded-lg py-2 sm:py-3 text-base sm:text-lg text-white bg-white/5 transition-all"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-wide">
                                                        Phone Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="+358 40 1234567"
                                                            className="border border-white/30 placeholder:text-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 rounded-lg py-2 sm:py-3 text-base sm:text-lg text-white bg-white/5 transition-all"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Message */}
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-wide">
                                                    Message
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={4}
                                                        placeholder="Tell us how we can help you with your Arctic adventure..."
                                                        className="border border-white/30 placeholder:text-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 rounded-lg text-base sm:text-lg text-white bg-white/5 transition-all resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Privacy Policy */}
                                    <FormField
                                        control={form.control}
                                        name="privacyPolicy"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 sm:p-4 bg-white/10 rounded-lg border border-white/30">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        className="border border-white/40 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-xs sm:text-sm text-blue-100 leading-relaxed cursor-pointer">
                                                        I agree to the Privacy
                                                        Policy and understand my
                                                        data will be used to
                                                        follow up on this
                                                        message
                                                    </FormLabel>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={contactMutation.isPending}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                        {contactMutation.isPending
                                            ? "Sending..."
                                            : "Send Message"}
                                    </Button>

                                    {/* Inline Confirmation / Error */}
                                    {confirmation && (
                                        <p className="text-green-400 font-semibold mt-2 text-center">
                                            {confirmation}
                                        </p>
                                    )}
                                    {errorMessage && (
                                        <p className="text-red-400 font-semibold mt-2 text-center">
                                            {errorMessage}
                                        </p>
                                    )}
                                </form>
                            </Form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
