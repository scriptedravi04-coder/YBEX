import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const handleLinkClick = (path) => {
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const marqueeItems = [
    'UGC Videos',
    'Performance Marketing',
    'In House Team',
    'Studio Start Ups',
    'Paid PR',
    'Brand Identity'
  ];

  return (
    <footer className="site-footer">
      {/* Background Glows */}
      <div className="footer-bg-glow" />
      <div className="footer-bg-glow-right" />

      {/* Top Scrolling Marquee Bar (Clickable to /services) */}
      <Link to="/services" className="footer-marquee-link-wrapper">
        <div className="footer-marquee-container">
          <div className="footer-marquee-track">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={idx} className="footer-marquee-item">
                <span>{item}</span>
                <span className="marquee-star">+</span>
              </div>
            ))}
          </div>
        </div>
      </Link>

      <motion.div
        className="container footer-grid-premium"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Column 1: Brand & Logo */}
        <motion.div className="footer-brand-block" variants={itemVariants}>
          <Link to="/" onClick={() => handleLinkClick('/')} style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div className="footer-brand-logo-container">
              <div className="yx-circle">YX</div>
              <span className="ybex-text">YBEX</span>
            </div>
          </Link>
          <p className="footer-brand-desc">
            India's sharpest creative marketing agency. We build brands, run campaigns, and scale creators — from zero to iconic.
          </p>
          <div className="footer-social-row">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Column 2: Company Links */}
        <motion.div className="footer-links-column" variants={itemVariants}>
          <p className="footer-heading">COMPANY</p>
          <nav className="footer-links-list">
            <Link to="/" onClick={() => handleLinkClick('/')} className="footer-link-item">Home</Link>
            <Link to="/about" onClick={() => handleLinkClick('/about')} className="footer-link-item">About</Link>
            <Link to="/portfolio" onClick={() => handleLinkClick('/portfolio')} className="footer-link-item">Portfolio</Link>
            <Link to="/contact" onClick={() => handleLinkClick('/contact')} className="footer-link-item">Contact</Link>
          </nav>
        </motion.div>

        {/* Column 3: Offerings Links */}
        <motion.div className="footer-links-column" variants={itemVariants}>
          <p className="footer-heading">OFFERINGS</p>
          <nav className="footer-links-list">
            <Link to="/offerings" onClick={() => handleLinkClick('/offerings')} className="footer-link-item">9-Day Challenge</Link>
            <Link to="/academy" onClick={() => handleLinkClick('/academy')} className="footer-link-item">Creators Academy</Link>
            <Link to="/about" onClick={() => handleLinkClick('/about')} className="footer-link-item">In-House Team</Link>
            <Link to="/contact" onClick={() => handleLinkClick('/contact')} className="footer-link-item">Pitch Your Idea</Link>
          </nav>
        </motion.div>

        {/* Column 4: Get In Touch */}
        <motion.div className="footer-links-column" variants={itemVariants}>
          <p className="footer-heading">GET IN TOUCH</p>
          <div className="footer-links-list">
            <div className="contact-info-block">
              <div className="contact-icon-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-text-box">
                <span className="contact-label">EMAIL</span>
                <a href="mailto:ravi@ybex.in" className="contact-value">ravi@ybex.in</a>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-icon-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-text-box">
                <span className="contact-label">PHONE</span>
                <a href="tel:+918171440017" className="contact-value">+91 8171440017</a>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-icon-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-text-box">
                <span className="contact-label">LOCATION</span>
                <span className="contact-value">Sector 63, Noida</span>
              </div>
            </div>

            <Link to="/admin/login" className="footer-admin-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              ADMIN
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Legal / Meta Section */}
      <div className="container footer-bottom-premium">
        <p className="footer-copy-text">
          &copy; 2026 YBEX MEDIA. ALL RIGHTS RESERVED.
        </p>

        <div className="footer-bottom-actions">

          <Link to="/admin/login" className="footer-go-admin-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            GO TO ADMIN
          </Link>
        </div>
      </div>

      {/* Giant Watermark Text */}
      <div className="footer-watermark">YBEX</div>

      <style>{`
        .site-footer {
          position: relative;
          overflow: hidden;
          background: #000000 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0 0 64px;
        }

        .footer-bg-glow {
          position: absolute;
          top: -100px;
          left: 5%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(210, 245, 60, 0.05) 0%, rgba(210, 245, 60, 0) 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .footer-bg-glow-right {
          position: absolute;
          bottom: -150px;
          right: 5%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        .footer-marquee-link-wrapper {
          text-decoration: none;
          display: block;
        }

        .footer-marquee-container {
          background: #d2f53c;
          overflow: hidden;
          white-space: nowrap;
          height: 48px;
          display: flex;
          align-items: center;
          margin-bottom: 80px;
          border-bottom: 2px solid #bbf32c;
          box-shadow: 0 4px 20px rgba(210, 245, 60, 0.25);
          cursor: pointer;
        }
        .footer-marquee-track {
          display: flex;
          align-items: center;
          gap: 32px;
          width: max-content;
          animation: marquee-scroll 25s linear infinite;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .footer-marquee-item {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 32px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.12em;
          color: #000000;
          text-transform: uppercase;
        }
        .marquee-star {
          font-weight: 700;
          font-size: 0.85rem;
          color: #000000;
          opacity: 0.5;
        }

        .footer-grid-premium {
          display: grid;
          grid-template-columns: 1.5fr 0.75fr 0.75fr 1.2fr;
          gap: 48px;
          position: relative;
          z-index: 1;
          margin-bottom: 64px;
        }

        .footer-brand-block {
          max-width: 380px;
        }
        
        .footer-brand-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .yx-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d2f53c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #000000;
          font-size: 0.95rem;
          box-shadow: 0 0 12px rgba(210, 245, 60, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .ybex-text {
          font-size: 1.7rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .footer-brand-logo-container:hover .yx-circle {
          transform: scale(1.1) rotate(5deg);
          background: #ffffff;
          color: #000000;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
        .footer-brand-logo-container:hover .ybex-text {
          color: #d2f53c;
          text-shadow: 0 0 10px rgba(210, 245, 60, 0.3);
        }

        .footer-brand-desc {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
          margin: 16px 0 24px;
        }

        .footer-social-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .footer-social-btn:hover {
          border-color: #d2f53c;
          background: rgba(210, 245, 60, 0.08);
          color: #d2f53c;
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(210, 245, 60, 0.2);
        }

        .footer-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .footer-links-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-link-item {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: inline-flex;
          align-items: center;
          position: relative;
          width: fit-content;
        }
        .footer-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #d2f53c;
          transition: width 0.3s ease;
        }
        .footer-link-item:hover {
          color: #d2f53c;
          transform: translateX(4px);
        }
        .footer-link-item:hover::after {
          width: 100%;
        }

        .contact-info-block {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .contact-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .contact-info-block:hover .contact-icon-box {
          color: #d2f53c;
          border-color: rgba(210, 245, 60, 0.3);
          background: rgba(210, 245, 60, 0.08);
          box-shadow: 0 0 15px rgba(210, 245, 60, 0.15);
        }
        .contact-text-box {
          display: flex;
          flex-direction: column;
        }
        .contact-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 2px;
        }
        .contact-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .contact-value:hover {
          color: #d2f53c;
        }

        .footer-admin-link {
          display: inline-flex;
          align-items: center;
          margin-top: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.35);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-admin-link:hover {
          color: #d2f53c;
        }

        .footer-bottom-premium {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 32px;
        }
        .footer-copy-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #d2f53c;
          box-shadow: 0 0 8px #d2f53c;
          display: inline-block;
          animation: status-pulse 2s infinite ease-in-out;
        }
        @keyframes status-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 8px #d2f53c;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
            box-shadow: 0 0 12px #d2f53c;
          }
        }

        .footer-bottom-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .footer-domain-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-domain-link:hover {
          color: #d2f53c;
        }

        .footer-go-admin-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: #ff003c;
          color: #ffffff !important;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 0, 60, 0.3);
        }
        .footer-go-admin-btn:hover {
          background: #e60036;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 0, 60, 0.5);
        }

        .footer-watermark {
          position: absolute;
          inset: auto 0 -30px;
          text-align: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: clamp(8rem, 26vw, 18rem);
          line-height: 0.8;
          letter-spacing: -0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.03);
          user-select: none;
          pointer-events: none;
          z-index: 0;
        }

        @media (max-width: 960px) {
          .footer-marquee-container {
            margin-bottom: 60px;
          }
          .footer-grid-premium {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .footer-bottom-premium {
            flex-direction: column;
            align-items: center;
            gap: 16px;
            text-align: center;
          }
          .footer-bottom-actions {
            flex-direction: column;
            gap: 12px;
          }
          .footer-watermark {
            font-size: clamp(6rem, 20vw, 12rem);
            bottom: -20px;
          }
        }
        @media (max-width: 576px) {
          .footer-grid-premium {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
