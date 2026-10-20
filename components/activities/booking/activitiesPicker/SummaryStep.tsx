"use client";

import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
    type RefObject,
} from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import type { StepProps } from "@/types/packagespicker";
import { baseUrl } from "@/utils/baseUrl";

type SummaryStepProps = Pick<StepProps, "pkg" | "onNext"> & {
    submitRef: RefObject<(() => void) | null>;
    /** The summary UI (PackageBookingSummary), rendered by the parent. */
    children: ReactNode;
};

type ApiResponse = {
    message?: string;
    error?: string;
    data?: {
        id?: string;
        bookingRef?: string;
    };
    client_secret?: string;
};

async function readApiResponse(response: Response): Promise<ApiResponse> {
    const text = await response.text();

    let result: ApiResponse;

    try {
        result = JSON.parse(text) as ApiResponse;
    } catch {
        console.error("Non-JSON API response:", {
            url: response.url,
            status: response.status,
            body: text.slice(0, 500),
        });

        throw new Error(
            `The server returned an unexpected response (HTTP ${response.status}). Please try again.`,
        );
    }

    if (!response.ok) {
        throw new Error(
            result.message ?? result.error ?? `Request failed (${response.status}).`,
        );
    }

    return result;
}

/**
 * Step 5: shows the full booking summary. "Continue to payment" (in the
 * footer) triggers submitRef, which creates the booking + Stripe session.
 */
export default function SummaryStep({
    pkg,
    onNext,
    submitRef,
    children,
}: SummaryStepProps) {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const customer = useActivityPickerStore((state) => state.customer);
    const picked = useActivityPickerStore((state) => state.picked);
    const members = useActivityPickerStore((state) => state.members);
    const bonusActivities = useActivityPickerStore(
        (state) => state.bonusActivities,
    );

    const submit = useCallback(async () => {
        if (submitting) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            const payload = {
                packageId: pkg.id,
                members,
                customer,

                activities: picked.map((pick) => ({
                    activityId: pick.id,
                    date: format(pick.date, "yyyy-MM-dd"),
                    departureHour: pick.departureHour,
                })),

                bonusActivities: bonusActivities.map((bonus) => ({
                    activityId: bonus.activityId,
                    date: bonus.date,
                    departureHour: bonus.departureHour,
                })),
            };

            // Step 1: create the package booking.
            const bookingResponse = await fetch(
                `${baseUrl}/api/package-booking/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );

            const bookingResult = await readApiResponse(bookingResponse);
            const booking = bookingResult.data;

            if (!booking?.id || !booking.bookingRef) {
                throw new Error("The booking response is missing required information.");
            }

            // Step 2: create or retrieve the Stripe Checkout Session.
            const checkoutResponse = await fetch(
                `${baseUrl}/api/package-booking/checkout`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId: booking.id }),
                },
            );

            const checkoutResult = await readApiResponse(checkoutResponse);

            if (!checkoutResult.client_secret) {
                throw new Error("Stripe did not return a Checkout client secret.");
            }

            // Step 3: hand the session to the parent to render Embedded Checkout.
            onNext({
                bookingId: booking.id,
                bookingRef: booking.bookingRef,
                clientSecret: checkoutResult.client_secret,
            });
        } catch (error) {
            console.error("Package booking/checkout error:", error);

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }, [submitting, pkg.id, members, customer, picked, bonusActivities, onNext]);

    useEffect(() => {
        submitRef.current = () => {
            void submit();
        };

        return () => {
            submitRef.current = null;
        };
    }, [submitRef, submit]);

    return (
        <>
            <div className="flex-1 overflow-y-auto pr-1">
                {children}

                {submitError && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                    >
                        {submitError}
                    </p>
                )}
            </div>

            {submitting && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm"
                >
                    <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
                    <div className="text-center">
                        <p className="text-base font-semibold text-gray-900">
                            Preparing your secure payment
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Please don&apos;t close or refresh this page.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}