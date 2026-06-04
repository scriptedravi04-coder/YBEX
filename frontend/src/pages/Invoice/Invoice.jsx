import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Calendar, User, Building, Check, ChevronRight, ChevronLeft,
  Download, Send, Plus, Trash2, Eye, Sparkles, Receipt, Landmark, FileCheck,
  AlertTriangle, X
} from 'lucide-react';

// ─── QR Validation Warning Modal ─────────────────────────────────────────────
function QRWarningModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'linear-gradient(160deg, #1a0a0a 0%, #0f0f0f 100%)',
          border: '1px solid rgba(255,61,16,0.4)',
          borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 50px 100px rgba(0,0,0,0.9), 0 0 60px rgba(255,61,16,0.2)'
        }}>
        {/* Header with gradient */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #FF3D10, #ff6b35, #FF3D10)'
        }} />
        <div style={{ padding: '2rem 1.75rem 1.5rem', textAlign: 'center' }}>
          {/* Animated Warning Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,61,16,0.3), rgba(255,61,16,0.1))',
              border: '2px solid rgba(255,61,16,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
            <AlertTriangle size={40} color="#FF3D10" />
          </motion.div>
          <h3 style={{
            fontSize: '1.25rem', fontWeight: 800, color: '#fff',
            margin: '0 0 0.75rem', letterSpacing: '-0.02em'
          }}>
            Invalid QR Code
          </h3>
          <p style={{
            fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6, margin: 0
          }}>
            {message}
          </p>
        </div>
        <div style={{
          padding: '0 1.75rem 1.75rem',
          display: 'flex', gap: '0.75rem'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            style={{
              flex: 1, padding: '0.875rem',
              background: 'linear-gradient(135deg, #FF3D10, #ff6b35)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer'
            }}>
            Got it
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

const steps = [
  { id: 1, title: 'The Basics', subtitle: 'Give it a number. Make it real.', icon: FileText },
  { id: 2, title: 'Who & Where', subtitle: 'Your details vs. Their details.', icon: User },
  { id: 3, title: "What's Sold", subtitle: 'List your items. Be descriptive.', icon: Receipt },
  { id: 4, title: 'Appearance', subtitle: 'Logo, signature & final touches.', icon: Sparkles },
  { id: 5, title: 'Accounts', subtitle: 'Where should they send money?', icon: Landmark },
  { id: 6, title: 'Review', subtitle: 'Preview before you send.', icon: Eye },
  { id: 7, title: 'Done', subtitle: 'Ready to download & send.', icon: FileCheck },
];

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({ invoiceData, setInvoiceData }) {
  const [showForOptions, setShowForOptions] = React.useState(false);

  const handleDateChange = (val) => {
    const due = val ? (() => {
      const d = new Date(val);
      d.setDate(d.getDate() + 10);
      return d.toISOString().split('T')[0];
    })() : '';
    setInvoiceData(p => ({ ...p, date: val, dueDate: due }));
  };

  const selectFor = (type) => {
    setInvoiceData(p => ({ ...p, invoiceFor: type }));
    setShowForOptions(false);
  };

  const forLabel = invoiceData.invoiceFor === 'brand' ? '🏢 Brand'
    : invoiceData.invoiceFor === 'influencer' ? '🌟 Influencer'
      : 'Select type...';

  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><FileText size={28} /></div>
        <div><h3>STEP 1: THE BASICS</h3><p>Give it a number. Make it real.</p></div>
      </div>
      <div className="form-section">
        <div className="form-header"><FileText size={20} /><h4>INVOICE INFO</h4></div>
        <div className="form-grid">
          <div className="form-field">
            <label>INVOICE NUMBER</label>
            <input type="text" value={invoiceData.invoiceNumber}
              onChange={e => setInvoiceData(p => ({ ...p, invoiceNumber: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>REFERENCE / PO NUMBER (OPTIONAL)</label>
            <input type="text" value={invoiceData.referenceNumber}
              onChange={e => setInvoiceData(p => ({ ...p, referenceNumber: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>DATE OF ISSUE</label>
            <div className="date-input-wrapper">
              <input type="date" value={invoiceData.date}
                onChange={e => handleDateChange(e.target.value)} />
              <Calendar size={18} className="date-icon" />
            </div>
          </div>
          <div className="form-field">
            <label>DUE DATE <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>(AUTO: +10 days)</span></label>
            <div className="date-input-wrapper">
              <input type="date" value={invoiceData.dueDate} readOnly
                style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.03)' }} />
              <Calendar size={18} className="date-icon" />
            </div>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '20px' }}>
          <div className="form-field">
            <label>CURRENCY</label>
            <select value={invoiceData.currency}
              onChange={e => setInvoiceData(p => ({ ...p, currency: e.target.value }))}>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="AED">AED (د.إ) - UAE Dirham</option>
            </select>
          </div>

          {/* Invoice For selector — inside form, no overflow */}
          <div className="form-field" style={{ position: 'relative' }}>
            <label>INVOICE FOR <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>(brand or influencer?)</span></label>
            <button
              type="button"
              onClick={() => setShowForOptions(v => !v)}
              style={{
                width: '100%', padding: '0.55rem 0.7rem',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${invoiceData.invoiceFor ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                color: invoiceData.invoiceFor ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.875rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}
            >
              <span>{forLabel}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', transition: 'transform 0.25s', display: 'inline-block', transform: showForOptions ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>

            {/* Dropdown — rendered inline, not absolute, to avoid overflow */}
            {showForOptions && (
              <div style={{
                marginTop: '6px',
                background: 'rgba(18,12,30,0.99)',
                border: '1px solid rgba(255,61,16,0.35)',
                borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                animation: 'step1DropIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                {[
                  { key: 'brand', icon: '🏢', label: 'Brand', desc: 'Invoice for a brand / company' },
                  { key: 'influencer', icon: '🌟', label: 'Influencer', desc: 'Invoice for an influencer / creator' },
                ].map((opt, idx) => (
                  <button key={opt.key} type="button" onClick={() => selectFor(opt.key)}
                    style={{
                      width: '100%', padding: '0.8rem 1rem',
                      background: invoiceData.invoiceFor === opt.key ? 'rgba(255,61,16,0.18)' : 'transparent',
                      border: 'none',
                      borderBottom: idx === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      color: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,16,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = invoiceData.invoiceFor === opt.key ? 'rgba(255,61,16,0.18)' : 'transparent'}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)' }}>{opt.desc}</div>
                    </div>
                    {invoiceData.invoiceFor === opt.key && <span style={{ color: '#FF3D10', fontWeight: 900 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Phone number — shown after selection */}
        {invoiceData.invoiceFor && (
          <div className="form-field" style={{ marginTop: '16px', animation: 'step1DropIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <label>{invoiceData.invoiceFor === 'brand' ? '🏢 BRAND PHONE NUMBER' : '🌟 INFLUENCER PHONE NUMBER'}</label>
            <input
              type="tel"
              value={invoiceData.clientPhone || ''}
              placeholder={invoiceData.invoiceFor === 'brand' ? 'Brand contact number' : 'Influencer phone number'}
              onChange={e => setInvoiceData(p => ({ ...p, clientPhone: e.target.value }))}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes step1DropIn {
          0%   { opacity: 0; transform: translateY(-8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({ invoiceData, updateInvoiceData }) {
  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><User size={28} /></div>
        <div><h3>STEP 2: WHO & WHERE</h3><p>Your details vs. Their details.</p></div>
      </div>
      <div className="billed-sections">
        <div className="form-section">
          <div className="form-header"><User size={20} /><h4>BILLED BY (YOU)</h4></div>
          <div className="form-field">
            <label>YOUR NAME / BUSINESS</label>
            <input type="text" value={invoiceData.billedBy.name}
              onChange={e => updateInvoiceData('billedBy', 'name', e.target.value)} />
          </div>
          <div className="form-field">
            <label>ADDRESS</label>
            <textarea value={invoiceData.billedBy.address} rows={3}
              onChange={e => updateInvoiceData('billedBy', 'address', e.target.value)} />
          </div>
          <div className="form-grid" style={{ marginTop: '0' }}>
            <div className="form-field">
              <label>EMAIL</label>
              <input type="email" value={invoiceData.billedBy.email}
                onChange={e => updateInvoiceData('billedBy', 'email', e.target.value)} />
            </div>
            <div className="form-field">
              <label>PHONE</label>
              <input type="tel" value={invoiceData.billedBy.phone}
                onChange={e => updateInvoiceData('billedBy', 'phone', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-header"><Building size={20} /><h4>BILLED TO (CLIENT)</h4></div>
          <div className="form-field">
            <label>CLIENT NAME</label>
            <input type="text" value={invoiceData.billedTo.name}
              onChange={e => updateInvoiceData('billedTo', 'name', e.target.value)} />
          </div>
          <div className="form-field">
            <label>CLIENT ADDRESS</label>
            <textarea value={invoiceData.billedTo.address} rows={3}
              onChange={e => updateInvoiceData('billedTo', 'address', e.target.value)} />
          </div>
          <div className="form-grid" style={{ marginTop: '0' }}>
            <div className="form-field">
              <label>CLIENT EMAIL</label>
              <input type="email" value={invoiceData.billedTo.email}
                onChange={e => updateInvoiceData('billedTo', 'email', e.target.value)} />
            </div>
            <div className="form-field">
              <label>CLIENT PHONE</label>
              <input type="tel" value={invoiceData.billedTo.phone}
                onChange={e => updateInvoiceData('billedTo', 'phone', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({ invoiceData, setInvoiceData, subtotal, discount, tax, grandTotal }) {
  const addItem = () => setInvoiceData(p => ({
    ...p, items: [...p.items, { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }]
  }));

  const removeItem = id => {
    if (invoiceData.items.length > 1)
      setInvoiceData(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
    else
      // If only 1 item, reset it instead of deleting
      setInvoiceData(p => ({ ...p, items: [{ id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }] }));
  };

  const updateItem = (id, field, value) => setInvoiceData(p => ({
    ...p, items: p.items.map(i => i.id === id ? { ...i, [field]: value } : i)
  }));

  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Receipt size={28} /></div>
        <div><h3>STEP 3: WHAT'S SOLD</h3><p>List your items. Be descriptive so they know exactly what they bought.</p></div>
      </div>
      <div className="form-section items-section">

        {/* Desktop table header - hidden on mobile */}
        <div className="items-table-header items-desktop-header">
          <span>DESCRIPTION</span><span>QTY</span><span>RATE</span><span>AMOUNT</span><span></span>
        </div>

        {invoiceData.items.map((item, idx) => (
          <div key={item.id} className="item-row-wrapper">
            {/* Mobile card layout */}
            <div className="item-mobile-card">
              <div className="item-mobile-top">
                <span className="item-mobile-num">Item #{idx + 1}</span>
                <button
                  className="remove-item-btn-mobile"
                  onClick={() => removeItem(item.id)}
                  title="Delete item"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
              <div className="item-mobile-desc-field">
                <label className="item-mobile-label">DESCRIPTION</label>
                <textarea
                  className="item-description-textarea"
                  value={item.description}
                  rows={4}
                  placeholder="e.g. Social Media Management for March 2026"
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                />
              </div>
              <div className="item-mobile-row">
                <div className="item-mobile-field">
                  <label className="item-mobile-label">QTY</label>
                  <input
                    type="number"
                    className="item-mobile-input"
                    value={item.quantity}
                    min="1"
                    placeholder="1"
                    onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="item-mobile-field" style={{ flex: 2 }}>
                  <label className="item-mobile-label">RATE (₹)</label>
                  <input
                    type="number"
                    className="item-mobile-input"
                    value={item.rate}
                    placeholder="0.00"
                    onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="item-mobile-field">
                  <label className="item-mobile-label">AMOUNT</label>
                  <div className="item-amount-display">
                    ₹{(item.quantity * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop row layout */}
            <div className="item-row item-desktop-row">
              <input type="text" className="item-description" value={item.description}
                placeholder="Service / product description..."
                onChange={e => updateItem(item.id, 'description', e.target.value)} />
              <input type="number" className="item-quantity" value={item.quantity} min="1"
                onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
              <input type="number" className="item-rate" value={item.rate}
                onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
              <span className="item-amount">
                ₹{(item.quantity * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <button className="remove-item-btn" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        <button className="add-item-btn" onClick={addItem}><Plus size={20} />Add Item</button>
        <div className="items-total">
          <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>

          {/* Discount input row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>Discount</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="number" min="0" max="100" value={invoiceData.discountPercent ?? 0}
                  onChange={e => setInvoiceData(p => ({ ...p, discountPercent: parseFloat(e.target.value) || 0 }))}
                  style={{ width: '52px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', padding: '0.2rem 0.4rem', fontSize: '0.82rem', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>%</span>
              </div>
            </div>
            <span style={{ fontSize: '0.875rem', color: '#00d26a', fontWeight: 600 }}>-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>GST</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="number" min="0" max="100" value={invoiceData.gstPercent}
                  onChange={e => setInvoiceData(p => ({ ...p, gstPercent: parseFloat(e.target.value) || 0 }))}
                  style={{ width: '52px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', padding: '0.2rem 0.4rem', fontSize: '0.82rem', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>%</span>
              </div>
            </div>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="total-row grand-total"><span>Total</span><span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Appearance ──────────────────────────────────────────────────────
function Step4({ invoiceData, setInvoiceData }) {
  const fileRef = React.useRef(null);
  const sigRef = React.useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInvoiceData(p => ({ ...p, appearance: { ...p.appearance, logoImage: ev.target.result, logoType: 'image', logoZoom: 100, logoPosX: 50, logoPosY: 50 } }));
    reader.readAsDataURL(file);
  };

  const handleSigUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInvoiceData(p => ({ ...p, appearance: { ...p.appearance, signatureImage: ev.target.result, signatureType: 'image', sigZoom: 100, sigPosX: 50, sigPosY: 50 } }));
    reader.readAsDataURL(file);
  };

  const ap = invoiceData.appearance;
  const setAp = (patch) => setInvoiceData(p => ({ ...p, appearance: { ...p.appearance, ...patch } }));

  const sliderStyle = { width: '100%', accentColor: '#FF3D10', cursor: 'pointer', height: '4px' };
  const sliderLabel = { fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' };
  const sliderVal = { fontSize: '0.72rem', fontWeight: 800, color: '#FF3D10' };

  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Sparkles size={28} /></div>
        <div><h3>STEP 4: APPEARANCE</h3><p>Logo, signature & final touches.</p></div>
      </div>

      {/* ── Logo Setup ── */}
      <div className="form-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
          <div className="form-header" style={{ margin: 0 }}><Building size={20} /><h4>LOGO SETUP</h4></div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['text', 'image'].map(t => (
              <button key={t} onClick={() => setAp({ logoType: t })}
                style={{ padding: '0.35rem 0.9rem', borderRadius: '8px', border: `1px solid ${ap.logoType === t ? '#FF3D10' : 'rgba(255,255,255,0.12)'}`, background: ap.logoType === t ? '#FF3D10' : 'rgba(255,255,255,0.04)', color: ap.logoType === t ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t === 'text' ? '✏ Text' : '🖼 Image'}
              </button>
            ))}
          </div>
        </div>

        {ap.logoType === 'text' ? (
          <div className="form-field">
            <label>ORGANIZATION NAME</label>
            <input type="text" value={ap.logoText} onChange={e => setAp({ logoText: e.target.value })} placeholder="e.g. YBEX" />
          </div>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            {ap.logoImage ? (
              <div>
                {/* Preview without box */}
                <div style={{ position: 'relative', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={ap.logoImage} alt="logo" style={{
                    maxHeight: `${(ap.logoZoom || 100) * 0.8}px`,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transform: `translate(${(ap.logoPosX || 50) - 50}%, ${(ap.logoPosY || 50) - 50}%)`,
                    transition: 'all 0.1s',
                  }} />
                  <button onClick={() => setAp({ logoImage: '' })}
                    style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', borderRadius: '50%', background: '#FF3D10', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>✕</button>
                </div>
                {/* Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={sliderLabel}>Zoom</span>
                      <span style={sliderVal}>{ap.logoZoom || 100}%</span>
                    </div>
                    <input type="range" min="30" max="300" value={ap.logoZoom || 100} style={sliderStyle}
                      onChange={e => setAp({ logoZoom: Number(e.target.value) })} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={sliderLabel}>H-Position</span>
                      <span style={sliderVal}>{ap.logoPosX || 50}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={ap.logoPosX || 50} style={sliderStyle}
                      onChange={e => setAp({ logoPosX: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.18)', borderRadius: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                🖼 Upload Logo Image
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Signature ── */}
      <div className="form-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
          <div className="form-header" style={{ margin: 0 }}><FileCheck size={20} /><h4>SIGNATURE</h4></div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['text', 'image'].map(t => (
              <button key={t} onClick={() => setAp({ signatureType: t })}
                style={{ padding: '0.35rem 0.9rem', borderRadius: '8px', border: `1px solid ${ap.signatureType === t ? '#FF3D10' : 'rgba(255,255,255,0.12)'}`, background: ap.signatureType === t ? '#FF3D10' : 'rgba(255,255,255,0.04)', color: ap.signatureType === t ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t === 'text' ? '✏ Text' : '🖼 Image'}
              </button>
            ))}
          </div>
        </div>

        {ap.signatureType === 'text' ? (
          <div>
            <div className="form-field">
              <label>AUTHORISED PERSON NAME</label>
              <input type="text" value={ap.signatureText} onChange={e => setAp({ signatureText: e.target.value })} placeholder="e.g. Ravi Sharma" />
            </div>
            {ap.signatureText && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Preview</div>
                <div style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: '1.6rem', color: '#222', background: '#fff', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
                  {ap.signatureText}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <input ref={sigRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSigUpload} />
            {ap.signatureImage ? (
              <div>
                <div style={{ position: 'relative', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={ap.signatureImage} alt="signature" style={{
                    maxHeight: `${(ap.sigZoom || 100) * 0.6}px`,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transform: `translate(${(ap.sigPosX || 50) - 50}%, ${(ap.sigPosY || 50) - 50}%)`,
                    transition: 'all 0.1s',
                  }} />
                  <button onClick={() => setAp({ signatureImage: '' })}
                    style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', borderRadius: '50%', background: '#FF3D10', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={sliderLabel}>Zoom</span>
                      <span style={sliderVal}>{ap.sigZoom || 100}%</span>
                    </div>
                    <input type="range" min="20" max="250" value={ap.sigZoom || 100} style={sliderStyle}
                      onChange={e => setAp({ sigZoom: Number(e.target.value) })} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={sliderLabel}>H-Position</span>
                      <span style={sliderVal}>{ap.sigPosX || 50}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={ap.sigPosX || 50} style={sliderStyle}
                      onChange={e => setAp({ sigPosX: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => sigRef.current?.click()}
                style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.18)', borderRadius: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                ✍ Upload Signature Image
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Final Touches ── */}
      <div className="form-section">
        <div className="form-header"><FileText size={20} /><h4>FINAL TOUCHES</h4></div>
        <div className="form-field">
          <label>NOTES</label>
          <textarea rows={2} value={ap.notes} onChange={e => setAp({ notes: e.target.value })} placeholder="Thank you for your business!" />
        </div>
        <div className="form-field">
          <label>TERMS</label>
          <textarea rows={2} value={ap.terms} onChange={e => setAp({ terms: e.target.value })} placeholder="Payment is due within 15 days." />
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Accounts ─────────────────────────────────────────────────────────
function Step5({ invoiceData, setInvoiceData, updateInvoiceData }) {
  const method = invoiceData.paymentMethod || 'none';
  const qrRef = React.useRef(null);
  const [qrWarning, setQrWarning] = useState({ isOpen: false, message: '' });

  const showQrWarning = (message) => {
    setQrWarning({ isOpen: true, message });
  };

  const closeQrWarning = () => {
    setQrWarning({ isOpen: false, message: '' });
    if (qrRef.current) qrRef.current.value = '';
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict validation: must be an image
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showQrWarning('Please upload a valid image file (PNG, JPG, or WEBP only). Other file types are not accepted.');
      e.target.value = '';
      return;
    }

    // File size check (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showQrWarning('File size too large. Please upload a QR code image smaller than 2MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const img = new Image();

      img.onload = () => {
        // Create canvas for basic validation
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height, 300);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // ULTRA LENIENT validation - accepts ALL real payment QR codes
        // Only reject obviously wrong files (blank images, solid colors)
        let hasDarkPixels = false;
        let hasLightPixels = false;
        let totalBrightness = 0;
        let pixelCount = 0;

        // Sample a few pixels to check if image has content
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          pixelCount++;

          if (brightness < 120) hasDarkPixels = true;
          if (brightness > 140) hasLightPixels = true;
        }

        const avgBrightness = totalBrightness / pixelCount;

        // ONLY reject if:
        // 1. Image is completely blank (solid color)
        // 2. Image has no contrast at all
        const isBlankImage = !hasDarkPixels || !hasLightPixels || avgBrightness < 10 || avgBrightness > 245;

        if (isBlankImage) {
          showQrWarning(
            'This appears to be a blank or invalid image.\n\n' +
            'Please upload a valid QR code image from Google Pay, Paytm, or PhonePe.'
          );
          e.target.value = '';
          return;
        }

        // ACCEPT ALL OTHER IMAGES - Google Pay, Paytm, PhonePe QR codes will pass
        // Payment apps add branding/colors which is perfectly fine

        // SMART UPI ID extraction
        let extractedUpiId = '';

        // 1. Try to extract from filename first
        const fileName = file.name.toLowerCase().replace(/\.[^.]+$/, '');
        const upiPatterns = [
          /([a-z0-9._-]+@[a-z0-9_]+)/i,  // Standard UPI format
          /([a-z0-9._-]+@(oksbi|okhdfc|okicici|okaxis|paytm|oksbi))/i, // Specific handles
        ];

        for (const pattern of upiPatterns) {
          const match = pattern.exec(fileName);
          if (match) {
            extractedUpiId = match[1];
            break;
          }
        }

        // 2. If not found in filename, try to decode QR image data (basic check for common patterns)
        // Google Pay QR codes often contain merchant info
        // Paytm QR codes have specific patterns
        if (!extractedUpiId) {
          // Check for common UPI patterns in QR data by analyzing pixel patterns
          // This is a heuristic - payment QR codes typically have certain structures
          const qrDataString = fileName.replace(/[^a-z0-9@._-]/gi, '');
          const upiMatch = /([a-z0-9._-]+@[a-z0-9_]+)/i.exec(qrDataString);
          if (upiMatch) {
            extractedUpiId = upiMatch[1];
          }
        }

        // 3. Common default patterns for major apps
        if (!extractedUpiId) {
          // If filename contains app name, set a placeholder
          if (fileName.includes('gpay') || fileName.includes('google')) {
            extractedUpiId = 'yourname@oksbi'; // Most common Google Pay handle
          } else if (fileName.includes('paytm')) {
            extractedUpiId = 'yourname@paytm';
          } else if (fileName.includes('phonepe')) {
            extractedUpiId = 'yourname@ybl';
          }
        }

        updateInvoiceData('bankDetails', 'qrImage', dataUrl);

        // Auto-fill UPI ID if extracted
        if (extractedUpiId) {
          updateInvoiceData('bankDetails', 'upiId', extractedUpiId);
        }

        setInvoiceData(p => ({ ...p, paymentMethod: 'qr' }));
      };

      img.onerror = () => {
        showQrWarning('Failed to load the image. Please try uploading a different QR code image.');
        e.target.value = '';
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      showQrWarning('Failed to read the file. Please try again with a different image.');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Landmark size={28} /></div>
        <div><h3>STEP 5: ACCOUNTS</h3><p>Choose how your client should pay you.</p></div>
      </div>

      <div className="form-section">
        <div className="form-header"><Receipt size={20} /><h4>PAYMENT METHOD</h4></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            { key: 'qr', label: 'QR Code', icon: '▦', color: '#FF3D10' },
            { key: 'bank', label: 'Bank Transfer', icon: '🏦', color: '#FF3D10' },
            { key: 'upi', label: 'UPI', icon: '📱', color: '#00D26A' },
          ].map(opt => (
            <button key={opt.key}
              onClick={() => setInvoiceData(p => ({ ...p, paymentMethod: opt.key }))}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '1rem 0.5rem', background: method === opt.key ? opt.color : 'rgba(255,255,255,0.04)', border: `1px solid ${method === opt.key ? opt.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', color: method === opt.key ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', transition: 'all 0.2s', boxShadow: method === opt.key ? `0 4px 18px ${opt.color}40` : 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* QR Code Upload */}
        {method === 'qr' && (
          <div>
            <input ref={qrRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleQrUpload} />
            {invoiceData.bankDetails.qrImage ? (
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={invoiceData.bankDetails.qrImage} alt="QR Code" style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.1)', background: '#fff', padding: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>QR Code Uploaded ✓</div>
                    <div className="form-field" style={{ marginBottom: '0.5rem' }}>
                      <label>UPI ID <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(shown below QR on invoice)</span></label>
                      <input
                        type="text"
                        value={invoiceData.bankDetails.upiId || ''}
                        placeholder={invoiceData.bankDetails.upiId ? '' : "Enter your UPI ID (e.g., name@upi) — auto-filled from QR filename"}
                        style={{
                          background: invoiceData.bankDetails.upiId ? 'rgba(0,200,100,0.08)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${invoiceData.bankDetails.upiId ? 'rgba(0,200,100,0.4)' : 'rgba(255,255,255,0.1)'}`,
                          color: invoiceData.bankDetails.upiId ? '#fff' : 'rgba(255,255,255,0.7)',
                        }}
                        onChange={e => updateInvoiceData('bankDetails', 'upiId', e.target.value)}
                      />
                      {invoiceData.bankDetails.upiId && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            fontSize: '0.7rem',
                            color: '#4ade80',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                          <Check size={12} /> UPI ID ready — shown on invoice
                        </motion.div>
                      )}
                    </div>
                    <button onClick={() => { updateInvoiceData('bankDetails', 'qrImage', ''); }}
                      style={{ padding: '5px 12px', background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '7px', color: '#ff6b6b', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      ✕ Remove QR
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => qrRef.current?.click()}
                style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,61,16,0.4)', borderRadius: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '2rem' }}>▦</span>
                <span style={{ fontWeight: 700, color: '#FF3D10' }}>Upload QR Code Image</span>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>PNG, JPG, WEBP — your payment QR code</span>
              </button>
            )}
          </div>
        )}

        {/* Bank Transfer */}
        {method === 'bank' && (
          <div>
            <div className="form-field">
              <label>OFFICIAL BANK NAME</label>
              <input type="text" value={invoiceData.bankDetails.bankName} placeholder="e.g. HDFC Bank Ltd."
                onChange={e => updateInvoiceData('bankDetails', 'bankName', e.target.value)} />
            </div>
            <div className="form-field">
              <label>ACCOUNT HOLDER NAME</label>
              <input type="text" value={invoiceData.bankDetails.accountName} placeholder="As per bank records"
                onChange={e => updateInvoiceData('bankDetails', 'accountName', e.target.value)} />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>ACCOUNT NUMBER</label>
                <input type="text" value={invoiceData.bankDetails.accountNumber} placeholder="0000 0000 00"
                  onChange={e => updateInvoiceData('bankDetails', 'accountNumber', e.target.value)} />
              </div>
              <div className="form-field">
                <label>IFSC CODE</label>
                <input type="text" value={invoiceData.bankDetails.ifsc} placeholder="IFSC000XXX"
                  onChange={e => updateInvoiceData('bankDetails', 'ifsc', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* UPI only */}
        {method === 'upi' && (
          <div className="form-field">
            <label>UPI ID</label>
            <input type="text" value={invoiceData.bankDetails.upiId || ''} placeholder="yourname@upi"
              onChange={e => updateInvoiceData('bankDetails', 'upiId', e.target.value)} />
          </div>
        )}
      </div>

      {/* QR Warning Modal */}
      <QRWarningModal
        isOpen={qrWarning.isOpen}
        onClose={closeQrWarning}
        message={qrWarning.message}
      />
    </div>
  );
}

// ─── Step 6: Review ──────────────────────────────────────────────────────────
function Step6({ invoiceData, grandTotal }) {
  return (
    <div className="step-content">
      <div className="step-header-card">
        <div className="step-icon-large"><Eye size={28} /></div>
        <div><h3>STEP 6: REVIEW</h3><p>Preview before you send. Make sure everything looks perfect.</p></div>
      </div>
      <div className="review-section">
        <div className="review-card">
          <div className="review-header"><Sparkles size={20} /><span>Your invoice is ready for review</span></div>
          <div className="review-items">
            <div className="review-item"><Check size={16} /><span>Invoice #{invoiceData.invoiceNumber}</span></div>
            <div className="review-item"><Check size={16} /><span>{invoiceData.items.length} item(s) added</span></div>
            <div className="review-item"><Check size={16} /><span>Total: ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div className="review-item"><Check size={16} /><span>{invoiceData.billedBy.name ? 'Billed By: ' + invoiceData.billedBy.name : 'Your details added'}</span></div>
            <div className="review-item"><Check size={16} /><span>{invoiceData.billedTo.name ? 'Billed To: ' + invoiceData.billedTo.name : 'Client details added'}</span></div>
          </div>
        </div>
        <p className="review-note">Click "Next Step" to proceed to download and share your invoice.</p>
      </div>
    </div>
  );
}

// ─── PDF Generator — captures the live preview div (pixel-perfect match) ─────
const generateInvoicePDF = async (invoiceData, subtotal, discount, tax, grandTotal, action = 'download', previewRef = null) => {
  // If we have a ref to the preview DOM node, use html2canvas for pixel-perfect output
  if (previewRef && previewRef.current) {
    const node = previewRef.current;
    
    // Save original styling to restore later
    const originalPosition = node.style.position;
    const originalLeft = node.style.left;
    const originalTop = node.style.top;
    
    // Temporarily position absolute at top-left so html2canvas captures it without offsets
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.top = '0';

    const canvas = await html2canvas(node, {
      scale: 3,           // high DPI — crisp text
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: node.scrollHeight,
      width: 794,
      height: node.scrollHeight,
    });

    // Restore original off-screen styles immediately
    node.style.position = originalPosition;
    node.style.left = originalLeft;
    node.style.top = originalTop;

    const imgData = canvas.toDataURL('image/png');
    const margin = 0;
    const pageW = 210; // Standard A4 width in mm
    const usableW = pageW - margin * 2;
    const imgH = (canvas.height / canvas.width) * usableW;
    const pageH = imgH + margin * 2; // Dynamically size height to match content exactly

    const doc = new jsPDF('p', 'mm', [pageW, pageH]);
    doc.addImage(imgData, 'PNG', margin, margin, usableW, imgH);

    if (action === 'download') {
      doc.save(`${invoiceData.invoiceNumber || 'Invoice'}.pdf`);
      return null;
    } else {
      return doc.output('blob');
    }
  }

  // Fallback: jsPDF text-based (used only if no previewRef)
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = 0;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, pageWidth, 50, 'F');
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 45, pageWidth, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`NO: ${invoiceData.invoiceNumber || 'INV-001'}`, pageWidth - margin, 32, { align: 'right' });

  yPos = 70;

  const leftColX = margin;
  const rightColX = pageWidth / 2 + 15;
  let leftY = yPos;
  let rightY = yPos;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('Bill To:', leftColX, leftY); leftY += 10;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(0, 0, 0);
  doc.text(invoiceData.billedTo.name || 'Client Name', leftColX, leftY); leftY += 7;
  doc.setFontSize(10); doc.setTextColor(80, 80, 80);
  if (invoiceData.billedTo.phone) { doc.text(invoiceData.billedTo.phone, leftColX, leftY); leftY += 6; }
  if (invoiceData.billedTo.address) {
    invoiceData.billedTo.address.split('\n').slice(0, 2).forEach(line => { doc.text(line, leftColX, leftY); leftY += 6; });
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('From:', rightColX, rightY); rightY += 10;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(0, 0, 0);
  doc.text(invoiceData.billedBy.name || 'Your Name', rightColX, rightY); rightY += 7;
  doc.setFontSize(10); doc.setTextColor(80, 80, 80);
  if (invoiceData.billedBy.phone) { doc.text(invoiceData.billedBy.phone, rightColX, rightY); rightY += 6; }
  if (invoiceData.billedBy.address) {
    invoiceData.billedBy.address.split('\n').slice(0, 2).forEach(line => { doc.text(line, rightColX, rightY); rightY += 6; });
  }

  yPos = Math.max(leftY, rightY) + 15;

  const dateStr = invoiceData.date
    ? new Date(invoiceData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${dateStr}`, margin, yPos); yPos += 18;

  const tableWidth = pageWidth - 2 * margin;
  const colDescWidth = 90, colQtyWidth = 18, colPriceWidth = 30, colTotalWidth = 32;
  const colDescX = margin, colQtyX = margin + colDescWidth, colPriceX = colQtyX + colQtyWidth, colTotalX = colPriceX + colPriceWidth;
  const tableStartY = yPos, rowHeight = 10;

  doc.setFillColor(0, 102, 204);
  doc.rect(margin, tableStartY - 6, tableWidth, 10, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
  doc.text('Description', colDescX + 3, tableStartY);
  doc.text('Qty', colQtyX + colQtyWidth / 2, tableStartY, { align: 'center' });
  doc.text('Rate', colPriceX + colPriceWidth / 2, tableStartY, { align: 'center' });
  doc.text('Amount', colTotalX + colTotalWidth / 2, tableStartY, { align: 'center' });
  yPos = tableStartY + 10;

  const fmtNum = v => Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  invoiceData.items.forEach((item, idx) => {
    if (idx % 2 === 1) { doc.setFillColor(240, 245, 250); doc.rect(margin, yPos - 6, tableWidth, rowHeight, 'F'); }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(0, 0, 0);
    doc.text((item.description || 'Service Item').substring(0, 45), colDescX + 3, yPos);
    doc.text(String(item.quantity), colQtyX + colQtyWidth / 2, yPos, { align: 'center' });
    doc.text('Rs.' + fmtNum(item.rate), colPriceX + colPriceWidth - 3, yPos, { align: 'right' });
    doc.text('Rs.' + fmtNum(Number(item.quantity) * Number(item.rate)), colTotalX + colTotalWidth - 3, yPos, { align: 'right' });
    yPos += rowHeight;
  });

  const tableEndY = yPos;
  doc.setDrawColor(0, 102, 204); doc.setLineWidth(0.5);
  doc.rect(margin, tableStartY - 6, tableWidth, tableEndY - tableStartY + 6);
  for (let i = 0; i < invoiceData.items.length; i++) doc.line(margin, tableStartY + 4 + i * rowHeight, margin + tableWidth, tableStartY + 4 + i * rowHeight);
  doc.line(colQtyX, tableStartY - 6, colQtyX, tableEndY);
  doc.line(colPriceX, tableStartY - 6, colPriceX, tableEndY);
  doc.line(colTotalX, tableStartY - 6, colTotalX, tableEndY);
  yPos = tableEndY + 10;

  const totalsWidth = 75, totalsX = pageWidth - margin - totalsWidth, totalsStartY = yPos;
  doc.setDrawColor(0, 102, 204); doc.setLineWidth(0.5);
  doc.rect(totalsX, totalsStartY - 6, totalsWidth, discount > 0 ? 48 : 40);
  const lx = totalsX + 5, vx = totalsX + totalsWidth - 5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  doc.text('Sub Total', lx, totalsStartY + 3); doc.text('Rs.' + fmtNum(subtotal), vx, totalsStartY + 3, { align: 'right' });

  let currentY = totalsStartY + 14;
  if (discount > 0) {
    doc.setTextColor(0, 128, 0); // Green for discount
    doc.text(`Discount (${invoiceData.discountPercent}%)`, lx, currentY);
    doc.text('-Rs.' + fmtNum(discount), vx, currentY, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    currentY += 10;
  }

  doc.text(`Tax (${invoiceData.gstPercent ?? 18}%)`, lx, currentY);
  doc.text('Rs.' + fmtNum(tax), vx, currentY, { align: 'right' });
  currentY += 6;

  doc.setDrawColor(200, 200, 200); doc.line(lx, currentY, vx, currentY);
  currentY += 10;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('TOTAL', lx, currentY); doc.text('Rs.' + fmtNum(grandTotal), vx, currentY, { align: 'right' });
  yPos = currentY + 20;

  if (invoiceData.bankDetails.accountNumber) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
    doc.text('Payment Information:', margin, yPos); yPos += 12;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
    const pl = margin, pv = margin + 40;
    doc.text('Bank:', pl, yPos); doc.text(invoiceData.bankDetails.bankName || '-', pv, yPos); yPos += 8;
    doc.text('Account:', pl, yPos); doc.text(invoiceData.bankDetails.accountNumber || '-', pv, yPos); yPos += 8;
    doc.text('IFSC:', pl, yPos); doc.text(invoiceData.bankDetails.ifsc || '-', pv, yPos); yPos += 8;
    if (invoiceData.bankDetails.branch) { doc.text('Branch:', pl, yPos); doc.text(invoiceData.bankDetails.branch, pv, yPos); yPos += 8; }
    doc.text('Email:', pl, yPos); doc.text(invoiceData.billedBy.email || '-', pv, yPos); yPos += 13;
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.setTextColor(0, 102, 204);
  doc.text('Thank You!', pageWidth / 2, yPos, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(150, 150, 150);
  doc.text('Generated by YBEX Invoice Maker', pageWidth / 2, pageHeight - 20, { align: 'center' });

  if (action === 'download') { doc.save(`${invoiceData.invoiceNumber || 'Invoice'}.pdf`); return null; }
  else { return doc.output('blob'); }
};

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ open, onClose, invoiceData, subtotal, discount, tax, grandTotal, previewRef }) {
  const [sharing, setSharing] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [shareError, setShareError] = React.useState(null);

  const opts = [
    { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', icon: '💬', supportsFiles: true },
    { id: 'gmail', label: 'Gmail', color: '#EA4335', icon: '📧', supportsFiles: true },
    { id: 'telegram', label: 'Telegram', color: '#0088CC', icon: '✈️', supportsFiles: true },
    { id: 'copy', label: copied ? 'Copied!' : 'Copy Link', color: '#FF3D10', icon: copied ? '✅' : '📋', supportsFiles: false },
  ];

  const handleShare = async (platform) => {
    setSharing(platform);
    setShareError(null);

    try {
      const blob = await generateInvoicePDF(invoiceData, subtotal, discount, tax, grandTotal, 'share', previewRef);
      const fileName = `${invoiceData.invoiceNumber || 'Invoice'}.pdf`;
      const text = `Invoice ${invoiceData.invoiceNumber || ''} from ${invoiceData.billedBy.name || 'YBEX'} — Amount: ₹${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      // Create the PDF file
      const file = new File([blob], fileName, { type: 'application/pdf' });

      // Check if native sharing with files is supported (mobile devices)
      const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });

      if (canShareFiles && platform !== 'copy') {
        // Use native share API with file - opens device share sheet with PDF attached
        try {
          await navigator.share({
            title: `Invoice ${invoiceData.invoiceNumber}`,
            text: text,
            files: [file]
          });
          onClose();
          return;
        } catch (shareErr) {
          // If native share fails or is cancelled, fall back to download
          console.log('Native share failed, falling back to download:', shareErr);
        }
      }

      // Download the PDF locally first
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);

      // Platform-specific sharing after download
      const enc = encodeURIComponent;
      const shareText = `${text}\n\n✅ Invoice PDF downloaded! Please attach the file from your Downloads folder.`;

      switch (platform) {
        case 'whatsapp':
          // For WhatsApp Web - open chat with pre-filled message
          // User needs to manually attach the downloaded PDF
          const whatsappUrl = `https://wa.me/?text=${enc(shareText)}`;
          window.open(whatsappUrl, '_blank');
          setShareError({
            platform: 'WhatsApp',
            message: 'PDF downloaded! Please attach the file manually in WhatsApp.'
          });
          break;

        case 'gmail':
          // Gmail compose with subject and body
          const gmailUrl = `mailto:?subject=${enc('Invoice ' + (invoiceData.invoiceNumber || ''))}&body=${enc(shareText)}`;
          window.open(gmailUrl, '_blank');
          setShareError({
            platform: 'Gmail',
            message: 'PDF downloaded! Please attach the file manually in Gmail.'
          });
          break;

        case 'telegram':
          // Telegram share
          const telegramUrl = `https://t.me/share/url?url=${enc(window.location.href)}&text=${enc(shareText)}`;
          window.open(telegramUrl, '_blank');
          setShareError({
            platform: 'Telegram',
            message: 'PDF downloaded! Please attach the file manually in Telegram.'
          });
          break;

        case 'copy':
          // Copy shareable text
          const fullText = `${text}\n\nInvoice PDF: ${window.location.href}`;
          await navigator.clipboard.writeText(fullText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          setShareError({
            platform: 'Clipboard',
            message: 'Invoice link copied! PDF is in your Downloads folder.'
          });
          break;

        default:
          break;
      }
    } catch (e) {
      console.error('Share error:', e);
      setShareError({
        platform: 'Error',
        message: 'Something went wrong. Please try downloading the PDF directly.'
      });
    }
    finally {
      setSharing(null);
    }
  };

  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '250px', background: 'radial-gradient(ellipse,rgba(255,61,16,0.15) 0%,transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '420px', background: 'linear-gradient(160deg,#0f0f0f 0%,#0a0a0a 100%)', border: '1px solid rgba(255,61,16,0.25)', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 48px 96px rgba(0,0,0,0.9)' }}>
        <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#FF3D10,transparent)' }} />
        <div style={{ padding: '1.5rem 1.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Share Invoice</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>PDF downloads + share link opens</div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem 1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          {opts.map(opt => (
            <button key={opt.id} onClick={() => handleShare(opt.id)} disabled={!!sharing}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '1rem 0.5rem', background: sharing === opt.id ? `${opt.color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${sharing === opt.id ? opt.color + '55' : 'rgba(255,255,255,0.08)'}`, borderRadius: '14px', cursor: sharing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: sharing && sharing !== opt.id ? 0.5 : 1 }}
              onMouseEnter={e => { if (!sharing) { e.currentTarget.style.background = `${opt.color}18`; e.currentTarget.style.borderColor = `${opt.color}55`; } }}
              onMouseLeave={e => { if (!sharing) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
            >
              <span style={{ fontSize: '1.6rem' }}>{sharing === opt.id ? '⏳' : opt.icon}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: sharing === opt.id ? opt.color : 'rgba(255,255,255,0.65)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{opt.label}</span>
            </button>
          ))}
        </div>
        {/* Status message display */}
        {shareError && (
          <div style={{ padding: '0 1.75rem 1rem' }}>
            <div style={{
              padding: '0.75rem 1rem',
              background: shareError.platform === 'Error' ? 'rgba(255,60,60,0.1)' : 'rgba(0,200,100,0.1)',
              border: `1px solid ${shareError.platform === 'Error' ? 'rgba(255,60,60,0.3)' : 'rgba(0,200,100,0.3)'}`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.1rem' }}>
                {shareError.platform === 'Error' ? '⚠️' : '✅'}
              </span>
              <span style={{
                fontSize: '0.8rem',
                color: shareError.platform === 'Error' ? '#ff6b6b' : '#4ade80',
                fontWeight: 500
              }}>
                {shareError.message}
              </span>
            </div>
          </div>
        )}

        {typeof navigator !== 'undefined' && navigator.share && (
          <div style={{ padding: '0 1.75rem 1.5rem' }}>
            <button onClick={() => handleShare('native')} disabled={!!sharing}
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,61,16,0.12)', border: '1px solid rgba(255,61,16,0.35)', borderRadius: '11px', color: '#FF3D10', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              📱 Share via Device (with PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 7: Done ────────────────────────────────────────────────────────────
function Step7({ invoiceData, subtotal, discount, tax, grandTotal, previewRef }) {
  const [shareOpen, setShareOpen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [dlAnim, setDlAnim] = React.useState(false);
  const [shareAnim, setShareAnim] = React.useState(false);

  const saveToBackend = async () => {
    if (saved) return;
    const payload = {
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate || null,
      referenceNumber: invoiceData.referenceNumber || null,
      invoiceType: invoiceData.invoiceType,
      currency: invoiceData.currency,
      placeOfSupply: invoiceData.placeOfSupply || null,
      invoiceFor: invoiceData.invoiceFor || '',
      clientPhone: invoiceData.clientPhone || '',
      clientUpiId: invoiceData.bankDetails?.upiId || '',
      billedBy: invoiceData.billedBy,
      billedTo: invoiceData.billedTo,
      items: invoiceData.items.map(item => ({
        id: typeof item.id === 'number' ? item.id : 1,
        description: item.description || 'Service Item',
        quantity: Number(item.quantity) || 1,
        rate: Number(item.rate) || 0,
        amount: Number(item.quantity) * Number(item.rate),
      })),
      bankDetails: invoiceData.bankDetails,
      subtotal: Number(subtotal),
      discountPercent: Number(invoiceData.discountPercent || 0),
      discount: Number(discount),
      tax: Number(tax),
      grandTotal: Number(grandTotal),
      status: 'generated',
    };

    try {
      try {
        await axiosInstance.post('/invoices', payload);
      } catch (e) {
        const isDuplicate =
          e.response?.status === 409 ||
          e.response?.status === 500 ||
          e.response?.data?.error?.includes?.('duplicate') ||
          e.response?.data?.error?.includes?.('11000');
        if (isDuplicate) {
          // Invoice already saved — not an error
        } else {
          throw e;
        }
      }
      setSaved(true);
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const handleDownload = async () => {
    setDlAnim(true);
    setTimeout(() => setDlAnim(false), 1200);
    await generateInvoicePDF(invoiceData, subtotal, discount, tax, grandTotal, 'download', previewRef);
    await saveToBackend();
  };

  const handleShare = async () => {
    setShareAnim(true);
    setTimeout(() => setShareAnim(false), 1200);
    await saveToBackend();
    setShareOpen(true);
  };

  // Premium particle burst positions - more particles, better distribution
  const particles = Array.from({ length: 20 }, (_, i) => ({
    angle: (i / 20) * 360 + (Math.random() * 20 - 10), // Add some randomness
    dist: 80 + Math.random() * 50,
    size: 3 + Math.random() * 6,
    color: ['#FF3D10', '#ff6b35', '#ffb347', '#fff', '#ff8c42', '#ff4757', '#ffa502'][i % 7],
    delay: i * 0.02,
  }));

  return (
    <>
      <style>{`
        @keyframes dlBurst {
          0%   { transform: scale(1); box-shadow: 0 4px 20px rgba(255,61,16,0.4); }
          20%  { transform: scale(0.95); box-shadow: 0 0 0 8px rgba(255,61,16,0.2); }
          40%  { transform: scale(1.15); box-shadow: 0 0 0 20px rgba(255,61,16,0.15), 0 0 0 40px rgba(255,61,16,0.08), 0 0 60px rgba(255,61,16,0.4); }
          60%  { transform: scale(1.08); box-shadow: 0 0 0 15px rgba(255,61,16,0.1), 0 0 0 30px rgba(255,61,16,0.05); }
          80%  { transform: scale(0.98); }
          100% { transform: scale(1); box-shadow: 0 8px 30px rgba(255,61,16,0.5); }
        }
        @keyframes shareBurst {
          0%   { transform: scale(1); box-shadow: 0 4px 20px rgba(255,255,255,0.1); }
          20%  { transform: scale(0.95); box-shadow: 0 0 0 8px rgba(255,255,255,0.15); }
          40%  { transform: scale(1.15); box-shadow: 0 0 0 20px rgba(255,255,255,0.12), 0 0 0 40px rgba(255,255,255,0.06), 0 0 60px rgba(255,255,255,0.3); }
          60%  { transform: scale(1.08); box-shadow: 0 0 0 15px rgba(255,255,255,0.08), 0 0 0 30px rgba(255,255,255,0.04); }
          80%  { transform: scale(0.98); }
          100% { transform: scale(1); box-shadow: 0 8px 30px rgba(255,255,255,0.2); }
        }
        @keyframes particleFly {
          0%   { opacity: 1; transform: translate(0, 0) scale(1); }
          50%  { opacity: 0.8; transform: translate(calc(var(--tx) * 0.5), calc(var(--ty) * 0.5)) scale(1.2); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
          40%  { transform: scale(1.4) rotate(10deg); opacity: 1; }
          60%  { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        .dl-btn-anim { 
          animation: dlBurst 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards, glowPulse 1.5s ease-in-out infinite 0.8s;
          background: linear-gradient(135deg, #FF3D10, #ff6b35) !important;
        }
        .share-btn-anim { 
          animation: shareBurst 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08)) !important;
          border-color: rgba(255,255,255,0.4) !important;
        }
        .dl-btn-anim:hover, .share-btn-anim:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        invoiceData={invoiceData}
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        grandTotal={grandTotal}
        previewRef={previewRef}
      />
      <div className="step-content">
        <div className="step-header-card success">
          <div className="step-icon-large success"><Check size={32} /></div>
          <div>
            <h3>ALL DONE!</h3>
            <p>Your invoice is ready. Download the PDF and send it off to get paid.</p>
          </div>
        </div>

        <div className="success-actions" style={{ position: 'relative' }}>
          {/* Download button with burst */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className={`button button-primary download-btn${dlAnim ? ' dl-btn-anim' : ''}`}
              onClick={handleDownload}
              style={{ position: 'relative', overflow: 'visible' }}
            >
              {dlAnim ? (
                <span style={{ animation: 'checkPop 0.4s ease-out forwards', display: 'inline-block' }}>✓</span>
              ) : (
                <Download size={20} />
              )}
              {dlAnim ? ' Downloading...' : ' Download PDF'}
            </button>
            {/* Premium Particles Effect */}
            {dlAnim && particles.map((p, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: `${p.size}px`, height: `${p.size}px`,
                borderRadius: '50%',
                background: p.color,
                pointerEvents: 'none',
                zIndex: 999,
                '--tx': `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`,
                '--ty': `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`,
                animation: `particleFly 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
                boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}80`,
              }} />
            ))}
          </div>

          {/* Share button with burst */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className={`button button-secondary share-btn${shareAnim ? ' share-btn-anim' : ''}`}
              onClick={handleShare}
              style={{ position: 'relative', overflow: 'visible' }}
            >
              {shareAnim ? (
                <span style={{ animation: 'checkPop 0.4s ease-out forwards', display: 'inline-block' }}>✓</span>
              ) : (
                <Send size={20} />
              )}
              {shareAnim ? ' Opening...' : ' Share Invoice'}
            </button>
            {/* Premium Share Particles Effect */}
            {shareAnim && particles.map((p, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: `${p.size}px`, height: `${p.size}px`,
                borderRadius: '50%',
                background: '#fff',
                pointerEvents: 'none',
                zIndex: 999,
                '--tx': `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`,
                '--ty': `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`,
                animation: `particleFly 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
                boxShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)',
              }} />
            ))}
          </div>
        </div>
        <div className="success-note"><p>(It is free, we promise!)</p></div>
      </div>
    </>
  );
}
// ─── Live Invoice Preview ─────────────────────────────────────────────────────
function InvoicePreview({ invoiceData, subtotal, tax, grandTotal, isPDF = false }) {
  const fmtMoney = (val) =>
    Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const dateStr = fmtDate(invoiceData.date) || fmtDate(new Date().toISOString().split('T')[0]);
  const dueDateStr = fmtDate(invoiceData.dueDate);

  const ap = invoiceData.appearance || {};
  const payMethod = invoiceData.paymentMethod || 'skip';
  const gstPct = invoiceData.gstPercent ?? 18;
  const discount = subtotal * ((invoiceData.discountPercent ?? 0) / 100);

  // Use a slightly larger and more readable font/padding scale for the PDF generation to prevent compressed overlapping text
  const S = isPDF
    ? { sectionGap: '24px', rowPad: '10px 8px', xs: '10px', sm: '11px', base: '13px', md: '15px', lg: '18px', xl: '26px' }
    : { sectionGap: '20px', rowPad: '8px 6px', xs: '7px', sm: '8px', base: '10px', md: '11px', lg: '14px', xl: '22px' };

  const fontFamily = "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  const letterSpacing = '-0.01em';
  const mainLineHeight = 1.5;

  return (
    <div style={{ fontFamily, color: '#000', fontSize: S.base, lineHeight: mainLineHeight, letterSpacing, background: '#fff', display: 'flex', flexDirection: 'column', minHeight: '100%', padding: isPDF ? '40px 32px' : '20px 16px' }}>

      {/* ── HEADER ── */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: S.sectionGap, 
        paddingBottom: '14px', 
        borderBottom: '2.5px solid #000',
        marginLeft: isPDF ? '-32px' : '-16px',
        marginRight: isPDF ? '-32px' : '-16px',
        paddingLeft: isPDF ? '32px' : '16px',
        paddingRight: isPDF ? '32px' : '16px'
      }}>
        <div>
          {ap.logoType === 'image' && ap.logoImage ? (
            <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
              <img src={ap.logoImage} alt="logo" style={{ height: `${(ap.logoZoom || 100) * 0.55}px`, maxWidth: '180px', objectFit: 'contain', display: 'block', transform: `translateX(${(ap.logoPosX || 50) - 50}%)` }} />
            </div>
          ) : (
            <div style={{ fontSize: S.xl, fontWeight: 900, color: '#000', letterSpacing: isPDF ? 'normal' : '-0.02em', marginBottom: '3px', lineHeight: 1.1 }}>
              {ap.logoText || invoiceData.billedBy.name || 'YBEX'}
            </div>
          )}
          <div style={{ fontSize: S.xs, color: '#666', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '4px' }}>Professional Billing Suite</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: S.xs, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px', fontWeight: 500 }}>Invoice No.</div>
          <div style={{ fontSize: S.lg, fontWeight: 700, color: '#000', letterSpacing: isPDF ? 'normal' : '-0.02em' }}>#{invoiceData.invoiceNumber || 'INV-001'}</div>
          {invoiceData.referenceNumber && <div style={{ fontSize: S.xs, color: '#999', marginTop: '3px' }}>REF: {invoiceData.referenceNumber}</div>}
          <div style={{ fontSize: S.xs, color: '#999', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{invoiceData.invoiceType || 'Standard'} Invoice</div>
        </div>
      </div>

      {/* ── SENDER / CLIENT ── */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: S.sectionGap, paddingBottom: '16px', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: S.xs, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Sender Details</div>
          <div style={{ fontWeight: 700, fontSize: S.md, color: '#000', marginBottom: '3px' }}>{invoiceData.billedBy.name || '—'}</div>
          {invoiceData.billedBy.address && <div style={{ color: '#555', fontSize: S.sm, whiteSpace: 'pre-line', lineHeight: 1.55 }}>{invoiceData.billedBy.address}</div>}
          {invoiceData.billedBy.email && <div style={{ color: '#777', fontSize: S.sm, marginTop: '3px' }}>{invoiceData.billedBy.email}</div>}
          {invoiceData.billedBy.phone && <div style={{ color: '#777', fontSize: S.sm }}>{invoiceData.billedBy.phone}</div>}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: S.xs, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Client Details</div>
          <div style={{ fontWeight: 700, fontSize: S.md, color: '#000', marginBottom: '3px' }}>{invoiceData.billedTo.name || '—'}</div>
          {invoiceData.billedTo.address && <div style={{ color: '#555', fontSize: S.sm, whiteSpace: 'pre-line', lineHeight: 1.55 }}>{invoiceData.billedTo.address}</div>}
          {invoiceData.billedTo.email && <div style={{ color: '#777', fontSize: S.sm, marginTop: '3px' }}>{invoiceData.billedTo.email}</div>}
          {invoiceData.billedTo.phone && <div style={{ color: '#777', fontSize: S.sm }}>{invoiceData.billedTo.phone}</div>}
        </div>
      </div>

      {/* ── DATES ── */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: S.sectionGap, paddingBottom: '14px', borderBottom: '1px solid #e8e8e8' }}>
        <div>
          <div style={{ fontSize: S.xs, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Issue Date</div>
          <div style={{ fontSize: S.md, fontWeight: 700, color: '#000' }}>{dateStr}</div>
        </div>
        {dueDateStr && (
          <div>
            <div style={{ fontSize: S.xs, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Payment Deadline</div>
            <div style={{ fontSize: S.md, fontWeight: 700, color: '#000' }}>{dueDateStr}</div>
          </div>
        )}
      </div>

      {/* ── ITEMS TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: S.sectionGap, fontSize: S.base }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #000', borderTop: '1px solid #000' }}>
            <th style={{ padding: S.rowPad, textAlign: 'left', fontWeight: 800, fontSize: S.sm, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</th>
            <th style={{ padding: S.rowPad, textAlign: 'center', fontWeight: 800, fontSize: S.sm, textTransform: 'uppercase', letterSpacing: '0.08em', width: '36px' }}>QTY</th>
            <th style={{ padding: S.rowPad, textAlign: 'right', fontWeight: 800, fontSize: S.sm, textTransform: 'uppercase', letterSpacing: '0.08em', width: isPDF ? '95px' : '70px' }}>Rate</th>
            <th style={{ padding: S.rowPad, textAlign: 'right', fontWeight: 800, fontSize: S.sm, textTransform: 'uppercase', letterSpacing: '0.08em', width: isPDF ? '115px' : '70px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: S.rowPad, color: '#222', fontWeight: 600 }}>{item.description || <span style={{ color: '#ccc' }}>—</span>}</td>
              <td style={{ padding: S.rowPad, textAlign: 'center', color: '#555' }}>{item.quantity}</td>
              <td style={{ padding: S.rowPad, textAlign: 'right', color: '#555' }}>INR {fmtMoney(item.rate)}</td>
              <td style={{ padding: S.rowPad, textAlign: 'right', color: '#000', fontWeight: 700 }}>INR {fmtMoney(Number(item.quantity) * Number(item.rate))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── TOTALS + PAYMENT ── */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: S.sectionGap, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {payMethod === 'bank' && invoiceData.bankDetails.accountNumber && (
            <div style={{ fontSize: S.sm, lineHeight: 1.8 }}>
              <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', fontSize: S.xs, color: '#666', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Bank Transfer Details</div>
              {invoiceData.bankDetails.bankName && <div><span style={{ color: '#888', fontSize: S.xs }}>Bank: </span>{invoiceData.bankDetails.bankName}</div>}
              {invoiceData.bankDetails.accountName && <div><span style={{ color: '#888', fontSize: S.xs }}>Account Name: </span>{invoiceData.bankDetails.accountName}</div>}
              {invoiceData.bankDetails.accountNumber && <div><span style={{ color: '#888', fontSize: S.xs }}>Account No: </span><strong>{invoiceData.bankDetails.accountNumber}</strong></div>}
              {invoiceData.bankDetails.ifsc && <div><span style={{ color: '#888', fontSize: S.xs }}>IFSC: </span>{invoiceData.bankDetails.ifsc}</div>}
            </div>
          )}
          {payMethod === 'upi' && invoiceData.bankDetails.upiId && (
            <div style={{ fontSize: S.sm }}>
              <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px', fontSize: S.xs, color: '#666', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>UPI Payment</div>
              <div style={{ fontWeight: 700, fontSize: S.md }}>{invoiceData.bankDetails.upiId}</div>
            </div>
          )}
          {payMethod === 'qr' && invoiceData.bankDetails.qrImage && (
            <div style={{ fontSize: S.sm }}>
              <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontSize: S.xs, color: '#666', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Scan to Pay</div>
              <img src={invoiceData.bankDetails.qrImage} alt="QR Code" style={{ width: '80px', height: '80px', objectFit: 'contain', display: 'block', marginBottom: '5px' }} />
              {invoiceData.bankDetails.upiId && <div style={{ fontWeight: 700, fontSize: S.sm, color: '#333' }}>{invoiceData.bankDetails.upiId}</div>}
            </div>
          )}
        </div>
        <div style={{ width: isPDF ? '220px' : '170px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: S.sm, color: '#666', borderBottom: '1px solid #eee' }}>
            <span>Subtotal</span><span>INR {fmtMoney(subtotal)}</span>
          </div>
          {invoiceData.discountPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: S.sm, color: '#00d26a', fontWeight: 600, borderBottom: '1px solid #eee' }}>
              <span>Discount ({invoiceData.discountPercent}%)</span><span>-INR {fmtMoney(discount)}</span>
            </div>
          )}
          {gstPct > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: S.sm, color: '#666', borderBottom: '1px solid #eee' }}>
              <span>GST ({gstPct}%)</span><span>INR {fmtMoney(tax)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: S.md, fontWeight: 900, color: '#000', borderTop: '2.5px solid #000', marginTop: '2px' }}>
            <span>TOTAL</span><span>INR {fmtMoney(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER: notes + signature ── */}
      <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px', display: 'flex', gap: '16px', alignItems: 'flex-end', paddingBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          {ap.notes && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: S.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '3px' }}>Notes</div>
              <div style={{ fontSize: S.sm, color: '#333', fontStyle: 'italic', lineHeight: 1.55 }}>{ap.notes}</div>
            </div>
          )}
          {ap.terms && (
            <div>
              <div style={{ fontSize: S.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: '3px' }}>Terms & Conditions</div>
              <div style={{ fontSize: S.sm, color: '#333', fontStyle: 'italic', lineHeight: 1.55 }}>{ap.terms}</div>
            </div>
          )}
        </div>
        <div style={{ width: '130px', textAlign: 'center' }}>
          {ap.signatureType === 'image' && ap.signatureImage ? (
            <div style={{ marginBottom: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50px' }}>
              <img src={ap.signatureImage} alt="signature" style={{ height: `${(ap.sigZoom || 100) * 0.5}px`, maxWidth: '130px', objectFit: 'contain', transform: `translateX(${(ap.sigPosX || 50) - 50}%)` }} />
            </div>
          ) : ap.signatureType === 'text' && ap.signatureText ? (
            <div style={{ fontFamily: "'Dancing Script','Brush Script MT','Segoe Script',cursive", fontSize: '22px', color: '#111', marginBottom: '6px', lineHeight: 1.2, minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {ap.signatureText}
            </div>
          ) : (
            <div style={{ height: '38px', marginBottom: '6px', borderBottom: '1px solid #ccc' }} />
          )}
          <div style={{ borderTop: '1.5px solid #000', paddingTop: '5px' }}>
            <div style={{ fontSize: S.xs, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>Authorised Signatory</div>
            <div style={{ fontSize: '6px', color: '#bbb', marginTop: '2px' }}>Computer generated — no physical signature required</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auto Invoice Number ─────────────────────────────────────────────────────
const generateInvoiceNumber = () => {
  const stored = localStorage.getItem('ybex_inv_counter');
  const count = stored ? parseInt(stored) + 1 : 1;
  localStorage.setItem('ybex_inv_counter', String(count));
  return `INV-${String(count).padStart(3, '0')}`;
};

const makeDefaultData = () => ({
  invoiceNumber: generateInvoiceNumber(),
  referenceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 10); return d.toISOString().split('T')[0]; })(),
  invoiceType: 'Standard',
  currency: 'INR',
  placeOfSupply: '',
  gstPercent: 18,
  discountPercent: 0,
  paymentMethod: 'skip',
  invoiceFor: '',
  clientPhone: '',
  billedBy: { name: '', address: '', pan: '', gstin: '', email: '', phone: '' },
  billedTo: { name: '', address: '', pan: '', gstin: '', email: '', phone: '' },
  items: [{ id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }],
  bankDetails: { accountName: '', accountNumber: '', bankName: '', ifsc: '', branch: '', upiId: '', qrImage: '' },
  appearance: {
    logoType: 'text', logoText: 'YBEX', logoImage: '',
    logoZoom: 100, logoPosX: 50,
    signatureType: 'text', signatureText: '', signatureImage: '',
    sigZoom: 100, sigPosX: 50,
    notes: 'Thank you for your business!',
    terms: 'Payment is due within 15 days.',
  },
});

// Helper to retrieve saved invoice data
const getInitialData = () => {
  const saved = localStorage.getItem('ybex_invoice_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing ybex_invoice_data from localStorage:', e);
    }
  }
  return makeDefaultData();
};

// ─── Main Invoice Component ───────────────────────────────────────────────────
export default function Invoice() {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('ybex_invoice_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  const previewRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState(getInitialData);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ybex_invoice_data', JSON.stringify(invoiceData));
  }, [invoiceData]);

  useEffect(() => {
    localStorage.setItem('ybex_invoice_step', String(currentStep));
  }, [currentStep]);

  const updateInvoiceData = useCallback((section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const handleReset = () => {
    if (window.confirm('Reset invoice? All data will be cleared and a new invoice number will be generated.')) {
      const fresh = makeDefaultData();
      localStorage.setItem('ybex_invoice_data', JSON.stringify(fresh));
      localStorage.setItem('ybex_invoice_step', '1');
      setInvoiceData(fresh);
      setCurrentStep(1);
    }
  };

  const subtotal = useMemo(() => invoiceData.items.reduce((s, i) => s + Number(i.quantity) * Number(i.rate), 0), [invoiceData.items]);
  const discount = useMemo(() => subtotal * ((invoiceData.discountPercent ?? 0) / 100), [subtotal, invoiceData.discountPercent]);
  const taxableAmount = useMemo(() => subtotal - discount, [subtotal, discount]);
  const tax = useMemo(() => taxableAmount * ((invoiceData.gstPercent ?? 18) / 100), [taxableAmount, invoiceData.gstPercent]);
  const grandTotal = useMemo(() => taxableAmount + tax, [taxableAmount, tax]);

  const goNext = () => setCurrentStep(s => Math.min(s + 1, 7));
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 invoiceData={invoiceData} setInvoiceData={setInvoiceData} />;
      case 2: return <Step2 invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />;
      case 3: return <Step3 invoiceData={invoiceData} setInvoiceData={setInvoiceData} subtotal={subtotal} discount={discount} tax={tax} grandTotal={grandTotal} />;
      case 4: return <Step4 invoiceData={invoiceData} setInvoiceData={setInvoiceData} />;
      case 5: return <Step5 invoiceData={invoiceData} setInvoiceData={setInvoiceData} updateInvoiceData={updateInvoiceData} />;
      case 6: return <Step6 invoiceData={invoiceData} grandTotal={grandTotal} />;
      case 7: return <Step7 invoiceData={invoiceData} subtotal={subtotal} discount={discount} tax={tax} grandTotal={grandTotal} previewRef={previewRef} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        /* ── Page shell ── */
        .inv-page {
          min-height: 100vh;
          background: #080808;
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }
        .inv-container { max-width: 1400px; margin: 0 auto; }

        /* ── Header ── */
        .inv-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .inv-header h1 {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.03em;
          margin: 0 0 0.4rem;
        }
        .inv-header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin: 0;
        }

        /* ── Two-column layout — true 50/50 ── */
        .inv-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* ── Form column - compact ── */
        .inv-form-col {
          min-width: 0;
        }

        /* ── Item mobile/desktop toggle ── */
        .item-mobile-card { display: none; }
        .item-desktop-row { display: grid; }
        .items-desktop-header { display: grid; }

        /* ── Mobile ── */
        @media (max-width: 960px) {
          .inv-layout {
            grid-template-columns: 1fr;
          }
          .inv-preview-col {
            display: none;
          }
          /* Show mobile card on tablet/phone too */
          .item-mobile-card { display: block; }
          .item-desktop-row { display: none !important; }
          .items-desktop-header { display: none !important; }
        }
        @media (max-width: 640px) {
          /* ── Page ── */
          .inv-page { padding: 1rem 0.75rem; }
          .inv-header h1 { font-size: 1.5rem; }
          .inv-header p { font-size: 0.8rem; }
          .inv-header { margin-bottom: 1.5rem; }
          .inv-form-card { padding: 1rem; }
          .success-actions { flex-direction: column; }
          .inv-steps { gap: 0.15rem; }
          .inv-step-pill { padding: 5px 10px; font-size: 0.62rem; }

          /* ── Step 1 & all form-grids: force single column ── */
          .form-grid { grid-template-columns: 1fr !important; gap: 0 !important; }

          /* ── Step 2: stack YOU then CLIENT, no side-by-side ── */
          .billed-sections {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }

          /* ── All form fields: full width, proper size ── */
          .form-field {
            margin-bottom: 0.85rem !important;
            width: 100% !important;
          }
          .form-field label {
            font-size: 0.65rem !important;
            letter-spacing: 0.09em !important;
            margin-bottom: 5px !important;
            display: block !important;
          }
          .form-field input,
          .form-field select,
          .form-field textarea {
            width: 100% !important;
            box-sizing: border-box !important;
            font-size: 0.95rem !important;
            padding: 0.7rem 0.85rem !important;
            border-radius: 10px !important;
            min-height: 46px !important;
          }
          .form-field textarea {
            min-height: 80px !important;
          }
          /* Date wrapper full width */
          .date-input-wrapper { width: 100% !important; }
          .date-input-wrapper input { width: 100% !important; box-sizing: border-box !important; }

          /* ── Step header ── */
          .step-header-card { padding: 0.85rem 1rem; gap: 0.7rem; }
          .step-header-card h3 { font-size: 0.78rem; }
          .step-header-card p { font-size: 0.72rem; }
          .step-icon-large { width: 40px; height: 40px; border-radius: 10px; }

          /* ── Nav buttons ── */
          .inv-nav-btn { padding: 0.6rem 1.1rem; font-size: 0.82rem; }
          .inv-step-counter { font-size: 0.7rem; }

          /* ── Totals ── */
          .total-row { font-size: 0.9rem; }
          .total-row.grand-total { font-size: 1rem; }

          /* ── Mobile item cards ── */
          .item-mobile-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,61,16,0.2);
            border-radius: 14px;
            padding: 1rem;
            margin-bottom: 1rem;
          }
          .item-mobile-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.9rem;
          }
          .item-mobile-num {
            font-size: 0.68rem;
            font-weight: 800;
            color: #FF3D10;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            background: rgba(255,61,16,0.1);
            padding: 4px 12px;
            border-radius: 999px;
            border: 1px solid rgba(255,61,16,0.3);
          }
          .remove-item-btn-mobile {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 6px 14px;
            background: rgba(255,60,60,0.1);
            border: 1px solid rgba(255,60,60,0.3);
            border-radius: 8px;
            color: #ff6b6b;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s;
          }
          .remove-item-btn-mobile:active {
            background: rgba(255,60,60,0.25);
            border-color: rgba(255,60,60,0.6);
          }
          .item-mobile-desc-field { margin-bottom: 0.85rem; }
          .item-mobile-label {
            display: block;
            font-size: 0.65rem;
            font-weight: 700;
            color: rgba(255,255,255,0.4);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .item-description-textarea {
            width: 100%;
            box-sizing: border-box;
            background: rgba(255,255,255,0.06);
            border: 1.5px solid rgba(255,255,255,0.14);
            border-radius: 10px;
            color: #fff;
            padding: 0.8rem 0.9rem;
            font-size: 0.95rem;
            outline: none;
            font-family: inherit;
            resize: vertical;
            min-height: 90px;
            line-height: 1.6;
            -webkit-appearance: none;
            touch-action: manipulation;
            display: block;
          }
          .item-description-textarea:focus {
            border-color: #FF3D10;
            background: rgba(255,61,16,0.04);
            box-shadow: 0 0 0 3px rgba(255,61,16,0.12);
          }
          .item-description-textarea::placeholder {
            color: rgba(255,255,255,0.28);
            font-size: 0.88rem;
          }
          /* QTY / RATE / AMOUNT row */
          .item-mobile-row {
            display: grid;
            grid-template-columns: 1fr 1.6fr 1fr;
            gap: 0.6rem;
            align-items: end;
          }
          .item-mobile-field {
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-width: 0;
          }
          .item-mobile-input {
            width: 100%;
            box-sizing: border-box;
            background: rgba(255,255,255,0.06);
            border: 1.5px solid rgba(255,255,255,0.12);
            border-radius: 8px;
            color: #fff;
            padding: 0.6rem 0.5rem;
            font-size: 0.9rem;
            outline: none;
            font-family: inherit;
            -webkit-appearance: none;
            text-align: center;
          }
          .item-mobile-input:focus {
            border-color: #FF3D10;
            background: rgba(255,61,16,0.04);
          }
          .item-mobile-input::placeholder { color: rgba(255,255,255,0.3); }
          /* Amount — fixed, never overflows */
          .item-amount-display {
            background: rgba(255,61,16,0.1);
            border: 1.5px solid rgba(255,61,16,0.25);
            border-radius: 8px;
            color: #FF3D10;
            padding: 0.6rem 0.4rem;
            font-size: 0.82rem;
            font-weight: 800;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 0;
          }
        }
        .inv-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        .inv-step-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.35);
          cursor: default;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .inv-step-pill.active {
          background: #FF3D10;
          border-color: #FF3D10;
          color: #fff;
          box-shadow: 0 0 18px rgba(255,61,16,0.45);
        }
        .inv-step-pill.done {
          background: rgba(0,180,100,0.12);
          border-color: rgba(0,180,100,0.4);
          color: #4ade80;
          cursor: pointer;
        }
        .inv-step-pill.done:hover {
          background: rgba(0,180,100,0.2);
        }
        .inv-step-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4ade80;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .inv-step-num {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          flex-shrink: 0;
        }
        .inv-step-pill.active .inv-step-num {
          background: rgba(255,255,255,0.25);
        }
        .inv-step-connector {
          width: 20px;
          height: 1.5px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .inv-step-connector.done { background: rgba(0,180,100,0.4); }

        /* ── Form card ── */
        .inv-form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 1.25rem;
        }

        /* ── Navigation ── */
        .inv-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .inv-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.65rem 1.4rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .inv-nav-prev {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .inv-nav-prev:hover { background: rgba(255,255,255,0.1); }
        .inv-nav-next {
          background: #FF3D10;
          color: #fff;
        }
        .inv-nav-next:hover { background: #e03000; }
        .inv-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .inv-step-counter { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

        /* ── Preview column ── */
        .inv-preview-col {
          position: sticky;
          top: 2rem;
        }
        .inv-preview-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .inv-preview-label::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF3D10;
          box-shadow: 0 0 8px #FF3D10;
          animation: inv-pulse 2s infinite;
        }
        @keyframes inv-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .inv-preview-paper {
          background: #fff;
          border-radius: 8px;
          padding: 28px 0px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4);
          min-height: 700px;
          font-family: Arial, sans-serif;
          color: #000;
          font-size: 11px;
          overflow: hidden;
        }

        /* ── Shared step styles (reused from original) ── */
        .step-content {}
        .step-header-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          background: rgba(255,61,16,0.08);
          border: 1px solid rgba(255,61,16,0.22);
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }
        .step-header-card.success {
          background: rgba(0,180,100,0.1);
          border-color: rgba(0,180,100,0.3);
        }
        .step-icon-large {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,61,16,0.15);
          border: 1px solid rgba(255,61,16,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF3D10;
          flex-shrink: 0;
        }
        .step-icon-large.success {
          background: rgba(0,180,100,0.2);
          border-color: rgba(0,180,100,0.4);
          color: #4ade80;
        }
        .step-header-card h3 {
          font-size: 0.82rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.05em;
          margin: 0 0 3px;
        }
        .step-header-card p {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        /* Form sections */
        .form-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .form-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.1rem;
          color: #FF3D10;
        }
        .form-header h4 {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin: 0;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 0.9rem;
        }
        .form-field label {
          font-size: 0.62rem;
          font-weight: 700;
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .form-field input,
        .form-field select,
        .form-field textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          padding: 0.55rem 0.7rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #FF3D10;
        }
        .form-field select option { background: #1a1a1a; }
        .date-input-wrapper { position: relative; }
        .date-input-wrapper input { width: 100%; box-sizing: border-box; }
        .date-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }

        /* Billed sections */
        .billed-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Items */
        .items-table-header {
          display: grid;
          grid-template-columns: 1fr 70px 90px 90px 36px;
          gap: 0.5rem;
          padding: 0.45rem 0.65rem;
          background: rgba(255,61,16,0.12);
          border-radius: 7px;
          margin-bottom: 0.4rem;
          font-size: 0.62rem;
          font-weight: 700;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .item-row {
          display: grid;
          grid-template-columns: 1fr 70px 90px 90px 36px;
          gap: 0.5rem;
          align-items: center;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .item-description,
        .item-quantity,
        .item-rate {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: #fff;
          padding: 0.4rem 0.55rem;
          font-size: 0.82rem;
          outline: none;
          font-family: inherit;
        }
        .item-description:focus,
        .item-quantity:focus,
        .item-rate:focus { border-color: #FF3D10; }
        .item-amount {
          font-size: 0.82rem;
          color: #FF3D10;
          font-weight: 600;
          text-align: right;
        }
        .remove-item-btn {
          background: rgba(255,60,60,0.1);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 6px;
          color: rgba(255,100,100,0.8);
          cursor: pointer;
          padding: 0.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-item-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .add-item-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 0.65rem;
          padding: 0.55rem 0.9rem;
          background: rgba(255,61,16,0.08);
          border: 1px dashed rgba(255,61,16,0.4);
          border-radius: 8px;
          color: #FF3D10;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .items-total {
          margin-top: 1.1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 0.9rem;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.3rem 0;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
        }
        .total-row.grand-total {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          border-top: 1px solid rgba(255,255,255,0.15);
          margin-top: 0.4rem;
          padding-top: 0.4rem;
        }

        /* Review */
        .review-card {
          background: rgba(255,61,16,0.07);
          border: 1px solid rgba(255,61,16,0.2);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .review-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #FF3D10;
          font-weight: 700;
          margin-bottom: 0.9rem;
        }
        .review-items { display: flex; flex-direction: column; gap: 0.45rem; }
        .review-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.72);
        }
        .review-item svg { color: #4ade80; flex-shrink: 0; }
        .review-note {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.32);
          margin-top: 0.9rem;
          text-align: center;
        }

        /* Step 6 */
        .success-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.4rem;
          flex-wrap: wrap;
        }
        .button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.8rem 1.6rem;
          border-radius: 11px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .button-primary { background: #FF3D10; color: #fff; }
        .button-primary:hover { background: #e03000; }
        .button-secondary {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.15) !important;
        }
        .button-secondary:hover { background: rgba(255,255,255,0.12); }
        .success-note { margin-top: 0.9rem; font-size: 0.78rem; color: rgba(255,255,255,0.28); }
      `}</style>

      <div className="inv-page">
        <div className="inv-container">

          {/* Header */}
          <div className="inv-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h1>Invoice Generator</h1>
                <p>Professional invoices in minutes — free, forever.</p>
              </div>
              <button
                onClick={handleReset}
                title="Reset invoice"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '10px',
                  background: 'rgba(255,61,16,0.1)',
                  border: '1.5px solid rgba(255,61,16,0.35)',
                  color: '#FF3D10', fontSize: '0.78rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,61,16,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,61,16,0.1)'; }}
              >
                ↺ New Invoice
              </button>
            </div>
          </div>

          {/* Two column */}
          <div className="inv-layout">

            {/* LEFT: Form */}
            <div className="inv-form-col">

              {/* Step indicator */}
              <div className="inv-steps">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  return (
                    <React.Fragment key={step.id}>
                      {idx > 0 && (
                        <div className={`inv-step-connector${isDone ? ' done' : ''}`} />
                      )}
                      <div
                        className={`inv-step-pill${isActive ? ' active' : isDone ? ' done' : ''}`}
                        onClick={() => isDone && setCurrentStep(step.id)}
                      >
                        {isDone ? (
                          <div className="inv-step-check">
                            <Check size={10} color="#fff" />
                          </div>
                        ) : (
                          <div className="inv-step-num">
                            <Icon size={10} />
                          </div>
                        )}
                        {step.title}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Step card */}
              <div className="inv-form-card">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="inv-nav">
                <button
                  className="inv-nav-btn inv-nav-prev"
                  onClick={goPrev}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft size={17} /> Previous
                </button>
                <span className="inv-step-counter">Step {currentStep} of {steps.length}</span>
                {currentStep < 7 ? (
                  <button className="inv-nav-btn inv-nav-next" onClick={goNext}>
                    Next Step <ChevronRight size={17} />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </div>

            {/* RIGHT: Live Preview (desktop) */}
            <div className="inv-preview-col">
              <div className="inv-preview-label">Live Preview</div>
              <div className="inv-preview-paper">
                <InvoicePreview
                  invoiceData={invoiceData}
                  subtotal={subtotal}
                  tax={tax}
                  grandTotal={grandTotal}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Hidden off-screen capture div — exact content size, no extra whitespace */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '-9999px',
            width: '794px',
            background: '#fff',
            zIndex: -1,
            pointerEvents: 'none',
            padding: '40px 0px',
            boxSizing: 'border-box',
          }}
          ref={previewRef}
        >
          <InvoicePreview
            invoiceData={invoiceData}
            subtotal={subtotal}
            tax={tax}
            grandTotal={grandTotal}
            isPDF={true}
          />
        </div>
      </div>
    </>
  );
}
