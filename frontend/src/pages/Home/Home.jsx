import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs/animation';
import { stagger } from 'animejs/utils';
import Lenis from 'lenis';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/MinimalHome.css';
import { 
  Eye, Users, Share2, Tags, MapPin, 
  Building2, Sparkles, Cpu, 
  XCircle, AlertCircle 
} from 'lucide-react';

// siteData imports
import {
  heroGallery,
  talentProfiles,
  marqueeItems
} from '../../content/siteData';

// Import new premium sections
import InfiniteMarquee from '../../components/InfiniteMarquee';
import TestimonialCarousel from '../../components/TestimonialCarousel';
import PartnerSection from '../../components/PartnerSection';
import LaptopRevealSection from '../../components/LaptopRevealSection';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#E4F141";

const marqueeItemsText = [
  "BRAND GROWTH", "INFLUENCER COLLAB", "VIRAL CAMPAIGNS",
  "CONTENT STRATEGY", "AUDIENCE REACH", "DIGITAL PRESENCE",
  "ROI FOCUSED", "AUTHENTIC STORIES",
];

const brandServices = [
  { title: "Campaign Strategy", desc: "Data-driven campaigns tailored to your brand DNA and target audience for maximum impact." },
  { title: "Influencer Matching", desc: "AI-powered pairing with creators who truly align with your values and goals." },
  { title: "Content Creation", desc: "Premium content that converts — from 15-second reels to long-form storytelling." },
  { title: "Analytics & Reporting", desc: "Real-time dashboards showing ROI, reach, engagement, and every metric that matters." },
];

const influencerServices = [
  { title: "Brand Deal Negotiation", desc: "We fight for your worth — fair rates, clean contracts, zero runarounds." },
  { title: "Content Calendar", desc: "Structured posting schedules built to grow your audience consistently." },
  { title: "Monetization Strategy", desc: "Multiple revenue streams beyond brand deals — merch, digital products, and more." },
  { title: "Community Building", desc: "Tools and tactics to deepen the bond with your most loyal followers." },
];

