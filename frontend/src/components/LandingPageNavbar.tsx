import Link from 'next/link';
import { Target } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full bg-[#FAF8ED] pt-6 px-4 sm:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md border border-stone-200/80 rounded-2xl px-6 h-16 flex items-center justify-between shadow-xs">
        
        {/* Left: Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 group">
          <Target className="w-5 h-5 text-slate-900" />
          <span className="font-bold text-xl text-slate-900 tracking-tight font-['Instrument_Serif',serif] italic">
            JobAssist
          </span>
        </Link>

        {/* Right: Auth Links */}
        <div className="flex items-center gap-2 sm:gap-4 font-medium text-sm font-['Plus_Jakarta_Sans',sans-serif]">
          <Link
            href="/login"
            className="text-slate-700 hover:text-slate-950 px-3 py-2 transition-colors"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="text-slate-700 hover:text-slate-950 px-3 py-2 transition-colors"
          >
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}