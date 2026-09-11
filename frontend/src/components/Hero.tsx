import Link from 'next/link';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-[#FAF8ED] text-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
        
        {/* Editorial Serif Display Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal text-[#1A1A1A] tracking-tight leading-[1.05] font-['Instrument_Serif',serif]">
          Apply smart, <span className="italic"> interview smarter</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-2xl font-normal leading-relaxed">
          The AI voice interviewer that prepares you out loud and tracks every application seamlessly in one place.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#E9D5FF] text-[#4C1D95] border border-[#D8B4FE] font-semibold text-base hover:bg-[#DDD6FE] active:scale-[0.98] transition-all shadow-sm"
          >
            Get started for free
          </Link>

          <Link
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/80 border border-stone-300/80 text-slate-800 font-semibold text-base hover:bg-white active:scale-[0.98] transition-all shadow-xs"
          >
            <Play className="w-4 h-4 fill-current text-slate-700" />
            Watch Demo
          </Link>
        </div>

      </div>
    </section>
  );
}