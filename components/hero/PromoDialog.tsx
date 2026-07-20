"use client";

import { Snowflake, Package, Sparkles, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent" />

          {/* Animated Snow Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-snow"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
              />
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-14 min-h-[520px]">
            <DialogHeader className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mx-auto px-4 py-1.5 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-200 text-sm font-medium animate-pulse">
                <Sparkles className="w-4 h-4" />
                Limited Time Offer
              </div>

              <DialogTitle className="text-center">
                <span className="block text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
                  NEW:
                </span>
                <span className="block text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 tracking-tight mt-1">
                  LAPLAND PACKAGES
                </span>
                <span className="block text-3xl mt-2">❄️</span>
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="sr-only">
              Discover our new Lapland travel packages with multi-day adventures
            </DialogDescription>

            <div className="mt-8 space-y-6 max-w-lg">
              {/* Price Tag */}
              <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <Package className="h-7 w-7 text-cyan-300" />
                <span className="text-xl md:text-2xl font-bold text-white">
                  Multi-day adventures
                </span>
                <div className="h-6 w-px bg-white/20" />
                <span className="text-2xl md:text-3xl font-black text-amber-300 drop-shadow-lg animate-pulse">
                  from €600
                </span>
                <span className="text-white/60 text-sm font-medium">
                  /person
                </span>
              </div>

              <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-md mx-auto">
                Every package bundles activities, accommodation & airport
                transfers into one seamless itinerary — just show up and let the
                magic happen.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link href="/packages" className="w-full sm:w-auto">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-lg font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View Packages
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white/80 text-sm font-medium underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all duration-300 py-2"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Snow Animation Keyframes */}
      <style jsx global>{`
        @keyframes snow {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(520px) translateX(20px);
            opacity: 0;
          }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
      `}</style>
    </Dialog>
  );
}
