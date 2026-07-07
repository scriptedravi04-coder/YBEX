import { useState, useEffect } from "react";

import { motion, AnimatePresence } from 'motion/react';
import { submitContact } from '../../api/api';
import { contactDetails } from '../../content/siteData';
import App from "../../App";

const ICONS = { Email: '✉', Phone: '📞', Base: '📍' };

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isValidPhone = (v) => !v.trim() || /^[+]?[\d\s\-().]{7,15}$/.test(v.trim());

/* ── Field ── */
function Field({ name, type = 'text', placeholder, value, focused, error, onChange, onFocus, onBlur, required = true }) {
  const on = focused === name;
  const hasErr = !!error;
  return (
    <div style={{ position: 'relative' }}>
      <input
        name={name} type={type} placeholder={placeholder} value={value}
        onChange={onChange} onFocus={onFocus} onBlur={onBlur} required={required}
        style={{
          width: '100%', padding: '13px 16px',
          background: hasErr ? 'rgba(255,69,0,0.06)' : on ? 'rgba(228,241,65,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${hasErr ? 'rgba(255,69,0,0.55)' : on ? 'rgba(228,241,65,0.6)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px', color: '#fff', fontSize: '0.88rem', outline: 'none',
          boxSizing: 'border-box', fontFamily: 'inherit',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          boxShadow: hasErr ? '0 0 0 3px rgba(255,69,0,0.12)' : on ? '0 0 0 3px rgba(228,241,65,0.15)' : 'none',
        }}
      />
      <AnimatePresence>
        {on && !hasErr && (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.22 }}
            style={{ position: 'absolute', bottom: 1, left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg,transparent,#E4F141,transparent)', transformOrigin: 'center', borderRadius: '2px' }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasErr && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ margin: '4px 0 0 4px', fontSize: '0.72rem', color: '#ff6b35', fontWeight: 600 }}
          >{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Public Telephone SVG (vertical payphone) ── */
function PhoneDrop({ onComplete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ y: -500, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 55, damping: 14, mass: 1.6, delay: 0.15 }}
      onAnimationComplete={onComplete}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
    >
      {/* Straight cord from top */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 25, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '3px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.3))', borderRadius: '3px' }}
      />
      {/* Coiled wire — rounded loops */}
      <motion.svg
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top', display: 'block' }}
        width="28" height="40" viewBox="0 0 28 40"
      >
        {[0,1,2,3,4].map((i) => (
          <motion.ellipse
            key={i}
            cx="14" cy={5 + i * 8} rx={8 + (i % 3)} ry="4"
            fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.15 + i * 0.05, duration: 0.25 }}
          />
        ))}
      </motion.svg>
      
      {/* Clickable phone wrapper */}
      <a
        href="tel:+919950832099"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative' }}
      >
        {/* Vertical public telephone body */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ filter: 'drop-shadow(0 16px 48px rgba(228,241,65,0.4))', position: 'relative' }}
        >
          <svg width="110" height="160" viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main body */}
            <rect x="15" y="10" width="80" height="140" rx="14" fill="rgba(255,255,255,0.92)" />
            {/* Screen / display area */}
            <rect x="24" y="20" width="62" height="28" rx="6" fill="rgba(0,0,0,0.75)" />
            {/* Screen glow */}
            <rect x="26" y="22" width="58" height="24" rx="5" fill="rgba(228,241,65,0.15)" />
            <text x="55" y="38" textAnchor="middle" fontSize="9" fill="rgba(228,241,65,0.9)" fontFamily="monospace" fontWeight="bold">YBEX</text>
            {/* Coin slot */}
            <rect x="42" y="56" width="26" height="5" rx="2.5" fill="rgba(0,0,0,0.4)" />
            {/* Keypad dots 3x4 */}
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((k) => (
              <circle key={k} cx={32 + (k % 3) * 18} cy={72 + Math.floor(k / 3) * 14} r="5" fill="rgba(0,0,0,0.25)" />
            ))}
            {/* Handset cradle */}
            <rect x="22" y="128" width="66" height="16" rx="8" fill="rgba(0,0,0,0.18)" />
            {/* Handset */}
            <rect x="28" y="126" width="54" height="12" rx="6" fill="rgba(80,80,80,0.7)" />
            {/* Speaker grille lines */}
            {[0,1,2,3].map((l) => (
              <line key={l} x1={34 + l * 4} y1="130" x2={34 + l * 4} y2="136" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            ))}
            {/* Side cord hole */}
            <circle cx="15" cy="132" r="4" fill="rgba(0,0,0,0.3)" />
          </svg>
        </motion.div>

        {/* Floating Lining Motion Call Icon Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: hovered ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${hovered ? 1 : 0.7})`
        }}>
          <div style={{ position: 'relative', width: '68px', height: '68px' }}>
            <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx="34" cy="34" r="28" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" fill="rgba(0,0,0,0.88)" />
              <motion.circle
                cx="34"
                cy="34"
                r="28"
                stroke="#E4F141"
                strokeWidth="3"
                fill="none"
                strokeDasharray="175.8"
                animate={{
                  strokeDashoffset: [175.8, 0, -175.8],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#E4F141"
                animate={hovered ? {
                  rotate: [0, -15, 15, -15, 15, 0],
                  scale: [1, 1.15, 0.9, 1.15, 1]
                } : {}}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.58c0-.56-.45-1.04-1-1.04z" />
              </motion.svg>
            </div>
          </div>
          <div style={{
            background: '#E4F141',
            color: '#000',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '0.62rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 15px rgba(228, 241, 65, 0.45)',
            whiteSpace: 'nowrap'
          }}>
            CALL NOW
          </div>
        </div>
      </a>
      
      {/* Glow pulse ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.8, 1.8, 0.8], opacity: [0, 0.35, 0] }}
        transition={{ delay: 1.8, duration: 1.4, repeat: Infinity, repeatDelay: 1.8 }}
        style={{ position: 'absolute', bottom: '-8px', width: '90px', height: '90px', borderRadius: '50%', border: '2px solid rgba(228,241,65,0.55)', pointerEvents: 'none', zIndex: 1 }}
      />
    </motion.div>
  );
}

/* ── YBEX Speaking Text ── */
function YbexSpeaking({ show }) {
  const letters = 'YBEX'.split('');
  const words = ['Speaking', 'Listening', 'Building'];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="ybex-speaking-wrapper"
          style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
        >
          {/* YBEX letters */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {letters.map((l, i) => (
              <motion.span key={l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, color: '#e4f141', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}
              >{l}</motion.span>
            ))}
          </div>
          {/* Cycling word */}
          <div style={{ height: '2.2rem', overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.span key={wordIdx}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block', fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}
              >{words[wordIdx]}</motion.span>
            </AnimatePresence>
          </div>
          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '3px', background: 'linear-gradient(90deg, #e4f141, rgba(228,241,65,0.2))', borderRadius: '2px', transformOrigin: 'left', width: '100%' }}
          />
          {/* Pulse dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <motion.div animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e4f141', boxShadow: '0 0 12px rgba(228,241,65,0.8)' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Online · Ready to connect
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [focused, setFocused] = useState('');
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneDropDone, setPhoneDropDone] = useState(false);
  const [showForm, setShowForm] = useState(false);

  /* trigger form reveal after phone lands */
  useEffect(() => {
    if (phoneDropDone) {
      const t = setTimeout(() => setShowForm(true), 300);
      return () => clearTimeout(t);
    }
  }, [phoneDropDone]);

  const bind = (name) => ({
    value: form[name],
    onChange: (e) => { setForm(f => ({ ...f, [name]: e.target.value })); if (errors[name]) setErrors(er => ({ ...er, [name]: '' })); },
    onFocus: () => setFocused(name),
    onBlur:  () => { setFocused(''); validate(name, form[name]); },
    error: errors[name] || '',
  });

  const validate = (name, value) => {
    let msg = '';
    if (name === 'email' && value && !isValidEmail(value)) msg = 'Enter a valid email address';
    if (name === 'phone' && value && !isValidPhone(value)) msg = 'Enter a valid phone number';
    if (name === 'name' && !value.trim()) msg = 'Name is required';
    if (name === 'subject' && !value.trim()) msg = 'Project type is required';
    if (name === 'message' && !value.trim()) msg = 'Message is required';
    setErrors(er => ({ ...er, [name]: msg }));
    return !msg;
  };

  const validateAll = () => {
    const fields = ['name', 'email', 'subject', 'message'];
    const newErrors = {};
    let valid = true;
    fields.forEach(f => {
      let msg = '';
      if (f === 'email' && !isValidEmail(form[f])) { msg = 'Enter a valid email address'; valid = false; }
      else if (f !== 'email' && !form[f].trim()) { msg = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`; valid = false; }
      newErrors[f] = msg;
    });
    if (form.phone && !isValidPhone(form.phone)) { newErrors.phone = 'Enter a valid phone number'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true); setStatus(null);
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      setStatus('error');
    } finally { setLoading(false); }
  };

  return (
    <section className="page-shell contact-page-shell" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '3rem', paddingTop: '1.5rem' }}>

      {/* Background grid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(228,241,65,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(228,241,65,0.05) 1px,transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 40%,black 20%,transparent 100%)' }} />

      {/* Orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-10%', left: '20%', width: '700px', height: '600px', background: 'radial-gradient(ellipse,rgba(228,241,65,0.2) 0%,transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.1, 0.04] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ position: 'absolute', bottom: '-5%', right: '-2%', width: '500px', height: '400px', background: 'radial-gradient(ellipse,rgba(228,241,65,0.12) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -(12 + i * 3), 0], opacity: [0.04, 0.14 + (i % 3) * 0.04, 0.04], x: [0, i % 2 ? 9 : -9, 0] }}
          transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          style={{ position: 'absolute', left: `${5 + i * 9}%`, top: `${8 + (i % 5) * 18}%`, width: i % 3 === 0 ? '5px' : '3px', height: i % 3 === 0 ? '5px' : '3px', background: i % 4 === 0 ? 'rgba(255,69,0,0.5)' : 'rgba(228,241,65,0.7)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }}
        />
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ ROW 1: Phone animation | Contact form ══ */}
        <div className="contact-hero-grid">

          {/* ── LEFT: Phone + YBEX Speaking ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start', paddingTop: 0 }}>
            {/* Eyebrow */}
            <motion.p className="eyebrow"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              style={{ justifyContent: 'flex-start', margin: 0, width: 'fit-content' }}
            >
              <motion.span animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#E4F141', marginRight: '8px', verticalAlign: 'middle', boxShadow: '0 0 10px rgba(228,241,65,0.8)' }} />
              Contact
            </motion.p>

            <div className="contact-avatar-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(1.2rem, 3vw, 2.5rem)' }}>
              <div style={{ flexShrink: 0 }}>
                <PhoneDrop onComplete={() => setPhoneDropDone(true)} />
              </div>
              <YbexSpeaking show={phoneDropDone} />
            </div>
          </div>

          {/* ── RIGHT: Contact form ── */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: 'linear-gradient(160deg,rgba(228,241,65,0.08) 0%,rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(228,241,65,0.25)', borderRadius: '26px', padding: 'clamp(2rem,4vw,3rem)', backdropFilter: 'blur(28px)', boxShadow: '0 28px 72px rgba(0,0,0,0.55),inset 0 1px 0 rgba(228,241,65,0.1)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#E4F141,transparent)', pointerEvents: 'none' }} />
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.58rem', fontWeight: 800, color: 'rgba(228,241,65,0.85)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 5px' }}>Send enquiry</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)', margin: 0, lineHeight: 1.5 }}>Fill in the details and we'll get back to you.</p>
                </div>
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-row-half">
                    <Field name="name"  type="text"  placeholder="Your name"     focused={focused} {...bind('name')} />
                    <Field name="email" type="email" placeholder="Email address" focused={focused} {...bind('email')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-row-half">
                    <Field name="phone"   type="tel"  placeholder="Phone (optional)" focused={focused} required={false} {...bind('phone')} />
                    <Field name="subject" type="text" placeholder="Project type"     focused={focused} {...bind('subject')} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea name="message" rows={5} placeholder="Tell us what you want to build"
                      value={form.message}
                      onChange={(e) => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(er => ({ ...er, message: '' })); }}
                      onFocus={() => setFocused('message')}
                      onBlur={() => { setFocused(''); validate('message', form.message); }}
                      required
                      style={{ width: '100%', padding: '13px 16px', background: errors.message ? 'rgba(255,69,0,0.06)' : focused === 'message' ? 'rgba(228,241,65,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${errors.message ? 'rgba(255,69,0,0.55)' : focused === 'message' ? 'rgba(228,241,65,0.6)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.65, transition: 'border-color 0.2s,background 0.2s,box-shadow 0.2s', boxShadow: errors.message ? '0 0 0 3px rgba(255,69,0,0.12)' : focused === 'message' ? '0 0 0 3px rgba(228,241,65,0.15)' : 'none' }}
                    />
                    <AnimatePresence>
                      {focused === 'message' && !errors.message && (
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.22 }}
                          style={{ position: 'absolute', bottom: 1, left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg,transparent,#E4F141,transparent)', transformOrigin: 'center', borderRadius: '2px' }} />
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                          style={{ margin: '4px 0 0 4px', fontSize: '0.72rem', color: '#ff6b35', fontWeight: 600 }}>{errors.message}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="wait">
                    {status === 'success' && (
                      <motion.div key="ok" initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.35)', borderRadius: '12px', padding: '0.8rem 1rem', overflow: 'hidden' }}
                      >
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 16 }} style={{ fontSize: '1.1rem' }}>✅</motion.span>
                        <span style={{ color: '#E4F141', fontSize: '0.84rem', fontWeight: 600 }}>Message sent. We'll be in touch soon.</span>
                      </motion.div>
                    )}
                    {status === 'error' && (
                      <motion.div key="err" initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,69,0,0.25)', borderRadius: '12px', padding: '0.8rem 1rem', overflow: 'hidden' }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>⚠</span>
                        <span style={{ color: '#ff6b35', fontSize: '0.84rem', fontWeight: 600 }}>Something went wrong. Please try again.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button type="submit" disabled={loading}
                    whileHover={!loading ? { scale: 1.02, boxShadow: '0 16px 44px rgba(228,241,65,0.4)' } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{ width: '100%', padding: '14px', background: loading ? 'rgba(228,241,65,0.3)' : 'linear-gradient(135deg,#d4e130 0%,#E4F141 50%,#d4e130 100%)', border: 'none', borderRadius: '13px', color: '#000', fontSize: '0.9rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.05em', boxShadow: '0 8px 26px rgba(228,241,65,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.3s,box-shadow 0.3s', marginTop: '0.2rem' }}
                  >
                    {loading ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Sending...</>
                    ) : (
                      <>Send enquiry <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span></>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══ ROW 2: Map | Contact details ══ */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="contact-hero-grid"
              style={{ marginTop: 'clamp(2rem,4vw,3.5rem)', alignItems: 'stretch' }}
            >
              {/* ── LEFT: Map ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(228,241,65,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 4px' }}>Our Location</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Sector 63, Noida — Hyperfocus Building</p>
                  </div>
                  <motion.a href="https://maps.google.com/?q=Hyperfocus+Building+Sector+63+Noida" target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.04, background: 'rgba(228,241,65,0.2)' }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0.5rem 1.1rem', background: 'rgba(228,241,65,0.12)', border: '1px solid rgba(228,241,65,0.4)', borderRadius: '999px', color: '#E4F141', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em', transition: 'all 0.2s' }}
                  >📍 Open in Maps →</motion.a>
                </div>
                <div style={{ position: 'relative', borderRadius: '22px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.35)', height: '360px' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 1, pointerEvents: 'none' }} />
                  <iframe
                    title="YBEX Studio — Sector 63 Noida"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=77.3600%2C28.6150%2C77.3900%2C28.6350&layer=mapnik&marker=28.6250%2C77.3750"
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block', filter: 'invert(0.88) hue-rotate(180deg) saturate(0.55) brightness(0.82)' }}
                    loading="lazy" allowFullScreen
                  />
                  <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', zIndex: 2, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E4F141', flexShrink: 0, boxShadow: '0 0 10px rgba(228,241,65,0.8)' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>YBEX Studio</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)' }}>D-216 Hyperfocus Building, Sector 63, Noida</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Contact details ── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '360px' }}
              >
                {/* Main card — full height matching map */}
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  background: 'linear-gradient(160deg, rgba(228,241,65,0.07) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.3) 100%)',
                  border: '1px solid rgba(228,241,65,0.18)',
                  borderRadius: '22px', overflow: 'hidden',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
                  position: 'relative',
                }}>
                  {/* Top accent line */}
                  <div style={{ height: '2px', background: 'linear-gradient(90deg, #E4F141, rgba(228,241,65,0.2), transparent)', flexShrink: 0 }} />

                  {/* Glow orb */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(228,241,65,0.25) 0%, transparent 70%)', pointerEvents: 'none' }}
                  />

                  <div style={{ padding: '1.75rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

                    {/* Header */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                          style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E4F141', boxShadow: '0 0 10px rgba(228,241,65,0.9)', flexShrink: 0 }}
                        />
                        <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(228,241,65,0.85)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Get in touch</p>
                      </div>
                      <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.15 }}>
                        Let&apos;s start a<br /><span style={{ color: '#E4F141' }}>conversation.</span>
                      </h3>
                    </div>

                    {/* Contact detail rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      {contactDetails.map((item, i) => (
                        <motion.div key={item.label}
                          whileHover={{ x: 6, background: 'rgba(228,241,65,0.06)', transition: { duration: 0.18 } }}
                          style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0.85rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'default', transition: 'background 0.2s' }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.12, rotate: 5 }}
                            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(228,241,65,0.18) 0%, rgba(228,241,65,0.06) 100%)', border: '1px solid rgba(228,241,65,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', flexShrink: 0, boxShadow: '0 4px 16px rgba(228,241,65,0.15)' }}
                          >
                            {ICONS[item.label] || '📌'}
                          </motion.div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '3px' }}>{item.label}</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</div>
                          </div>
                          {/* Arrow indicator */}
                          <motion.div
                            initial={{ opacity: 0, x: -4 }} whileHover={{ opacity: 1, x: 0 }}
                            style={{ color: 'rgba(228,241,65,0.6)', fontSize: '0.85rem', flexShrink: 0 }}
                          >→</motion.div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(228,241,65,0.2), transparent)' }} />

                    {/* Response time + social strip */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <motion.div animate={{ scale: [1, 1.7, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                          style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E4F141', flexShrink: 0, boxShadow: '0 0 12px rgba(228,241,65,0.8)' }} />
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                          Usually responds within 24 hours · Mon–Sat, 11am–7pm IST
                        </span>
                      </div>

                      {/* Quick action buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Email us', href: `mailto:${contactDetails.find(d => d.label === 'Email')?.value || 'inf0@ybexmedia.com'}`, icon: '✉' },
                          { label: 'WhatsApp', href: 'https://wa.me/9950832099', icon: '💬' },
                          { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ybex-media/posts/?feedView=all', icon: '🔗' },
                        ].map(btn => (
                          <motion.a key={btn.label} href={btn.href} target="_blank" rel="noreferrer"
                            whileHover={{ scale: 1.06, background: 'rgba(228,241,65,0.15)', borderColor: 'rgba(228,241,65,0.5)' }}
                            whileTap={{ scale: 0.96 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', background: 'rgba(228,241,65,0.07)', border: '1px solid rgba(228,241,65,0.22)', borderRadius: '50px', color: '#E4F141', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.04em', transition: 'all 0.2s' }}
                          >
                            <span>{btn.icon}</span>{btn.label}
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .contact-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 4vw, 4rem);
          align-items: start;
        }
        @media (max-width: 1024px) {
          .contact-hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .contact-map-frame { height: 280px !important; }
        }
        @media (max-width: 500px) { .form-row-half { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) {
          .contact-avatar-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .ybex-speaking-wrapper {
            align-items: center !important;
            text-align: center !important;
          }
          .ybex-speaking-wrapper div {
            justify-content: center !important;
          }
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.22); }
        input:-webkit-autofill, input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(8,8,8,0.98) inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </section>
  );
}



