import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../../api/axiosInstance';

const ACCENT = '#E4F141';

function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `http://${window.location.hostname}:5000${url}`;
    }
    return url;
  }
  return url;
}

function getIgHandle(url) {
  if (!url) return '';
  try {
    // Remove query parameters
    let clean = url.split('?')[0];
    // Remove trailing slash
    clean = clean.replace(/\/$/, '');
    const parts = clean.split('/');
    const handle = parts[parts.length - 1];
    return handle ? `@${handle}` : '';
  } catch (e) {
    return '';
  }
}

export default function Creators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/creators')
      .then((res) => {
        setCreators(res.data.creators || []);
      })
      .catch((err) => {
        console.error('Error fetching creators:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="creators-page">
      <style>{`
        .creators-page {
          background-color: #000;
          color: #fff;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
          padding-bottom: 120px;
        }

        /* Ambient background glow with floating motion */
        @keyframes floatGlow1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatGlow2 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-40px, -60px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1.1); }
        }

        .ambient-glow {
          position: absolute;
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.06) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          z-index: 1;
        }
        .glow-1 { 
          top: -300px; 
          left: -200px; 
          animation: floatGlow1 15s ease-in-out infinite;
        }
        .glow-2 { 
          bottom: -300px; 
          right: -200px; 
          animation: floatGlow2 18s ease-in-out infinite;
        }

        .creators-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 140px 24px 60px;
          position: relative;
          z-index: 2;
        }

        .creators-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .creators-eyebrow {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: ${ACCENT};
          margin-bottom: 16px;
        }

        /* Heading Shine / Glow Effects */
        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .creators-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0 0 24px;
          line-height: 1.1;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .creators-title span {
          background: linear-gradient(90deg, #E4F141 0%, #ffffff 50%, #E4F141 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3.5s linear infinite;
          filter: drop-shadow(0 0 10px rgba(228, 241, 65, 0.6));
          display: inline-block;
        }

        .creators-description {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .creators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
          justify-content: center;
        }

        /* ── Exact Reference Card Design ── */
        .creator-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .creator-card {
          position: relative;
          height: 380px;
          max-width: 250px;
          width: 100%;
          margin: 0 auto;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(12, 12, 12, 0.8) 0%, rgba(5, 5, 5, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          padding: 16px 14px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          backdrop-filter: blur(10px);
        }

        .creator-card:hover {
          transform: translateY(-6px);
          border-color: rgba(228, 241, 65, 0.4);
          box-shadow: 0 20px 40px rgba(228, 241, 65, 0.06);
        }

        /* Outline Text Backgrounds */
        .outline-bg-talent {
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 2.2rem;
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 1;
        }

        .outline-bg-custom {
          position: absolute;
          top: 20%;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 5rem;
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.03);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 1;
        }

        /* Instagram Handle Badge */
        .creator-ig-badge {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .creator-card:hover .creator-ig-badge {
          border-color: rgba(228, 241, 65, 0.3);
          color: #fff;
          background: rgba(228, 241, 65, 0.05);
        }

        .creator-ig-icon {
          color: #E4F141;
          display: flex;
          align-items: center;
        }

        /* Main Name */
        .creator-name {
          position: relative;
          z-index: 5;
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0;
          text-align: center;
          transition: color 0.3s ease;
        }

        .creator-card:hover .creator-name {
          color: #E4F141;
        }

        /* Line Divider */
        .creator-line-divider {
          position: relative;
          z-index: 5;
          width: 50px;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 6px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .creator-line-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #E4F141;
          box-shadow: 0 0 6px #E4F141;
        }

        /* Profile Photo Container */
        .creator-photo-box {
          position: relative;
          width: 100%;
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 3;
          margin-bottom: 12px;
          margin-top: -5px;
        }

        /* Splatter/Spray paint glow behind image */
        .creator-splash-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.15) 0%, rgba(228, 241, 65, 0.02) 60%, rgba(0,0,0,0) 80%);
          z-index: -1;
          filter: blur(8px);
          pointer-events: none;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .creator-card:hover .creator-splash-glow {
          transform: translate(-50%, -50%) scale(1.1);
        }

        .creator-portrait-img {
          max-height: 150px;
          max-width: 95%;
          object-fit: contain;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6));
        }

        .creator-card:hover .creator-portrait-img {
          transform: scale(1.04);
        }

        /* Stats Box */
        .creator-stats-box {
          width: 100%;
          background: rgba(10, 10, 10, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          display: flex;
          padding: 10px 6px;
          z-index: 5;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }

        .creator-card:hover .creator-stats-box {
          border-color: rgba(228, 241, 65, 0.25);
        }

        .creator-stat-col {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .stat-badge-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(228, 241, 65, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E4F141;
          flex-shrink: 0;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
        }

        .stat-txt {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        /* Clear Separation Divider */
        .stat-col-divider {
          width: 1px;
          background: rgba(228, 241, 65, 0.25); /* Clearer separation */
          align-self: stretch;
          margin: 0 4px;
        }

        /* Hover Overlay - Card remains visible, no blur, transparent overlay */
        .creator-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45); /* Transparent overlay, no blur */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          z-index: 10;
          transition: opacity 0.4s ease;
        }

        .creator-card:hover .creator-hover-overlay {
          opacity: 1;
          pointer-events: auto;
        }

        .creator-social-btn {
          padding: 12px 24px;
          border-radius: 30px;
          background: ${ACCENT};
          color: #000;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 25px rgba(228, 241, 65, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .creator-social-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 30px rgba(228, 241, 65, 0.6);
        }

        .shimmer-card {
          height: 500px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <div className="creators-container">
        {/* Header */}
        <header className="creators-header">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="creators-eyebrow"
          >
            EXCLUSIVE TALENTS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="creators-title"
          >
            OUR <span>CREATORS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="creators-description"
          >
            Connecting brands with world-class exclusive digital talents and cultural pioneers.
          </motion.p>
        </header>

        {/* Grid */}
        <div className="creators-grid">
          <AnimatePresence mode="wait">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`shimmer-${i}`}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="shimmer-card"
                />
              ))
            ) : creators.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem' }}>No creators published yet.</p>
              </div>
            ) : (
              creators.map((c, idx) => (
                <a
                  key={c._id || idx}
                  href={c.socialLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="creator-card-link"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }}
                    className="creator-card"
                  >
                    {/* Outline Backdrop Texts */}
                    <div className="outline-bg-talent">OUR TALENT</div>
                    <div className="outline-bg-custom">{c.backgroundText || 'YBEX'}</div>

                    {/* Instagram badge */}
                    <div className="creator-ig-badge">
                      <span className="creator-ig-icon">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </span>
                      <span>{getIgHandle(c.socialLink) || '@yebx'}</span>
                    </div>

                    {/* Name */}
                    <h2 className="creator-name">{c.name}</h2>

                    {/* Line Divider */}
                    <div className="creator-line-divider">
                      <div className="creator-line-dot"></div>
                    </div>

                    {/* Portrait Photo Container */}
                    <div className="creator-photo-box">
                      <div className="creator-splash-glow"></div>
                      {c.imageUrl ? (
                        <img src={resolveImg(c.imageUrl)} alt={c.name} className="creator-portrait-img" />
                      ) : (
                        <div style={{ fontSize: '4rem', opacity: 0.15 }}>👤</div>
                      )}
                    </div>

                    {/* Stats Box */}
                    <div className="creator-stats-box">
                      <div className="creator-stat-col">
                        <div className="stat-badge-icon">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        </div>
                        <div className="stat-details">
                          <span className="stat-num">{c.instagramFollowers || '0'}</span>
                          <span className="stat-txt">Followers</span>
                        </div>
                      </div>

                      <div className="stat-col-divider"></div>

                      <div className="creator-stat-col">
                        <div className="stat-badge-icon">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
                          </svg>
                        </div>
                        <div className="stat-details">
                          <span className="stat-num">{c.averageReach || '0'}</span>
                          <span className="stat-txt">Avg Reach</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Link Hint - Transparent background, card remains visible */}
                    <div className="creator-hover-overlay">
                      <div className="creator-social-btn">
                        <span>View Profile</span>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </a>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
