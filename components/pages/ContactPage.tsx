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
import { useTranslations } from "next-intl";

type ContactFormData = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  message: string;
  privacyPolicy: boolean;
};

const submitContactForm = async (data: ContactFormData) => {
  const response = await fetch(`${baseUrl}/api/emails/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

const ContactPage = () => {
  const t = useTranslations("contact");

  const contactFormSchema = z.object({
    fullName: z.string().min(2, t("validation.fullNameMin")),
    email: z.string().email(t("validation.emailInvalid")),
    phoneNumber: z.string().optional(),
    message: z.string().min(10, t("validation.messageMin")),
    privacyPolicy: z
      .boolean()
      .refine((val) => val === true, t("validation.privacyPolicyRequired")),
  });

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
      setConfirmation(t("successMessage"));
      setErrorMessage(null);
      toast.success(t("successMessage"));
      form.reset();
    },
    onError: () => {
      setErrorMessage(t("errorMessage"));
      setConfirmation(null);
      toast.error(t("errorMessage"));
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/contact.jpg')",
          minHeight: "100vh",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-slate-900/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-24">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {t("title")}
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-200 mb-4 sm:mb-6 drop-shadow-md">
                {t("subtitle")}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed drop-shadow-sm">
                {t("description")}
              </p>
            </div>

            {/* Email & Phone */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20 backdrop-blur-sm">
                <div className="bg-blue-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Mail className="text-white" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">
                    {t("emailUs")}
                  </p>
                  <a
                    href="mailto:contact@arcticdreamtours.com"
                    className="text-sm sm:text-lg lg:text-xl font-semibold text-white hover:text-blue-200 break-all transition-colors"
                  >
                    contact@arcticdreamtours.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20 backdrop-blur-sm">
                <div className="bg-blue-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Phone className="text-white" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">
                    {t("callUs")}
                  </p>
                  <p className="text-sm sm:text-lg lg:text-xl font-semibold text-white">
                    +350 404 121 843
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-white/20"
            >
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {t("sendUsMessage")}
                </h3>
                <p className="text-sm sm:text-base text-blue-100">
                  {t("responseTime")}
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
                          {t("fullName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("fullNamePlaceholder")}
                            {...field}
                            className="border border-white/30 placeholder:text-white/70 bg-white/5 text-white rounded-lg py-2 sm:py-3 text-base sm:text-lg"
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
                            {t("email")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("emailPlaceholder")}
                              {...field}
                              className="border border-white/30 placeholder:text-white/70 bg-white/5 text-white rounded-lg py-2 sm:py-3 text-base sm:text-lg"
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
                            {t("phoneNumber")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder={t("phoneNumberPlaceholder")}
                              {...field}
                              className="border border-white/30 placeholder:text-white/70 bg-white/5 text-white rounded-lg py-2 sm:py-3 text-base sm:text-lg"
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
                          {t("message")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t("messagePlaceholder")}
                            {...field}
                            className="border border-white/30 placeholder:text-white/70 bg-white/5 text-white rounded-lg text-base sm:text-lg resize-none"
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
                      <FormItem className="flex flex-row items-start space-x-3 p-3 sm:p-4 bg-white/10 rounded-lg border border-white/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border border-white/40 data-[state=checked]:bg-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-xs sm:text-sm text-blue-100 cursor-pointer">
                            {t("privacyPolicy")}
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    {contactMutation.isPending
                      ? t("sending")
                      : t("sendMessage")}
                  </Button>

                  {/* Status */}
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
