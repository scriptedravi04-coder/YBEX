import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { navItems } from '../../content/siteData';
import { useTheme } from '../../context/ThemeContext';

// Magnetic button effect component
function MagneticLink({ children, to, className, isActive, onClick, highlight }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.15);
    y.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={to} className={className} onClick={onClick}>
        {children}
        {isActive && (
          <motion.div
            layoutId="navUnderline"
            className="nav-underline"
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              right: '0',
              height: '2px',
              background: highlight 
                ? 'linear-gradient(90deg, #ffd700, #ffa500)' 
                : 'linear-gradient(90deg, #d2f53c, #bbf32c)',
              borderRadius: '2px',
              boxShadow: highlight ? '0 0 8px rgba(255, 215, 0, 0.6)' : '0 0 8px rgba(210, 245, 60, 0.6)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 50);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Don't render on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reset scroll state on route change so border hides at top of new page
  useEffect(() => {
    setScrolled(window.scrollY > 50);
  }, [location.pathname]);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Prevent body scroll when menu open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .site-header {
          position: fixed;
          top: 16px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: calc(100% - 48px);
          max-width: 1240px;
          z-index: 990;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          height: 88px;
          display: flex;
          align-items: center;
          padding: 0 !important;
          background: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 44px !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .site-header.is-scrolled {
          top: 12px;
          background: rgba(0, 0, 0, 0.65) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          border-radius: 44px !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .site-header .container {
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-shell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          gap: 28px;
          padding: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          border: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: none !important;
        }
        .brand-mark {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex: 0 0 auto;
          position: relative;
          margin-right: 8px;
        }
        .logo-simple {
          display: flex;
          align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 1.85rem;
          letter-spacing: -0.04em;
          color: #ffffff;
          user-select: none;
          transition: color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .site-header.is-scrolled .brand-mark img {
          height: 72px;
        }
        .brand-glow {
          position: absolute;
          left: -10px;
          width: 110px;
          height: 55px;
          background: radial-gradient(circle at center, rgba(228, 241, 65, 0.4) 0%, transparent 75%);
          filter: blur(16px);
          opacity: 0.5;
          z-index: -1;
          pointer-events: none;
        }
        .brand-mark:hover .brand-glow {
          opacity: 1;
        }
        .nav-links-shell {
          display: flex;
          align-items: center;
          gap: 28px;
          flex: 1;
          min-width: 0;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          flex: 0 0 auto;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          min-width: 0;
        }
        .desktop-nav a {
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          padding: 6px 0;
          color: rgba(255, 255, 255, 0.75);
        }
        .desktop-nav a:hover {
          transform: translateY(-2px);
          text-shadow: 0 4px 20px rgba(210, 245, 60, 0.35);
          color: #d2f53c;
        }
        .nav-cta {
          position: relative;
          overflow: hidden;
          padding: 0.65rem 1.6rem !important;
          font-size: 0.88rem !important;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          letter-spacing: 0.05rem;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 12px !important;
          background: linear-gradient(135deg, #d2f53c, #bbf32c) !important;
          color: #000000 !important;
          text-decoration: none;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          text-shadow: none;
          box-shadow: 0 4px 20px rgba(210, 245, 60, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        @keyframes shine-sweep {
          0% {
            left: -150%;
          }
          50% {
            left: 150%;
          }
          100% {
            left: 150%;
          }
        }
        .nav-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine-sweep 2.5s infinite ease-in-out;
        }
        .nav-cta:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #cbf33b, #d2f53c) !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
          box-shadow: 0 0 28px rgba(210, 245, 60, 0.85), 0 0 12px rgba(255, 255, 255, 0.2);
          text-shadow: none;
        }
        .theme-toggle-btn {
          display: none !important;
        }
        
        /* Menu Toggle */
        .menu-toggle {
          display: none;
        }
        
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-actions {
            flex: 1;
            justify-content: flex-end;
            margin-left: 0;
          }
          .menu-toggle {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
            background: rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(10px);
            cursor: pointer;
            padding: 8px;
            gap: 4px;
            transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 12px rgba(255,255,255,0.08);
          }
          .menu-toggle:hover {
            background: rgba(255, 255, 255, 0.18) !important;
            border-color: rgba(255, 255, 255, 0.7) !important;
            transform: scale(1.06);
            box-shadow: 0 0 18px rgba(255,255,255,0.2);
          }
          .menu-toggle span {
            display: block;
            width: 20px;
            height: 2px;
            border-radius: 3px;
            transition: all 0.3s ease;
            background: #ffffff !important;
          }
        }
        
        @media (max-width: 768px) {
          .site-header {
            top: 10px;
            left: 12px;
            right: 12px;
            width: auto;
            margin: 0;
            height: 64px;
            padding: 0 !important;
            border-radius: 32px !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
          }
          .site-header.is-scrolled {
            top: 8px;
            height: 60px;
            border-radius: 30px !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
          }
          .site-header .container {
            padding: 0 12px;
          }
           .logo-simple { font-size: 1.5rem; }
          .site-header.is-scrolled .logo-simple { font-size: 1.35rem; }
        }

        /* Mobile Drawer */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(300px, 82vw);
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: -8px 0 40px rgba(0,0,0,0.5);
        }
        .mobile-drawer::-webkit-scrollbar { display: none; }
        .mobile-drawer-content {
          padding: 1.5rem;
          flex: 1;
        }
        .mobile-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        :root.light-theme .mobile-theme-toggle {
          border-bottom-color: rgba(0,0,0,0.08);
        }
        .mobile-nav-link {
          display: block;
          padding: 0.85rem 0;
          font-size: 1.05rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s ease;
        }
        :root.light-theme .mobile-nav-link {
          border-bottom-color: rgba(0,0,0,0.05);
        }
        .mobile-nav-link:hover {
          padding-left: 10px;
          color: #ffffff;
        }
        .mobile-nav-link.is-active {
          color: #ffffff;
          font-weight: 600;
        }
      `}</style>

      <motion.header 
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container">
          <div className="nav-shell">

          {/* Brand Logo */}
          <Link to="/" className="brand-mark" aria-label="YBEX home">
            <motion.div 
              className="brand-glow"
              animate={{ 
                opacity: [0.4, 0.75, 0.4],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
            <motion.img
              src="/fgdfg%201.png"
              alt="YBEX logo"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            />
          </Link>

          {/* Navigation group */}
          <div className="nav-links-shell">
            <nav className="desktop-nav" aria-label="Primary navigation">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.3 + i * 0.08, 
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ position: 'relative' }}
                >
                  <MagneticLink
                    to={item.path}
                    className={location.pathname === item.path ? 'is-active' : ''}
                    isActive={location.pathname === item.path}
                    highlight={item.highlight}
                  >
                    <span style={{ 
                      position: 'relative',
                      zIndex: 2,
                      color: item.highlight
                        ? '#ffd700'
                        : hoveredItem === item.path ? '#d2f53c' : 'inherit',
                      textShadow: item.highlight
                        ? (hoveredItem === item.path 
                            ? '0 0 15px rgba(255, 215, 0, 1), 0 0 25px rgba(255, 215, 0, 0.8)' 
                            : '0 0 8px rgba(255, 215, 0, 0.6), 0 0 15px rgba(255, 215, 0, 0.3)')
                        : undefined,
                      transition: 'all 0.3s ease',
                      fontWeight: item.highlight ? 600 : undefined,
                    }}>
                      {item.label}
                    </span>
                    <AnimatePresence>
                      {hoveredItem === item.path && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            inset: '-5px -10px',
                            background: item.highlight ? 'rgba(255, 215, 0, 0.08)' : 'rgba(210, 245, 60, 0.08)',
                            border: item.highlight ? '1px solid rgba(255, 215, 0, 0.25)' : '1px solid rgba(210, 245, 60, 0.2)',
                            borderRadius: '8px',
                            zIndex: -1,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </MagneticLink>
                </motion.div>
              ))}
            </nav>

            <div className="nav-actions">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Link to="/contact" className="button button-primary nav-cta">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ display: 'inline-block' }}
                  >
                    GET STARTED
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            type="button"
            className="menu-toggle"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 6 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              animate={{
                opacity: isOpen ? 0 : 1,
                scaleX: isOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span 
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -6 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                background: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(30px)',
              }}
            >
              <div className="mobile-drawer-content">
                {/* Nav Links */}
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`mobile-nav-link ${location.pathname === item.path ? 'is-active' : ''}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        color: item.highlight ? '#ffd700' : (theme === 'light' ? '#1a1a1a' : '#fff'),
                        textShadow: item.highlight ? '0 0 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3)' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>
                        {item.label}
                      </span>
                      {location.pathname === item.path && (
                        <motion.span
                           layoutId="mobileActive"
                           style={{
                             width: '8px',
                             height: '8px',
                             borderRadius: '50%',
                             background: item.highlight ? '#ffd700' : '#d2f53c',
                             boxShadow: item.highlight ? '0 0 8px #ffd700' : '0 0 8px #d2f53c',
                             display: 'block',
                           }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
                

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
