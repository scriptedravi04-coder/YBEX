import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";
import axiosInstance from "../../api/axiosInstance";
import { getUploadUrl } from "../../api/getUploadUrl";

const CATEGORIES = ['Brand Identity', 'Social Media', 'Campaigns', 'Product'];
const CAT_COLORS = {
  'Brand Identity': '#a78bfa',
  'Social Media':   '#60a5fa',
  'Campaigns':      '#f97316',
  'Product':        '#4ade80',
};

function getImageUrl(img) {
  return getUploadUrl(img);
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const bg = project.bgColor || '#111';
  const accent = project.accentColor || '#e4f141';
  const catColor = CAT_COLORS[project.category] || '#a78bfa';
  const imgUrl = getImageUrl(project.coverImage);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent}25` }}
      style={{ borderRadius: '20px', overflow: 'hidden', background: bg, border: `1px solid rgba(255,255,255,0.07)`, cursor: 'pointer', position: 'relative', transition: 'border-color 0.3s' }}
    >
      {/* Cover */}
      <div style={{ height: '220px', position: 'relative', overflow: 'hidden', background: bg }}>
        {imgUrl ? (
          <motion.img
            src={imgUrl}
            alt={project.brandName}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(ellipse at 50% 50%, ${accent}12 0%, transparent 70%)` }}>
            <div style={{ fontSize: '5rem', fontWeight: 900, color: accent, opacity: 0.15, letterSpacing: '-0.04em', userSelect: 'none' }}>
              {project.brandName?.toUpperCase()}
            </div>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 35%, ${bg}f0 100%)`, pointerEvents: 'none' }} />

        {/* Category badge */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <span style={{ background: `${catColor}22`, border: `1px solid ${catColor}55`, color: catColor, fontSize: '0.6rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', backdropFilter: 'blur(10px)' }}>
            {project.category}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
          {project.year}
        </div>

        {/* View Project hover overlay */}
        <AnimatePresence>
          {hovered && project.projectLink && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            >
              <a href={project.projectLink} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.75rem', background: accent, borderRadius: '50px', color: '#000', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '0.02em' }}
              >
                VIEW PROJECT →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: accent, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '6px' }}>
          {project.brandName}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '10px', lineHeight: 1.5 }}>
          {project.title}
        </div>
        {project.description && (
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </div>
        )}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {project.tagBadge && (
            <span style={{ background: `${accent}12`, border: `1px solid ${accent}28`, color: accent, fontSize: '0.62rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {project.tagBadge}
            </span>
          )}
          {project.stats && (
            <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
              {project.stats}
            </span>
          )}
          {project.projectLink && (
            <a href={project.projectLink} target="_blank" rel="noreferrer"
              style={{ marginLeft: 'auto', width: '28px', height: '28px', borderRadius: '50%', background: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: '0.75rem', textDecoration: 'none', flexShrink: 0 }}
              onClick={e => e.stopPropagation()}
            >↗</a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    axiosInstance.get('/projects')
      .then(({ data }) => setProjects(data.projects || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  const counts = {
    all: projects.length,
    ...CATEGORIES.reduce((a, c) => ({ ...a, [c]: projects.filter(p => p.category === c).length }), {}),
  };

  return (
    <section className="page-shell portfolio-page-container">
      <style>{`
        .portfolio-page-container {
          background-color: #000000 !important;
          background-image: radial-gradient(circle at 50% 0%, rgba(228, 241, 65, 0.18) 0%, rgba(228, 241, 65, 0.05) 30%, transparent 65%) !important;
          min-height: 100vh;
          padding-top: 0px !important;
          padding-bottom: 6rem;
          position: relative;
        }
      `}</style>
      <div className="container">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ paddingTop: '0px', paddingBottom: '3rem' }}
        >
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 1rem' }}>
            Work That<br />
            <span style={{ color: '#e4f141' }}>Speaks Loud.</span>
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.45)', maxWidth: '520px', lineHeight: 1.7, margin: 0 }}>
            7+ years. 50+ brands. Zero filler. हर काम में जान लगाई है।
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {[['50+', 'Brands Scaled'], ['7+', 'Years Running'], ['100M+', 'Views Generated'], ['∞', 'Ideas Executed']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#e4f141', letterSpacing: '-0.03em', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {['all', ...CATEGORIES].map(cat => {
            const isActive = activeFilter === cat;
            const col = cat === 'all' ? '#e4f141' : CAT_COLORS[cat];
            return (
              <motion.button key={cat}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '50px', cursor: 'pointer',
                  background: isActive ? (cat === 'all' ? '#e4f141' : `${col}20`) : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? col : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? (cat === 'all' ? '#000' : col) : 'rgba(255,255,255,0.5)',
                  fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em',
                  transition: 'all 0.2s',
                }}
              >
                {cat === 'all' ? 'ALL' : cat.toUpperCase()}
              </motion.button>
            );
          })}
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            {filtered.length} RESULTS
          </span>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <motion.div key={i}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                style={{ height: '360px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '6rem 2rem' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗂️</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: 600 }}>No projects yet</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginTop: '6px' }}>Check back soon — we're always building.</div>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            <AnimatePresence>
              {filtered.map((p, i) => (
                <ProjectCard key={p._id} project={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginTop: '5rem', textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(228,241,65,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>आपका brand अगला हो सकता है —</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 1.5rem', lineHeight: 1.1 }}>
              Let&apos;s Make Your<br /><span style={{ color: '#e4f141' }}>Brand Iconic.</span>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.a href="/get-started" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', background: '#e4f141', borderRadius: '50px', color: '#000', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '0.01em' }}
              >Start Your Project →</motion.a>
              <motion.a href="/services" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}
              >View All Services ↗</motion.a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
