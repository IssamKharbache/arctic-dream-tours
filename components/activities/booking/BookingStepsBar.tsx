"use client";
import { CheckCircle, User, CreditCard } from "lucide-react";

interface BookingStepsBarProps {
    step: number;
}

const steps = [
    { id: 1, label: "Contact Details", icon: User },
    { id: 2, label: "Checkout", icon: CreditCard },
];

export default function BookingStepsBar({ step }: BookingStepsBarProps) {
    return (
        <div className="w-full px-6 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between relative">
                    <div
                        className="absolute top-5 left-10 h-0.5 bg-gray-200 -z-10"
                        style={{
                            width: "calc(100% - 80px)", // full distance between first and last icon centers
                        }}
                    ></div>

                    {/* Active progress line */}
                    <div
                        className="absolute top-5 left-10 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out -z-10"
                        style={{
                            width:
                                step === 1
                                    ? "0%"
                                    : step === 2
                                      ? "calc(100% - 80px)"
                                      : "0%",
                        }}
                    ></div>
                    {steps.map((s, idx) => {
                        const Icon = s.icon;
                        const isCompleted = step > s.id;
                        const isActive = step === s.id;
                        const isUpcoming = step < s.id;

                        return (
                            <div
                                key={s.id}
                                className="flex flex-col items-center relative z-10"
                            >
                                {/* Step circle with enhanced styling */}
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ease-out transform ${
                                        isCompleted
                                            ? "bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-lg shadow-green-200 scale-110"
                                            : isActive
                                              ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg shadow-blue-200 scale-110"
                                              : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 animate-in zoom-in duration-300" />
                                    ) : (
                                        <Icon
                                            className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                                        />
                                    )}
                                </div>

                                {/* Step label with enhanced typography */}
                                <div className="mt-3 text-center">
                                    <p
                                        className={`text-sm font-semibold transition-all duration-300 ${
                                            isCompleted
                                                ? "text-green-700"
                                                : isActive
                                                  ? "text-blue-700"
                                                  : "text-gray-500"
                                        }`}
                                    >
                                        {s.label}
                                    </p>

                                    {/* Status indicator */}
                                    <div className="mt-1">
                                        {isCompleted && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        )}
                                        {isActive && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Current
                                            </span>
                                        )}
                                        {isUpcoming && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Upcoming
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress indicator */}
                <div className="mt-6 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">
                            Step {step} of {steps.length}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${(step / steps.length) * 100}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
