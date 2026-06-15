import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../../api/axiosInstance';

/* ─── DATA ─────────────────────────────────────────────────────────── */
const pillars = [
  {
    iconEmoji: '🎬',
    title: 'Content Creation Mastery',
    desc: 'Learn the art of storytelling, high-end video editing, and viral hook techniques used by the world\'s top creators.',
  },
  {
    iconEmoji: '📊',
    title: 'Digital Marketing Pro',
    desc: 'Master performance marketing, SEO, and social media algorithms to scale any brand or personal profile effectively.',
  },
  {
    iconEmoji: '👥',
    title: 'Learn from Founders & Creators',
    desc: 'Direct mentorship from industry leaders who have built million-dollar media houses and successful digital brands.',
  },
  {
    iconEmoji: '🏢',
    title: 'Franchise Opportunity',
    desc: 'Exclusive access to our business model, enabling you to launch your own YBEX-powered media education hub.',
  },
];

const curriculumTracks = [
  {
    title: 'Content Creation',
    desc: 'Master the art of visual storytelling and high-retention editing that drives millions of views.',
    modules: ['Thumbnails & Design', 'Premium Editing', 'Storyboarding', 'Color Grading'],
    points: [
      'Photoshop mastery for viral thumbnail design',
      'Advanced Premier Pro & After Effects workflows',
      'Scriptwriting frameworks for high retention',
      'Sound design and color science for cinematic output',
      'Build a professional portfolio from day one',
    ],
  },
  {
    title: 'Digital Marketing',
    desc: 'Learn how to turn attention into revenue through performance marketing and sales funnels.',
    modules: ['Funnel Building', 'Meta & YT Ads', 'Copywriting', 'Data Analytics'],
    points: [
      'Building high-converting landing pages',
      'Psychology-backed copywriting for sales',
      'Scaling Meta and YouTube ad campaigns',
      'CRM automation and email marketing systems',
      'Conversion rate optimization (CRO) strategies',
    ],
  },
];

const premiumFeatures = [
  { iconEmoji: '💻', title: 'High-End Workstations', desc: 'Access to professional-grade editing rigs and software suites.' },
  { iconEmoji: '🎙️', title: 'Studio Access', desc: 'Record your content in our fully equipped production studios.' },
  { iconEmoji: '🧑‍🏫', title: 'One-on-One Mentorship', desc: 'Direct face-to-face guidance from industry veterans.' },
  { iconEmoji: '🤝', title: 'Creator Community Hub', desc: 'Network with other creators in a dedicated co-working space.' },
];

const mentors = [
  { name: 'Ravi', role: 'FOUNDER OF YBEX', initials: 'R' },
  { name: 'Sharadh', role: 'FOUNDER OF GUTARGOO+', initials: 'S' },
];

const faqs = [
  { q: 'Will I get a job after the course?', a: 'Yes, YBEX offers dedicated placement support. We have tie-ups with leading media houses and content creation agencies to help our students secure roles that match their skills and interests.' },
  { q: 'Who will I learn from?', a: 'You will learn directly from Ravi (Founder of YBEX), Sharadh (Founder of Gutargoo+), and 10+ specialized guest lecturers from the industry.' },
  { q: 'Do I need any prior experience?', a: 'No prior experience is needed. Our curriculum is designed to take you from zero to industry-ready, regardless of your background.' },
  { q: 'Is there a scholarship available?', a: 'Yes! The YBEX Talent Fund offers 100% scholarships for students with exceptional potential. Apply through our scholarship program.' },
  { q: 'What tools will I learn?', a: 'Adobe Premiere Pro, After Effects, Photoshop, Meta Ads Manager, Google Analytics, Notion, and many more industry-standard tools.' },
];

const franchiseStats = [
  { value: '5+', label: 'CITIES' },
  { value: '3L+', label: 'REVENUE' },
  { value: '6 Months', label: 'BREAK EVEN' },
  { value: '100%', label: 'SUPPORT' },
];

// Static placement brands as fallback
const staticPlacementBrands = [
  'ScrollStop Media', 'OnTheRise Media', 'ScoopWhoop', 'Mad Over Marketing',
  'The Viral Fever', 'SocialSamosa', 'FilterCopy', 'Pocket Aces', 'BeerBiceps',
  'Under 25', 'GrowthSchool', 'BigBrainco.'
];

// Static success stories as fallback
const staticSuccessStories = [
  { name: 'ARYAN MEHTA', role: 'CONTENT CREATOR', quote: 'YBEX se seekha ki viral kaise hote hain. Aaj main apna brand khud manage karta hoon.', earning: '₹3.2L/mo', company: 'SELF-BUILT', initials: 'AM' },
  { name: 'PRIYA SINGH', role: 'DIGITAL MARKETER', quote: 'From a student to heading digital at a top FMCG brand. YBEX is where it started.', earning: '₹1.8L/mo', company: 'MAMAEARTH', initials: 'PS' },
  { name: 'RAHUL VERMA', role: 'BRAND STRATEGIST', quote: 'I learned execution here. Now I\'m working with the best brands in the country.', earning: '₹2.4L/mo', company: 'RAZORPAY', initials: 'RV' },
  { name: 'SNEHA PATEL', role: 'UGC CREATOR', quote: 'Monthly lakhs earning while sitting at home. YBEX school made me a real creator.', earning: '₹4.5L/mo', company: 'SELF-BUILT', initials: 'SP' },
  { name: 'VIKRAM DAS', role: 'GROWTH MANAGER', quote: 'Learned from Founders Cabin. Now working in a top-floor office at a global company.', earning: '₹1.6L/mo', company: 'VEDANTU', initials: 'VD' },
  { name: 'ANANYA SHARMA', role: 'INFLUENCER & SPEAKER', quote: 'I was just a student. YBEX built my profile and now brands pay me lakhs.', earning: '₹6.2L/mo', company: 'SELF-BUILT', initials: 'AS' },
];

