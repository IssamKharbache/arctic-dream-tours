"use client";

import { X, Plane, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";

export default function PromoDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0">
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fillOpacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
          </div>

          <div className="relative px-6 py-8">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-center text-2xl font-bold text-white">
                🎉 <span className="text-yellow-300">SPECIAL OFFER!</span>
              </DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4 mt-6">
              <div className="flex items-center justify-center space-x-2 text-lg">
                <Plane className="h-6 w-6 text-yellow-300" />
                <span className="font-semibold">
                  Book 2 Tours = FREE Airport Transfers!
                </span>
                <MapPin className="h-6 w-6 text-yellow-300" />
              </div>

              <p className="text-white/90 text-base">
                We'll handle ALL your airport transportation - from airport to
                hotel and back to airport.
              </p>

              <div className="flex items-center justify-center space-x-4 mt-6">
                <Link href="/activities">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-yellow-100 transition-colors duration-200 cursor-pointer"
                  >
                    Book Now
                  </button>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white underline transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>

          {/* Sparkle effect */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div
              className="absolute top-8 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute bottom-4 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
