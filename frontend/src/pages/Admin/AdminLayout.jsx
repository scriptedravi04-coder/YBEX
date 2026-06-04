import { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { TOKENS, ANIMATIONS } from './AdminDesignSystem';

// Use design system tokens
const C = TOKENS;

const NAV_TABS = [
  { label: 'Enquiries',        path: '/admin/enquiries',        icon: '📬', hoverColor: '#3b82f6' },
  { label: 'Manage Admins',    path: '/admin/users',            icon: '👥', hoverColor: '#22c55e' },
  { label: 'About Page Team',  path: '/admin/about-team',       icon: '🧑‍💼', hoverColor: '#a855f7' },
  { label: 'Hiring',           path: '/admin/hiring',           icon: '💼', hoverColor: '#f97316' },
  { label: 'Influencers',      path: '/admin/influencers',      icon: '🌟', hoverColor: '#ec4899' },
  { label: 'Brands',           path: '/admin/brands',           icon: '🏷️', hoverColor: '#14b8a6' },
  { label: 'School Mentors',   path: '/admin/school-mentors',   icon: '🎓', hoverColor: '#8b5cf6' },
  { label: 'Success Stories',  path: '/admin/success-stories',  icon: '🏆', hoverColor: '#f59e0b' },
  { label: 'Scholarship',      path: '/admin/scholarship',      icon: '🎖️', hoverColor: '#06b6d4' },
  { label: 'Activity Logs',    path: '/admin/activity-logs',    icon: '📊', hoverColor: '#6366f1' },
  { label: 'Invoices',         path: '/admin/invoices',         icon: '🧾', hoverColor: '#3b82f6' },
  { label: 'Portfolio',        path: '/admin/portfolio',        icon: '🗂️', hoverColor: '#3b82f6' },
  { label: 'Bin',              path: '/admin/bin',              icon: '🗑️', hoverColor: '#ef4444' },
];

/* ── smooth page wrapper — fades content only, no layout shift ── */
function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Full Screen Admin Intro Animation ── */
function AdminIntroAnimation({ onComplete }) {
  // Generate random particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Gradient Orbs */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(228,241,65,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,61,16,0.15) 0%, transparent 40%)',
            'radial-gradient(circle at 70% 20%, rgba(228,241,65,0.2) 0%, transparent 40%), radial-gradient(circle at 30% 80%, rgba(255,61,16,0.15) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(228,241,65,0.25) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(255,61,16,0.1) 0%, transparent 40%)',
            'radial-gradient(circle at 20% 30%, rgba(228,241,65,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,61,16,0.15) 0%, transparent 40%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Animated Rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 2], opacity: [0, 0.3, 0] }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            border: '1px solid rgba(228,241,65,0.3)',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: '100vh' }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: ['100vh', '-10vh'],
            x: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 2 === 0 ? '#E4F141' : '#FF3D10',
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size * 2}px ${p.id % 2 === 0 ? '#E4F141' : '#FF3D10'}`,
          }}
        />
      ))}

      {/* Rotating Geometric Shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          border: '1px dashed rgba(228,241,65,0.1)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          border: '1px dashed rgba(255,61,16,0.1)',
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
        }}
      />

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(228,241,65,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(228,241,65,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.5,
      }} />

      {/* Scanline Effect */}
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(228,241,65,0.5), transparent)',
          boxShadow: '0 0 20px rgba(228,241,65,0.5)',
        }}
      />
      
      {/* Central Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, #FF3D10 0%, #E4F141 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(228,241,65,0.4), 0 0 120px rgba(255,61,16,0.2)',
          }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: '#000',
              fontFamily: C.font.display,
            }}
          >
            A
          </motion.span>
        </motion.div>
        
        {/* Title Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#fff',
            fontFamily: C.font.display,
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            ADMIN DASHBOARD
          </div>
        </motion.div>
        
        {/* Subtitle Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div style={{
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            Now Open
          </div>
        </motion.div>
        
        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: '3rem',
            width: '200px',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '3rem auto 0',
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FF3D10, #E4F141)',
              borderRadius: '2px',
            }}
          />
        </motion.div>
      </div>
      
      {/* Corner Decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em',
        }}
      >
        YBEX COMMAND CENTER
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em',
        }}
      >
        SECURE ACCESS
      </motion.div>
    </motion.div>
  );
}

export default function AdminLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  /* ── Show intro only on initial load/refresh ── */
  useEffect(() => {
    // Check if animation already played in this session
    const hasPlayed = sessionStorage.getItem('adminIntroPlayed');
    if (!hasPlayed) {
      setShowIntro(true);
      sessionStorage.setItem('adminIntroPlayed', 'true');
    }
  }, []);

  /* auto-scroll active tab into view */
  useEffect(() => {
    const active = navRef.current?.querySelector('[data-active="true"]');
    if (active) active.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  });

  /* ── Browser Tab Animation ── */
  useEffect(() => {
    const originalTitle = document.title;
    const originalFavicon = document.querySelector('link[rel*="icon"]')?.getAttribute('href') || '/favicon.ico';
    
    // Create animated admin favicon (SVG data URI with pulsing effect)
    const adminFavicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF3D10"/>
          <stop offset="100%" style="stop-color:#E4F141"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#g)"/>
      <text x="50" y="65" font-size="45" font-weight="900" text-anchor="middle" fill="#000">A</text>
    </svg>`)}`;
    
    // Update favicon
    let faviconLink = document.querySelector('link[rel*="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = adminFavicon;
    
    // Animated title sequence
    const titles = ['⚡ YBEX ADMIN', '🔴 ADMIN LIVE', '⚡ YBEX ADMIN', '🔴 DASHBOARD'];
    let titleIndex = 0;
    let blinkCount = 0;
    const maxBlinks = 6; // Show animation for a few seconds then settle
    
    const titleInterval = setInterval(() => {
      if (blinkCount < maxBlinks) {
        document.title = titles[titleIndex % titles.length];
        titleIndex++;
        blinkCount++;
      } else {
        document.title = '🔴 YBEX Admin Dashboard';
        clearInterval(titleInterval);
      }
    }, 400);
    
    // Cleanup on unmount
    return () => {
      clearInterval(titleInterval);
      document.title = originalTitle;
      faviconLink.href = originalFavicon;
    };
  }, []);

  return (
    <>
      {/* Full Screen Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <AdminIntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        body:has(.ybex-admin-shell) { 
          background: ${C.bg} !important; 
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        body:has(.ybex-admin-shell)::before { display: none !important; }
        body:has(.ybex-admin-shell) .site-header { display: none !important; }

        .adm-tab { 
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          font-weight: 500;
          letter-spacing: 0.04em;
          position: relative;
          overflow: hidden;
        }
        .adm-tab::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--hover-color, #3b82f6) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }
        .adm-tab:hover::before {
          opacity: 0.15;
        }
        .adm-tab:hover { 
          color: var(--hover-color, #3b82f6) !important;
          transform: translateY(-2px);
          text-shadow: 0 0 20px var(--hover-color, #3b82f6);
        }
        .adm-tab span {
          transition: transform 0.3s ease, filter 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .adm-tab:hover span {
          transform: scale(1.2) rotate(-5deg);
          filter: drop-shadow(0 0 8px var(--hover-color, #3b82f6));
        }
        .adm-tab[data-active="true"] {
          font-weight: 700 !important;
        }

        .adm-nav::-webkit-scrollbar { height: 3px; }
        .adm-nav::-webkit-scrollbar-track { background: transparent; }
        .adm-nav::-webkit-scrollbar-thumb { 
          background: linear-gradient(90deg, ${C.accentOrange}, ${C.accent}); 
          border-radius: 4px; 
        }

        .adm-hdr-btn { 
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .adm-hdr-btn:hover { 
          background: rgba(228,241,65,0.1) !important; 
          border-color: rgba(228,241,65,0.3) !important; 
          color: ${C.accent} !important;
          transform: translateY(-1px);
        }

        .adm-logout { transition: all 0.2s ease; }
        .adm-logout:hover { 
          background: rgba(255,61,16,0.3) !important; 
          border-color: rgba(255,61,16,0.7) !important; 
          color: #fff !important;
          transform: scale(1.05);
        }
        
        .adm-header {
          background: linear-gradient(180deg, ${C.bgElevated} 0%, rgba(10,10,10,0.98) 100%) !important;
          box-shadow: 0 4px 30px rgba(0,0,0,0.4) !important;
        }
        
        .adm-nav {
          background: ${C.bgElevated} !important;
        }
        
        .adm-logo-text {
          font-family: 'Space Grotesk', sans-serif;
        }

        @media (max-width: 640px) {
          .adm-logo-text  { display: none !important; }
          .adm-right      { display: none !important; }
          .adm-hamburger  { display: flex !important; }
          .adm-nav        { display: none !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .adm-badge      { display: none !important; }
          .adm-hamburger  { display: none !important; }
        }
        @media (min-width: 1025px) {
          .adm-hamburger  { display: none !important; }
        }
      `}</style>

      <div className="ybex-admin-shell" style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font.sans, color: C.text }}>

        {/* ══════════ HEADER ══════════ */}
        <header className="adm-header" style={{
          background: C.bgElevated,
          borderBottom: `1px solid ${C.border}`,
          height: '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky', top: 0, zIndex: 300,
          gap: '1rem',
        }}>

          {/* Logo */}
          <Link to="/admin/enquiries" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              style={{
                width: '46px', height: '46px', background: C.accent,
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '1.1rem', color: '#000', flexShrink: 0,
                boxShadow: `0 0 0 0 ${C.accent}`,
              }}
              animate={{ boxShadow: [`0 0 0px ${C.accent}00`, `0 0 14px ${C.accent}55`, `0 0 0px ${C.accent}00`] }}
              transition={{ boxShadow: { duration: 3, repeat: Infinity }, scale: { duration: 0.15 } }}
            >YB</motion.div>

            <div className="adm-logo-text">
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                color: '#fff', 
                letterSpacing: '0.02em', 
                lineHeight: 1.1, 
                fontFamily: C.font.display,
              }}>
                YBEX COMMAND CENTER
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                color: 'rgba(255,255,255,0.5)', 
                letterSpacing: '0.2em', 
                textTransform: 'uppercase', 
                marginTop: '3px',
                fontWeight: 500
              }}>
                Secure Dashboard Management
              </div>
            </div>
          </Link>

          {/* Right — desktop */}
          <div className="adm-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* Admin badge - Updated to match screenshot */}
            <div className="adm-badge" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
              borderRadius: '12px', padding: '0.5rem 1rem', cursor: 'default',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', color: C.accent, flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {user?.name?.toUpperCase() || 'GUTARGOOPLUS25'}
                </div>
                <div style={{ fontSize: '0.6rem', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Owner Admin
                </div>
              </div>
            </div>

            {/* Live site - Updated style */}
            <motion.a
              href="/" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                borderRadius: '10px', padding: '0.5rem 1rem',
                color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                textDecoration: 'none', whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Live Site
            </motion.a>

            {/* Logout - Updated style */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{
                width: '40px', height: '40px',
                background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)',
                borderRadius: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FF3D10', flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
              title="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="adm-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none', background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              width: '36px', height: '36px',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: C.text, fontSize: '1rem', flexShrink: 0,
            }}
          >{mobileOpen ? '✕' : '☰'}</button>
        </header>

        {/* ══════════ MOBILE MENU ══════════ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              style={{
                position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 290,
                background: 'rgba(10,10,10,0.98)', borderBottom: `1px solid ${C.border}`,
                backdropFilter: 'blur(20px)', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem', background: `${C.accent}08`, border: `1px solid ${C.accent}18`, borderRadius: '10px', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${C.accent}20`, border: `1px solid ${C.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: C.accent, fontWeight: 800 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: C.accent }}>{user?.name?.toUpperCase() || 'ADMIN'}</div>
                    <div style={{ fontSize: '0.58rem', color: C.textDimmed }}>Owner Admin</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a href="/" target="_blank" rel="noreferrer" style={{ padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: '6px', color: C.textMuted, fontSize: '0.7rem', textDecoration: 'none' }}>🌐</a>
                  <button onClick={handleLogout} style={{ padding: '0.3rem 0.6rem', background: `${C.accentOrange}12`, border: `1px solid ${C.accentOrange}35`, borderRadius: '6px', color: C.accentOrange, fontSize: '0.7rem', cursor: 'pointer' }}>⏻</button>
                </div>
              </div>
              {NAV_TABS.map((tab) => (
                <NavLink key={tab.path} to={tab.path} onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '0.65rem 0.9rem',
                    background: isActive ? C.accentOrange : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? C.accentOrange : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '9px', color: isActive ? C.text : C.textMuted,
                    fontSize: '0.8rem', fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none', letterSpacing: '0.04em',
                  })}
                >
                  <span>{tab.icon}</span>{tab.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════ NAV TABS ══════════ */}
        <div
          ref={navRef}
          className="adm-nav"
          style={{
            background: C.bgElevated,
            borderBottom: `1px solid ${C.border}`,
            overflowX: 'auto',
            position: 'sticky', top: '64px', zIndex: 200,
            scrollbarWidth: 'thin',
            scrollbarColor: `${C.accent}33 transparent`,
          }}
        >
          <div style={{ display: 'flex', minWidth: 'max-content' }}>
            {NAV_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="adm-tab"
                data-active={undefined}
                style={({ isActive }) => {
                  return {
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '0 1rem', height: '44px',
                    fontSize: '0.7rem', fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    color: isActive ? C.text : C.textMuted,
                    background: isActive ? `${C.accentOrange}18` : 'transparent',
                    borderBottom: isActive ? `2px solid ${C.accentOrange}` : '2px solid transparent',
                    borderTop: '2px solid transparent',
                    position: 'relative',
                    '--hover-color': tab.hoverColor,
                  };
                }}
              >
                {({ isActive }) => (
                  <>
                    <span style={{ fontSize: '0.78rem', lineHeight: 1 }}>{tab.icon}</span>
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                          background: C.accentOrange,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ══════════ PAGE CONTENT ══════════ */}
        <main className="adm-main" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>

      </div>
    </>
  );
}
