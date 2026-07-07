import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  aboutJoinStrip,
  aboutStats,
  aboutTimeline,
} from '../content/siteData';

function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
      if (isIP && hostname !== '127.0.0.1') {
        return `http://${hostname}:5000${url}`;
      }
    }
    const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
    return `${API_BASE}${url}`;
  }
  return url;
}

/* ─── Hiring Application Modal ─────────────────────────────────────────────── */
function HiringModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '',
    resumeLink: '', portfolioLink: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.position.trim()) e.position = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await axiosInstance.post('/hiring', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: form.position.trim(),
        resumeLink: form.resumeLink.trim(),
        portfolioLink: form.portfolioLink.trim(),
        message: form.message.trim(),
      });
      setDone(true);
      setTimeout(onClose, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}{['name', 'email', 'phone', 'position'].includes(key) && <span style={{ color: '#a78bfa', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); }}
        style={{
          padding: '12px 14px',
          background: errors[key] ? 'rgba(255,61,16,0.06)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${errors[key] ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', color: '#fff', fontSize: '0.9rem',
          outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#a78bfa'}
        onBlur={e => e.target.style.borderColor = errors[key] ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}
      />
      {errors[key] && <span style={{ fontSize: '0.65rem', color: '#FF3D10' }}>{errors[key]}</span>}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            width: '100%', maxWidth: '560px',
            background: 'linear-gradient(160deg, #0d0d0d 0%, #111 100%)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(167,139,250,0.1)',
            position: 'relative',
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #a78bfa, #7c3aed, #a78bfa)' }} />

          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >✕</button>

          <div style={{ padding: '2rem 2rem 1.5rem' }}>
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >🎉</motion.div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#a78bfa', margin: '0 0 0.5rem' }}>Application Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>We'll review your application and get back to you soon.</p>
              </motion.div>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                    Apply to <span style={{ color: '#a78bfa' }}>Team YBEX</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    Let's build something crazy together.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {field('name', 'Full Name', 'text', 'Aman Verma')}
                    {field('email', 'Email Address', 'email', 'aman@example.com')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {field('phone', 'WhatsApp Number', 'tel', '+91 00000 00000')}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Role Interested In <span style={{ color: '#a78bfa' }}>*</span>
                      </label>
                      <select
                        value={form.position}
                        onChange={e => { setForm(p => ({ ...p, position: e.target.value })); setErrors(p => ({ ...p, position: '' })); }}
                        style={{
                          padding: '12px 14px',
                          background: errors.position ? 'rgba(255,61,16,0.06)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${errors.position ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '10px', color: form.position ? '#fff' : 'rgba(255,255,255,0.35)',
                          fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                          cursor: 'pointer', width: '100%',
                        }}
                      >
                        <option value="" style={{ background: '#111' }}>Select role...</option>
                        {['Creative Designer', 'Video Editor', 'Content Creator', 'Social Media Manager', 'Digital Marketer', 'Copywriter', 'Brand Strategist', 'Other'].map(r => (
                          <option key={r} value={r} style={{ background: '#111' }}>{r}</option>
                        ))}
                      </select>
                      {errors.position && <span style={{ fontSize: '0.65rem', color: '#FF3D10' }}>{errors.position}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {field('resumeLink', 'Resume Link (GDrive/Dropbox)', 'url', 'https://...')}
                    {field('portfolioLink', 'Portfolio Link', 'url', 'Behance/Instagram/Drive')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Why do you want to join YBEX?
                    </label>
                    <textarea
                      value={form.message}
                      placeholder="Tell us something about yourself..."
                      rows={4}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      style={{
                        padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                        color: '#fff', fontSize: '0.9rem', outline: 'none',
                        fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#a78bfa'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '1rem',
                      background: submitting ? 'rgba(167,139,250,0.4)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      border: 'none', borderRadius: '12px',
                      color: '#fff', fontSize: '0.95rem', fontWeight: 800,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {submitting ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⟳</motion.span> Sending...</>
                    ) : (
                      <><span>✈</span> Send Application</>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Default assets in case team members API is empty or down
const defaultFounders = [
  {
    _id: 'default-founder-radhakrishn',
    name: 'radhakrishn',
    role: 'CEO',
    coreTeam: 'Founder',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    socialLink: 'https://linkedin.com'
  },
  {
    _id: 'default-founder-sharadh',
    name: 'Sharadh',
    role: 'Founder & Director',
    coreTeam: 'Founder',
    imageUrl: 'https://wtoixhtepdmnchdrbycr.supabase.co/storage/v1/object/public/ybex-images/img_1772304689425.png',
    socialLink: 'https://linkedin.com'
  },
  {
    _id: 'default-founder-ravi',
    name: 'Ravi',
    role: 'Founder & Director',
    coreTeam: 'Founder',
    imageUrl: 'https://wtoixhtepdmnchdrbycr.supabase.co/storage/v1/object/public/ybex-images/img_1773244595138_rh0x98htjph.png',
    socialLink: 'https://linkedin.com'
  }
];

const defaultPowerhouse = [
  {
    _id: 'default-powerhouse-sarthak',
    name: 'sarthak',
    role: 'full stack dev',
    coreTeam: 'Powerhouse',
    imageUrl: 'https://wtoixhtepdmnchdrbycr.supabase.co/storage/v1/object/public/ybex-images/img_1776930737020_c0buf2i84vp.jpeg',
    socialLink: 'https://github.com'
  },
  {
    _id: 'default-powerhouse-himanshu',
    name: 'Himanshu',
    role: 'CTO',
    coreTeam: 'Powerhouse',
    imageUrl: 'https://wtoixhtepdmnchdrbycr.supabase.co/storage/v1/object/public/ybex-images/img_1776930484123_p82p9zlpfts.jpeg',
    socialLink: 'https://github.com'
  },
  {
    _id: 'default-powerhouse-vikas',
    name: 'Vikas Malik',
    role: 'CFO',
    coreTeam: 'Powerhouse',
    imageUrl: 'https://wtoixhtepdmnchdrbycr.supabase.co/storage/v1/object/public/ybex-images/img_1776930817477_d2yw6nrxxyv.jpeg',
    socialLink: 'https://linkedin.com'
  }
];

// Movie Reel / Creative Powerhouse section removed

// 3D Flip Card Carousel rewritten subcomponent using a Center-Stacked 3D Deck layout with Multi-Card Reveal
function CoverflowCarousel({ members }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState([0]);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize revealedIndices with activeIdx initially
  useEffect(() => {
    if (!isSectionHovered) {
      setRevealedIndices([activeIdx]);
    }
  }, [activeIdx, isSectionHovered]);

  useEffect(() => {
    if (isSectionHovered || !members || members.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % members.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isSectionHovered, members?.length]);

  if (!members || members.length === 0) return null;

  const memberStories = {
    'radhakrishn': "Pioneered YBEX's vision, aligning creator networks with digital strategies to scale brand presence from zero to millions of organic views.",
    'sharadh': "Spearheads production quality and campaign planning, ensuring every content piece is optimized for engagement and cultural relevance.",
    'ravi': "Drives business growth and brand partnerships, building the commercial foundation that powers our creators' creative freedom.",
    'sarthak': "Architects the web platforms and creator tools at YBEX, delivering seamless, high-performance web experiences.",
    'himanshu': "Maintains overall technology strategy, cloud architectures, and development operations to support high-traffic campaigns.",
    'vikas malik': "Manages financial strategies and invoice operations, optimizing resource allocation for scale and sustainability."
  };

  const getStory = (name) => {
    const key = name.toLowerCase().trim();
    return memberStories[key] || "Dedicated YBEX creative powerhouse, driving innovation and creator excellence behind the scenes.";
  };

  const getCardPositionStyle = (index) => {
    const offset = (index - activeIdx + members.length) % members.length;
    const isRevealed = revealedIndices.includes(index);
    const revIndex = revealedIndices.indexOf(index);

    if (isMobile) {
      if (!isSectionHovered) {
        // Stacked in the center
        const zIndex = members.length - offset;
        const scale = 1 - offset * 0.06;
        const translateY = offset * 10;
        const translateZ = -offset * 30;
        return {
          left: '50%',
          x: '-50%',
          y: `${translateY}px`,
          scale: scale,
          zIndex: zIndex,
          transform: `perspective(1000px) translateZ(${translateZ}px)`,
          opacity: 1,
          pointerEvents: offset === 0 ? 'auto' : 'none',
        };
      } else {
        // Vertically split: revealed cards stacked vertically, deck at bottom
        if (isRevealed) {
          return {
            left: '50%',
            x: '-50%',
            y: `${revIndex * 400}px`,
            scale: 1,
            zIndex: 10 + revIndex,
            transform: 'perspective(1000px) translateZ(0px)',
            opacity: 1,
            pointerEvents: 'auto',
          };
        } else {
          // Cards remaining in the deck
          const deckOffset = members.filter((_, idx) => !revealedIndices.includes(idx)).indexOf(index);
          const zIndex = members.length - deckOffset;
          const scale = 0.8 - deckOffset * 0.06;
          const translateY = (revealedIndices.length * 400) + deckOffset * 12;
          const translateZ = -deckOffset * 30;
          return {
            left: '50%',
            x: '-50%',
            y: `${translateY}px`,
            scale: scale,
            zIndex: zIndex,
            transform: `perspective(1000px) translateZ(${translateZ}px)`,
            opacity: 0.85,
            pointerEvents: 'auto',
          };
        }
      }
    } else {
      // Desktop positioning
      if (!isSectionHovered) {
        // Initially stacked in the center
        const zIndex = members.length - offset;
        const scale = 1 - offset * 0.05;
        const translateY = offset * 8;
        const translateZ = -offset * 30;
        const rotate = offset * 2;
        return {
          left: '50%',
          x: '-50%',
          y: `${translateY}px`,
          scale: scale,
          zIndex: zIndex,
          transform: `perspective(1000px) rotateY(0deg) rotateZ(${rotate}deg) translateZ(${translateZ}px)`,
          opacity: 1,
          pointerEvents: offset === 0 ? 'auto' : 'none',
        };
      } else {
        // Split layout: revealed cards slide to left side (spacing side-by-side)
        if (isRevealed) {
          return {
            left: `${5 + revIndex * 31}%`,
            x: '0%',
            y: '0px',
            scale: 0.95,
            zIndex: 10 + revIndex,
            transform: 'perspective(1000px) rotateY(0deg) translateZ(0px)',
            opacity: 1,
            pointerEvents: 'auto',
          };
        } else {
          // Stacked center deck (sitting on the right side)
          const deckOffset = members.filter((_, idx) => !revealedIndices.includes(idx)).indexOf(index);
          const zIndex = members.length - deckOffset;
          const scale = 0.82 - deckOffset * 0.05;
          const translateY = deckOffset * 12;
          const translateZ = -deckOffset * 35;
          const rotate = (deckOffset + 1) * 3;
          return {
            left: '94%',
            x: '-100%',
            y: `${translateY}px`,
            scale: scale,
            zIndex: zIndex,
            transform: `perspective(1000px) rotateY(-8deg) rotateZ(${rotate}deg) translateZ(${translateZ}px)`,
            opacity: 0.8,
            pointerEvents: 'auto',
          };
        }
      }
    }
  };

  const handleContainerLeave = () => {
    setIsSectionHovered(false);
    setRevealedIndices([activeIdx]);
  };

  return (
    <div
      className="split-carousel-container"
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={handleContainerLeave}
      style={{
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 20px 80px',
        position: 'relative',
        height: isMobile
          ? (isSectionHovered ? `${revealedIndices.length * 400 + 380}px` : '520px')
          : '560px',
        transition: 'height 0.5s ease',
      }}
    >
      <style>{`
        .flip-card {
          position: absolute;
          perspective: 1000px;
          width: 320px;
          height: 440px;
          transition: left 0.7s cubic-bezier(0.25, 1, 0.5, 1), 
                      transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), 
                      opacity 0.7s ease,
                      scale 0.7s cubic-bezier(0.25, 1, 0.5, 1),
                      y 0.7s cubic-bezier(0.25, 1, 0.5, 1);
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.2, 0.85, 0.32, 1.2);
          transform-style: preserve-3d;
        }
        
        .flip-card.can-flip:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        }
        
        .flip-card-front {
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .flip-card-front img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .flip-card-front-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.9) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 24px;
          text-align: left;
        }
        
        .flip-card-back {
          background: rgba(10, 10, 10, 0.95);
          border: 1px solid rgba(125, 76, 246, 0.35);
          transform: rotateY(180deg);
          padding: 35px 25px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          text-align: center;
        }
        
        .flip-card-back-spotlight {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(125, 76, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .story-text-anim {
          animation: fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 960px) {
          .flip-card {
            width: 280px;
            height: 360px;
          }
        }
      `}</style>

      {/* Floating Instructions */}
      <div style={{
        position: 'absolute',
        top: '-45px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.8rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: isSectionHovered ? '#7d4cf6' : 'rgba(255,255,255,0.4)',
        fontWeight: 800,
        transition: 'all 0.3s ease',
        textAlign: 'center',
        width: '100%',
        pointerEvents: 'none',
        zIndex: 15,
      }}>

      </div>

      {/* Cards list */}
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
        {members.map((member, i) => {
          const isRevealed = revealedIndices.includes(i);
          const posStyle = getCardPositionStyle(i);
          const canFlip = isRevealed && isSectionHovered;

          return (
            <div
              key={member._id || i}
              className={`flip-card ${canFlip ? 'can-flip' : ''}`}
              onMouseEnter={() => {
                if (isSectionHovered && !isRevealed) {
                  setRevealedIndices(prev => [...prev, i]);
                  setActiveIdx(i);
                }
              }}
              style={{
                position: 'absolute',
                left: posStyle.left,
                top: '0px',
                zIndex: posStyle.zIndex,
                scale: posStyle.scale,
                opacity: posStyle.opacity,
                pointerEvents: posStyle.pointerEvents,
                transform: `${posStyle.x ? `translateX(${posStyle.x})` : ''} ${posStyle.y ? `translateY(${posStyle.y})` : ''} ${posStyle.transform || ''}`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front">
                  <img
                    src={resolveImg(member.imageUrl)}
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                  <div className="flip-card-front-overlay">
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7d4cf6', fontWeight: 800, marginBottom: '6px' }}>
                      {member.role || member.coreTeam}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Back Side (Contribution story - active card only) */}
                <div className="flip-card-back">
                  <div className="flip-card-back-spotlight" />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7d4cf6', fontWeight: 800, display: 'block', marginBottom: '15px' }}>
                      CONTRIBUTION STORY
                    </span>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', margin: '0 0 15px', textTransform: 'uppercase' }}>
                      {member.name}
                    </h4>
                    <p
                      key={i}
                      className="story-text-anim"
                      style={{ fontSize: '0.85rem', color: '#b5b0a3', lineHeight: '1.6', margin: 0, fontWeight: 500 }}
                    >
                      {getStory(member.name)}
                    </p>
                    {member.socialLink && (
                      <a
                        href={member.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '20px',
                          fontSize: '0.75rem',
                          color: '#7d4cf6',
                          fontWeight: 700,
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(125,76,246,0.3)',
                          paddingBottom: '2px',
                        }}
                      >
                        LINKEDIN PROFILE ↗
                      </a>
                    )}
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

function TrustBanner({ brands }) {
  if (!brands || brands.length === 0) return null;

  // Duplicate brands for seamless scrolling
  const displayBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <div className="trust-marquee-container">
      {/* Left static label */}
      <div className="trust-static-label">
        THEY TRUST US
      </div>
      
      {/* Right scrolling brands with fade effects */}
      <div className="trust-marquee-track-container">
        <div className="trust-marquee-track">
          {displayBrands.map((brand, idx) => (
            <MarqueeBrandItem key={idx} brand={brand} itemClass="trust-marquee-item" />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarqueeBrandItem({ brand, itemClass }) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveImg(brand.logoUrl);

  return (
    <span className={itemClass}>
      {brand.logoUrl && !failed ? (
        <img
          src={resolvedSrc}
          alt={brand.name}
          onError={() => {
            console.error("AboutStorySection: Logo failed to load:", brand.name, resolvedSrc ? resolvedSrc.slice(0, 100) + '...' : 'null');
            setFailed(true);
          }}
        />
      ) : (
        <span className="fallback-logo-text">{brand.name}</span>
      )}
    </span>
  );
}

export default function AboutStorySection() {
  const [viewCount, setViewCount] = useState(47804210);
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderIndexRef = useRef(0);
  const transitionTimeoutRef = useRef(null);

  useEffect(() => {
    sliderIndexRef.current = sliderIndex;
  }, [sliderIndex]);

  const changeSlide = (newIndex) => {
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    setIsTransitioning(true);
    setSliderIndex(newIndex);
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const heroSectionRef = useRef(null);
  const [hoveredHero, setHoveredHero] = useState(false);
  const lastScrollTime = useRef(0);

  // 1. Auto-scroll hero slider every 5 seconds (paused on hover)
  useEffect(() => {
    if (hoveredHero) return;
    const interval = setInterval(() => {
      changeSlide((sliderIndexRef.current + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [hoveredHero]);

  // 2. Scroll-jacking logic disabled to prevent automatic scroll-jacking resets
  useEffect(() => {
    // Scroll-jacking wheel and touch listeners removed to prevent resetting layout/page top scroll
  }, []);

  // 2b. Strict scroll guard disabled to prevent resetting scroll position
  useEffect(() => {
    // Scroll lock disabled to prevent automatic jump reset
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance.get('/team-members')
      .then((res) => setTeamMembers(res.data.members || []))
      .catch(console.error)
      .finally(() => setTeamLoading(false));
  }, []);

  useEffect(() => {
    console.log("AboutStorySection: Fetching brands...");
    axiosInstance.get('/brands')
      .then((res) => {
        console.log("AboutStorySection: Fetch brands success response:", res.data);
        const fetchedBrands = res.data.data || res.data.brands || [];
        console.log("AboutStorySection: Setting brands array of length:", fetchedBrands.length);
        setBrands(fetchedBrands);
      })
      .catch((err) => {
        console.error("AboutStorySection: Failed to fetch brands", err);
        setBrands([]);
      })
      .finally(() => setBrandsLoading(false));
  }, []);

  const formatNumber = (num) => num.toLocaleString();

  // Split by category and merge default/database lists
  const founders = teamMembers.filter((m) => m.coreTeam === 'Founder');
  const powerhouse = teamMembers.filter((m) => m.coreTeam !== 'Founder');

  const displayFounders = founders;
  const displayPowerhouse = powerhouse;

  // 3D tilt handlers for Growth cards
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // safe subtle rotation
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    card.style.transition = 'none';
  };

  const nextSlider = () => {
    changeSlide((sliderIndexRef.current + 1) % 3);
  };

  const prevSlider = () => {
    changeSlide((sliderIndexRef.current - 1 + 3) % 3);
  };

  // Build card offset parameters dynamically
  const getCardStyles = (index) => {
    const diff = (index - sliderIndex + 3) % 3;
    if (diff === 0) {
      return {
        x: '0%',
        scale: 1,
        zIndex: 3,
        rotateY: 0,
        filter: 'blur(0px)',
        opacity: 1,
        pointerEvents: 'auto',
      };
    } else if (diff === 1) {
      return {
        x: '15%',
        scale: 0.76,
        zIndex: 2,
        rotateY: -8,
        filter: 'blur(2px)',
        opacity: 0.75,
        pointerEvents: 'none',
      };
    } else if (diff === 2) {
      return {
        x: '30%',
        scale: 0.58,
        zIndex: 1,
        rotateY: -16,
        filter: 'blur(4px)',
        opacity: 0.5,
        pointerEvents: 'none',
      };
    }
    return {
      x: '100%',
      scale: 0.4,
      zIndex: 0,
      rotateY: -30,
      filter: 'blur(12px)',
      opacity: 0,
      pointerEvents: 'none',
    };
  };

  // Re-generate list for marquee scrolling using fetched brands and high-quality fallbacks
  const fallbackBrands = [
    { name: 'Bingo', logoUrl: '' },
    { name: 'Stage', logoUrl: '' },
    { name: 'Colors Rishtey', logoUrl: '' },
    { name: 'Ryze', logoUrl: '' },
    { name: 'Mi', logoUrl: '' },
    { name: 'Colgate', logoUrl: '' },
    { name: 'Oppo', logoUrl: '' },
    { name: 'Amazon MX', logoUrl: '' },
    { name: 'Wild Stone', logoUrl: '' },
    { name: 'TVS', logoUrl: '' },
    { name: 'Traya', logoUrl: '' }
  ];

  const displayBrandsList = brands && brands.length > 0 ? brands : fallbackBrands;

  const marqueeBrands = [];
  for (let i = 0; i < 6; i++) {
    marqueeBrands.push(...displayBrandsList);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');

        .about-page-premium {
          background-color: #000000 !important;
          color: #ffffff;
          font-family: 'Montserrat', sans-serif !important;
          overflow-x: hidden;
          min-height: 100vh;
          position: relative;
        }

        .about-page-premium * {
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif !important;
        }

        /* Ambient Glowing 3D Backdrop Orbs */
        .bg-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          z-index: 1;
          opacity: 0.45;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.1) 0%, transparent 70%);
          top: 5%;
          left: -150px;
          animation: orb-drift 18s infinite ease-in-out alternate;
        }

        .orb-2 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.07) 0%, transparent 70%);
          top: 35%;
          right: -200px;
          animation: orb-drift-reverse 24s infinite ease-in-out alternate;
        }

        .orb-3 {
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.09) 0%, transparent 70%);
          bottom: 25%;
          left: 5%;
          animation: orb-drift 20s infinite ease-in-out alternate;
        }

        .orb-4 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.06) 0%, transparent 70%);
          bottom: 2%;
          right: 10%;
          animation: orb-drift-reverse 22s infinite ease-in-out alternate;
        }

        @keyframes orb-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(80px, 50px) scale(1.15); }
          100% { transform: translate(-50px, -60px) scale(0.9); }
        }

        @keyframes orb-drift-reverse {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, -50px) scale(0.9); }
          100% { transform: translate(50px, 60px) scale(1.15); }
        }

        /* Hero styles */
        .about-hero-slider-section {
          padding: 100px 0 120px;
          background-color: #000000;
          overflow: visible;
          position: relative;
          z-index: 2;
        }

        .about-hero-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 20px;
        }

        .about-hero-eyebrow {
          font-size: 0.85rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #E4F141;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .about-hero-title {
          font-size: 4.8rem;
          font-weight: 900 !important;
          line-height: 1.05;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0 auto 24px;
          max-width: 950px;
        }

        .about-hero-sub {
          font-size: 1.15rem;
          color: #b5b0a3;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 500 !important;
        }

        .slider-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 70px;
          align-items: center;
          min-height: 520px;
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .slider-left {
          position: relative;
          height: 500px;
          width: 100%;
        }

        .slider-deck {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .slider-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 76%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.06);
          transform-origin: center right;
          transition: filter 0.5s ease, opacity 0.5s ease;
        }

        .slider-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slider-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .card-arrow-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 1.5rem;
          margin-bottom: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card-phase {
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E4F141;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .card-title {
          font-size: 2.8rem;
          font-weight: 900 !important;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .slider-controls {
          position: absolute;
          left: -40px;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          z-index: 100;
          pointer-events: none;
        }

        .slider-arrow-btn {
          pointer-events: auto;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          color: #ffffff;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .slider-arrow-btn:hover {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          transform: scale(1.05);
        }

        .slider-footer-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 80px;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 40px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        .slider-footer-left {
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .sparkle-icon {
          width: 38px;
          height: 38px;
          fill: #E4F141;
          animation: sparkle-pulse 4s infinite ease-in-out;
        }

        @keyframes sparkle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
        }

        .slider-footer-desc {
          font-size: 0.95rem;
          color: #b5b0a3;
          line-height: 1.65;
          font-weight: 500 !important;
        }

        .slider-footer-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 650px;
          justify-content: flex-end;
        }

        .pill-btn {
          padding: 14px 28px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pill-btn:hover {
          border-color: #ffffff;
          transform: translateY(-2px);
        }

        .pill-btn.active {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        /* Growth Section styles */
        .about-growth-section {
          padding: 120px 0;
          background-color: #000000;
          border-top: 1px solid rgba(255,255,255,0.05);
          position: relative;
          z-index: 2;
        }

        .growth-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .growth-header {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          align-items: flex-end;
          margin-bottom: 60px;
        }

        .growth-title-group {
          display: flex;
          flex-direction: column;
        }

        .growth-title-outline {
          font-size: 5rem;
          font-weight: 900 !important;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.6);
          letter-spacing: -0.02em;
          line-height: 0.95;
        }

        .growth-title-solid {
          font-size: 5rem;
          font-weight: 900 !important;
          text-transform: uppercase;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 0.95;
        }

        .growth-header-desc {
          font-size: 1.05rem;
          color: #b5b0a3;
          line-height: 1.65;
          font-weight: 500 !important;
        }

        .growth-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 32px;
        }

        .tilt-card {
          border-radius: 28px;
          overflow: hidden;
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
          transform-style: preserve-3d;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tilt-card:hover {
          box-shadow: 0 30px 60px rgba(125, 76, 246, 0.18), 0 0 30px rgba(125, 76, 246, 0.06);
          border-color: rgba(125, 76, 246, 0.3) !important;
        }

        .left-growth-card {
          height: 520px;
          background: linear-gradient(135deg, #181512 0%, #0f0d0b 100%);
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px;
        }

        .left-growth-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
          mix-blend-mode: luminosity;
          transition: opacity 0.4s ease;
        }

        .left-growth-card:hover .left-growth-card-img {
          opacity: 0.65;
        }

        .left-growth-card-content {
          position: relative;
          z-index: 2;
          transform: translateZ(30px);
        }

        .growth-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .left-growth-card-title {
          font-size: 2.3rem;
          font-weight: 900 !important;
          color: #ffffff;
          margin: 0;
          text-transform: uppercase;
          line-height: 1.1;
        }

        .right-growth-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .right-growth-top-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .stat-card {
          height: 240px;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          padding: 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .stat-card-badge {
          font-size: 0.72rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .stat-card-number {
          font-size: 3.8rem;
          font-weight: 900 !important;
          line-height: 1;
          color: #ffffff;
          margin: 12px 0;
          letter-spacing: -0.02em;
        }

        .stat-card-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
          line-height: 1.4;
          margin: 0;
        }

        .marquee-card {
          height: 248px;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .marquee-card-header {
          font-size: 0.72rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 20px;
          position: relative;
          z-index: 5;
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          white-space: nowrap;
          padding: 10px 0;
          z-index: 2;
        }

        .marquee-track {
          display: inline-flex;
          gap: 50px;
          animation: marquee-scroll 35s linear infinite;
        }

        .marquee-item {
          font-size: 1.6rem;
          font-weight: 900 !important;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .marquee-item img {
          height: 35px;
          width: auto;
          max-width: 120px;
          object-fit: contain;
          opacity: 0.95;
          border-radius: 4px;
        }

        .marquee-track {
          display: inline-flex;
          gap: 50px;
          animation: marquee-scroll 80s linear infinite; /* slowed down marquee */
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* THEY TRUST US — static left label and marquee right */
        .trust-marquee-container {
          position: relative;
          height: 80px;
          background: #000000;
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          overflow: hidden;
          z-index: 10;
          width: 100%;
        }

        .trust-static-label {
          background: #000000;
          color: #E4F141; /* Accent Yellow */
          font-weight: 900;
          font-size: 0.95rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          padding: 0 35px;
          height: 100%;
          white-space: nowrap;
          border-right: 1px solid rgba(255,255,255,0.08);
          z-index: 30;
          position: relative;
        }

        .trust-marquee-track-container {
          flex-grow: 1;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 10;
          background: #000;
        }

        /* Fade effects on the left and right corners of the marquee track */
        .trust-marquee-track-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(to right, #000000 20%, transparent 100%);
          z-index: 20;
          pointer-events: none;
        }

        .trust-marquee-track-container::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 70px;
          background: linear-gradient(to left, #000000 0%, transparent 100%);
          z-index: 20;
          pointer-events: none;
        }

        .trust-marquee-track {
          display: inline-flex;
          align-items: center;
          gap: 60px;
          white-space: nowrap;
          animation: trust-marquee-scroll 25s linear infinite;
        }

        .trust-marquee-item {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .trust-marquee-item img {
          height: 40px;
          width: auto;
          max-width: 130px;
          object-fit: contain;
          opacity: 0.92;
          border-radius: 4px;
          filter: brightness(0.9) contrast(1.05);
        }

        .fallback-logo-text {
          font-size: 1rem;
          font-weight: 800;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 5px 12px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @keyframes trust-marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Team coverflow styles */
        .about-team-section {
          padding: 120px 0;
          background-color: #000000;
          border-top: 1px solid rgba(255,255,255,0.05);
          position: relative;
          z-index: 2;
        }

        .team-heading-container {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 20px;
        }

        .team-section-title {
          font-size: 4rem;
          font-weight: 900 !important;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0 0 12px 0;
        }

        .team-section-subtitle {
          font-size: 1.1rem;
          color: #E4F141;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 800;
          margin: 0;
        }

        .coverflow-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 0;
          overflow: visible;
        }

        .coverflow-track {
          position: relative;
          height: 440px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          transform-style: preserve-3d;
          margin-bottom: 24px;
        }

        .coverflow-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%);
          padding: 30px 24px 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          border-top: 1px solid rgba(255,255,255,0.05);
          height: 140px;
        }

        .coverflow-name {
          font-size: 1.6rem;
          font-weight: 900 !important;
          color: #ffffff;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .coverflow-role {
          font-size: 0.85rem;
          color: #E4F141;
          margin: 0;
          font-style: italic;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .coverflow-social {
          position: absolute;
          right: 24px;
          bottom: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.2s ease;
        }

        .coverflow-social:hover {
          background: #ffffff;
          color: #000000;
          transform: scale(1.1);
        }

        .coverflow-nav {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 10px;
        }

        .coverflow-nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: #ffffff;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .coverflow-nav-btn:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #000000;
          transform: scale(1.05);
        }

        /* Responsiveness */
        @media (max-width: 960px) {
          .about-hero-title {
            font-size: 3.2rem;
          }
          .slider-container {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 40px;
          }
          .slider-left {
            height: 420px;
          }
          .slider-card {
            width: 90%;
          }
          .slider-controls {
            left: 10px;
            right: 10px;
            top: 40%;
          }
          .slider-footer-bar {
            flex-direction: column;
            gap: 30px;
            align-items: center;
            text-align: center;
          }
          .slider-footer-pills {
            justify-content: center;
          }
          .growth-header {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .growth-title-solid, .growth-title-outline {
            font-size: 3.5rem;
          }
          .growth-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .left-growth-card {
            height: 400px;
          }
          .right-growth-top-row {
            grid-template-columns: 1fr;
          }
          .coverflow-track {
            height: 380px;
          }
          .coverflow-card {
            width: 260px !important;
            height: 360px !important;
          }
          .coverflow-name {
            font-size: 1.3rem;
          }
        }
        @media (max-width: 560px) {
          .about-hero-title {
            font-size: clamp(2rem, 10vw, 2.8rem) !important;
          }
          .growth-title-solid, .growth-title-outline {
            font-size: clamp(1.8rem, 10vw, 2.5rem) !important;
          }
          .left-growth-card-title {
            font-size: clamp(1.5rem, 8vw, 1.9rem) !important;
          }
          .stat-card-number {
            font-size: clamp(2.2rem, 12vw, 3rem) !important;
          }
          .coverflow-track {
            height: 320px !important;
          }
          .coverflow-card {
            width: min(250px, 85vw) !important;
            height: 300px !important;
          }
          .team-section-title {
            font-size: clamp(2rem, 12vw, 3rem) !important;
          }
          .left-growth-card {
            padding: 24px !important;
            height: 320px !important;
          }
          .stat-card {
            padding: 24px !important;
            height: 180px !important;
          }
        }
      `}</style>

      <div className="about-page-premium">
        {/* Ambient Glowing Backdrop Orbs */}
        <div className="bg-glow-orb orb-1" />
        <div className="bg-glow-orb orb-2" />
        <div className="bg-glow-orb orb-3" />
        <div className="bg-glow-orb orb-4" />

        <section className="about-hero-slider-section" ref={heroSectionRef}>
          <div className="about-hero-header">

            <h1 className="about-hero-title">THE YBEX STORY</h1>
            <p className="about-hero-sub">
              A full-scale creative agency scaling brands from zero to millions of views.
              <br />

            </p>
          </div>

          <div
            className="slider-container"
            onMouseEnter={() => setHoveredHero(true)}
            onMouseLeave={() => setHoveredHero(false)}
          >
            <div className="slider-left">
              <motion.div
                className="slider-deck"
                animate={{ scale: isTransitioning ? 0.82 : 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                style={{ transformStyle: 'preserve-3d', height: '100%', width: '100%', position: 'relative' }}
              >
                {aboutTimeline.slice(0, 3).map((item, i) => {
                  const cardStyles = getCardStyles(i);
                  const displayImage = i === 1 ? item.images[1] : item.images[0];
                  return (
                    <motion.div
                      key={item.title}
                      className="slider-card"
                      animate={cardStyles}
                      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <img src={resolveImg(displayImage)} alt={item.title} className="slider-card-img" />
                      <div className="slider-card-overlay">
                        <span className="card-phase">{item.phase}</span>
                        <h3 className="card-title">{item.title}</h3>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right details of active slide */}
            <div className="slider-right" style={{ paddingLeft: '40px', zIndex: 5 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={sliderIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <span style={{ fontSize: '0.85rem', color: '#E4F141', fontWeight: '900', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {aboutTimeline[sliderIndex].phase}
                  </span>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff' }}>
                    {aboutTimeline[sliderIndex].title}
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: '#b5b0a3', lineHeight: '1.7', margin: 0, fontWeight: '500' }}>
                    {aboutTimeline[sliderIndex].description}
                  </p>
                  <div style={{ marginTop: '10px' }}>
                    <button
                      className="pill-btn active"
                      style={{ padding: '12px 24px', fontSize: '0.85rem' }}
                      onClick={() => setShowHiringModal(true)}
                    >
                      APPLY TO TEAM YBEX
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Arrows Overlapping Entire Container at edges */}
            <div className="slider-controls">
              <button className="slider-arrow-btn" onClick={prevSlider}>
                ←
              </button>
              <button className="slider-arrow-btn" onClick={nextSlider}>
                →
              </button>
            </div>
          </div>

          {sliderIndex === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.4 },
                y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
              }}
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight * 0.85,
                  behavior: 'smooth'
                });
              }}
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                zIndex: 100,
              }}
            >
              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                fontWeight: 800,
                color: '#E4F141',
                textTransform: 'uppercase'
              }}>
                EXPLORE ECOSYSTEM
              </span>
              <span style={{ fontSize: '1.2rem', color: '#fff' }}>↓</span>
            </motion.div>
          )}
        </section>

        {/* They Trust Us — fade cycle: label → logos → label → ... */}
        <TrustBanner brands={marqueeBrands} />

        {/* SECTION 2: THE GROWTH */}
        <section className="about-growth-section">
          <div className="growth-container">
            <div className="growth-header">
              <div className="growth-title-group">
                <span className="growth-title-outline">THE GROWTH</span>
                <span className="growth-title-solid">SCALING BRANDS FROM ZERO</span>
              </div>
              <div className="growth-header-desc">
                We transitioned into a full-scale creative agency, helping dozens of brands grow their presence from scratch to millions of views. Our focus shifted to strategic growth, community building, and long-form storytelling that sticks.
              </div>
            </div>

            <div className="growth-grid">
              {/* Left visual card with mouse-tilt */}
              <div
                className="tilt-card left-growth-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
              >
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"
                  alt="Growth shoot setup"
                  className="left-growth-card-img"
                />
                <div className="left-growth-card-content">
                  <div className="growth-badge">Case Studies</div>
                  <h3 className="left-growth-card-title">Strategic Content Creation</h3>
                </div>
              </div>

              {/* Right Stack */}
              <div className="right-growth-stack">
                <div className="right-growth-top-row">
                  {/* Views Stat Card */}
                  <div
                    className="tilt-card stat-card"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                  >
                    <span className="stat-card-badge">Organic Reach</span>
                    <div className="stat-card-number" style={{ fontSize: '2.4rem', whiteSpace: 'nowrap' }}>
                      {formatNumber(viewCount)}
                    </div>
                    <p className="stat-card-desc">Organic views generated for our brand partners globally.</p>
                  </div>

                  {/* Campaigns Stat Card */}
                  <div
                    className="tilt-card stat-card"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                  >
                    <span className="stat-card-badge">Live Campaigns</span>
                    <div className="stat-card-number" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      38+
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          display: 'inline-block',
                          boxShadow: '0 0 10px #22c55e',
                          animation: 'pulse 1.8s infinite',
                        }}
                      />
                    </div>
                    <p className="stat-card-desc">Active influencer campaigns running live right now.</p>
                  </div>
                </div>

                {/* Wide Logo Marquee Card */}
                <div
                  className="tilt-card marquee-card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseEnter={handleMouseEnter}
                >
                  <span className="marquee-card-header">Our Brand Partners</span>
                  <div className="marquee-container">
                    <div className="marquee-track">
                      {marqueeBrands.map((brand, index) => (
                        <MarqueeBrandItem key={index} brand={brand} itemClass="marquee-item" />
                      ))}
                    </div>
                  </div>
                  <div style={{ height: '10px' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE VISIONARIES (FOUNDERS) */}
        {displayFounders.length > 0 && (
          <section className="about-team-section" id="team-founders-section">
            <div className="team-heading-container">
              <h2 className="team-section-title">The Visionaries</h2>
              <p className="team-section-subtitle">The Founders of YBEX</p>
            </div>

            <CoverflowCarousel members={displayFounders} />
          </section>
        )}

        {/* SECTION 4: OUR POWERHOUSE */}
        {displayPowerhouse.length > 0 && (
          <section className="about-team-section" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className="team-heading-container">
              <h2 className="team-section-title">Our Powerhouse</h2>
              <p className="team-section-subtitle">Meet the creatives behind the scenes</p>
            </div>

            <CoverflowCarousel members={displayPowerhouse} />
          </section>
        )}
      </div>
    </>
  );
}