/* ─── CIRCULAR WAVE CAROUSEL - NO OVERLAP, SMOOTH ROTATION ─────────── */
function BrandSpiralGalaxy({ brands }) {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const animationRef = useRef(null);

  if (!brands || brands.length === 0) return null;

  // Ensure we have exactly 12 brands for perfect spacing
  const targetCount = 12;
  const displayBrands = brands.length < targetCount 
    ? [...Array(Math.ceil(targetCount / brands.length))].flatMap(() => brands).slice(0, targetCount)
    : brands.slice(0, targetCount);

  useEffect(() => {
    if (isPaused) return;
    
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      setRotation(prev => (prev + delta * 10) % 360); // Smooth 10 degrees per second
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1000px',
        height: '500px', // Increased height for proper spacing
        margin: '80px auto 120px', // More margins for text safety
        overflow: 'visible',
      }}
    >
      {/* Central glow core */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(167,139,250,0.15) 30%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Three concentric circles - PROPER SPACING, NO OVERLAP */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
      }}>
        {/* Inner Circle - 4 brands with proper spacing */}
        {displayBrands.slice(0, 4).map((brand, i) => {
          const angle = (i / 4) * 360 + rotation;
          const radius = 110; // Increased for better spacing
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={`inner-${i}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${isHovered ? 1.12 : 1})`,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered ? 100 : 10,
              }}
            >
              <BrandWaveCard brand={brand} isHovered={isHovered} size="medium" />
            </div>
          );
        })}

        {/* Middle Circle - 4 brands with proper spacing */}
        {displayBrands.slice(4, 8).map((brand, i) => {
          const angle = (i / 4) * 360 + rotation + 45; // Offset by 45 degrees
          const radius = 200; // Increased for better spacing
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          const isHovered = hoveredIndex === (i + 4);

          return (
            <div
              key={`middle-${i}`}
              onMouseEnter={() => setHoveredIndex(i + 4)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${isHovered ? 1.12 : 1})`,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered ? 100 : 8,
              }}
            >
              <BrandWaveCard brand={brand} isHovered={isHovered} size="medium" />
            </div>
          );
        })}

        {/* Outer Circle - 4 brands with proper spacing */}
        {displayBrands.slice(8, 12).map((brand, i) => {
          const angle = (i / 4) * 360 + rotation; // Same as inner for symmetry
          const radius = 290; // Increased for better spacing
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          const isHovered = hoveredIndex === (i + 8);

          return (
            <div
              key={`outer-${i}`}
              onMouseEnter={() => setHoveredIndex(i + 8)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${isHovered ? 1.12 : 1})`,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered ? 100 : 6,
              }}
            >
              <BrandWaveCard brand={brand} isHovered={isHovered} size="medium" />
            </div>
          );
        })}
      </div>

      {/* NO DECORATIVE RINGS - Removed as per request */}

      {/* Pause indicator */}
      {isPaused && (
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '999px',
          background: 'rgba(124,58,237,0.25)',
          border: '1px solid rgba(167,139,250,0.4)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#a78bfa',
            boxShadow: '0 0 12px #a78bfa',
          }} />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#e9d5ff',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Carousel Paused
          </span>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.5; }
        }
        @media (max-width: 768px) {
          /* Mobile adjustments handled in component */
        }
      `}</style>
    </div>
  );
}

function BrandWaveCard({ brand, isHovered, size = 'medium' }) {
  const name = brand.name || brand;
  const logo = brand.logoUrl;
  const link = brand.websiteLink;
  const Tag = link ? 'a' : 'div';
  const linkProps = link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      {...linkProps}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '0',
        minWidth: 'auto',
        minHeight: 'auto',
        borderRadius: '0',
        background: 'transparent',
        border: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        boxShadow: 'none',
        textDecoration: 'none',
        cursor: link ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Logo ONLY - NO BORDERS, NO BACKGROUND */}
      <div style={{
        width: '70px',
        height: '70px',
        borderRadius: '0',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        position: 'relative',
        zIndex: 1,
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
      }}>
        {logo ? (
          <img
            src={logo}
            alt={name}
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'contain',
              filter: isHovered 
                ? 'brightness(1.2) contrast(1.1) drop-shadow(0 4px 20px rgba(124,58,237,0.7))' 
                : 'brightness(1) contrast(1) drop-shadow(0 2px 10px rgba(0,0,0,0.4))',
              transition: 'filter 0.3s ease',
            }}
          />
        ) : (
          <span style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: isHovered ? '#fff' : '#f3e8ff',
            textShadow: isHovered 
              ? '0 0 30px rgba(167,139,250,1), 0 4px 15px rgba(0,0,0,0.7)' 
              : '0 3px 12px rgba(0,0,0,0.8)',
            transition: 'all 0.3s ease',
          }}>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name with proper spacing */}
      <span style={{
        fontSize: '0.8rem',
        fontWeight: isHovered ? 800 : 700,
        color: isHovered ? '#fff' : 'rgba(255,255,255,0.98)',
        letterSpacing: '0.05em', // Increased letter spacing
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        textShadow: isHovered 
          ? '0 3px 15px rgba(0,0,0,0.6), 0 0 25px rgba(124,58,237,0.7)' 
          : '0 2px 10px rgba(0,0,0,0.8)',
        transition: 'all 0.4s ease',
        maxWidth: '100px', // Reduced to prevent overlap
        lineHeight: 1.5, // Increased line height for better spacing
        wordBreak: 'break-word',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        marginTop: '6px', // Gap between logo and text
      }}>
        {name}
      </span>

      {/* Link arrow */}
      {link && isHovered && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          color: '#fff',
          fontWeight: 'bold',
          animation: 'bounce 0.6s ease-in-out infinite',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}>
          ↗
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes bounce {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(3px, -3px); }
        }
      `}</style>
    </Tag>
  );
}

