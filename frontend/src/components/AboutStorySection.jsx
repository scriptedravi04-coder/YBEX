import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  aboutJoinStrip,
  aboutStats,
  aboutTimeline,
} from '../content/siteData';

// Resolve image URL — handles local /uploads/ paths and external URLs
function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) {
    // On localhost: Vite proxies /uploads → backend:5000, so use path directly
    // On IP access (mobile/LAN): point directly to backend port 5000
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `http://${window.location.hostname}:5000${url}`;
    }
    return url; // Vite proxy handles it on localhost
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
    if (!form.name.trim())  e.name  = 'Required';
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
        {label}{['name','email','phone','position'].includes(key) && <span style={{ color: '#a78bfa', marginLeft: '3px' }}>*</span>}
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

export default function AboutStorySection() {
  const [viewCount, setViewCount] = useState(47804210);
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance.get('/team-members')
      .then((res) => setTeamMembers(res.data.members || []))
      .catch(console.error)
      .finally(() => setTeamLoading(false));
  }, []);

  const formatNumber = (num) => num.toLocaleString();

  // Split by category
  const founders   = teamMembers.filter((m) => m.coreTeam === 'Founder');
  const powerhouse = teamMembers.filter((m) => m.coreTeam !== 'Founder');

  return (
    <>
      {showHiringModal && <HiringModal onClose={() => setShowHiringModal(false)} />}
      <section className="section-block about-story-hero">
        <div className="container">
          <motion.div
            className="about-hero-shell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="about-story-title">
              The <span>YBEX</span> Story
            </h1>

            <div className="about-big-stat">
              <strong>{formatNumber(viewCount)}</strong>
              <p>{aboutStats[0].label}</p>
            </div>

            <div className="about-mini-stats">
              {aboutStats.slice(1).map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-block about-story-journey">
        <div className="container about-timeline-shell">
          {aboutTimeline.map((item, index) => (
            <motion.article
              key={item.title}
              className={`about-timeline-row ${index % 2 ? 'is-reverse' : ''}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <div className="about-timeline-copy">
                <span className="about-phase">{item.phase}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="about-timeline-rule">
                  <span>{item.icon}</span>
                </div>
              </div>

              {index === 1 ? (
                <div className="about-growth-logos">
                  {item.images.map((image, imageIndex) => (
                    <div key={image} className={`about-logo-card about-logo-card-${imageIndex + 1}`}>
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : index === 2 ? (
                <div className="about-present-media">
                  {item.images.map((image, imageIndex) => (
                    <motion.div
                      key={image}
                      className={`about-office-card about-office-card-${imageIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: imageIndex * 0.1 }}
                    >
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="about-timeline-media">
                  {item.images.map((image, imageIndex) => (
                    <div key={image} className={`about-pill-image about-pill-image-${imageIndex + 1}`}>
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-block about-team-premium">
        <div className="container">
          <motion.div
            className="about-team-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-display">The Visionaries</h2>
            <div className="about-team-meta">
              <p className="section-subtitle">The Founders of YBEX</p>
              <div className="about-active-force">
                <span />
                Active Force
              </div>
            </div>
          </motion.div>

          {teamLoading ? (
            <div className="team-grid founders-grid">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{ height: '320px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}
                />
              ))}
            </div>
          ) : founders.length > 0 ? (
            <div className="team-grid founders-grid">
              {founders.map((member, index) => (
                <motion.article
                  key={member._id}
                  className="team-member"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                >
                  <div className="team-photo">
                    {resolveImg(member.imageUrl) ? (
                      <img src={resolveImg(member.imageUrl)} alt={member.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'rgba(255,255,255,0.04)' }}>👤</div>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role || member.coreTeam}</p>
                  {member.socialLink && (
                    <a
                      href={member.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-link"
                      aria-label={`${member.name} social profile`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          ) : null}

          <motion.div
            className="about-team-heading team-header-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-display">Our Powerhouse</h2>
            <div className="about-team-meta">
              <p className="section-subtitle">Meet the creatives behind the scenes</p>
            </div>
          </motion.div>

          {teamLoading ? (
            <div className="team-grid team-grid-powerhouse">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{ height: '280px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}
                />
              ))}
            </div>
          ) : powerhouse.length > 0 ? (
            <div className="team-grid team-grid-powerhouse">
              {powerhouse.map((member, index) => (
                <motion.article
                  key={member._id}
                  className="team-member"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                >
                  <div className="team-photo">
                    {resolveImg(member.imageUrl) ? (
                      <img src={resolveImg(member.imageUrl)} alt={member.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'rgba(255,255,255,0.04)' }}>👤</div>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role || member.coreTeam}</p>
                  {member.socialLink && (
                    <a
                      href={member.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-link"
                      aria-label={`${member.name} social profile`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-block about-join-section">
        <div className="container">
          <motion.div
            className="about-join-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="about-join-line" />
            <h2>
              You can also be a part of <span>YBEX</span>
            </h2>
            <Link to="/contact" className="button button-primary join-team-btn" onClick={e => { e.preventDefault(); setShowHiringModal(true); }}>
              Apply Now
            </Link>
          </motion.div>

          <div className="about-join-strip">
            {[...aboutJoinStrip, ...aboutJoinStrip].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
