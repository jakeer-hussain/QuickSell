import React from "react";
import { Sparkles, ShoppingBag } from "lucide-react";

function HeroSection() {
  return (
    <div className="clay-card p-6 md:p-10 bg-gradient-to-br from-indigo-50/50 via-pink-50/30 to-purple-50/40 border border-white relative overflow-hidden">
      <div className="relative z-10 max-w-2xl space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-pink-100 text-pink-600 rounded-full border border-pink-200">
          <Sparkles className="w-3.5 h-3.5" /> Fun, Interactive Clay Design UI
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
          Buy & Sell with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Squishy, Cozier</span> Feel!
        </h2>
        <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
          Welcome to ReSeller. Clean pastel design with soft physical shadows. Create listings, ask questions, and reply to queries. The interface dynamically adapts to whether you own a listing or are exploring items!
        </p>
      </div>
      <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-center opacity-20 pointer-events-none">
        <ShoppingBag className="w-56 h-56 text-indigo-300" />
      </div>
    </div>
  );
}

export default HeroSection;