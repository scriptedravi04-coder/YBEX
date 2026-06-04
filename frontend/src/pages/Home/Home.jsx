import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import AboutStorySection from '../../components/AboutStorySection';
import {
  aboutHighlightCopy,
  clientLogos,
  heroGallery,
  marqueeItems,
  serviceCards,
  serviceHighlights,
  talentProfiles,
} from '../../content/siteData';
import axiosInstance from '../../api/axiosInstance';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
const toAbsUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  // On mobile/IP access, resolve relative paths to the backend IP
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000${url}`;
  }
  return `${API_BASE}${url}`;
};

export default function Home() {
  const aboutSectionRef = useRef(null);
  const heroGalleryRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [aboutProgress, setAboutProgress] = useState(0);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [influencers, setInfluencers] = useState([]);
  const [influencersLoading, setInfluencersLoading] = useState(true);
  // hover-pause state for each marquee row
  const [pauseTop, setPauseTop] = useState(false);
  const [pauseBottom, setPauseBottom] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const heroParallax = useTransform(heroScrollProgress, [0, 1], ['0%', '14%']);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.92]);
  const springRotateX = useSpring(heroTilt.x, { stiffness: 120, damping: 20, mass: 0.4 });
  const springRotateY = useSpring(heroTilt.y, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const updateProgress = () => {
      const section = aboutSectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height + viewportHeight * 0.6;
      const travelled = viewportHeight - rect.top;
      const progress = Math.min(Math.max(travelled / total, 0), 1);

      setAboutProgress(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    const section = heroGalleryRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroExpanded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const aboutWords = useMemo(() => aboutHighlightCopy.split(' '), []);
  const talentTopRow = talentProfiles.slice(0, 4);
  const talentBottomRow = talentProfiles.slice(4);

  // Fetch brands from backend
  useEffect(() => {
    axiosInstance.get('/brands')
      .then((res) => setBrands(res.data.brands || []))
      .catch(() => setBrands([]))
      .finally(() => setBrandsLoading(false));
  }, []);

  // Fetch influencers from backend
  useEffect(() => {
    axiosInstance.get('/influencers')
      .then((res) => setInfluencers(res.data.influencers || []))
      .catch(() => setInfluencers([]))
      .finally(() => setInfluencersLoading(false));
  }, []);

  // Mobile gallery: tap cover to fan out cards
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setHeroTilt({
      x: (0.5 - py) * 12,
      y: (px - 0.5) * 16,
    });
  };

  const resetHeroTilt = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  return (
    <div className="clone-home">
      <section ref={heroSectionRef} className="clone-hero section-block">
        <div className="container">
          <motion.div
            className="clone-hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="clone-pill hero-pill">
              <span className="hero-pill-year">2026</span>
              <span>India&apos;s #1 Talent Management Company</span>
            </div>

            <h1 className="clone-hero-title">
              We Build <span>Talent</span> Powered
              <br />
              Momentum.
            </h1>

            <p className="clone-hero-text">
              YBEX blends creator strategy, sharp production, and growth-ready execution
              to turn ideas into campaigns, content, and brands that actually move.
            </p>
          </motion.div>

          {/* ── Desktop gallery ── */}
          <motion.div
            ref={heroGalleryRef}
            className="hero-gallery-stage hero-gallery-desktop"
            style={{ y: heroParallax, scale: heroScale, rotateX: springRotateX, rotateY: springRotateY }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8 }}
            onMouseMove={handleHeroMove}
            onMouseLeave={resetHeroTilt}
          >
            <div className="hero-gallery-glow" />
            {heroGallery.map((item, index) => (
              <article
                key={item.title}
                className={`hero-gallery-card hero-gallery-card-${index + 1} ${
                  heroExpanded ? 'is-expanded' : 'is-stacked'
                }`}
              >
                <img src={item.image} alt={item.title} />
                <div className="hero-gallery-card-copy">
                  <p>{item.title}</p>
                  <span>{item.tag}</span>
                </div>
              </article>
            ))}
          </motion.div>

          {/* ── Mobile gallery — Premium 3D Carousel ── */}
          <div className="hero-gallery-mobile">
            <motion.div
              className="hero-gallery-mobile-stage"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1 
              }}
            >
              <div className="hero-gallery-mobile-glow" />

              {/* Progress Dots */}
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 50,
              }}>
                {heroGallery.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveCardIndex(index)}
                    style={{
                      width: activeCardIndex === index ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: activeCardIndex === index ? '#E4F141' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Hint text */}
              <AnimatePresence>
                {!isDragging && (
                  <motion.div
                    className="hero-gallery-mobile-hint"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: [0, -8, 0] }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      opacity: { duration: 0.3 }
                    }}
                    style={{
                      position: 'absolute',
                      top: '-50px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 40,
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.6)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}>Swipe to explore</span>
                    <motion.span 
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        marginTop: '4px',
                      }}
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >→</motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Stack Container */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, info) => {
                  setIsDragging(false);
                  const threshold = 50;
                  if (info.offset.x < -threshold && activeCardIndex < heroGallery.length - 1) {
                    setActiveCardIndex(prev => prev + 1);
                    setDragDirection('left');
                  } else if (info.offset.x > threshold && activeCardIndex > 0) {
                    setActiveCardIndex(prev => prev - 1);
                    setDragDirection('right');
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  touchAction: 'pan-y',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
              >
                {heroGallery.map((item, index) => {
                  const offset = index - activeCardIndex;
                  const isVisible = Math.abs(offset) <= 2;
                  
                  if (!isVisible) return null;

                  const isActive = index === activeCardIndex;
                  
                  // 3D spring physics configuration
                  const springConfig = { stiffness: 300, damping: 30, mass: 0.8 };

                  return (
                    <motion.article
                      key={item.title}
                      className="hero-gallery-mobile-card"
                      initial={false}
                      animate={{
                        x: offset * 30,
                        y: Math.abs(offset) * 10,
                        scale: isActive ? 1 : 1 - Math.abs(offset) * 0.08,
                        rotateY: offset * -8,
                        rotateZ: offset * 2,
                        zIndex: heroGallery.length - Math.abs(offset),
                        opacity: 1 - Math.abs(offset) * 0.25,
                      }}
                      transition={{
                        type: 'spring',
                        ...springConfig,
                      }}
                      whileHover={isActive ? { 
                        y: -8, 
                        scale: 1.02,
                        transition: { type: 'spring', stiffness: 400, damping: 25 }
                      } : {}}
                      whileTap={isActive ? { scale: 0.98 } : {}}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transformOrigin: 'center center',
                        transformStyle: 'preserve-3d',
                        perspective: 1000,
                      }}
                    >
                      {/* Card glow effect */}
                      <motion.div
                        style={{
                          position: 'absolute',
                          inset: '-2px',
                          borderRadius: '24px',
                          background: isActive 
                            ? 'linear-gradient(135deg, rgba(228,241,65,0.4) 0%, rgba(255,61,16,0.2) 50%, rgba(228,241,65,0.1) 100%)' 
                            : 'transparent',
                          filter: 'blur(20px)',
                          opacity: isActive ? 1 : 0,
                          zIndex: -1,
                        }}
                        animate={{ opacity: isActive ? [0.6, 1, 0.6] : 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        loading="lazy"
                        style={{
                          transform: 'translateZ(20px)',
                        }}
                      />
                      
                      <motion.div 
                        className="hero-gallery-mobile-card-copy"
                        style={{
                          transform: 'translateZ(30px)',
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.7, 
                          y: isActive ? 0 : 5,
                        }}
                        transition={{ delay: isActive ? 0.1 : 0, duration: 0.3 }}
                      >
                        <motion.span 
                          className="hero-gallery-mobile-tag"
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: 'rgba(228,241,65,0.15)',
                            border: '1px solid rgba(228,241,65,0.3)',
                            borderRadius: '20px',
                            fontSize: '0.65rem',
                            color: '#E4F141',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                          }}
                        >
                          {item.tag}
                        </motion.span>
                        <motion.p
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#fff',
                            margin: 0,
                            lineHeight: 1.3,
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                          }}
                        >
                          {item.title}
                        </motion.p>
                      </motion.div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-block services-panel">
        <div className="container">
          <div className="services-grid">
            {serviceCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="service-panel-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
              >
                <div className="service-panel-icon">{String(index + 1).padStart(2, '0')}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link to="/services" className="service-card-cta">
                  {card.cta}
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="services-marquee-shell">
            <div className="clone-marquee clone-marquee-services">
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>

          <div className="service-highlights-grid">
            {serviceHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                className="service-highlight-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.07 }}
              >
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block clients-section">
        <div className="container clients-shell">
          <div className="clone-pill">
            <span>Our Clients</span>
          </div>

          <div className="clients-copy">
            <h2>
              Our Clients: Leading
              <br />
              <span>Brands That Trust YBEX</span>
            </h2>
            <p>
              We partner with growth-focused brands across categories and build creator-led
              systems that feel premium, measurable, and culturally aligned.
            </p>
          </div>

          {brandsLoading ? (
            <div className="clients-marquee-stack">
              <div className="logo-marquee">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ display: 'flex', gap: '24px' }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{
                      minWidth: '120px', height: '72px', borderRadius: '20px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    }} />
                  ))}
                </motion.div>
              </div>
            </div>
          ) : brands.length > 0 ? (
            <div className="clients-marquee-stack">
              {/* First Row Marquee */}
              <div 
                className="logo-marquee"
                style={{
                  maskImage: hoveredBrand ? 'none' : 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage: hoveredBrand ? 'none' : 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
              >
                <motion.div
                  className="logo-marquee-track"
                  animate={hoveredBrand ? {} : { x: ['0%', '-50%'] }}
                  transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                  style={{
                    animationPlayState: hoveredBrand ? 'paused' : 'running',
                    display: 'flex',
                    gap: '24px',
                  }}
                >
                  {[...brands, ...brands].map((brand, index) => {
                    const isHovered = hoveredBrand === `${brand._id}-${index}`;
                    const isOtherHovered = hoveredBrand && !isHovered;
                    
                    return (
                      <motion.a
                        key={`${brand._id}-${index}`}
                        href={brand.websiteLink}
                        target="_blank"
                        rel="noreferrer"
                        className="logo-pill logo-pill-brand"
                        onMouseEnter={() => setHoveredBrand(`${brand._id}-${index}`)}
                        onMouseLeave={() => setHoveredBrand(null)}
                        animate={{
                          scale: isHovered ? 1.15 : isOtherHovered ? 0.92 : 1,
                          y: isHovered ? -8 : 0,
                          opacity: isOtherHovered ? 0.4 : 1,
                          filter: isOtherHovered ? 'grayscale(0.8)' : 'grayscale(0)',
                        }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 25,
                          mass: 0.8 
                        }}
                        style={{
                          position: 'relative',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          minWidth: '140px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isHovered 
                            ? 'rgba(228,241,65,0.1)' 
                            : 'rgba(255,255,255,0.03)',
                          border: isHovered 
                            ? '1px solid rgba(228,241,65,0.5)' 
                            : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '20px',
                          padding: '16px 24px',
                          boxShadow: isHovered 
                            ? '0 20px 40px rgba(228,241,65,0.2), 0 0 60px rgba(228,241,65,0.1)' 
                            : 'none',
                          zIndex: isHovered ? 100 : 1,
                        }}
                      >
                        {/* Spotlight glow effect */}
                        {isHovered && (
                          <motion.div
                            layoutId="brandGlow"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              position: 'absolute',
                              inset: '-4px',
                              borderRadius: '24px',
                              background: 'radial-gradient(circle at center, rgba(228,241,65,0.3) 0%, transparent 70%)',
                              filter: 'blur(20px)',
                              zIndex: -1,
                            }}
                          />
                        )}
                        
                        <motion.img
                          src={toAbsUrl(brand.logoUrl)}
                          alt={brand.name}
                          animate={{
                            filter: isHovered 
                              ? 'brightness(1.2) saturate(1.1)' 
                              : 'brightness(0.85) saturate(0.9)',
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '44px',
                            objectFit: 'contain',
                          }}
                        />
                        
                        {/* Brand name tooltip */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              transition={{ 
                                type: 'spring',
                                stiffness: 400,
                                damping: 25 
                              }}
                              style={{
                                position: 'absolute',
                                bottom: '-45px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.95)',
                                border: '1px solid rgba(228,241,65,0.5)',
                                borderRadius: '12px',
                                padding: '8px 16px',
                                fontSize: '0.75rem',
                                color: '#E4F141',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                zIndex: 200,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                              }}
                            >
                              <span style={{ marginRight: '4px' }}>🔗</span>
                              {brand.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.a>
                    );
                  })}
                </motion.div>
              </div>

              {/* Second Row Marquee - Reverse */}
              <div 
                className="logo-marquee logo-marquee-reverse"
                style={{
                  maskImage: hoveredBrand ? 'none' : 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage: hoveredBrand ? 'none' : 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
              >
                <motion.div
                  className="logo-marquee-track"
                  animate={hoveredBrand ? {} : { x: ['-50%', '0%'] }}
                  transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
                  style={{
                    animationPlayState: hoveredBrand ? 'paused' : 'running',
                    display: 'flex',
                    gap: '24px',
                  }}
                >
                  {[...brands.slice().reverse(), ...brands.slice().reverse()].map((brand, index) => {
                    const key = `${brand._id}-rev-${index}`;
                    const isHovered = hoveredBrand === key;
                    const isOtherHovered = hoveredBrand && !isHovered;
                    
                    return (
                      <motion.a
                        key={key}
                        href={brand.websiteLink}
                        target="_blank"
                        rel="noreferrer"
                        className="logo-pill logo-pill-brand"
                        onMouseEnter={() => setHoveredBrand(key)}
                        onMouseLeave={() => setHoveredBrand(null)}
                        animate={{
                          scale: isHovered ? 1.15 : isOtherHovered ? 0.92 : 1,
                          y: isHovered ? -8 : 0,
                          opacity: isOtherHovered ? 0.4 : 1,
                          filter: isOtherHovered ? 'grayscale(0.8)' : 'grayscale(0)',
                        }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 25,
                          mass: 0.8 
                        }}
                        style={{
                          position: 'relative',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          minWidth: '140px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isHovered 
                            ? 'rgba(228,241,65,0.1)' 
                            : 'rgba(255,255,255,0.03)',
                          border: isHovered 
                            ? '1px solid rgba(228,241,65,0.5)' 
                            : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '20px',
                          padding: '16px 24px',
                          boxShadow: isHovered 
                            ? '0 20px 40px rgba(228,241,65,0.2), 0 0 60px rgba(228,241,65,0.1)' 
                            : 'none',
                          zIndex: isHovered ? 100 : 1,
                        }}
                      >
                        {/* Spotlight glow effect */}
                        {isHovered && (
                          <motion.div
                            layoutId="brandGlow"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              position: 'absolute',
                              inset: '-4px',
                              borderRadius: '24px',
                              background: 'radial-gradient(circle at center, rgba(228,241,65,0.3) 0%, transparent 70%)',
                              filter: 'blur(20px)',
                              zIndex: -1,
                            }}
                          />
                        )}
                        
                        <motion.img
                          src={toAbsUrl(brand.logoUrl)}
                          alt={brand.name}
                          animate={{
                            filter: isHovered 
                              ? 'brightness(1.2) saturate(1.1)' 
                              : 'brightness(0.85) saturate(0.9)',
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '44px',
                            objectFit: 'contain',
                          }}
                        />
                        
                        {/* Brand name tooltip */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              transition={{ 
                                type: 'spring',
                                stiffness: 400,
                                damping: 25 
                              }}
                              style={{
                                position: 'absolute',
                                bottom: '-45px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.95)',
                                border: '1px solid rgba(228,241,65,0.5)',
                                borderRadius: '12px',
                                padding: '8px 16px',
                                fontSize: '0.75rem',
                                color: '#E4F141',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                zIndex: 200,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                              }}
                            >
                              <span style={{ marginRight: '4px' }}>🔗</span>
                              {brand.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.a>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="clients-marquee-stack">
              <div className="logo-marquee">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                >
                  {[...clientLogos, ...clientLogos].map((logo, index) => (
                    <span key={`${logo}-${index}`} className="logo-pill">
                      {logo}
                    </span>
                  ))}
                </motion.div>
              </div>

              <div className="logo-marquee logo-marquee-reverse">
                <motion.div
                  className="logo-marquee-track"
                  animate={{ x: ['-50%', '0%'] }}
                  transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
                >
                  {[...clientLogos.slice().reverse(), ...clientLogos.slice().reverse()].map((logo, index) => (
                    <span key={`${logo}-rev-${index}`} className="logo-pill">
                      {logo}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-block talents-section">
        <div className="container">
          {(() => {
            const useDB     = !influencersLoading && influencers.length > 0;
            const topRow    = useDB ? influencers.slice(0, Math.ceil(influencers.length / 2)) : talentTopRow;
            const bottomRow = useDB ? influencers.slice(Math.ceil(influencers.length / 2))   : talentBottomRow;

            const renderCard = (item, keyPrefix, index) => {
              const imgSrc = useDB ? toAbsUrl(item.imageUrl) : item.image;
              const name   = item.name;
              const role   = useDB ? 'Influencer' : item.role;
              const link   = useDB ? item.profileLink : null;
              const rot    = useDB ? ((index % 5) - 2) * 3 : item.rotation;

              const inner = (
                <article
                  className="talent-card talent-card-marquee"
                  style={{ rotate: `${rot}deg`, cursor: link ? 'pointer' : 'default' }}
                >
                  {imgSrc
                    ? <img src={imgSrc} alt={name} />
                    : <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🌟</div>
                  }
                  <span>{name}</span>
                  <small>{role}</small>
                </article>
              );

              if (link) {
                return (
                  <a key={`${keyPrefix}-${index}`} href={link} target="_blank" rel="noreferrer"
                    style={{ textDecoration: 'none', display: 'contents' }}>
                    {inner}
                  </a>
                );
              }
              return <React.Fragment key={`${keyPrefix}-${index}`}>{inner}</React.Fragment>;
            };

            return (
              <>
                {/* TOP ROW — scrolls left, pauses on hover */}
                <div className={`talent-marquee talent-marquee-top${pauseTop ? ' is-paused' : ''}`}
                  onMouseEnter={() => setPauseTop(true)}
                  onMouseLeave={() => setPauseTop(false)}
                >
                  <div className="talent-marquee-track talent-css-left">
                    {[...topRow, ...topRow].map((item, i) => renderCard(item, 'top', i))}
                  </div>
                </div>

                <h2 className="talents-title">Our Exclusive Talents</h2>

                {/* BOTTOM ROW — scrolls right, pauses on hover */}
                <div className={`talent-marquee talent-marquee-bottom${pauseBottom ? ' is-paused' : ''}`}
                  onMouseEnter={() => setPauseBottom(true)}
                  onMouseLeave={() => setPauseBottom(false)}
                >
                  <div className="talent-marquee-track talent-css-right">
                    {[...bottomRow, ...bottomRow].map((item, i) => renderCard(item, 'bottom', i))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      <section className="section-block">
        <div className="container launch-panel">
          <div className="launch-panel-media">
            <video autoPlay muted loop playsInline>
              <source src="/video.mp4" type="video/mp4" />
            </video>
            <div className="launch-panel-overlay" />
          </div>

          <motion.div
            className="launch-panel-copy"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
          >
            <div className="clone-pill">
              <span>Launch Your Campaign</span>
            </div>

            <h2>
              Launch Your Campaign with YBEX
              <br />
              <span>In Minutes, Not Months.</span>
            </h2>

            <p>
              Build your brand with YBEX through campaign planning, creator partnerships,
              content systems, and launch support built to move faster without losing
              quality. Ready to scale your next idea? Let&apos;s start now.
            </p>

            <div className="launch-panel-actions">
              <Link to="/contact" className="button button-primary">
                Book an Appointment
              </Link>
              <span>200+ Agencies Rated</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
