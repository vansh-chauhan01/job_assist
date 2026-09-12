import Link from 'next/link';
import { Target, Code2, Globe } from 'lucide-react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF8ED] border-t border-stone-200/80 pt-16 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-stone-200/60">
          
          {/* Brand Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            
            <Link href="/" className="flex items-center gap-2 group">
              <Target className="w-5 h-5 text-slate-900" />
              <span className="font-bold text-2xl text-slate-900 tracking-tight font-['Instrument_Serif',serif] italic">
                Orbit
              </span>
            </Link>
            <p className="text-sm text-stone-600 max-w-sm">
              Practice voice interviews out loud and track your entire job search seamlessly.
            </p>
          </div>

          {/* Social / Developer Links */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <p>contact me :</p>
            <a
              href="https://portfolio-5vvv.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-stone-200/80 text-stone-700 hover:text-slate-950 hover:bg-white transition-all text-sm font-medium shadow-2xs"
            >
              <Globe className="w-4 h-4 text-[#4C1D95]" />
              Portfolio
            </a>

            <a
              href="https://github.com/vansh-chauhan01/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-stone-200/80 text-stone-700 hover:text-slate-950 hover:bg-white transition-all text-sm font-medium shadow-2xs"
            >
              <GitHubIcon className="w-4 h-4 text-slate-900" />
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/vansh-chauhan-aa9227204/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-stone-200/80 text-stone-700 hover:text-slate-950 hover:bg-white transition-all text-sm font-medium shadow-2xs"
            >
              <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
              LinkedIn
            </a>

            <a
              href="https://leetcode.com/u/vansh_chauhan01/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-stone-200/80 text-stone-700 hover:text-slate-950 hover:bg-white transition-all text-sm font-medium shadow-2xs"
            >
              <Code2 className="w-4 h-4 text-[#FFA116]" />
              LeetCode
            </a>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Orbit. All rights reserved.</p>
          <p className="font-['Instrument_Serif',serif] italic text-sm text-stone-600">
            Created by Vansh Chauhan
          </p>
        </div>
      </div>
    </footer>
  );
}