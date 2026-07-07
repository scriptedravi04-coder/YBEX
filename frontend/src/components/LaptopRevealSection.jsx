import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const ACCENT = '#E4F141';

export default function LaptopRevealSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to lid rotation: 90deg (closed flat) → 0deg (fully open)
  const lidRotation = useTransform(scrollYProgress, [0.15, 0.55], [90, 0]);
  // Shadow intensity increases as lid opens
  const lidShadowOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0, 0.6]);
  // Screen content fades in as lid opens
  const screenOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="laptop-reveal-section"
    >
      <style>{`
        .laptop-reveal-section {
          min-height: 110vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .laptop-wrapper {
          perspective: 1800px;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* The screen lid that rotates open */
        .laptop-lid {
          width: 100%;
          transform-origin: bottom center;
          position: relative;
          z-index: 2;
        }

        .laptop-screen-frame {
          background: #1a1a1a;
          border-radius: 16px 16px 0 0;
          border: 2px solid #333;
          border-bottom: none;
          overflow: hidden;
          position: relative;
          aspect-ratio: 16 / 10;
        }

        /* Bezel top bar with camera dot */
        .screen-bezel {
          height: 28px;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .camera-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #444;
          border: 1px solid #555;
        }

        /* Blurred dashboard content */
        .screen-content {
          position: relative;
          width: 100%;
          height: calc(100% - 28px);
          background: linear-gradient(135deg, #f5f0ff 0%, #e8e0f5 40%, #f0e6ff 100%);
          overflow: hidden;
        }

        .dashboard-blur {
          filter: blur(3px);
          opacity: 0.7;
          width: 100%;
          height: 100%;
          padding: 20px;
          display: flex;
          gap: 14px;
        }

        .dash-sidebar {
          width: 55px;
          background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 0;
          gap: 16px;
          flex-shrink: 0;
        }

        .dash-sidebar-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: rgba(255,255,255,0.2);
        }

        .dash-sidebar-icon.active {
          background: rgba(255,255,255,0.5);
        }

        .dash-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dash-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1a1a2e;
          font-family: 'Inter', sans-serif;
        }

        .dash-date-pills {
          display: flex;
          gap: 6px;
        }

        .dash-date-pill {
          padding: 3px 10px;
          background: #f0ecf5;
          border-radius: 6px;
          font-size: 0.6rem;
          color: #666;
          font-weight: 600;
        }

        .dash-stats-row {
          display: flex;
          gap: 10px;
        }

        .dash-stat-card {
          flex: 1;
          background: #ffffff;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .dash-stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dash-stat-icon.blue { background: #dbeafe; }
        .dash-stat-icon.orange { background: #fed7aa; }
        .dash-stat-icon.red { background: #fecaca; }
        .dash-stat-icon.purple { background: #e9d5ff; }

        .dash-stat-val {
          font-size: 1rem;
          font-weight: 800;
          color: #1a1a2e;
        }

        .dash-stat-label {
          font-size: 0.55rem;
          color: #888;
          font-weight: 600;
        }

        .dash-panels-row {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .dash-panel {
          flex: 1;
          background: #ffffff;
          border-radius: 10px;
          padding: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .dash-panel-header {
          font-size: 0.75rem;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 10px;
        }

        .dash-chart-placeholder {
          width: 100%;
          height: 60px;
          background: linear-gradient(90deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.15) 50%, rgba(124,58,237,0.05) 100%);
          border-radius: 8px;
        }

        .dash-donut-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 6px solid #dbeafe;
          border-top-color: #7c3aed;
          border-right-color: #f59e0b;
          margin: 0 auto;
        }

        /* Coming Soon Overlay */
        .coming-soon-overlay {
          position: absolute;
          inset: 28px 0 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          background: rgba(0,0,0,0.15);
          backdrop-filter: blur(1px);
        }

        .coming-soon-text {
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 60px rgba(228,241,65,0.3);
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        /* Laptop base / keyboard */
        .laptop-base {
          width: 104%;
          height: 14px;
          background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
          border-radius: 0 0 10px 10px;
          border: 2px solid #333;
          border-top: 1px solid #444;
          position: relative;
          z-index: 3;
        }

        .laptop-base::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 2px;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: #444;
          border-radius: 0 0 4px 4px;
        }

        /* Surface shadow beneath the laptop */
        .laptop-shadow {
          width: 90%;
          height: 20px;
          background: radial-gradient(ellipse, rgba(228,241,65,0.1) 0%, transparent 70%);
          filter: blur(12px);
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .laptop-reveal-section {
            min-height: 80vh;
            padding: 60px 16px;
          }
          .laptop-wrapper {
            max-width: 100%;
          }
          .dash-stats-row {
            flex-wrap: wrap;
          }
          .dash-stat-card {
            min-width: 45%;
          }
          .screen-bezel {
            height: 18px;
          }
          .camera-dot {
            width: 4px;
            height: 4px;
          }
        }
      `}</style>

      <div className="laptop-wrapper">
        {/* Laptop Lid (rotates open on scroll) */}
        <motion.div
          className="laptop-lid"
          style={{
            rotateX: lidRotation,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="laptop-screen-frame">
            {/* Bezel */}
            <div className="screen-bezel">
              <div className="camera-dot" />
            </div>

            {/* Dashboard Content (blurred) */}
            <motion.div className="screen-content" style={{ opacity: screenOpacity }}>
              <div className="dashboard-blur">
                {/* Sidebar */}
                <div className="dash-sidebar">
                  <div className="dash-sidebar-icon active" />
                  <div className="dash-sidebar-icon" />
                  <div className="dash-sidebar-icon" />
                  <div className="dash-sidebar-icon" />
                  <div className="dash-sidebar-icon" />
                </div>

                {/* Main Dashboard Area */}
                <div className="dash-main">
                  <div className="dash-header">
                    <div className="dash-title">Dashboard</div>
                    <div className="dash-date-pills">
                      <span className="dash-date-pill">Brands</span>
                      <span className="dash-date-pill">Creators</span>
                    </div>
                  </div>

                  <div className="dash-stats-row">
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon blue" />
                      <div>
                        <div className="dash-stat-val">500+</div>
                        <div className="dash-stat-label">Brand Partners</div>
                      </div>
                    </div>
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon orange" />
                      <div>
                        <div className="dash-stat-val">10K+</div>
                        <div className="dash-stat-label">Creators</div>
                      </div>
                    </div>
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon red" />
                      <div>
                        <div className="dash-stat-val">250M+</div>
                        <div className="dash-stat-label">Total Reach</div>
                      </div>
                    </div>
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon purple" />
                      <div>
                        <div className="dash-stat-val">98%</div>
                        <div className="dash-stat-label">Satisfaction</div>
                      </div>
                    </div>
                  </div>

                  <div className="dash-panels-row">
                    <div className="dash-panel">
                      <div className="dash-panel-header">Campaign Reports</div>
                      <div className="dash-chart-placeholder" />
                    </div>
                    <div className="dash-panel">
                      <div className="dash-panel-header">Analytics</div>
                      <div className="dash-donut-placeholder" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon overlay */}
              <div className="coming-soon-overlay">
                <span className="coming-soon-text">Coming Soon</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Laptop Base */}
        <motion.div
          className="laptop-base"
          style={{
            boxShadow: useTransform(
              lidShadowOpacity,
              (v) => `0 10px 40px rgba(0,0,0,${v})`
            ),
          }}
        />

        {/* Surface shadow */}
        <div className="laptop-shadow" />
      </div>
    </section>
  );
}
