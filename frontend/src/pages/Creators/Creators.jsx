import React, { useState } from 'react';
import { motion } from 'motion/react';

const creators = [
  {
    name: 'Ashu Ghai',
    category: 'Edutainment',
    instagram: 'https://www.instagram.com/ashu_ghai',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Mira Shah',
    category: 'Lifestyle',
    instagram: 'https://www.instagram.com/mira.shah',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Rohan Mehta',
    category: 'Entertainment',
    instagram: 'https://www.instagram.com/rohan.mehta',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Nia Kapoor',
    category: 'Comedy',
    instagram: 'https://www.instagram.com/nia.kapoor',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Harsh Dhaka',
    category: 'Infotainment',
    instagram: 'https://www.instagram.com/harsh.dhaka',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Anubhav Golia',
    category: 'Entertainment',
    instagram: 'https://www.instagram.com/anubhav.golia',
    image: 'https://images.unsplash.com/photo-1507539803626-fd09e7422390?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Hemant Yadav',
    category: 'VoxPop',
    instagram: 'https://www.instagram.com/hemant.yadav',
    image: 'https://images.unsplash.com/photo-1500595046891-e51df1bdc82f?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Naveen Yadav',
    category: 'Experiment',
    instagram: 'https://www.instagram.com/naveen.yadav',
    image: 'https://images.unsplash.com/photo-1508738773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Creators() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <main className="creators-page">
      <style>{`
        .creators-page { overflow: hidden; }

        .creators-hero {
          padding: 80px 20px 60px;
          text-align: center;
          background: linear-gradient(135deg, rgba(228,241,65,0.05) 0%, transparent 100%);
        }

        .creators-hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .creators-eyebrow {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #E4F141;
          margin-bottom: 16px;
        }

        .creators-hero h1 {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          line-height: 1.1;
        }

        .creators-hero h1 span {
          background: linear-gradient(135deg, #E4F141 0%, #E4F141 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .creators-intro {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .creators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
          padding: 80px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .creator-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          text-decoration: none;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: center;
        }

        .creator-card:hover {
          transform: translateY(-8px);
        }

        .creator-card-image {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .creator-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .creator-card:hover .creator-card-image img {
          transform: scale(1.08);
        }

        .creator-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
          transition: all 0.3s ease;
        }

        .creator-card:hover::before {
          background: linear-gradient(180deg, rgba(228,241,65,0.15) 0%, rgba(0,0,0,0.85) 100%);
        }

        .creator-card-copy {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          z-index: 2;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
        }

        .creator-card-copy p {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E4F141;
          margin-bottom: 8px;
          transform: translateY(12px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .creator-card:hover .creator-card-copy p {
          transform: translateY(0);
          opacity: 1;
        }

        .creator-card-copy h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.2;
          transform: translateY(0);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .creator-card:hover .creator-card-copy h2 {
          transform: translateY(-8px);
        }

        /* Social Link Indicator */
        .creator-card::after {
          content: '';
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(228,241,65,0.3);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .creator-card:hover::after {
          opacity: 1;
          background: rgba(228,241,65,0.2);
          border-color: rgba(228,241,65,0.6);
        }

        @media (max-width: 768px) {
          .creators-hero {
            padding: 60px 16px 40px;
          }

          .creators-hero h1 {
            font-size: 2rem;
          }

          .creators-intro {
            font-size: 1rem;
          }

          .creators-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            padding: 60px 16px;
          }

          .creator-card-copy {
            padding: 20px;
          }

          .creator-card-copy h2 {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .creators-hero {
            padding: 48px 12px 32px;
          }

          .creators-hero h1 {
            font-size: 1.75rem;
            margin-bottom: 16px;
          }

          .creators-intro {
            font-size: 0.95rem;
          }

          .creators-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
            padding: 48px 12px;
          }

          .creator-card-copy {
            padding: 16px;
          }

          .creator-card-copy h2 {
            font-size: 1rem;
          }

          .creator-card-copy p {
            font-size: 0.75rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="creators-hero">
        <motion.div 
          className="creators-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="creators-eyebrow">Meet Our</p>
          <h1>Exclusive <span>Talent</span></h1>
          <p className="creators-intro">
            Meet the architects of innovation. Our roster features elite talent driven by a singular obsession: turning your vision into a market-defining reality.
          </p>
        </motion.div>
      </section>

      {/* Creators Grid */}
      <section className="creators-grid">
        <motion.div
          style={{
            display: 'contents'
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {creators.map((creator, idx) => (
            <motion.a
              key={idx}
              href={creator.instagram}
              target="_blank"
              rel="noreferrer"
              className="creator-card"
              variants={itemVariants}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="creator-card-image">
                <img src={creator.image} alt={creator.name} loading="lazy" />
              </div>
              <div className="creator-card-copy">
                <p>{creator.category}</p>
                <h2>{creator.name}</h2>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
