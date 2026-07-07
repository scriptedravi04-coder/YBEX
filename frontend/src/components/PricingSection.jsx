import React from 'react';
import useInViewAnimation from '../hooks/useInViewAnimation';

export default function PricingSection() {
  const [sectionRef, isInView] = useInViewAnimation();

  return (
    <section className="bg-white py-16 px-6 w-full flex justify-center">
      <div
        ref={sectionRef}
        className={`w-full max-w-5xl flex justify-end ${isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
      >
        <div className="w-full md:max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Card 1 (Dark) */}
          <div
            style={{ animationDelay: '0.1s' }}
            className="bg-[#051A24] rounded-[24px] md:rounded-[40px] px-6 md:pl-10 md:pr-24 py-8 md:py-10 flex flex-col justify-between text-[#E0EBF0] shadow-[inset_0_2px_8px_rgba(255,255,255,0.08)]"
          >
            <div>
              <h3 className="text-[22px] font-medium text-[#F6FCFF] mb-4 font-neue-montreal">
                Monthly Partnership
              </h3>
              <p className="text-sm leading-relaxed text-[#E0EBF0]/80 font-neue-montreal mb-8">
                A dedicated creative design team. <br />
                You work directly with Viktor.
              </p>
            </div>

            <div>
              <div className="mb-8">
                <span className="text-3xl font-bold text-[#F6FCFF] block font-neue-montreal">
                  $5,000
                </span>
                <span className="text-xs uppercase tracking-wider text-[#E0EBF0]/60 font-neue-montreal">
                  Monthly
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://halaskastudio.com/./book"
                  className="bg-[#F6FCFF] text-[#051A24] text-center font-semibold text-sm rounded-full px-6 py-3 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_2px_10px_rgba(0,0,0,0.15)] font-neue-montreal"
                >
                  Start a chat
                </a>
                <a
                  href="https://halaskastudio.com/./book"
                  className="bg-transparent border border-[#F6FCFF]/20 text-[#F6FCFF] text-center font-semibold text-sm rounded-full px-6 py-3 transition-colors duration-300 hover:bg-white/5 font-neue-montreal"
                >
                  How it works
                </a>
              </div>
            </div>
          </div>

          {/* Card 2 (Light) */}
          <div
            style={{ animationDelay: '0.2s' }}
            className="bg-white rounded-[24px] md:rounded-[40px] px-6 md:pl-10 md:pr-24 py-8 md:py-10 flex flex-col justify-between text-[#0D212C] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100"
          >
            <div>
              <h3 className="text-[22px] font-medium text-[#0D212C] mb-4 font-neue-montreal">
                Custom Project
              </h3>
              <p className="text-sm leading-relaxed text-[#0D212C]/70 font-neue-montreal mb-8">
                Fixed scope, fixed timeline. <br />
                Same team, same standards.
              </p>
            </div>

            <div>
              <div className="mb-8">
                <span className="text-3xl font-bold text-[#0D212C] block font-neue-montreal">
                  $5,000
                </span>
                <span className="text-xs uppercase tracking-wider text-[#0D212C]/60 font-neue-montreal">
                  Minimum
                </span>
              </div>

              <a
                href="https://halaskastudio.com/./book"
                className="bg-white text-[#051A24] text-center font-semibold text-sm rounded-full px-6 py-3 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 border border-[#051A24]/10 shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),_0_4px_30px_rgba(0,0,0,0.08)] inline-block font-neue-montreal"
              >
                Start a chat
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