/* ─── ANIMATION VARIANTS ────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ─── AUTO-SCROLL QUOTE COMPONENT ──────────────────────────────────── */
function StoryQuote({ lines }) {
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const currentLineRef = useRef(0);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const isLong = lines.length > 5;

  useEffect(() => {
    if (!isLong) return;
    const el = containerRef.current;
    if (!el) return;

    const lineEls = el.querySelectorAll('.q-line');
    const lineHeight = lineEls[0] ? lineEls[0].offsetHeight + 2 : 22;

    const tick = () => {
      if (isPausedRef.current) return;
      currentLineRef.current = (currentLineRef.current + 1) % lines.length;
      const idx = currentLineRef.current;
      setActiveLineIndex(idx);
      el.scrollTo({ top: idx * lineHeight, behavior: 'smooth' });
    };

    // Reset on mount
    currentLineRef.current = 0;
    setActiveLineIndex(0);
    el.scrollTop = 0;

    intervalRef.current = setInterval(tick, 2400);
    return () => clearInterval(intervalRef.current);
  }, [isLong, lines.length]);

  const handleClick = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  const progress = isLong ? Math.round(((activeLineIndex + 1) / lines.length) * 100) : 100;

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      {/* Progress bar */}
      {isLong && (
        <div style={{
          height: '2px',
          background: 'rgba(139,92,246,0.15)',
          borderRadius: '2px',
          marginBottom: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
            borderRadius: '2px',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 8px rgba(124,58,237,0.7)'
          }} />
        </div>
      )}

      {/* Scrollable quote area */}
      <div
        ref={containerRef}
        onClick={isLong ? handleClick : undefined}
        style={{
          maxHeight: '120px',
          overflowY: isLong ? 'hidden' : 'visible',
          overflowX: 'hidden',
          position: 'relative',
          cursor: isLong ? 'pointer' : 'default',
          scrollBehavior: 'smooth',
          WebkitMaskImage: isLong ? 'linear-gradient(to bottom, black 70%, transparent 100%)' : 'none',
          maskImage: isLong ? 'linear-gradient(to bottom, black 70%, transparent 100%)' : 'none',
        }}
      >
        {lines.map((line, lineIndex) => (
          <p
            key={lineIndex}
            className="q-line"
            style={{
              fontSize: '0.82rem',
              color: isLong
                ? (lineIndex === activeLineIndex ? 'rgba(255,255,255,0.95)' : lineIndex < activeLineIndex ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)')
                : 'rgba(255,255,255,0.75)',
              lineHeight: 1.55,
              margin: '0 0 2px 0',
              fontStyle: 'italic',
              fontWeight: isLong && lineIndex === activeLineIndex ? 600 : 400,
              WebkitFontSmoothing: 'antialiased',
              transition: 'color 0.4s ease, font-weight 0.3s ease',
              transform: isLong && lineIndex === activeLineIndex ? 'translateX(3px)' : 'translateX(0)',
            }}
          >
            {lineIndex === 0 && (
              <span style={{ color: '#a78bfa', fontSize: '1rem', fontStyle: 'normal', marginRight: '2px', lineHeight: 1 }}>"</span>
            )}
            {line}
            {lineIndex === lines.length - 1 && (
              <span style={{ color: '#a78bfa', fontSize: '1rem', fontStyle: 'normal', marginLeft: '2px', lineHeight: 1 }}>"</span>
            )}
          </p>
        ))}
      </div>

      {/* Pause / Play hint */}
      {isLong && (
        <div style={{
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer',
        }} onClick={handleClick}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: isPaused ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.25)',
            border: `1px solid ${isPaused ? 'rgba(167,139,250,0.5)' : 'rgba(124,58,237,0.5)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.3s ease'
          }}>
            {isPaused ? (
              /* Play triangle */
              <svg width="6" height="7" viewBox="0 0 6 7" fill="#a78bfa">
                <path d="M1 0.5L5.5 3.5L1 6.5V0.5Z"/>
              </svg>
            ) : (
              /* Pause bars */
              <svg width="6" height="7" viewBox="0 0 6 7" fill="#a78bfa">
                <rect x="0.5" y="0.5" width="2" height="6" rx="0.5"/>
                <rect x="3.5" y="0.5" width="2" height="6" rx="0.5"/>
              </svg>
            )}
          </div>
          <span style={{
            fontSize: '0.62rem',
            color: 'rgba(167,139,250,0.6)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            userSelect: 'none'
          }}>
            {isPaused ? 'Resume' : 'Pause'}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── COMPONENT ─────────────────────────────────────────────────────── */
export default function Academy() {
  const [openFaq, setOpenFaq] = useState(0);
  const [brands, setBrands] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('enrollment');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    track: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Scholarship Modal State
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [scholarshipForm, setScholarshipForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredTrack: '',
    portfolioUrl: '',
    reason: '',
    background: ''
  });
  const [scholarshipSubmitting, setScholarshipSubmitting] = useState(false);
  const [scholarshipSubmitted, setScholarshipSubmitted] = useState(false);

  // Fetch brands and success stories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, storiesRes] = await Promise.all([
          axiosInstance.get('/brands'),
          axiosInstance.get('/success-stories')
        ]);
        setBrands(brandsRes.data.data || brandsRes.data.brands || []);
        setSuccessStories(storiesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setBrands([]);
        setSuccessStories([]);
      }
    };
    fetchData();
  }, []);

  const handleApplyClick = (type = 'enrollment') => {
    setModalType(type);
    setShowModal(true);
    setShowThankYou(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowThankYou(false);
    setFormData({ fullName: '', email: '', phone: '', track: '', goals: '' });
  };

  const handleOpenScholarshipModal = () => {
    setShowScholarshipModal(true);
    setScholarshipSubmitted(false);
    setScholarshipForm({
      fullName: '',
      email: '',
      phone: '',
      preferredTrack: '',
      portfolioUrl: '',
      reason: '',
      background: ''
    });
  };

  const handleCloseScholarshipModal = () => {
    setShowScholarshipModal(false);
    setScholarshipSubmitted(false);
  };

  const handleScholarshipInputChange = (e) => {
    setScholarshipForm({ ...scholarshipForm, [e.target.name]: e.target.value });
  };

  const handleScholarshipSubmit = async (e) => {
    e.preventDefault();
    setScholarshipSubmitting(true);

    try {
      await axiosInstance.post('/scholarships/apply', scholarshipForm);
      setScholarshipSubmitting(false);
      setScholarshipSubmitted(true);

      setTimeout(() => {
        handleCloseScholarshipModal();
      }, 4000);
    } catch (error) {
      console.error('Error submitting scholarship application:', error);
      setScholarshipSubmitting(false);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post('/contact', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: modalType === 'scholarship' ? 'YBEX Talent Fund Application' : 'YBEX School Enrollment',
        message: `Track: ${formData.track || 'Not selected'}\nGoals: ${formData.goals}`,
        category: modalType === 'scholarship' ? 'scholarship' : 'creators-school'
      });

      setIsSubmitting(false);
      setShowThankYou(true);

      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  const displayBrands = brands.length > 0 ? brands : staticPlacementBrands.map((name, i) => ({ name, logoUrl: null, websiteLink: null, _id: i }));
  const displayStories = successStories.length > 0 ? successStories : staticSuccessStories;

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif", 
      overflowX: 'hidden',
      backgroundColor: '#050510',
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(30, 60, 150, 0.25), transparent),
        radial-gradient(ellipse 60% 40% at 80% 50%, rgba(20, 40, 120, 0.15), transparent),
        radial-gradient(ellipse 50% 30% at 20% 80%, rgba(25, 50, 130, 0.12), transparent)
      `,
    }}>
      {/* Purple Grid Overlay - Full Page */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* CSS for hover effects */}
      <style>{`
        .story-card:hover .image-hover-overlay {
          background: rgba(0,0,0,0.38) !important;
        }
        .story-card:hover .image-hover-overlay .profile-link-btn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .story-card:hover img {
          transform: scale(1.07) !important;
        }
        .story-card:hover {
          border-color: rgba(139,92,246,0.35) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15), 0 0 40px rgba(124,58,237,0.12) !important;
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '10px 20px 80px', overflow: 'hidden', zIndex: 2 }}>
        {/* Purple Glow Effects */}
        <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse,rgba(139,92,246,0.4) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '20%', width: '400px', height: '300px', background: 'radial-gradient(ellipse,rgba(124,58,237,0.25) 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '28px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.12)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.95)', WebkitFontSmoothing: 'antialiased' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 12px #a78bfa' }} />
            LIMITED SEATS AVAILABLE FOR NEXT BATCH
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ margin: '0 0 16px', fontSize: 'clamp(2.8rem,7vw,4.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", WebkitFontSmoothing: 'antialiased' }}>
          <span style={{ 
            background: 'linear-gradient(135deg,#ffffff 0%,#a78bfa 50%,#8b5cf6 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.6))'
          }}>YBEX SCHOOL</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ margin: '0 0 32px', fontSize: 'clamp(0.9rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.85)', fontWeight: 500, letterSpacing: '0.01em', WebkitFontSmoothing: 'antialiased' }}>
          A School from <strong style={{ color: '#fff', fontWeight: 600 }}>Founders Cabin</strong>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          {/* Join Now Button - Blue Theme with White Shine */}
          <motion.button
            onClick={() => handleApplyClick('enrollment')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: '1px solid rgba(167,139,250,0.4)',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            {/* White Shining Effect */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: ['-100%', '200%'], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                pointerEvents: 'none'
              }}
            />
            <span style={{ position: 'relative', zIndex: 1, textShadow: '0 0 15px rgba(255,255,255,0.5)', fontWeight: 600 }}>Join Now</span>
            <span style={{ position: 'relative', zIndex: 1 }}>→</span>
          </motion.button>

          <motion.a 
            href="#curriculum" 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 28px', 
              borderRadius: '999px', 
              background: 'rgba(255,255,255,0.06)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 500, 
              fontSize: '0.85rem', 
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'all 0.3s ease',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            <span style={{ fontWeight: 500 }}>Explore Curriculum</span>
          </motion.a>
        </motion.div>

        {/* Feature cards row */}
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', width: '100%', maxWidth: '900px' }}>
          {[
            { icon: '📍', title: 'Learn at Our Office', desc: 'Hands-on physical workspace' },
            { icon: '🌐', title: 'Offline + Online', desc: 'Flexible hybrid learning model' },
            { icon: '🎛️', title: 'Studio Access', desc: 'Professional creator tools' },
            { icon: '📈', title: 'Guaranteed Growth', desc: 'Personalized mentorship path' },
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ padding: '24px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: '#fff' }}>{f.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WHY YBEX / CORE PILLARS ── */}
      <section id="pillars" style={{ padding: '100px 20px', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '20px' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a78bfa' }} />
            WHY YBEX
          </span>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Our Core <span style={{ color: '#a855f7' }}>Pillars</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Beyond just a school, we are an ecosystem designed to turn passionate individuals into industry-ready masters.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {pillars.map((pillar, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}
              style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}
              whileHover={{ y: -8, borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.1))', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px' }}>
                {pillar.iconEmoji}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>{pillar.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CURRICULUM / ROADMAP ── */}
      <section id="curriculum" style={{ padding: '100px 20px', background: 'linear-gradient(180deg,rgba(124,58,237,0.03) 0%,transparent 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            THE ROADMAP TO <span style={{ color: '#a855f7' }}>MASTERY</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            A dual-track curriculum designed to turn you into a full-stack digital entrepreneur.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {curriculumTracks.map((track, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>{track.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', lineHeight: 1.6 }}>{track.desc}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '28px' }}>
                {track.modules.map((module, j) => (
                  <div key={j} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>
                    {module}
                  </div>
                ))}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {track.points.map((point, k) => (
                  <li key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PREMIUM / HQ SECTION ── */}
      <section style={{ padding: '100px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Learn at Our <span style={{ color: '#a855f7' }}>HQ Office</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Experience the ultimate creator environment. Get hands-on training with professional equipment and direct access to mentors at our Bangalore headquarters.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 24px', color: '#fff' }}>What You Get in Premium</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {premiumFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(168,85,247,0.05)' }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '16px 14px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(168,85,247,0.12)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {feature.iconEmoji}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>{feature.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.45 }}>{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.15)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(168,85,247,0.2)', fontSize: '0.65rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em' }}>
              COMING SOON
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>Premium Plan</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>Our most intensive cohorts.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>₹??,???</div>
            <p style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '24px' }}>Pricing to be revealed soon</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['Limited to 9 seats per batch', '3 month Offline Intensive', 'Direct feedback on every project', 'Live Industry Projects', 'Certification & Portfolio Review'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  <svg width="16" height="16" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  {item}
                </li>
              ))}
            </ul>

            <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              JOIN WAITLIST →
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '12px', letterSpacing: '0.1em' }}>
              *BATCH STARTING IN 13 DAYS
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MENTORS ── */}
      <section style={{ padding: '80px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 12px', color: 'rgba(255,255,255,0.8)' }}>
            Learn from the <span style={{ color: '#a855f7' }}>Best</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Our mentors are industry practitioners who have successfully built and scaled digital-first brands.
          </p>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {mentors.map((mentor, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ width: '200px', padding: '30px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.2))', border: '2px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                {mentor.initials}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{mentor.name}</h4>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a78bfa', letterSpacing: '0.05em' }}>{mentor.role}</p>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
          + and 10+ more specialized guest lecturers from the industry.
        </motion.p>
      </section>

      {/* ── PLACEMENTS ── */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(180deg,transparent 0%,rgba(124,58,237,0.03) 50%,transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Animated background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          animation: 'pulseGlow 4s ease-in-out infinite'
        }} />

        <style>{`
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .brand-card:hover .brand-logo {
            transform: scale(1.12);
            filter: grayscale(0%) brightness(1.15) !important;
          }
          .brand-card:hover .brand-glow {
            opacity: 1 !important;
          }
          .brand-card:hover {
            transform: translateY(-8px) !important;
            border-color: rgba(139,92,246,0.5) !important;
            box-shadow: 0 20px 60px rgba(124,58,237,0.25), 0 0 0 1px rgba(167,139,250,0.3) !important;
          }
          @media (max-width: 768px) {
            .brand-card { padding: 16px 12px !important; }
            .brand-card h4 { font-size: 0.7rem !important; }
          }
          @media (max-width: 480px) {
            .story-card { border-radius: 16px !important; }
          }
        `}</style>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: '20px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 10px #a78bfa' }} />
            PLACEMENT PARTNERS
          </motion.span>
          <h2 style={{
            fontSize: 'clamp(2.2rem,5vw,3.5rem)',
            fontWeight: 800,
            margin: '0 0 16px',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #a78bfa 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 4s linear infinite'
          }}>
            GET PLACED AT
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
            Join the ranks of professionals working at India&apos;s most innovative media houses and creative agencies
          </p>
        </motion.div>

        {/* 3D Spiral Galaxy Carousel */}
        <BrandSpiralGalaxy brands={displayBrands} />

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginBottom: '40px',
            position: 'relative',
            zIndex: 2
          }}
        >
          {[
            { value: '50+', label: 'Partner Brands' },
            { value: '95%', label: 'Placement Rate' },
            { value: '8LPA', label: 'Avg. Package' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto 30px', position: 'relative', zIndex: 2 }}>
          Our graduates are making waves at India&apos;s top media houses and creative agencies.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.button
            onClick={() => handleApplyClick('enrollment')}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            START YOUR JOURNEY
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transition: 'transform 0.3s ease' }}>
              <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </section>
      <section style={{ padding: '100px 20px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 16px', 
              borderRadius: '999px', 
              background: 'rgba(120, 50, 255, 0.15)', 
              border: '1px solid rgba(120, 50, 255, 0.3)', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: '#a78bfa', 
              marginBottom: '20px' 
            }}
          >
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a78bfa' }} />
            TESTIMONIALS
          </motion.span>
          <h2 style={{ 
            fontSize: 'clamp(2.2rem,5vw,3.5rem)', 
            fontWeight: 800, 
            margin: '0 0 16px', 
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Success Stories
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
            People who learned from us and are now crushing it in the industry.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px', maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          {displayStories.map((story, i) => {
            // Split quote into lines of max 5 words each
            const words = story.quote ? story.quote.split(' ') : [];
            const lines = [];
            for (let j = 0; j < words.length; j += 5) {
              lines.push(words.slice(j, j + 5).join(' '));
            }

            return (
              <motion.div
                key={i}
                className="story-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                style={{
                  borderRadius: '24px',
                  background: 'linear-gradient(160deg, rgba(30,20,60,0.95) 0%, rgba(15,10,35,0.98) 100%)',
                  border: '1px solid rgba(139,92,246,0.18)',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(139,92,246,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
              >
                {/* Hover border glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    padding: '1px',
                    background: 'linear-gradient(135deg, rgba(167,139,250,0.7) 0%, rgba(124,58,237,0.5) 50%, rgba(167,139,250,0.3) 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    zIndex: 3
                  }}
                />

                {/* ── TOP HALF: IMAGE ── */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden', borderRadius: '24px 24px 0 0', flexShrink: 0 }}>
                  {story.imageUrl ? (
                    <img
                      src={story.imageUrl}
                      alt={story.name}
                      className={`story-img-${i}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        display: 'block',
                        transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      fontWeight: 800,
                      color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '-0.02em',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                      {story.initials || story.name?.charAt(0) || '?'}
                    </div>
                  )}

                  {/* Gradient fade at bottom of image */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(15,10,35,0.97) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }} />

                  {/* Package badge — top-right corner */}
                  {story.earning && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.92) 0%, rgba(167,139,250,0.88) 100%)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(12px)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#fff',
                      letterSpacing: '0.04em',
                      boxShadow: '0 4px 16px rgba(124,58,237,0.55)',
                      zIndex: 3,
                      whiteSpace: 'nowrap'
                    }}>
                      {story.earning}
                    </div>
                  )}

                  {/* Social link overlay on hover */}
                  {story.socialLink && (
                    <a
                      href={story.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0)',
                        transition: 'background 0.35s ease',
                        zIndex: 2,
                        textDecoration: 'none'
                      }}
                      className="image-hover-overlay"
                    >
                      <span style={{
                        opacity: 0,
                        transform: 'translateY(8px)',
                        transition: 'all 0.35s ease',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(124,58,237,0.85)',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        letterSpacing: '0.05em'
                      }} className="profile-link-btn">
                        🔗 View Profile
                      </span>
                    </a>
                  )}
                </div>

                {/* ── BOTTOM HALF: INFO ── */}
                <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                  {/* Name */}
                  <h4 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#fff',
                    margin: '0 0 4px 0',
                    letterSpacing: '0.01em',
                    lineHeight: 1.2,
                    WebkitFontSmoothing: 'antialiased'
                  }}>
                    {story.name}
                  </h4>

                  {/* Organization */}
                  {story.company && (
                    <p style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#a78bfa',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      margin: '0 0 14px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '2px',
                        background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                        borderRadius: '1px',
                        flexShrink: 0
                      }} />
                      {story.company}
                    </p>
                  )}

                  {/* Divider */}
                  <div style={{
                    width: '100%',
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0.05) 100%)',
                    marginBottom: '14px'
                  }} />

                  {/* Quote — auto-scrollable StoryQuote */}
                  <StoryQuote lines={lines} />

                  {/* Role tag at bottom */}
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'rgba(167,139,250,0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(124,58,237,0.12)',
                      border: '1px solid rgba(124,58,237,0.2)'
                    }}>
                      {story.role}
                    </span>
                    {story.socialLink && (
                      <a
                        href={story.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#a78bfa',
                          textDecoration: 'none',
                          letterSpacing: '0.08em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
                      >
                        VIEW →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Your Story Card - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: displayStories.length * 0.1 }}
            whileHover={{ y: -8, borderColor: 'rgba(255,77,0,0.5)', boxShadow: '0 20px 40px rgba(255,77,0,0.15)' }}
            style={{
              padding: '32px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,77,0,0.1) 0%, rgba(255,107,53,0.05) 100%)',
              border: '2px solid rgba(255,77,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d00, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '16px' }}>
              🚀
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>YOUR STORY</h4>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>NEXT?</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>APPLY NOW</p>
            <motion.button
              onClick={() => handleApplyClick('enrollment')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(255,77,0,0.4)'
              }}
            >
              APPLY NOW →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── YBEX TALENT FUND ── */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,77,0,0.03) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(255,77,0,0.1)',
              border: '1px solid rgba(255,77,0,0.2)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#ff6b35',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            <span>🎓</span> DOESN&apos;T FIT YOUR BUDGET?
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,30,0.9))',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '32px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>💜</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>100% Scholarship</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, margin: '0 0 24px', letterSpacing: '-0.02em', color: '#fff' }}
          >
            YBEX TALENT FUND
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}
          >
            We believe talent shouldn&apos;t be limited by finances.<br />
            Our fully-funded scholarship program is designed for students with exceptional potential.
          </motion.p>

          <motion.button
            onClick={handleOpenScholarshipModal}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(255,77,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px 40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,77,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                pointerEvents: 'none'
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Apply for Scholarship</span>
          </motion.button>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '100px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 700, margin: '0 0 12px' }}>
            Frequently Asked <span style={{ color: '#a855f7' }}>Questions</span>
          </h2>
        </motion.div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ marginBottom: '16px', borderRadius: '16px', background: openFaq === i ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${openFaq === i ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden', transition: 'all 0.3s ease' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                {faq.q}
                <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: '1.2rem', color: '#a78bfa' }}>
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div style={{ padding: '0 24px 20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FRANCHISE ── */}
      <section id="apply" style={{ padding: '100px 20px', background: 'linear-gradient(180deg,rgba(124,58,237,0.05) 0%,transparent 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, margin: '0 0 16px' }}>
            Own a <span style={{ color: '#a855f7' }}>YBEX</span> Franchise
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Launch your own YBEX-powered media education hub with our proven business model and full support.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto 50px' }}>
          {franchiseStats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a855f7', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ textAlign: 'center' }}>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', borderRadius: '999px', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Apply for Franchise →
          </Link>
        </motion.div>
      </section>

      {/* ── ADMISSION DESK MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                width: '100%',
                maxWidth: '550px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,77,0,0.2)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={handleCloseModal}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                ×
              </motion.button>

              {/* Header */}
              <div style={{ padding: '40px 40px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🎓
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>ADMISSION DESK</h3>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#ff6b35', letterSpacing: '0.1em', margin: '4px 0 0' }}>YBEX SCHOOL • FOUNDERS CABIN</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: '16px 0 0' }}>
                  Enter the elite network. Complete your application.
                </p>
              </div>

              {/* Thank You Animation */}
              {showThankYou ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                  style={{ padding: '60px 40px', textAlign: 'center' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 40px rgba(255,77,0,0.4)'
                    }}
                  >
                    ✓
                  </motion.div>
                  <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}
                  >
                    Thank You!
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}
                  >
                    Your application has been submitted successfully.<br />
                    We&apos;ll get back to you soon!
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit} style={{ padding: '0 40px 40px' }}>
                    {/* Tab Toggle */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
                      <button
                        type="button"
                        onClick={() => setModalType('enrollment')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          background: modalType === 'enrollment' ? 'linear-gradient(135deg, #ff4d00, #ff6b35)' : 'transparent',
                          color: modalType === 'enrollment' ? '#fff' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Enrollment
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalType('scholarship')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          background: modalType === 'scholarship' ? 'linear-gradient(135deg, #ff4d00, #ff6b35)' : 'transparent',
                          color: modalType === 'scholarship' ? '#fff' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        General Inquiry
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          required
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          required
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 00000 00000"
                          required
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Selected Track
                        </label>
                        <select
                          name="track"
                          value={formData.track}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: formData.track ? '#fff' : 'rgba(255,255,255,0.4)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                          <option value="">Select Track</option>
                          <option value="Content Creation">Content Creation</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Both Tracks">Both Tracks</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        Your Goals / Mission
                      </label>
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        placeholder="Tell us what you want to achieve..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = 'rgba(255,77,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,0,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 8px 32px rgba(255,77,0,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                          >
                            ⟳
                          </motion.span>
                          Submitting...
                        </>
                      ) : (
                        <>Submit Application →</>
                      )}
                    </motion.button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Direct Contact</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* WhatsApp Button */}
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'; e.currentTarget.style.color = '#25d366'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                      Talk on WhatsApp
                    </a>

                    <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '16px', letterSpacing: '0.05em' }}>
                      Admission and franchise data is securely processed.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PREMIUM SCHOLARSHIP MODAL ── */}
      <AnimatePresence>
        {showScholarshipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={handleCloseScholarshipModal}
          >
            {/* Background Animated Gradient */}
            <motion.div
              animate={{
                background: [
                  'radial-gradient(ellipse at 20% 20%, rgba(255,77,0,0.15) 0%, transparent 50%)',
                  'radial-gradient(ellipse at 80% 80%, rgba(255,77,0,0.15) 0%, transparent 50%)',
                  'radial-gradient(ellipse at 20% 20%, rgba(255,77,0,0.15) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#ff6b35',
                  boxShadow: '0 0 10px #ff6b35',
                  pointerEvents: 'none',
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '650px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(145deg, #111 0%, #0a0a0a 100%)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,77,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseScholarshipModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </motion.button>

              {/* Success State */}
              {scholarshipSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  style={{
                    padding: '80px 40px',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      margin: '0 auto 32px',
                      boxShadow: '0 20px 60px rgba(34,197,94,0.4)',
                    }}
                  >
                    ✓
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: '#fff',
                      marginBottom: '16px',
                    }}
                  >
                    Application Submitted!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      fontSize: '1rem',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.6,
                    }}
                  >
                    Thank you for applying to the YBEX Talent Fund.<br />
                    We&apos;ll review your application and contact you soon.
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #ff4d00 0%, #ff6b35 100%)',
                    padding: '32px 40px',
                    borderRadius: '28px 28px 0 0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Decorative Elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '200px',
                        height: '200px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                      }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        bottom: '-30%',
                        left: '-10%',
                        width: '150px',
                        height: '150px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '50%',
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.75rem',
                        }}>
                          🎓
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: '#fff',
                            margin: 0,
                            fontStyle: 'italic',
                          }}>
                            TALENT HUB
                          </h3>
                          <p style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.8)',
                            margin: '4px 0 0',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                          }}>
                            YBEX SCHOLARSHIP PROGRAM
                          </p>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}>
                        <span style={{ fontSize: '1.25rem' }}>💡</span>
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.9)',
                          margin: 0,
                          fontWeight: 500,
                        }}>
                          THE <strong style={{ color: '#fff' }}>TOP 10%</strong> OF CREATORS GET ACCESS TO FULL FUNDING. SHOWCASE YOUR SPARK.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleScholarshipSubmit} style={{ padding: '32px 40px 40px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px',
                    }}>
                      {/* Full Name */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: '10px',
                        }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={scholarshipForm.fullName}
                          onChange={handleScholarshipInputChange}
                          placeholder="Enter your full name"
                          required
                          style={{
                            width: '100%',
                            padding: '16px 18px',
                            borderRadius: '14px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: '10px',
                        }}>
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={scholarshipForm.email}
                          onChange={handleScholarshipInputChange}
                          placeholder="your@email.com"
                          required
                          style={{
                            width: '100%',
                            padding: '16px 18px',
                            borderRadius: '14px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: '10px',
                        }}>
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={scholarshipForm.phone}
                          onChange={handleScholarshipInputChange}
                          placeholder="+91 00000 00000"
                          required
                          style={{
                            width: '100%',
                            padding: '16px 18px',
                            borderRadius: '14px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      {/* Preferred Track */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          marginBottom: '10px',
                        }}>
                          Preferred Track
                        </label>
                        <select
                          name="preferredTrack"
                          value={scholarshipForm.preferredTrack}
                          onChange={handleScholarshipInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: '16px 18px',
                            borderRadius: '14px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: scholarshipForm.preferredTrack ? '#fff' : 'rgba(255,255,255,0.4)',
                            fontSize: '0.95rem',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 16px center',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          }}
                        >
                          <option value="">Select Track</option>
                          <option value="Content Creation">🎬 Content Creation</option>
                          <option value="Digital Marketing">📊 Digital Marketing</option>
                          <option value="Both Tracks">🎯 Both Tracks</option>
                        </select>
                      </div>
                    </div>

                    {/* Portfolio URL */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '10px',
                      }}>
                        Portfolio / Profile URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={scholarshipForm.portfolioUrl}
                        onChange={handleScholarshipInputChange}
                        placeholder="Link to your portfolio, social media, or work samples"
                        style={{
                          width: '100%',
                          padding: '16px 18px',
                          borderRadius: '14px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '0.95rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                          e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Why You Deserve */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '10px',
                      }}>
                        Why Do You Deserve This Opportunity? *
                      </label>
                      <textarea
                        name="reason"
                        value={scholarshipForm.reason}
                        onChange={handleScholarshipInputChange}
                        placeholder="Tell us about your spark, your passion, and why you deserve this scholarship..."
                        rows={4}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 18px',
                          borderRadius: '14px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '0.95rem',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                          e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Background */}
                    <div style={{ marginBottom: '28px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '10px',
                      }}>
                        Your Background (Briefly) *
                      </label>
                      <textarea
                        name="background"
                        value={scholarshipForm.background}
                        onChange={handleScholarshipInputChange}
                        placeholder="Tell us about your current journey, education, and experience..."
                        rows={3}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 18px',
                          borderRadius: '14px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '0.95rem',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          lineHeight: 1.6,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                          e.target.style.boxShadow = '0 0 0 4px rgba(255,107,53,0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={scholarshipSubmitting}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        border: 'none',
                        cursor: scholarshipSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 8px 32px rgba(255,77,0,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        opacity: scholarshipSubmitting ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {scholarshipSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                          >
                            ⟳
                          </motion.span>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Apply for Scholarship
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </>
                      )}
                    </motion.button>

                    <p style={{
                      textAlign: 'center',
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.3)',
                      marginTop: '20px',
                      letterSpacing: '0.05em',
                    }}>
                      Scholarship applications are merit-based and reviewed by YBEX Academy Council.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}