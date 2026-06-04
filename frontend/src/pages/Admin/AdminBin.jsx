import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

// Premium admin colors/styling tokens
const ACCENT = '#E4F141';
const ACCENT_ORANGE = '#FF3D10';
const MUTED = 'rgba(255,255,255,0.45)';
const DIM = 'rgba(255,255,255,0.08)';
const BORDER = 'rgba(255,255,255,0.08)';

// Configuration for all 11 item types supported by the Recycle Bin
const ITEM_CONFIG = {
  USER: { icon: '👥', color: '#10b981', label: 'Admin User' },
  ENQUIRY: { icon: '📬', color: '#3b82f6', label: 'Enquiry/Contact' },
  TEAM_MEMBER: { icon: '🧑‍💼', color: '#a855f7', label: 'Team Member' },
  SUGGESTION: { icon: '💡', color: '#f59e0b', label: 'Suggestion' },
  BRAND: { icon: '🏷️', color: '#14b8a6', label: 'Partner Brand' },
  SUCCESS_STORY: { icon: '🏆', color: '#84cc16', label: 'Success Story' },
  INFLUENCER: { icon: '🌟', color: '#ec4899', label: 'Influencer' },
  HIRING: { icon: '💼', color: '#f97316', label: 'Job Application' },
  INVOICE: { icon: '🧾', color: '#06b6d4', label: 'Client Invoice' },
  PORTFOLIO: { icon: '🗂️', color: '#6366f1', label: 'Portfolio Project' },
  SCHOLARSHIP: { icon: '🎖️', color: '#ef4444', label: 'Scholarship App' }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.25, ease: 'easeIn' }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 350, damping: 26 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 15, 
    transition: { duration: 0.2 } 
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function AdminBin() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [clearingBin, setClearingBin] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [restoringItem, setRestoringItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  // Available filter tabs
  const filters = [
    { key: 'ALL', label: 'All Items', icon: '🗑️' },
    { key: 'PORTFOLIO', label: 'Portfolio', icon: '🗂️' },
    { key: 'INVOICE', label: 'Invoices', icon: '🧾' },
    { key: 'SCHOLARSHIP', label: 'Scholarships', icon: '🎖️' },
    { key: 'ENQUIRY', label: 'Enquiries', icon: '📬' },
    { key: 'HIRING', label: 'Hiring', icon: '💼' },
    { key: 'INFLUENCER', label: 'Influencers', icon: '🌟' },
    { key: 'BRAND', label: 'Brands', icon: '🏷️' },
    { key: 'TEAM_MEMBER', label: 'Team', icon: '🧑‍💼' },
    { key: 'SUGGESTION', label: 'Suggestions', icon: '💡' },
    { key: 'USER', label: 'Admins', icon: '👥' },
    { key: 'SUCCESS_STORY', label: 'Stories', icon: '🏆' }
  ];

  useEffect(() => {
    fetchBinItems();
    fetchBinStats();
  }, []);

  // Alert message helper auto-dismiss
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchBinItems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/bin');
      setItems(data.items || []);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load bin items');
    } finally {
      setLoading(false);
    }
  };

  const fetchBinStats = async () => {
    try {
      const { data } = await axiosInstance.get('/bin/stats');
      setStats(data.stats);
    } catch (e) {
      console.error('Failed to load bin stats:', e);
    }
  };

  const handleRestore = async (type, id, name) => {
    try {
      setRestoringItem(id);
      await axiosInstance.post(`/bin/restore/${type}/${id}`);
      setSuccessMsg(`"${name}" restored successfully!`);
      // Remove from list with animation
      setTimeout(() => {
        setItems(prev => prev.filter(item => item._id !== id));
        setRestoringItem(null);
        if (previewItem?._id === id) setPreviewItem(null);
        fetchBinStats();
      }, 300);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to restore item');
      setRestoringItem(null);
    }
  };

  const handlePermanentDelete = async (type, id, name) => {
    try {
      setDeletingItem(id);
      await axiosInstance.delete(`/bin/${type}/${id}`);
      setSuccessMsg(`"${name}" permanently deleted.`);
      setTimeout(() => {
        setItems(prev => prev.filter(item => item._id !== id));
        setDeletingItem(null);
        if (previewItem?._id === id) setPreviewItem(null);
        fetchBinStats();
      }, 300);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete item');
      setDeletingItem(null);
    }
  };

  const handleClearBin = async () => {
    try {
      setClearingBin(true);
      const { data } = await axiosInstance.delete('/bin/clear');
      setSuccessMsg(data.message || 'Bin cleared successfully.');
      setItems([]);
      fetchBinStats();
      setClearingBin(false);
      setShowClearConfirm(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to clear bin');
      setClearingBin(false);
    }
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter & Search Items
  const filteredItems = items
    .filter(item => filter === 'ALL' || item.itemType === filter)
    .filter(item => {
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase();
      const name = (item.itemName || '').toLowerCase();
      const type = (ITEM_CONFIG[item.itemType]?.label || '').toLowerCase();
      const deleter = (item.deletedBy?.name || '').toLowerCase();
      return name.includes(term) || type.includes(term) || deleter.includes(term);
    });

  // Get details fields based on item type
  const renderItemDetails = (item) => {
    switch (item.itemType) {
      case 'INVOICE':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', textAlign: 'left' }}>
              <div><strong style={{ color: '#fff' }}>Invoice Number:</strong><div style={{ color: MUTED }}>{item.invoiceNumber || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Client Name:</strong><div style={{ color: MUTED }}>{item.clientName || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Grand Total:</strong><div style={{ color: ACCENT, fontWeight: 700 }}>₹{item.grandTotal || 0}</div></div>
              <div><strong style={{ color: '#fff' }}>Status:</strong><div style={{ color: MUTED, textTransform: 'uppercase' }}>{item.status || 'N/A'}</div></div>
            </div>
            {item.items && item.items.length > 0 && (
              <div style={{ marginTop: '1.25rem', textAlign: 'left' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Items Breakdown:</strong>
                <div style={{ maxHeight: '120px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${BORDER}` }}>
                  {item.items.map((line, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: MUTED, padding: '4px 0', borderBottom: idx < item.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{line.description} (x{line.quantity})</span>
                      <span style={{ color: '#fff' }}>₹{line.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case 'PORTFOLIO':
        return (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><strong style={{ color: '#fff' }}>Brand Name:</strong><div style={{ color: MUTED }}>{item.brandName || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Category:</strong><div style={{ color: MUTED }}>{item.category || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Year:</strong><div style={{ color: MUTED }}>{item.year || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Tag:</strong><div style={{ color: MUTED }}>{item.tagBadge || 'N/A'}</div></div>
            </div>
            {item.description && (
              <div>
                <strong style={{ color: '#fff' }}>Description:</strong>
                <p style={{ color: MUTED, fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.4 }}>{item.description}</p>
              </div>
            )}
            {item.coverImage && (
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Cover Image Path:</strong>
                <code style={{ background: '#000', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: ACCENT }}>{item.coverImage}</code>
              </div>
            )}
          </div>
        );
      case 'SCHOLARSHIP':
        return (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><strong style={{ color: '#fff' }}>Email:</strong><div style={{ color: MUTED }}>{item.email || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Phone:</strong><div style={{ color: MUTED }}>{item.phone || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Track:</strong><div style={{ color: MUTED }}>{item.preferredTrack || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Portfolio:</strong><div style={{ color: MUTED }}>{item.portfolioUrl ? <a href={item.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: ACCENT }}>Link 🌐</a> : 'N/A'}</div></div>
            </div>
            {item.reason && (
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#fff' }}>Reason for Application:</strong>
                <p style={{ color: MUTED, fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.4 }}>{item.reason}</p>
              </div>
            )}
            {item.background && (
              <div>
                <strong style={{ color: '#fff' }}>Applicant Background:</strong>
                <p style={{ color: MUTED, fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.4 }}>{item.background}</p>
              </div>
            )}
          </div>
        );
      case 'ENQUIRY':
        return (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><strong style={{ color: '#fff' }}>Email:</strong><div style={{ color: MUTED }}>{item.email || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Phone:</strong><div style={{ color: MUTED }}>{item.phone || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Company:</strong><div style={{ color: MUTED }}>{item.company || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Subject:</strong><div style={{ color: MUTED }}>{item.subject || 'N/A'}</div></div>
            </div>
            {item.message && (
              <div>
                <strong style={{ color: '#fff' }}>Message:</strong>
                <p style={{ color: MUTED, fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.4 }}>{item.message}</p>
              </div>
            )}
          </div>
        );
      case 'HIRING':
        return (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><strong style={{ color: '#fff' }}>Email:</strong><div style={{ color: MUTED }}>{item.email || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Phone:</strong><div style={{ color: MUTED }}>{item.phone || 'N/A'}</div></div>
              <div><strong style={{ color: '#fff' }}>Position:</strong><div style={{ color: MUTED }}>{item.position || 'N/A'}</div></div>
              <div>
                <strong style={{ color: '#fff' }}>Links:</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  {item.resumeLink && <a href={item.resumeLink} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontSize: '0.8rem' }}>Resume 📄</a>}
                  {item.portfolioLink && <a href={item.portfolioLink} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontSize: '0.8rem' }}>Portfolio 🗂️</a>}
                </div>
              </div>
            </div>
            {item.message && (
              <div>
                <strong style={{ color: '#fff' }}>Message:</strong>
                <p style={{ color: MUTED, fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.4 }}>{item.message}</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            {Object.entries(item).map(([key, val]) => {
              if (['_id', 'itemType', 'itemName', 'deletedAt', 'deletedBy', 'createdAt', '__v'].includes(key)) return null;
              if (typeof val === 'object' && val !== null) return null;
              return (
                <div key={key} style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{key}:</strong>
                  <span style={{ color: MUTED, marginLeft: '8px' }}>{String(val)}</span>
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}>
        {/* Alerts / Success Notifications */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{
                position: 'fixed', top: '100px', right: '2rem', zIndex: 1100,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid rgba(16,185,129,0.3)',
                boxShadow: '0 8px 30px rgba(16,185,129,0.25)',
                color: '#fff', padding: '1rem 1.5rem', borderRadius: '14px',
                fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <span>✅</span> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: '#fff', margin: 0,
                letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <span style={{ filter: 'drop-shadow(0 0 10px rgba(255,61,16,0.3))' }}>🗑️</span>
                Recycle Bin
              </h1>
              <p style={{ fontSize: '0.92rem', color: MUTED, marginTop: '8px', maxWidth: '600px' }}>
                Soft-deleted items are safely cached here. Restoring them brings them back immediately; clearing permanently deletes database entries and unlinks server files.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { fetchBinItems(); fetchBinStats(); }}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`,
                  borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>🔄</span> Refresh
              </motion.button>

              {/* Clear Bin Button */}
              {items.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(239,68,68,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearConfirm(true)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(255,61,16,0.15) 0%, rgba(255,61,16,0.05) 100%)',
                    border: '1px solid rgba(255,61,16,0.35)',
                    borderRadius: '12px', color: '#ff3d10', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>🧹</span> Empty Trash
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Search & Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`,
              borderRadius: '16px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
            <input
              type="text"
              placeholder="Search deleted records by name, type, or deleter..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: '0.95rem', padding: '0.5rem 0'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '0.85rem' }}
              >✕ Clear</button>
            )}
          </motion.div>

          {/* Mini-Stats Grid */}
          {stats && stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '8px',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent'
              }}
            >
              {Object.entries(stats).filter(([key]) => key !== 'total' && countDocuments !== 0).map(([key, count]) => {
                if (count === 0) return null;
                const config = ITEM_CONFIG[key] || { icon: '📦', color: '#64748b', label: key };
                return (
                  <div
                    key={key}
                    onClick={() => setFilter(key)}
                    style={{
                      flex: '0 0 auto', background: filter === key ? `${config.color}15` : 'rgba(255,255,255,0.01)',
                      border: `1px solid ${filter === key ? config.color : BORDER}`,
                      borderRadius: '14px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px',
                      cursor: 'pointer', transition: 'all 0.22s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{config.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{config.label}</span>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 800, padding: '2px 6px', borderRadius: '20px',
                      background: config.color, color: '#000'
                    }}>{count}</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Scrollable Filters row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex', gap: '8px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '8px',
            scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent'
          }}
        >
          {filters.map((f) => {
            const isActive = filter === f.key;
            // Check if filter type has any items to display
            const count = f.key === 'ALL' ? items.length : items.filter(i => i.itemType === f.key).length;
            if (f.key !== 'ALL' && count === 0) return null;

            return (
              <motion.button
                key={f.key}
                onClick={() => setFilter(f.key)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  flex: '0 0 auto', padding: '0.6rem 1rem',
                  background: isActive ? `linear-gradient(135deg, ${ACCENT} 0%, #cbd5e1 150%)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? ACCENT : BORDER}`,
                  borderRadius: '12px', color: isActive ? '#000' : MUTED,
                  fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease'
                }}
              >
                <span>{f.icon}</span>
                {f.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Core Items Grid */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: `3px solid ${DIM}`, borderTopColor: ACCENT
              }}
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              padding: '2rem', textAlign: 'center', color: '#ff3d10',
              background: 'rgba(255,61,16,0.04)', border: '1px solid rgba(255,61,16,0.18)', borderRadius: '16px'
            }}
          >
            ⚠️ {error}
          </motion.div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '5rem 2rem', textAlign: 'center',
              border: `1px dashed ${BORDER}`, borderRadius: '24px', background: 'rgba(255,255,255,0.005)'
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'grayscale(1) opacity(0.3)' }}>🗑️</div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, margin: '0 0 8px 0' }}>
              No items match this filter
            </h3>
            <p style={{ color: MUTED, fontSize: '0.9rem', margin: 0 }}>
              {searchQuery ? 'Try adjusting your search query' : 'Your recycle bin is clean and organized!'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden" animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const config = ITEM_CONFIG[item.itemType] || { icon: '📦', color: '#64748b', label: item.itemType };
                const isDeleting = deletingItem === item._id;
                const isRestoring = restoringItem === item._id;

                return (
                  <motion.div
                    key={item._id}
                    variants={cardVariants}
                    layout
                    whileHover={{ y: -5, borderColor: config.color, boxShadow: `0 12px 30px rgba(0,0,0,0.4)` }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
                      border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '1.5rem',
                      position: 'relative', overflow: 'hidden', transition: 'border-color 0.25s ease'
                    }}
                  >
                    {/* Glow Accents */}
                    <div style={{
                      position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px',
                      background: config.color, filter: 'blur(35px)', opacity: 0.15, pointerEvents: 'none'
                    }} />

                    {/* Top Type Badge */}
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px', padding: '4px 10px',
                      background: `linear-gradient(135deg, ${config.color}20 0%, ${config.color}08 100%)`,
                      border: `1px solid ${config.color}35`, borderRadius: '30px',
                      fontSize: '0.72rem', fontWeight: 700, color: config.color,
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                      <span>{config.icon}</span>
                      {config.label}
                    </div>

                    {/* Icon + Title block */}
                    <div style={{ display: 'flex', gap: '1.1rem', marginBottom: '1.5rem', marginTop: '8px' }}>
                      <div style={{
                        width: '54px', height: '54px', borderRadius: '16px',
                        background: `linear-gradient(135deg, ${config.color}25 0%, ${config.color}08 100%)`,
                        border: `1px solid ${config.color}30`, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0
                      }}>
                        {config.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {item.itemName || 'Untitled Item'}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.78rem', color: MUTED, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📅 {formatDate(item.deletedAt)}
                          </span>
                          {item.deletedBy?.name && (
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                              👤 Deleted by: {item.deletedBy.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Panel */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* View Details / Preview Button */}
                      <button
                        onClick={() => setPreviewItem(item)}
                        style={{
                          width: '42px', height: '38px', borderRadius: '10px',
                          background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`,
                          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', transition: 'all 0.2s ease'
                        }}
                        title="Preview Details"
                      >
                        👁️
                      </button>

                      {/* Restore Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(16,185,129,0.18)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRestore(item.itemType, item._id, item.itemName)}
                        disabled={isRestoring || isDeleting}
                        style={{
                          flex: 1, padding: '0.6rem',
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.02) 100%)',
                          border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px',
                          color: '#10b981', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        {isRestoring ? '⏳ Restoring...' : '♻️ Restore'}
                      </motion.button>

                      {/* Permanent Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(239,68,68,0.18)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePermanentDelete(item.itemType, item._id, item.itemName)}
                        disabled={isRestoring || isDeleting}
                        style={{
                          flex: 1, padding: '0.6rem',
                          background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.02) 100%)',
                          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px',
                          color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        {isDeleting ? '⏳ Purging...' : '💥 Purge'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 1200
              }}
              onClick={() => !clearingBin && setShowClearConfirm(false)}
            >
              <motion.div
                variants={modalVariants}
                style={{
                  background: 'linear-gradient(135deg, #121212 0%, #080808 100%)',
                  border: `1px solid ${BORDER}`, borderRadius: '24px', padding: '2.5rem',
                  maxWidth: '440px', width: '92%', textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'rgba(255,61,16,0.12)', border: '2px solid rgba(255,61,16,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(255,61,16,0.3))'
                }}>
                  ⚠️
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
                  Empty Recycle Bin?
                </h3>
                <p style={{ fontSize: '0.9rem', color: MUTED, margin: '0 0 2rem 0', lineHeight: 1.6 }}>
                  You are about to permanently delete all {items.length} items from the bin. This will erase database records and unlink disk image uploads permanently. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    disabled={clearingBin}
                    style={{
                      flex: 1, padding: '0.85rem', background: 'transparent',
                      border: `1px solid ${BORDER}`, borderRadius: '14px',
                      color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearBin}
                    disabled={clearingBin}
                    style={{
                      flex: 1, padding: '0.85rem', background: ACCENT_ORANGE, border: 'none',
                      borderRadius: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    {clearingBin ? 'Emptying...' : 'Yes, Clear All'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Preview Modal */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 1200
              }}
              onClick={() => setPreviewItem(null)}
            >
              <motion.div
                variants={modalVariants}
                style={{
                  background: 'linear-gradient(135deg, #121212 0%, #080808 100%)',
                  border: `1px solid ${BORDER}`, borderRadius: '24px', padding: '2rem',
                  maxWidth: '550px', width: '92%', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${BORDER}`, paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{ITEM_CONFIG[previewItem.itemType]?.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                        {previewItem.itemName || 'Record Preview'}
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: ITEM_CONFIG[previewItem.itemType]?.color, fontWeight: 700, textTransform: 'uppercase' }}>
                        {ITEM_CONFIG[previewItem.itemType]?.label}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreviewItem(null)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
                  >✕</button>
                </div>

                {/* Modal Body */}
                <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                  {renderItemDetails(previewItem)}
                  
                  <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: '1.5rem', paddingTop: '1rem', fontSize: '0.8rem', color: MUTED }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Record ID:</span>
                      <code style={{ color: '#fff', fontSize: '0.75rem' }}>{previewItem._id}</code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Deleted On:</span>
                      <span style={{ color: '#fff' }}>{formatDate(previewItem.deletedAt)}</span>
                    </div>
                    {previewItem.deletedBy && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Deleted By:</span>
                        <span style={{ color: '#fff' }}>{previewItem.deletedBy.name} ({previewItem.deletedBy.email})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '1.75rem', borderTop: `1px solid ${BORDER}`, paddingTop: '1.25rem' }}>
                  <button
                    onClick={() => setPreviewItem(null)}
                    style={{
                      flex: 1, padding: '0.75rem', background: 'transparent',
                      border: `1px solid ${BORDER}`, borderRadius: '12px',
                      color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Close Preview
                  </button>

                  <button
                    onClick={() => {
                      const item = previewItem;
                      handleRestore(item.itemType, item._id, item.itemName);
                    }}
                    style={{
                      flex: 1, padding: '0.75rem', background: 'rgba(16,185,129,0.15)',
                      border: '1px solid rgba(16,185,129,0.4)', borderRadius: '12px',
                      color: '#10b981', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    ♻️ Restore Record
                  </button>

                  <button
                    onClick={() => {
                      const item = previewItem;
                      handlePermanentDelete(item.itemType, item._id, item.itemName);
                    }}
                    style={{
                      flex: 1, padding: '0.75rem', background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px',
                      color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    💥 Permanent Purge
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
