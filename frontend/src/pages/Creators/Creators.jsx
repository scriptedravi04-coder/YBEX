import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import axiosInstance from '../../api/axiosInstance';

function resolveImg(url) {
  if (!url) return null;
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

function getIgHandle(url) {
  if (!url) return '';
  try {
    let clean = url.split('?')[0].replace(/\/$/, '');
    const parts = clean.split('/');
    const handle = parts[parts.length - 1];
    return handle ? `@${handle}` : '';
  } catch { return ''; }
}

const spring = { type: 'spring', stiffness: 150, damping: 22, mass: 0.8 };

export default function Creators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    axiosInstance.get('/creators')
      .then((res) => setCreators(res.data.creators || []))
      .catch((err) => console.error('Error fetching creators:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = creators.length;

  // Calculate the optimal rows and columns to keep aspect ratio near target (0.85)
  const getOptimalGrid = (N, width, height) => {
    if (N <= 0) return { rows: 1, cols: 1 };
    const isMobile = width <= 768;
    const headerPadding = isMobile ? 80 : 110;
    const availHeight = Math.max(200, height - headerPadding - 8);
    const availWidth = Math.max(200, width - 8);

    let bestR = 1;
    let bestC = N;
    let minDeviation = Infinity;
    const targetRatio = 0.85;

    for (let r = 1; r <= N; r++) {
      const c = Math.ceil(N / r);
      const cellW = availWidth / c;
      const cellH = availHeight / r;
      const ratio = cellW / cellH;
      const deviation = Math.abs(Math.log(ratio / targetRatio));

      if (deviation < minDeviation) {
        minDeviation = deviation;
        bestR = r;
        bestC = c;
      }
    }
    return { rows: bestR, cols: bestC };
  };

  const grid = getOptimalGrid(total, dimensions.width, dimensions.height);
  const numRows = grid.rows;

  // Distribute items into rows as evenly as possible
  const rows = [];
  let remaining = total;
  let startIndex = 0;
  for (let i = 0; i < numRows; i++) {
    const count = Math.ceil(remaining / (numRows - i));
    rows.push(creators.slice(startIndex, startIndex + count));
    startIndex += count;
    remaining -= count;
  }

  /* Identify active row */
  const getCellId = (c, ri, ci) => c._id || `${ri}-${ci}`;
  let hoveredRowIdx = -1;
  if (hoveredId !== null) {
    for (let ri = 0; ri < rows.length; ri++) {
      for (let ci = 0; ci < rows[ri].length; ci++) {
        if (getCellId(rows[ri][ci], ri, ci) === hoveredId) {
          hoveredRowIdx = ri;
          break;
        }
      }
      if (hoveredRowIdx !== -1) break;
    }
  }
  const hasHover = hoveredId !== null;

  /* Organic corner radii base */
  const radii = [
    '18px', '22px 14px 20px 14px', '14px 20px 14px 22px',
    '20px 16px 18px 16px', '16px 18px 16px 20px', '18px 14px 22px 16px',
    '22px 18px 14px 20px', '14px 22px 18px 14px', '20px 14px 16px 22px',
  ];

  return (
    <main className={`mx-page ${hasHover ? 'mx-has-hover' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .mx-page {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #060606;
          color: #fff;
          font-family: 'Inter', 'Montserrat', sans-serif;
          position: relative;
        }

        /* Film grain */
        .mx-page::before {
          content: '';
          position: fixed;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
        }

        /* ── Mosaic fills entire viewport ── */
        .mx-mosaic {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 110px 4px 4px 4px; /* Desktop navbar spacing */
          box-sizing: border-box;
        }

        .mx-row {
          display: flex;
          gap: 4px;
          min-height: 0;
          flex-shrink: 1;
          flex-basis: 0;
        }

        /* ── Cell ── */
        .mx-cell {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          min-width: 70px;
          min-height: 60px;
          flex-shrink: 1;
          flex-basis: 0;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .mx-cell-inner {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          border: 1.5px solid rgba(255,255,255,0.06);
          background: #0d0d0d;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .mx-cell.is-active .mx-cell-inner {
          border-color: rgba(228, 241, 65, 0.55);
          box-shadow:
            0 0 50px rgba(228, 241, 65, 0.1),
            0 0 80px rgba(228, 241, 65, 0.05),
            0 15px 50px rgba(0, 0, 0, 0.4);
        }

        /* ── Image ── */
        .mx-cell-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          display: block;
          image-rendering: auto;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transition: filter 0.45s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: filter;
        }

        /* When ANY cell is hovered, dim & desaturate the non-active ones */
        .mx-has-hover .mx-cell:not(.is-active) .mx-cell-img {
          filter: brightness(0.5) saturate(0.6);
        }

        /* Active cell image stays vivid and zooms in slightly */
        .mx-cell.is-active .mx-cell-img {
          filter: brightness(1.02) saturate(1.05) contrast(1.03);
          transform: scale(1.06);
        }

        .mx-cell-noimg {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          opacity: 0.06;
          background: #0d0d0d;
        }

        /* ── Vignette on all cells ── */
        .mx-cell-vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.3);
          border-radius: inherit;
        }

        /* ── Gradient overlay on hovered cell ── */
        .mx-cell-grad {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.4) 78%,
            rgba(0, 0, 0, 0.82) 100%
          );
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .mx-cell.is-active .mx-cell-grad {
          opacity: 1;
        }

        /* ── Info overlay (slides up) ── */
        .mx-cell-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 18px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 5px;
          transform: translateY(100%);
          opacity: 0;
          transition:
            transform 0.42s cubic-bezier(0.25, 1, 0.5, 1),
            opacity 0.32s ease;
        }

        .mx-cell.is-active .mx-cell-info {
          transform: translateY(0);
          opacity: 1;
        }

        .mx-cell-name {
          font-size: clamp(0.75rem, 1.4vw, 1.2rem);
          font-weight: 800;
          color: #E4F141;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
        }

        .mx-cell-handle {
          font-size: clamp(0.5rem, 0.85vw, 0.7rem);
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mx-cell-handle svg {
          color: rgba(228, 241, 65, 0.6);
          flex-shrink: 0;
        }

        /* ── IG circle badge ── */
        .mx-cell-ig {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 5;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.5);
          transition:
            opacity 0.3s ease 0.06s,
            transform 0.3s cubic-bezier(0.25, 1, 0.5, 1) 0.06s;
        }

        .mx-cell.is-active .mx-cell-ig {
          opacity: 1;
          transform: scale(1);
        }

        .mx-cell-ig svg {
          color: #E4F141;
        }

        /* ── Non-hovered cell subtle border highlight ── */
        .mx-has-hover .mx-cell:not(.is-active) .mx-cell-inner {
          border-color: rgba(255, 255, 255, 0.03);
        }

        /* ── Loading ── */
        .mx-load {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .mx-load-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E4F141;
          animation: mxPulse 1.2s ease-in-out infinite;
        }
        .mx-load-dot:nth-child(2) { animation-delay: 0.15s; }
        .mx-load-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes mxPulse {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .mx-empty {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.3);
          font-size: 1rem;
          font-weight: 500;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .mx-mosaic { gap: 3px; padding: 80px 3px 3px 3px; }
          .mx-row { gap: 3px; }
          .mx-cell { min-width: 50px; min-height: 45px; }
          .mx-cell-info {
            transform: translateY(0) !important;
            opacity: 1 !important;
            padding: 8px 10px !important;
            background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.85) 100%) !important;
          }
          .mx-cell-grad {
            opacity: 0.95 !important;
          }
        }
      `}</style>

      {/* Full-viewport mosaic — no heading */}
      {loading ? (
        <div className="mx-load">
          <div className="mx-load-dot" />
          <div className="mx-load-dot" />
          <div className="mx-load-dot" />
        </div>
      ) : creators.length === 0 ? (
        <div className="mx-empty">No creators published yet.</div>
      ) : (
        <div className="mx-mosaic">
          {rows.map((row, ri) => {
            const isActiveRow = hoveredRowIdx === ri;

            // Calculate starting global index for this row
            let previousItemsCount = 0;
            for (let prevRi = 0; prevRi < ri; prevRi++) {
              previousItemsCount += rows[prevRi].length;
            }

            return (
              <motion.div
                key={ri}
                className="mx-row"
                animate={{
                  flexGrow: !hasHover ? 1 : isActiveRow ? 2.0 : 0.9,
                }}
                transition={spring}
              >
                {row.map((c, ci) => {
                  const cellId = getCellId(c, ri, ci);
                  const isHov = hoveredId === cellId;
                  const globalIdx = previousItemsCount + ci;
                  const r = radii[globalIdx % radii.length];
                  const handle = getIgHandle(c.socialLink);

                  // Scale down border radius and elements dynamically based on total card count
                  const scaleFactor = total <= 8 ? 1.0 : total <= 15 ? 0.7 : total <= 30 ? 0.55 : 0.35;
                  const customRadius = r.split(' ').map(val => {
                    const num = parseInt(val);
                    return `${Math.round(num * scaleFactor)}px`;
                  }).join(' ');

                  return (
                    <motion.a
                      key={cellId}
                      href={c.socialLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className={`mx-cell ${isHov ? 'is-active' : ''}`}
                      animate={{
                        flexGrow: !hasHover ? 1 : isHov ? 2.5 : 1,
                      }}
                      initial={{ opacity: 0, scale: 0.94 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        flexGrow: spring,
                        opacity: { duration: 0.4, delay: globalIdx * 0.03 },
                        scale: { duration: 0.4, delay: globalIdx * 0.03 },
                      }}
                      onMouseEnter={() => setHoveredId(cellId)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="mx-cell-inner" style={{ borderRadius: customRadius }}>
                        {c.imageUrl ? (
                          <img
                            src={resolveImg(c.imageUrl)}
                            alt={c.name}
                            className="mx-cell-img"
                            loading="eager"
                            draggable={false}
                          />
                        ) : (
                          <div className="mx-cell-noimg">👤</div>
                        )}

                        <div className="mx-cell-vignette" />
                        <div className="mx-cell-grad" />

                        <div 
                          className="mx-cell-ig"
                          style={{
                            top: total > 30 ? '6px' : '10px',
                            right: total > 30 ? '6px' : '10px',
                            width: total > 30 ? '20px' : total > 15 ? '24px' : '30px',
                            height: total > 30 ? '20px' : total > 15 ? '24px' : '30px',
                          }}
                        >
                          <svg 
                            width={total > 30 ? "10" : total > 15 ? "12" : "14"} 
                            height={total > 30 ? "10" : total > 15 ? "12" : "14"} 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                        </div>

                        <div 
                          className="mx-cell-info"
                          style={{
                            padding: total > 30 ? '8px 10px' : total > 15 ? '12px 14px' : '16px 18px',
                            gap: total > 30 ? '2px' : '5px'
                          }}
                        >
                          <h3 className="mx-cell-name">{c.name}</h3>
                          {handle && (
                            <span className="mx-cell-handle">
                              <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                              </svg>
                              {handle}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
