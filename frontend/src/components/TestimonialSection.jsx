import React, { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import useInViewAnimation from '../hooks/useInViewAnimation';

export default function TestimonialSection() {
  const [sectionRef, isInView] = useInViewAnimation();
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate if section is in or near viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate scroll progress through the viewport
        const totalDistance = windowHeight + rect.height;
        const scrolledDistance = windowHeight - rect.top;
        const progress = scrolledDistance / totalDistance; // 0 to 1

        // Center position gives yOffset = 0, moving up to +100px or down to -100px
        const maxOffset = 200; // max offset range is 200px
        const offset = (progress - 0.5) * maxOffset;

        setYOffset(offset);
      }
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculate
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-white py-16 px-6 overflow-hidden flex justify-center w-full"
    >
      <div
        ref={sectionRef}
        className={`max-w-2xl w-full flex flex-col items-center text-center ${
          isInView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        {/* Quote Icon */}
        <div style={{ animationDelay: '0.1s' }} className="mb-6">
          <Quote className="w-8 h-8 text-[#0D212C]" />
        </div>

        {/* Large Quote Text */}
        <h2
          style={{ animationDelay: '0.2s' }}
          className="text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] font-semibold text-[#0D212C] tracking-tight font-neue-montreal max-w-xl mb-4"
        >
          I left <span className="font-mondwest italic">Apple</span> to build the studio I always wanted to work with
        </h2>

        {/* Author */}
        <p
          style={{ animationDelay: '0.3s' }}
          className="italic text-sm text-[#273C46] mb-8 font-neue-montreal font-medium"
        >
          — Viktor Oddy
        </p>

        {/* Company Logos */}
        <div
          style={{ animationDelay: '0.4s' }}
          className="flex items-center justify-center gap-12 mb-12"
        >
          <span className="font-medium text-slate-900 text-2xl font-neue-montreal w-[80px]">Apple</span>
          <span className="font-medium text-slate-900 text-2xl font-neue-montreal w-[83px]">IDEO</span>
          <span className="font-medium text-slate-900 text-2xl font-neue-montreal w-[110px]">Polygon</span>
        </div>

        {/* Parallax Image */}
        <div
          style={{ animationDelay: '0.5s' }}
          className="relative w-full max-w-xs h-96 overflow-hidden rounded-2xl shadow-lg border border-slate-100"
        >
          <img
            ref={imageRef}
            src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260330_103804_7aa5494f-4d5b-432e-9dc7-20715275f143.png&w=1280&q=85"
            alt="Chris Halaska"
            className="absolute left-0 w-full h-[150%] object-cover"
            style={{
              top: '-25%',
              transform: `translate3d(0, ${yOffset}px, 0)`,
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </section>
  );
}
