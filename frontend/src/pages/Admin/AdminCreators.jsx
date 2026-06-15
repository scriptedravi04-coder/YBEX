import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const ACCENT = '#e4f141';
const DIM    = 'rgba(255,255,255,0.12)';
const MUTED  = 'rgba(255,255,255,0.55)';

const EMPTY = { name: '', instagramFollowers: '', averageReach: '', socialLink: '', backgroundText: '' };

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
    let clean = url.split('?')[0];
    clean = clean.replace(/\/$/, '');
    const parts = clean.split('/');
    const handle = parts[parts.length - 1];
    return handle ? `@${handle}` : '';
  } catch (e) {
    return '';
  }
}

/* ══════════════════════════════════════════════════════════════════ */
/* EDIT MODAL                                                        */
/* ══════════════════════════════════════════════════════════════════ */
function EditCreatorModal({ open, creator, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (open && creator) {
      setForm({
        name: creator.name || '',
        instagramFollowers: creator.instagramFollowers || '',
        averageReach: creator.averageReach || '',
        socialLink: creator.socialLink || '',
        backgroundText: creator.backgroundText || '',
      });
      setImagePreview(resolveImg(creator.imageUrl) || '');
      setImageFile(null);
      setErr('');
    }
  }, [open, creator]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('instagramFollowers', form.instagramFollowers.trim());
      fd.append('averageReach', form.averageReach.trim());
      fd.append('socialLink', form.socialLink.trim());
      fd.append('backgroundText', form.backgroundText.trim());
      if (imageFile) fd.append('image', imageFile);
      const res = await axiosInstance.patch(`/admin/creators/${creator._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data.creator);
      onClose();
    } catch (e) { setErr(e.response?.data?.message || 'Error updating creator'); }
    finally { setSaving(false); }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: '520px', background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.85)' }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem 1.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(228,241,65,0.04)' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>Edit Creator</div>
                <div style={{ fontSize: '0.7rem', color: MUTED, marginTop: '2px' }}>Update creator details</div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</motion.button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {err && (
                <div style={{ background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', color: '#FF3D10', fontSize: '0.8rem' }}>⚠ {err}</div>
              )}

              {/* Image Upload */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Photo</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {imagePreview && (
                    <img src={imagePreview} alt="preview"
                      style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: `2px solid ${ACCENT}` }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <button onClick={() => fileRef.current?.click()}
                    style={{ padding: '0.6rem 1.1rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${DIM}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}
                  >📷 {imagePreview ? 'Change Photo' : 'Choose Photo'}</button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Name <span style={{ color: ACCENT }}>*</span>
                </label>
                <input type="text" placeholder="Creator name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-creator-input" />
              </div>

              {/* Followers & Reach */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Instagram Followers</label>
                  <input type="text" placeholder="e.g. 1.2M" value={form.instagramFollowers}
                    onChange={(e) => setForm({ ...form, instagramFollowers: e.target.value })} className="admin-creator-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Average Reach</label>
                  <input type="text" placeholder="e.g. 200K" value={form.averageReach}
                    onChange={(e) => setForm({ ...form, averageReach: e.target.value })} className="admin-creator-input" />
                </div>
              </div>

              {/* Social Link & Background Text */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Social Link</label>
                  <input type="url" placeholder="https://instagram.com/handle" value={form.socialLink}
                    onChange={(e) => setForm({ ...form, socialLink: e.target.value })} className="admin-creator-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Background Text</label>
                  <input type="text" placeholder="e.g. YBEX" value={form.backgroundText}
                    onChange={(e) => setForm({ ...form, backgroundText: e.target.value })} className="admin-creator-input" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.1rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '0.65rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <motion.button
                whileHover={!saving ? { scale: 1.03, boxShadow: '0 6px 20px rgba(228,241,65,0.25)' } : {}}
                whileTap={!saving ? { scale: 0.97 } : {}}
                onClick={handleSubmit} disabled={saving}
                style={{ padding: '0.65rem 1.5rem', background: saving ? 'rgba(228,241,65,0.4)' : ACCENT, border: 'none', borderRadius: '9px', color: '#000', fontSize: '0.82rem', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {saving ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }} />
                    Saving...
                  </>
                ) : '✓ Save Changes'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/* MAIN ADMIN CREATORS PAGE                                          */
/* ══════════════════════════════════════════════════════════════════ */
export default function AdminCreators() {
  const [creators, setCreators]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [form, setForm]               = useState(EMPTY);
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving]           = useState(false);
  const [err, setErr]                 = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    axiosInstance.get('/admin/creators')
      .then((res) => setCreators(res.data.creators || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('instagramFollowers', form.instagramFollowers.trim());
      fd.append('averageReach', form.averageReach.trim());
      fd.append('socialLink', form.socialLink.trim());
      fd.append('backgroundText', form.backgroundText.trim());
      if (imageFile) fd.append('image', imageFile);
      const res = await axiosInstance.post('/admin/creators', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCreators((prev) => [res.data.creator, ...prev]);
      setForm(EMPTY);
      clearImage();
    } catch (e) {
      setErr(e.response?.data?.message || 'Error adding creator');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/creators/${deleteTarget._id}`);
      setCreators((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const handleEditSave = (updated) => {
    setCreators((prev) => prev.map((c) => c._id === updated._id ? updated : c));
  };

  return (
    <AdminLayout>
      <style>{`
        /* Form glassmorphic styles with focus effects */
        .admin-creator-form-container {
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(8, 8, 8, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 2.25rem;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);
        }

        .admin-creator-form-container::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -30%;
          width: 160%;
          height: 160%;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.035) 0%, transparent 65%);
          pointer-events: none;
        }

        .admin-creator-input {
          width: 100%;
          padding: 0.85rem 1.15rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #fff;
          font-size: 0.88rem;
          outline: none;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, sans-serif;
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .admin-creator-input:focus {
          border-color: #E4F141;
          background: rgba(228, 241, 65, 0.01);
          box-shadow: 0 0 0 4px rgba(228, 241, 65, 0.08);
          transform: translateY(-2px);
        }

        .creator-photo-upload-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.85rem 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
          user-select: none;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .creator-photo-upload-label:hover {
          border-color: rgba(228, 241, 65, 0.4);
          background: rgba(228, 241, 65, 0.03);
          color: #E4F141;
          transform: translateY(-2px);
        }

        .admin-submit-btn {
          padding: 0.85rem 1.75rem;
          background: #E4F141;
          border: none;
          border-radius: 12px;
          color: #000;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 15px rgba(228, 241, 65, 0.25);
          white-space: nowrap;
          align-self: flex-start;
        }

        .admin-submit-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(228, 241, 65, 0.45);
        }

        /* Creator Card Styles - matching exactly Creators.jsx */
        .admin-creators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
          justify-content: center;
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
          font-size: 1.1rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
        }

        .stat-txt {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 1px;
        }

        .stat-col-divider {
          width: 1px;
          background: rgba(255, 255, 255, 0.08);
          align-self: stretch;
          margin: 0 4px;
        }
      `}</style>

      <EditCreatorModal
        open={!!editTarget}
        creator={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEditSave}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Creator"
        message={`"${deleteTarget?.name}" will be permanently removed from the creators page.`}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(228,241,65,0.15) 0%, rgba(228,241,65,0.05) 100%)',
                border: '1px solid rgba(228,241,65,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', boxShadow: '0 8px 32px rgba(228,241,65,0.15)',
              }}
            >🎬</motion.div>
            <h1 style={{
              fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0,
              letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', sans-serif",
            }}>Our Creators</h1>
          </div>
          <p style={{ color: MUTED, fontSize: '0.85rem', paddingLeft: '56px', margin: 0 }}>
            {creators.length} creator{creators.length !== 1 ? 's' : ''} · shown on the Our Creators page
          </p>
        </div>
      </motion.div>

      {/* ── Add Creator Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="admin-creator-form-container"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🎬</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Add Creator
          </span>
        </div>

        {err && (
          <div style={{ background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', color: '#FF3D10', fontSize: '0.8rem', marginBottom: '1rem' }}>
            ⚠ {err}
          </div>
        )}

        {/* Row 1 — name · backgroundText · followers · reach */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ flex: '2 1 200px' }}>
            <input type="text" placeholder="Creator Name *" value={form.name}
              onChange={setField('name')} className="admin-creator-input" />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <input type="text" placeholder="Background Text (e.g. YBEX)" value={form.backgroundText}
              onChange={setField('backgroundText')} className="admin-creator-input" />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <input type="text" placeholder="Followers (e.g. 1.2M)" value={form.instagramFollowers}
              onChange={setField('instagramFollowers')} className="admin-creator-input" />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <input type="text" placeholder="Avg Reach (e.g. 200K)" value={form.averageReach}
              onChange={setField('averageReach')} className="admin-creator-input" />
          </div>
        </div>

        {/* Row 2 — photo picker · social link · add button */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Hidden file input + styled label */}
          <div style={{ flex: '0 0 auto' }}>
            <input ref={fileRef} id="creator-photo-upload" type="file" accept="image/*"
              onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="creator-photo-upload" className="creator-photo-upload-label" style={{
              borderColor: imagePreview ? '#E4F141' : 'rgba(255,255,255,0.08)',
              background: imagePreview ? 'rgba(228,241,65,0.06)' : 'rgba(255,255,255,0.03)',
              color: imagePreview ? '#E4F141' : 'rgba(255,255,255,0.6)',
            }}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview"
                    style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', border: `1px solid #E4F141` }} />
                  Photo Selected ✓
                </>
              ) : (
                <>📷 Choose Photo</>
              )}
            </label>
            {imagePreview && (
              <button onClick={clearImage}
                style={{ display: 'block', marginTop: '6px', background: 'none', border: 'none', color: 'rgba(255,100,100,0.7)', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
              >✕ Remove</button>
            )}
          </div>

          {/* Social link */}
          <div style={{ flex: '1 1 200px' }}>
            <input type="url" placeholder="Social Link (Instagram / YouTube)" value={form.socialLink}
              onChange={setField('socialLink')} className="admin-creator-input" />
          </div>

          {/* Add button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd} disabled={saving}
            className="admin-submit-btn"
            style={{ background: saving ? 'rgba(228,241,65,0.4)' : '#E4F141' }}
          >
            {saving ? 'Adding...' : '+ ADD CREATOR'}
          </motion.button>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)' }}>
          💡 Upload a photo from your device — it saves to the server and stays visible after deployment & IP sharing.
        </div>
      </motion.div>

      {/* ── Creators Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
              style={{ height: '380px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
            padding: '5rem 2rem', textAlign: 'center',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(228,241,65,0.3))' }}
          >🎬</motion.div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>No creators yet</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Add your first creator above to get started.</div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="admin-creators-grid"
        >
          <AnimatePresence>
            {creators.map((c, i) => (
              <CreatorCard key={c._id} c={c} i={i} onDelete={setDeleteTarget} onEdit={setEditTarget} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/* CREATOR CARD                                                      */
/* ══════════════════════════════════════════════════════════════════ */
function CreatorCard({ c, i, onDelete, onEdit }) {
  const imgSrc = resolveImg(c.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}
      className="creator-card"
    >
      {/* Outline Backdrop Texts */}
      <div className="outline-bg-talent">OUR TALENT</div>
      <div className="outline-bg-custom">{c.backgroundText || 'YBEX'}</div>

      {/* Instagram badge */}
      <div className="creator-ig-badge">
        <span className="creator-ig-icon">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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
        {imgSrc ? (
          <img src={imgSrc} alt={c.name} className="creator-portrait-img" />
        ) : (
          <div style={{ fontSize: '3rem', opacity: 0.15 }}>👤</div>
        )}
      </div>

      {/* Stats Box */}
      <div className="creator-stats-box">
        <div className="creator-stat-col">
          <div className="stat-badge-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
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
              <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
            </svg>
          </div>
          <div className="stat-details">
            <span className="stat-num">{c.averageReach || '0'}</span>
            <span className="stat-txt">Avg Reach</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 15 }} onClick={e => e.stopPropagation()}>
        <motion.button whileHover={{ scale: 1.1, background: 'rgba(228,241,65,0.3)' }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(c); }}
          style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(228,241,65,0.25)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: ACCENT }}
        >✏️</motion.button>
        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255,61,16,0.3)' }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(c); }}
          style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,61,16,0.25)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#ff6b35' }}
        >🗑</motion.button>
      </div>
    </motion.div>
  );
}
