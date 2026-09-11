import { UserPlus, AudioLines, BarChart2, Trophy } from 'lucide-react';

const steps = [
  {
    step: '1',
    icon: UserPlus,
    title: 'Create your profile',
    description:
      'Tell us your target role, experience level, and the companies you are aiming for. We customize everything from there.',
  },
  {
    step: '2',
    icon: AudioLines,
    title: 'Speak with AI',
    description:
      'Start a voice interview anytime. The AI asks realistic questions out loud, listens to your answers, and follows up naturally in real time.',
  },
  {
    step: '3',
    icon: BarChart2,
    title: 'Get instant feedback',
    description:
      'After each session, receive a detailed breakdown of your performance with specific, actionable improvement tips.',
  },
  {
    step: '4',
    icon: Trophy,
    title: 'Track and land offers',
    description:
      'Log every application, monitor your progress, and watch your interview scores climb until you land the offer.',
  },
];

export default function Working() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-[#FAF8ED] text-stone-800 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-6xl font-normal text-[#1A1A1A] tracking-tight leading-tight font-['Instrument_Serif',serif]">
            How it works in <span className="italic">four steps</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
            From sign-up to offer letter in less time than you think. No setup, no learning curve — just results.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Horizontal Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-stone-200/80 -z-0" />

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon Card with Step Number Badge */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 flex items-center justify-center shadow-2xs group-hover:bg-white group-hover:scale-105 transition-all duration-200">
                      <Icon className="w-8 h-8 text-[#4C1D95]" />
                    </div>

                    {/* Number Badge */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {item.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-2.5">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-stone-600 leading-relaxed font-normal max-w-xs">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}