const influencers = [
  { name: "Zara Khan", niche: "Fashion & Lifestyle", followers: "2.4M", platform: "Instagram", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=520&fit=crop&auto=format" },
  { name: "Dev Sharma", niche: "Tech & Gaming", followers: "5.1M", platform: "YouTube", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=520&fit=crop&auto=format" },
  { name: "Priya Nair", niche: "Beauty & Wellness", followers: "1.8M", platform: "Instagram", img: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=520&fit=crop&auto=format" },
  { name: "Arjun Mehta", niche: "Fitness & Sports", followers: "3.2M", platform: "Instagram", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=520&fit=crop&auto=format" },
  { name: "Riya Patel", niche: "Food & Travel", followers: "900K", platform: "TikTok", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=520&fit=crop&auto=format" },
  { name: "Kabir Singh", niche: "Lifestyle & Vlogs", followers: "4.2M", platform: "YouTube", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=520&fit=crop&auto=format" },
];

const stats = [
  { value: 500, suffix: "+", label: "Brands Served" },
  { value: 10, suffix: "K+", label: "Creator Network" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 250, suffix: "M+", label: "Total Reach" },
];

const steps = [
  { num: "01", title: "Discovery Call", desc: "We learn your goals, audience, and vision inside out before anything else." },
  { num: "02", title: "Strategy Build", desc: "Custom roadmap crafted for maximum reach, impact, and ROI." },
  { num: "03", title: "Execute & Create", desc: "Creators produce content. Campaigns go live. Real magic happens." },
  { num: "04", title: "Measure & Scale", desc: "Track every metric. Double down on what works. Scale relentlessly." },
];

const staticBrands = ["Gutargoo+", "Khiladi adda", "Prorewards", "we", "Gutargoo+", "Khiladi adda", "Prorewards", "we"];

function useCounter(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function FadeUp({ children, delay = 0, className = "", is3D = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  if (is3D) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 80, rotateX: 20, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center top", perspective: 1200 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// API Images resolver helper
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads/')) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
      if (isIP && hostname !== '127.0.0.1') {
        return `http://${hostname}:5000${url}`;
      }
    }
    return `${API_BASE}${url}`;
  }
  return url;
};

// Cursor Particles Background Component (Canvas based, mouse parallax, neon yellow)
function CursorParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 80;

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 2 + 1; // 1px to 3px
        this.alpha = Math.random() * 0.4 + 0.15; // 0.15 to 0.55
        this.parallaxFactor = this.size * 0.018; // Larger particles move more
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        const dx = (mouse.x - width / 2) * this.parallaxFactor;
        const dy = (mouse.y - height / 2) * this.parallaxFactor;

        ctx.beginPath();
        ctx.arc(this.x + dx, this.y + dy, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(228, 241, 65, ${this.alpha})`;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = '#E4F141';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles.forEach(p => p.reset());
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationId;
    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 0;

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// 3D Curved Gallery Component (dynamic 3D curve layout with left/right split and laser scanner)
function ThreeDCurvedGallery({ creators, brands }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // Duplicate creators if length is small to guarantee seamless horizontal looping
  let activeCreators = creators;
  if (activeCreators.length > 0 && activeCreators.length < 8) {
    activeCreators = [...activeCreators, ...activeCreators, ...activeCreators];
  }

  // Same for brands
  let activeBrands = brands;
  if (activeBrands.length > 0 && activeBrands.length < 8) {
    activeBrands = [...activeBrands, ...activeBrands, ...activeBrands];
  }

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    const container = containerRef.current;
    const track = trackRef.current;
    const cards = track.children;

    let scrollX = 0;
    let animationFrameId;
    const cardWidthWithGap = 280; // cardWidth (250px) + gap (30px)
    const totalWidth = activeCreators.length * cardWidthWithGap;
    const speed = 1.3; // scroll speed from left to right

    const update = () => {
      scrollX += speed;
      if (scrollX >= totalWidth) {
        scrollX -= totalWidth;
      }

      const containerWidth = container.offsetWidth || window.innerWidth;
      const centerX = containerWidth / 2;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const baseTrackX = i * cardWidthWithGap;

        // Wrapped horizontal position
        let relativeX = (baseTrackX + scrollX) % totalWidth;
        if (relativeX < 0) {
          relativeX += totalWidth;
        }

        // Apply shift so cards wrap outside the container edges
        let cardX = relativeX - 280;

        if (cardX > containerWidth + 280) {
          cardX -= totalWidth;
        } else if (cardX < -280) {
          cardX += totalWidth;
        }

        // Horizontal center of card relative to container center
        const cardCenterX = cardX + 125;
        const distFromCenter = cardCenterX - centerX;
        const normDist = distFromCenter / (containerWidth / 2 || 1);
        const clampedDist = Math.max(-1.5, Math.min(1.5, normDist));

        // 3D bend configuration
        const maxRotation = 35; // degrees
        const maxDepth = -160;  // pixels
        const rotateY = -clampedDist * maxRotation;
        const translateZ = -Math.abs(clampedDist) * maxDepth;
        const translateY = Math.abs(clampedDist) * 18;
        const scale = 1 - Math.min(0.12, Math.abs(clampedDist) * 0.08);

        // Hardware-accelerated hardware mutations
        card.style.transform = `translate3d(${cardX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

        // Z-Index depth sorting
        const zIndex = Math.round(100 - Math.abs(clampedDist) * 50);
        card.style.zIndex = zIndex;

        // Morph effect: Show influencer on the left side of the laser line, Brand on the right side
        const influencerSide = card.querySelector('.card-side-influencer');
        const brandSide = card.querySelector('.card-side-brand');

        if (influencerSide && brandSide) {
          const localSplitX = centerX - cardX;
          const splitPercent = Math.max(0, Math.min(100, (localSplitX / 250) * 100));

          if (splitPercent === 100) {
            // Entirely on the left of laser (Influencer)
            influencerSide.style.opacity = '1';
            influencerSide.style.pointerEvents = 'auto';
            influencerSide.style.clipPath = 'none';

            brandSide.style.opacity = '0';
            brandSide.style.pointerEvents = 'none';
            brandSide.style.clipPath = 'none';
          } else if (splitPercent === 0) {
            // Entirely on the right of laser (Brand)
            influencerSide.style.opacity = '0';
            influencerSide.style.pointerEvents = 'none';
            influencerSide.style.clipPath = 'none';

            brandSide.style.opacity = '1';
            brandSide.style.pointerEvents = 'auto';
            brandSide.style.clipPath = 'none';
          } else {
            // Crossing the laser line (Split morph)
            influencerSide.style.opacity = '1';
            influencerSide.style.pointerEvents = 'auto';
            influencerSide.style.clipPath = `polygon(0% 0%, ${splitPercent}% 0%, ${splitPercent}% 100%, 0% 100%)`;

            brandSide.style.opacity = '1';
            brandSide.style.pointerEvents = 'auto';
            brandSide.style.clipPath = `polygon(${splitPercent}% 0%, 100% 0%, 100% 100%, ${splitPercent}% 100%)`;
          }
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeCreators.length, activeBrands.length]);

  return (
    <div ref={containerRef} className="three-d-gallery-wrapper mt-16 select-none scroll-reveal-up-custom opacity-0">
      {/* Glowing shining aura backdrop behind laser separator */}
      <div className="laser-shining-aura" />

      {/* Central green neon laser beam separator */}
      <div className="gallery-laser-line" />

      <div
        ref={trackRef}
        className="three-d-gallery-container"
      >
        {activeCreators.map((item, idx) => {
          // Select corresponding brand for morphing back side
          const brand = activeBrands[idx % activeBrands.length];
          return (
            <div key={`${item._id || idx}-${idx}`} className="three-d-card group cursor-pointer">

              {/* Influencer Front Side (visible to the left of the laser line) */}
              <div className="card-side-influencer">
                <div className="three-d-card-img-container">
                  <img
                    src={resolveImg(item.imageUrl)}
                    alt={item.name}
                    className="three-d-card-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="three-d-card-overlay" />
                </div>

                <div className="three-d-card-details">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{item.name}</h4>
                      <span className="text-[7px] bg-[#E4F141] text-black px-1.5 py-0.5 rounded-full font-black">CREATOR</span>
                    </div>
                    <span className="text-[8px] text-white/40 font-semibold block mt-1">Verified Partner</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-center bg-white/5 border border-white/5 py-1.5 rounded-xl">
                    <div>
                      <span className="text-[5px] text-white/30 uppercase block font-semibold">Followers</span>
                      <strong className="text-[8px] text-white font-bold">{item.followersCount || '800K'}</strong>
                    </div>
                    <div>
                      <span className="text-[5px] text-white/30 uppercase block font-semibold">Reach</span>
                      <strong className="text-[8px] text-[#E4F141] font-bold">{item.reach || '3M+'}</strong>
                    </div>
                    <div>
                      <span className="text-[5px] text-white/30 uppercase block font-semibold">Engagement</span>
                      <strong className="text-[8px] text-white font-bold">{item.engagementRate || '7.2%'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Back/Scanned Side (visible to the right of the laser line) */}
              <div className="card-side-brand opacity-0 pointer-events-none">
                <div className="brand-card-logo-container">
                  {React.isValidElement(brand.logo) ? (
                    brand.logo
                  ) : brand.logo && typeof brand.logo === 'string' && (brand.logo.startsWith('data:') || brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="brand-card-logo-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-[#E4F141] font-black text-3xl">
                      {brand.logo ? brand.logo : brand.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="three-d-card-details">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{brand.name}</h4>
                      <span className="text-[7px] bg-[#E4F141] text-black px-1.5 py-0.5 rounded-full font-black">BRAND</span>
                    </div>
                    <span className="text-[8px] text-white/40 font-semibold block mt-1">Partner Brand</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-center bg-white/5 border border-white/5 py-1.5 rounded-xl">
                    <div>
                      <span className="text-[5px] text-white/30 uppercase block font-semibold">Campaigns</span>
                      <strong className="text-[8px] text-white font-bold">{idx % 2 === 0 ? '12' : '8'}</strong>
                    </div>
                    <div>
                      <span className="text-[5px] text-white/30 uppercase block font-semibold">Rating</span>
                      <strong className="text-[8px] text-[#E4F141] font-bold">4.9/5</strong>
                    </div>
                    <div>
                      <span className="text-[5px] text-white/30 uppercase block font-semibold">Status</span>
                      <strong className="text-[8px] text-white font-bold">ACTIVE</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

// Outlined Brand Marquee Component (moves continuously, color logos, neon yellow border)
function SeparatedBrandMarquee({ brands }) {
  if (!brands || brands.length === 0) return null;

  // Duplicate brands for smooth infinite scrolling
  const displayBrands = [...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <section className="separated-marquee-section">
      <div className="separated-marquee-wrapper">
        <div className="single-marquee-track">
          {displayBrands.map((brand, idx) => (
            <div key={`brand-${brand.name}-${idx}`} className="marquee-brand-item">
              <div className="marquee-brand-logo-container">
                {React.isValidElement(brand.logo) ? (
                  brand.logo
                ) : brand.logo && typeof brand.logo === 'string' && (brand.logo.startsWith('data:') || brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="marquee-brand-logo-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[#E4F141] font-black text-xs">
                    {brand.logo ? brand.logo : brand.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-white font-bold">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Default brands logo array in case DB is empty
const MOCK_HERO_BRANDS = [
  {
    name: 'ROOTER',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1C1C1E" />
        <path d="M6 6H10V10H6V6Z" fill="#E4F141" />
        <path d="M14 14H18V18H14V14Z" fill="#FFFFFF" />
        <path d="M10 10H14V14H10V10Z" fill="#E4F141" />
      </svg>
    )
  },
  {
    name: 'HAPPN',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1F2937" />
        <path d="M7 17L17 7M17 7H10M17 7V14" stroke="#E4F141" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7L7 17M7 17H14M7 17V10" stroke="#E4F141" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'ODOO',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1C1C1E" />
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="3" />
      </svg>
    )
  },
  {
    name: 'MIVI',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1C1C1E" />
        <path d="M6 18V6H9L12 11L15 6H18V18H15V11L12 15L9 11V18H6Z" fill="white" />
      </svg>
    )
  },
  {
    name: 'HIMALAYA OPTICALS',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1C1C1E" />
        <circle cx="8" cy="12" r="3" stroke="white" strokeWidth="2" />
        <circle cx="16" cy="12" r="3" stroke="white" strokeWidth="2" />
        <line x1="11" y1="12" x2="13" y2="12" stroke="white" strokeWidth="2" />
      </svg>
    )
  },
  {
    name: 'GYM99',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#111111" />
        <text x="5" y="16" fill="#E4F141" fontSize="10" fontWeight="900" fontFamily="sans-serif">G99</text>
      </svg>
    )
  },
  {
    name: 'NATURE PEARLS',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1C1C1E" />
        <circle cx="12" cy="12" r="4" fill="#E4F141" />
      </svg>
    )
  }
];

// Specific brand color mapping restricted strictly to #E4F141 and White/Black
const BRAND_COLORS = {
  apple: { border: 'hover:border-white/40', rgb: '255, 255, 255', textClass: 'text-white' },
  nike: { border: 'hover:border-[#E4F141]/40', rgb: '228, 241, 65', textClass: 'text-[#E4F141]' },
  tesla: { border: 'hover:border-[#E4F141]/40', rgb: '228, 241, 65', textClass: 'text-[#E4F141]' },
  spotify: { border: 'hover:border-[#E4F141]/40', rgb: '228, 241, 65', textClass: 'text-[#E4F141]' },
  netflix: { border: 'hover:border-[#E4F141]/40', rgb: '228, 241, 65', textClass: 'text-[#E4F141]' },
  amazon: { border: 'hover:border-[#E4F141]/40', rgb: '228, 241, 65', textClass: 'text-[#E4F141]' }
};

const getBrandColorStyle = (name, index) => {
  const key = name.toLowerCase();
  for (const brandKey in BRAND_COLORS) {
    if (key.includes(brandKey)) return BRAND_COLORS[brandKey];
  }
  return { border: 'hover:border-[#E4F141]/40', rgb: '228, 241, 65', textClass: 'text-[#E4F141]' };
};

// Reusable Native 3D Perspective Tilt Component
function TiltCard({ children, className, index = 0, style = {}, brandGlow = null }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate rotation: 10deg max rotation
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const glowStyles = brandGlow
    ? { '--glow-color-rgb': brandGlow.rgb }
    : { '--glow-color-rgb': '228, 241, 65' };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className} interactive-glow-card transition-transform duration-300 ease-out`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...glowStyles,
        ...style
      }}
    >
      {children}
    </div>
  );
}

// 3D Animated Viewport Graphic driven by AnimeJS (Monochrome Style)
function TrustStatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounter(stat.value, 2000, inView);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 20, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="p-8 rounded-[28px] border border-white/5 bg-white/[0.015] flex flex-col justify-between transition-all duration-500 group relative overflow-hidden backdrop-blur-md hover:border-[#E4F141]/30 hover:-translate-y-2"
      style={{
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        transformOrigin: "center top",
        perspective: 1000
      }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(150px circle at 50% 50%, rgba(228, 241, 65, 0.12), transparent 70%)`
        }}
      />
      
      {/* Decorative vertical glowing line on hover */}
      <div 
        className="absolute top-0 left-0 w-[3px] h-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top rounded-l-[28px] bg-[#E4F141]"
      />

      <div className="relative z-10">
        {/* Icon & Mini Badge */}
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border border-white/5 bg-white/[0.02] text-white/50 group-hover:text-white transition-all duration-300"
        >
          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform text-[#E4F141]" />
        </div>

        {/* Counter & Suffix */}
        <div className="text-5xl md:text-6xl font-black leading-none mb-3 font-mono tracking-tighter text-white">
          {count}
          <span className="text-[#E4F141]">{stat.suffix}</span>
        </div>
        
        {/* Label */}
        <div className="text-white font-bold text-sm tracking-wide mb-2 group-hover:text-[#E4F141] transition-colors">
          {stat.label}
        </div>
        
        {/* Description */}
        <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">
          {stat.desc}
        </p>
      </div>

      {/* Futuristic status dot */}
      <div className="flex items-center gap-1.5 mt-8 border-t border-white/5 pt-4 relative z-10">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#E4F141]" />
        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">SYSTEM ACTIVE</span>
      </div>
    </motion.div>
  );
}

function TrustSection() {
  const trustStats = [
    { value: 170, suffix: "M+", label: "Views Generated", desc: "Across YouTube, Instagram, and TikTok campaigns.", icon: Eye },
    { value: 1300, suffix: "+", label: "Creators Worked With", desc: "Vetted digital talent with active communities.", icon: Users },
    { value: 140, suffix: "K+", label: "Creator Network", desc: "Diverse influencer roster across all tiers.", icon: Share2 },
    { value: 25, suffix: "+", label: "Categories (Coming)", desc: "From tech, lifestyle to hyper-niche markets.", icon: Tags },
    { value: 500, suffix: "+", label: "Cities Covered", desc: "Hyperlocal and global campaign executions.", icon: MapPin },
  ];

  return (
    <section className="py-32 px-6 md:px-14 border-t border-b border-white/5 bg-black relative overflow-hidden">
      {/* Decorative cyber grids/lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(228,241,65,0.02)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E4F141]/25 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto">
        <FadeUp className="mb-20 text-center" is3D={true}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E4F141] animate-ping" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#E4F141]">YBEX Scale // Reach Analytics</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase max-w-4xl mx-auto">
            Proven <span className="accent-yellow-text">Credibility</span> in Numbers
          </h2>
          <p className="text-white/50 text-xs sm:text-sm mt-6 max-w-2xl mx-auto leading-relaxed">
            We host the infrastructure that drives high-growth campaign executions and matches brands with verified digital creators at scale.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {trustStats.map((stat, index) => (
            <TrustStatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ThreePillarsSection() {
  const pillars = [
    {
      title: "Brands",
      subtitle: "Enterprise Creator Strategy",
      desc: "Connect with vetted creators to scale campaigns and content systems that deliver real growth.",
      features: ["Creator Campaigns", "UGC Production", "Growth Strategy"],
      number: "01",
      themeColor: "#E4F141",
      glowColor: "rgba(228, 241, 65, 0.12)",
      icon: Building2
    },
    {
      title: "Creators",
      subtitle: "Creator Career Acceleration",
      desc: "Get brand deals with full transparency, grow your channel authority, and build your digital footprint.",
      features: ["Brand Collaborations", "Creator Growth", "Portfolio Hub"],
      number: "02",
      themeColor: "#E4F141",
      glowColor: "rgba(228, 241, 65, 0.12)",
      icon: Sparkles
    },
    {
      title: "YBEX Platform",
      subtitle: "Decentralized Creator Data",
      desc: "Vibe check details with verified metrics, track conversions, and access absolute rate transparency.",
      features: ["Creator Discovery", "Rate Transparency", "Verified Data", "Performance Tracking"],
      number: "03",
      themeColor: "#E4F141",
      glowColor: "rgba(228, 241, 65, 0.12)",
      icon: Cpu
    }
  ];

  return (
    <section className="py-32 px-6 md:px-14 bg-black relative overflow-hidden">
      {/* Decorative background grid and spots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(228,241,65,0.015)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto">
        <FadeUp className="mb-20 text-center" is3D={true}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E4F141] animate-ping" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#E4F141]">Our Core Pillars</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
            The Three <span className="accent-yellow-text">Pillars</span> of YBEX
          </h2>
          <p className="text-white/50 text-xs sm:text-sm mt-6 max-w-2xl mx-auto leading-relaxed">
            A cohesive three-way ecosystem that links brand campaign scaling, creator career optimization, and absolute metrics verification.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <FadeUp key={index} delay={index * 0.1} is3D={true} className="h-full">
                <TiltCard 
                  className="p-10 rounded-[32px] border border-white/5 bg-white/[0.01] flex flex-col justify-between group relative overflow-hidden backdrop-blur-md cursor-default transition-all duration-500 hover:border-[#E4F141]/35 h-full" 
                  index={index}
                  brandGlow={{ rgb: "228, 241, 65" }}
                >
                  {/* Background Large Number Watermark */}
                  <div className="absolute -top-4 -right-4 text-9xl font-black font-mono select-none pointer-events-none transition-all duration-500 opacity-[0.02] group-hover:opacity-[0.06] group-hover:scale-105"
                       style={{ 
                         color: '#ffffff',
                         WebkitTextStrokeWidth: '1px',
                         WebkitTextStrokeColor: pillar.themeColor,
                         fill: 'none'
                       }}>
                    {pillar.number}
                  </div>

                  {/* Cyber Glow Backdrop inside card */}
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[#E4F141]/5" />

                  <div className="relative z-10">
                    {/* Glowing Icon Wrapper */}
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300"
                         style={{ 
                           boxShadow: `0 0 20px rgba(0,0,0,0.5)`,
                           borderColor: `rgba(255, 255, 255, 0.08)`
                         }}>
                      <Icon className="w-7 h-7 text-[#E4F141]" />
                    </div>

                    <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-3">{pillar.subtitle}</span>
                    
                    <h3 className="text-3xl font-black text-white uppercase tracking-wide mb-5 group-hover:text-[#E4F141] transition-colors">
                      {pillar.title}
                    </h3>
                    
                    <p className="text-white/55 text-sm leading-relaxed mb-10 group-hover:text-white/70 transition-colors">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Features Capsules */}
                  <div className="relative z-10 mt-auto">
                    <div className="h-[1px] w-full bg-white/5 mb-6" />
                    <div className="flex flex-wrap gap-2.5">
                      {pillar.features.map((feature, idx) => (
                        <span key={idx} 
                              className="text-[10px] font-bold bg-white/[0.02] border border-white/15 hover:border-white/35 px-3.5 py-2 rounded-full text-white/70 hover:text-white transition-all duration-300 flex items-center gap-1.5"
                              style={{
                                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)'
                              }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E4F141]" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const brandProblems = [
    { title: "Vague Pricing", text: "Opaque pricing structures and hidden agency markups inflate your ad spend." },
    { title: "Fake Engagement", text: "Bloated follower metrics, bot accounts, and inorganic comment pools skew results." },
    { title: "Unreliable Delivery", text: "Inconsistent communication, missed content deadlines, and zero creative compliance." },
    { title: "Zero ROI Tracking", text: "Lack of clear attribution models, direct conversion logs, and performance math." }
  ];

  const creatorProblems = [
    { title: "Late Payouts", text: "Delayed cash transactions, long invoice cycles, and uncommunicative accounting." },
    { title: "Unfair rate contracts", text: "One-sided negotiation loops, complex legal clauses, and ownership loopholes." },
    { title: "Inconsistent Deal Flow", text: "Dry spells in brand opportunities, low predictable revenue, and endless pitch loops." },
    { title: "No Verified Analytics", text: "Scattered platform screenshots, manually compiled media kits, and lack of authority." }
  ];

  return (
    <section className="py-32 px-6 md:px-14 bg-black border-t border-b border-white/5 relative overflow-hidden">
      {/* Subtle lighting backdrop */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#E4F141]/[0.01] rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto">
        <FadeUp className="mb-20 text-center" is3D={true}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E4F141] animate-ping" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#E4F141]">The Challenge</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase max-w-4xl mx-auto">
            The Creator Economy Is Growing.<br />
            <span className="accent-yellow-text">But The System Is Still Broken.</span>
          </h2>
          <p className="text-white/50 text-xs sm:text-sm mt-6 max-w-xl mx-auto leading-relaxed">
            Brands struggle with verification, and creators struggle with transparency. We fix the plumbing.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-10 relative z-10">
          {/* Brand Problems Card */}
          <FadeUp delay={0.1} is3D={true} className="h-full">
            <div className="p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.015] to-transparent h-full flex flex-col justify-between hover:border-[#E4F141]/30 transition-all duration-500">
              <div>
                <div className="inline-flex items-center gap-3.5 mb-8">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E4F141]">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-wider">For Brands</h3>
                </div>
                
                <div className="space-y-6">
                  {brandProblems.map((prob, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E4F141]/60 mt-2 shrink-0" />
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-wide mb-1 uppercase">{prob.title}</h4>
                        <p className="text-white/50 text-xs leading-relaxed">{prob.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-white/30 text-[9px] font-mono tracking-widest uppercase">CRITICAL PATH DETECTED</span>
                <div className="bg-[#E4F141]/10 border border-[#E4F141]/20 text-[#E4F141] text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg w-fit">
                  Result // Inefficient spend & low ROI
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Creator Problems Card */}
          <FadeUp delay={0.2} is3D={true} className="h-full">
            <div className="p-10 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.015] to-transparent h-full flex flex-col justify-between hover:border-[#E4F141]/30 transition-all duration-500">
              <div>
                <div className="inline-flex items-center gap-3.5 mb-8">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E4F141]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-wider">For Creators</h3>
                </div>
                
                <div className="space-y-6">
                  {creatorProblems.map((prob, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E4F141]/60 mt-2 shrink-0" />
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-wide mb-1 uppercase">{prob.title}</h4>
                        <p className="text-white/50 text-xs leading-relaxed">{prob.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-white/30 text-[9px] font-mono tracking-widest uppercase">ADMINISTRATIVE LOOP</span>
                <div className="bg-[#E4F141]/10 border border-[#E4F141]/20 text-[#E4F141] text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg w-fit">
                  Result // Income instability & admin drag
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Bridge the Gap Callout */}
        <FadeUp delay={0.3} is3D={true} className="mt-20 relative z-10 max-w-5xl mx-auto">
          <div className="relative p-[1px] rounded-[36px] bg-gradient-to-r from-white/10 via-[#E4F141]/40 to-white/10 overflow-hidden shadow-[0_0_50px_rgba(228,241,65,0.05)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(228,241,65,0.04)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Main content body */}
            <div className="px-6 md:px-10 py-12 md:py-16 bg-black/90 backdrop-blur-xl rounded-[35px] border border-white/5 flex flex-col items-center text-center relative z-10">
              
              {/* Pulsing glow pipeline indicator */}
              <div className="flex items-center justify-center gap-6 md:gap-16 mb-10 w-full overflow-hidden">
                {/* Brand Side Node */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E4F141] shadow-[0_0_15px_rgba(228,241,65,0.15)] animate-pulse">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">BRANDS</span>
                </div>
                
                {/* Connecting Laser Conduit */}
                <div className="h-[2px] flex-grow max-w-[120px] relative bg-gradient-to-r from-white/10 via-[#E4F141] to-white/10 overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-transparent via-white to-transparent animate-laser-flow" />
                </div>

                {/* Center YBEX Portal Badge */}
                <div className="px-5 py-2.5 bg-[#E4F141] text-black rounded-2xl font-black text-[10px] sm:text-xs tracking-[0.25em] uppercase shadow-[0_0_30px_rgba(228,241,65,0.4)] transform hover:scale-105 transition-all flex-shrink-0">
                  YBEX PORTAL
                </div>

                {/* Connecting Laser Conduit */}
                <div className="h-[2px] flex-grow max-w-[120px] relative bg-gradient-to-r from-white/10 via-[#E4F141] to-white/10 overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-transparent via-white to-transparent animate-laser-flow-reverse" />
                </div>

                {/* Creator Side Node */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E4F141] shadow-[0_0_15px_rgba(228,241,65,0.15)] animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">CREATORS</span>
                </div>
              </div>

              {/* Text Callout */}
              <span className="text-[9px] font-mono tracking-widest bg-[#E4F141]/10 text-[#E4F141] border border-[#E4F141]/20 px-4 py-2 rounded-full mb-6">
                THE SOLUTION // METRIC BRIDGE
              </span>
              
              <h3 className="text-xl md:text-3xl font-black tracking-tight text-white uppercase max-w-3xl leading-snug">
                YBEX bridges the gap by linking <span className="accent-yellow-text">verified data</span>, <span className="accent-yellow-text">transparent rates</span>, and <span className="accent-yellow-text">automated campaigns</span>.
              </h3>
              
              <p className="text-white/50 text-xs sm:text-sm mt-5 max-w-xl leading-relaxed">
                By integrating our core metrics engines directly with social APIs, we eliminate middle-man markups, verify active creators, and pay out instantly.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function EarlyAccessFormSection() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Use existing endpoint `/contact`
      await axiosInstance.post('/contact', {
        name: 'Private Beta Applicant',
        email: email.trim(),
        phone: phone.trim() || 'N/A',
        subject: 'YBEX Private Beta early access request',
        message: 'Requested early access for YBEX private beta launching soon for selected brands and creators.'
      });
      setSuccess(true);
      setEmail('');
      setPhone('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="early-access" className="py-20 px-6 md:px-14 bg-black relative overflow-hidden border-b border-white/5">
      {/* Background ambient spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E4F141]/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10">
        <FadeUp is3D={true}>
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#E4F141] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E4F141]">Private Beta Launching Soon</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            Get Early Access to <span style={{ color: ACCENT }}>YBEX SaaS</span>
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Submit your contact information below to request an invite. Access real-time creator discovery, rates transparency, and campaign analytics.
          </p>
        </FadeUp>

        <FadeUp delay={0.1} is3D={true}>
          <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-white/[0.015] border border-white/5 backdrop-blur-md text-left space-y-4">
            {success ? (
              <div className="text-center py-6">
                <span className="text-4xl block mb-3">🎉</span>
                <h4 className="text-lg font-bold text-white mb-2">Request Submitted!</h4>
                <p className="text-white/50 text-xs">Thank you for your interest. Selected creators and brands will receive beta invitations soon.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-xs text-[#E4F141] underline uppercase tracking-wider font-bold"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="early-email" className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="early-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#E4F141]/50 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="early-phone" className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="early-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#E4F141]/50 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-semibold">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-yellow py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Submitting...' : 'Request Beta Access'}
                </button>
              </>
            )}
          </form>
        </FadeUp>
      </div>
    </section>
  );
}

function BrandBuildingSection() {
  const services = [
    {
      title: "Influencer Marketing",
      desc: "Connect with the perfect creators to build genuine narrative alignment and expand your organic impressions.",
      stat: "140K+ Network",
      tag: "Vetted Reach"
    },
    {
      title: "UGC Production",
      desc: "Get fast, cost-efficient, high-conversion creator video assets styled for modern advertising channels.",
      stat: "170M+ Views",
      tag: "High Engagement"
    },
    {
      title: "Brand Strategy",
      desc: "Design full-funnel strategy briefs that position your products with correct messaging formats.",
      stat: "Proven Growth",
      tag: "Expert Consulting"
    },
    {
      title: "Creator Campaigns",
      desc: "Run automated campaigns with complete tracking of analytics, payouts, and deliverable compliance.",
      stat: "Full Transparency",
      tag: "Automation"
    },
    {
      title: "Content Engine",
      desc: "Repurpose creator organic feeds into a continuous flow of commercial distribution materials.",
      stat: "Continuous Feed",
      tag: "Asset Machine"
    }
  ];

  return (
    <section className="py-24 px-6 md:px-14 bg-black relative overflow-hidden">
      {/* Blueprint Grid Lines Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(228,241,65,0.015)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <FadeUp is3D={true}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: ACCENT }} />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Brand Building</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
              We Don't Just Connect Brands.<br />
              <span style={{ color: ACCENT }}>We Build Them.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1} className="max-w-md" is3D={true}>
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
              We offer end-to-end services to transform raw creator alignments into permanent brand growth systems.
            </p>
          </FadeUp>
        </div>

        {/* Brand Building Services Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((svc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              whileHover={{ y: -8, borderColor: `${ACCENT}40` }}
              className="p-8 rounded-3xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.025] flex flex-col justify-between transition-all duration-400 group cursor-default relative overflow-hidden"
              style={{ transformOrigin: "center top", perspective: 1000 }}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#E4F141] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div>
                <span className="text-[9px] font-bold text-[#E4F141] bg-[#E4F141]/10 border border-[#E4F141]/20 px-3 py-1 rounded-full uppercase tracking-wider block w-max mb-6">
                  {svc.tag}
                </span>
                <h3 className="text-xl font-black uppercase text-white tracking-wide mb-4 group-hover:text-[#E4F141] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed mb-8">
                  {svc.desc}
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Performance stat</span>
                <span className="text-xs font-black text-white font-mono">{svc.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const scrollToEarlyAccess = () => {
    const el = document.getElementById('early-access');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-28 px-6 md:px-14 bg-gradient-to-b from-[#030303] to-black border-t border-white/5 relative overflow-hidden text-center">
      {/* Animated subtle particle circle background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E4F141]/3 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto relative z-10">
        <FadeUp is3D={true}>
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: ACCENT }} />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Join Us</span>
            <span className="h-px w-8" style={{ background: ACCENT }} />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white max-w-3xl mx-auto mb-6">
            Be a part of the next chapter of the <span style={{ color: ACCENT }}>creator economy</span>.
          </h2>
          <p className="text-white/60 text-xs sm:text-sm md:text-base font-medium max-w-xl mx-auto mb-12 leading-relaxed">
            YBEX brings technology, data transparency, and human creativity together. Sign up today.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} is3D={true}>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link
              to="/get-started?role=brand"
              className="btn-yellow px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold"
            >
              I'm a Brand
            </Link>

            <Link
              to="/get-started?role=creator"
              className="btn-outline px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold border border-white/10 hover:border-[#E4F141] hover:text-[#E4F141] transition-all"
            >
              I'm a Creator
            </Link>

            <button
              onClick={scrollToEarlyAccess}
              className="btn-outline px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold border border-[#E4F141]/30 text-[#E4F141] hover:bg-[#E4F141]/10 transition-all cursor-pointer"
            >
              Get Early Access
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function Home() {
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [creators, setCreators] = useState([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);

  const hoverOn = () => {};
  const hoverOff = () => {};

  // Fetch brands from database
  useEffect(() => {
    axiosInstance.get('/brands')
      .then((res) => setBrands(res.data.brands || []))
      .catch(() => setBrands([]))
      .finally(() => setBrandsLoading(false));
  }, []);

  // Fetch creators from database
  useEffect(() => {
    axiosInstance.get('/creators')
      .then((res) => setCreators(res.data.creators || []))
      .catch(() => setCreators([]))
      .finally(() => setCreatorsLoading(false));
  }, []);

  // Map gallery creators from database or fallback to talentProfiles
  const galleryCreators = creators.length > 0
    ? creators.map((c) => ({
      _id: c._id,
      name: c.name,
      imageUrl: c.imageUrl,
      followersCount: c.followersCount || '800K',
      reach: c.reach || '3M+',
      engagementRate: c.engagementRate || '7.2%'
    }))
    : talentProfiles.map((item, idx) => ({
      _id: `mock-creator-${idx}`,
      name: item.name,
      imageUrl: item.image,
      followersCount: idx === 0 ? '2.4M' : idx === 1 ? '1.8M' : idx === 2 ? '950K' : idx === 3 ? '1.2M' : idx === 4 ? '3.1M' : idx === 5 ? '880K' : '2.1M',
      reach: idx === 0 ? '12M+' : idx === 1 ? '9.5M+' : idx === 2 ? '5.2M+' : idx === 3 ? '6.8M+' : idx === 4 ? '15M+' : idx === 5 ? '4.8M+' : '10M+',
      engagementRate: idx === 0 ? '8.4%' : idx === 1 ? '7.2%' : idx === 2 ? '9.1%' : idx === 3 ? '7.8%' : idx === 4 ? '8.9%' : idx === 5 ? '6.7%' : '7.5%'
    }));

  // Map display brands from fetched or fallback mock list
  const displayBrands = brands.length > 0
    ? brands.map((b) => ({
      name: b.name,
      logo: b.logoUrl ? resolveImg(b.logoUrl) : null,
      desc: 'Partner Brand',
      isDb: true,
      link: b.websiteLink
    }))
    : MOCK_HERO_BRANDS;

  // GSAP Entrance timelines and reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero timeline animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge-anim',
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
      )
        .fromTo('.hero-title-anim',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo('.hero-desc-anim',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.45'
        )
        .fromTo('.hero-btn-anim',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 },
          '-=0.35'
        )
        .fromTo('.three-d-gallery-wrapper',
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.5'
        );
    });

    // 2. Intersection Observer for Scroll Reveals
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('scroll-reveal-active');
          observer.unobserve(target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up-custom');
    elements.forEach((el) => observer.observe(el));

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, [brandsLoading, creatorsLoading]);

  return (
    <div className="minimal-home-container relative min-h-screen text-white bg-black overflow-x-hidden">
      {/* Scrollbar hide global */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background ambient spots */}
      <div className="glow-spot glow-spot-yellow" />
      <div className="glow-spot glow-spot-yellow opacity-30" style={{ top: '45%', right: '15%' }} />
      <div className="glow-spot glow-spot-yellow opacity-20" style={{ bottom: '20%', left: '10%' }} />

      {/* Mesh Background */}
      <div className="minimal-bg-mesh" />

      {/* Cursor Particles Background */}
      <CursorParticlesBackground />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-[36px] md:pt-[64px] pb-12 px-4 md:px-8 border-b border-white/5 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          {/* Centered Column: Text & Action Hub */}
          <div className="text-center flex flex-col items-center justify-center pt-0 pb-6 px-2 max-w-4xl">
            <div className="hero-badge-anim hidden"></div>

            <h1 className="hero-title-anim text-4xl sm:text-5xl md:text-[64px] font-black text-white tracking-tight leading-[1.05] uppercase">
              Connecting Brands With <span className="accent-yellow-text">Elite Creators</span>
            </h1>

            <p className="hero-desc-anim text-xs sm:text-sm md:text-base text-white/60 font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
              We drive viral campaign operations and track verified performance metrics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center mt-10 z-20">
              <Link
                to="/get-started"
                className="hero-btn-anim btn-yellow px-9 py-4 rounded-full text-xs uppercase tracking-widest"
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Get Started
              </Link>

              <Link
                to="/creators"
                className="hero-btn-anim btn-outline px-9 py-4 rounded-full text-xs uppercase tracking-widest"
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Explore Influencers
              </Link>
            </div>
          </div>

          {/* Centered 3D curved gallery with scanning left/right split */}
          <ThreeDCurvedGallery creators={galleryCreators} brands={displayBrands} />

        </div>
      </section>

      {/* ── YELLOW TEXT MARQUEE ── */}
      <div className="overflow-hidden border-y-2 border-black py-5 select-none" style={{ background: ACCENT }}>
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            {[
              "PAID PR", "BRAND IDENTITY", "UGC VIDEOS", "PERFORMANCE MARKETING", "IN HOUSE TEAM", "STUDIO START UPS",
              "PAID PR", "BRAND IDENTITY", "UGC VIDEOS", "PERFORMANCE MARKETING", "IN HOUSE TEAM", "STUDIO START UPS",
              "PAID PR", "BRAND IDENTITY", "UGC VIDEOS", "PERFORMANCE MARKETING", "IN HOUSE TEAM", "STUDIO START UPS",
              "PAID PR", "BRAND IDENTITY", "UGC VIDEOS", "PERFORMANCE MARKETING", "IN HOUSE TEAM", "STUDIO START UPS"
            ].map((text, i) => (
              <span key={i} className="inline-flex items-center text-black font-black text-xs md:text-sm tracking-[0.2em] uppercase flex-shrink-0">
                {text}
                <span className="mx-16 text-black/40 font-black">+</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── TRUST SECTION ── */}
      <TrustSection />

      {/* ── THREE PILLARS ── */}
      <ThreePillarsSection />

      {/* ── PROBLEM SECTION ── */}
      <ProblemSection />

      {/* ── 3D LAPTOP REVEAL — COMING SOON DASHBOARD ── */}
      <LaptopRevealSection />

      {/* ── EARLY ACCESS FORM ── */}
      <EarlyAccessFormSection />

      {/* ── BRAND BUILDING SECTION ── */}
      <BrandBuildingSection />

      {/* ── TESTIMONIAL CAROUSEL ── */}
      <TestimonialCarousel />

      {/* ── FINAL CTA ── */}
      <FinalCTASection />

      {/* ── PARTNER SECTION ── */}
      <PartnerSection creators={creators} brands={brands} />
    </div>
  );
}
