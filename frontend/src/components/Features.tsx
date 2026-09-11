import {
  Mic,
  FileUser ,
  BarChart3,
  Sparkles,
  Target,
  Bell,
  FileText,
  Calendar,
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'AI Voice Interviews',
    description:
      'Speak naturally with an AI interviewer that asks realistic questions, listens to your responses, and adapts to your role and seniority.',
  },
  {
    icon: FileUser ,
    title: 'Application Tracker',
    description:
      'Track every application on a visual Kanban board. Drag and drop from Applied to Offer, and never lose track of where you stand.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description:
      'Get detailed scores on communication, technical depth, and problem-solving. See your improvement over time with visual trends.',
  },
  {
    icon: Sparkles,
    title: 'Smart Feedback',
    description:
      'Receive instant, actionable feedback after every voice session. Know exactly what to improve before your real interview.',
  },
  {
    icon: Target,
    title: 'Role-Specific Prep',
    description:
      'Choose from 200+ role templates — from Frontend Engineer to Product Manager. Questions tailored to the exact skills employers test.',
  },
  {
    icon: Bell,
    title: 'Interview Reminders',
    description:
      'Never miss a follow-up. Get timely reminders for upcoming interviews, thank-you emails, and application deadlines.',
  },
  {
    icon: FileText,
    title: 'Resume Analysis',
    description:
      'Upload your resume and get AI-powered suggestions to optimize it for each role. Beat the ATS and get more interviews.',
  },
  {
    icon: Calendar,
    title: 'Interview Scheduling',
    description:
      'Sync with your calendar and schedule mock interviews at the best times. Build a consistent practice habit effortlessly.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-[#FAF8ED] text-stone-800 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-6xl font-normal text-[#1A1A1A] tracking-tight leading-tight font-['Instrument_Serif',serif]">
            Two powerful tools, <span className="italic">one platform</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
            From your first practice question to your final offer letter, we've built
            every step of the job search journey into a single, seamless experience.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-7 rounded-2xl bg-white/70 backdrop-blur-xs border border-stone-200/80 hover:bg-white hover:border-stone-300 transition-all duration-200 shadow-2xs hover:shadow-sm group flex flex-col justify-between"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-[#E9D5FF]/60 text-[#4C1D95] border border-[#D8B4FE]/50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-2.5">
                    {feature.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-stone-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}