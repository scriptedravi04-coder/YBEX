import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const ACCENT = '#e4f141';
const DIM    = 'rgba(255,255,255,0.12)';
const MUTED  = 'rgba(255,255,255,0.35)';

const ROLE_OPTIONS = ['Founder', 'Head of Department', 'Core Team'];

const inp = {
  padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${DIM}`,
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
const onFocus = (e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.08)'; };
const onBlur  = (e) => { e.target.style.borderColor = DIM;    e.target.style.boxShadow = 'none'; };

const EMPTY = { name: '', role: '', coreTeam: 'Founder', socialLink: '' };

// Resolve /uploads/ paths to full backend URL, pass external URLs through unchanged
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

export default function AdminAboutTeam() {
  const [members, setMembers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [form, setForm]                 = useState(EMPTY);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving]             = useState(false);
  const [err, setErr]                   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    axiosInstance.get('/admin/team-members')
      .then((res) => setMembers(res.data.members || []))
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
    setSaving(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('name',       form.name.trim());
      fd.append('role',       form.role.trim());
      fd.append('coreTeam',   form.coreTeam);
      fd.append('socialLink', form.socialLink.trim());
      if (imageFile) fd.append('image', imageFile);

      const res = await axiosInstance.post('/admin/team-members', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMembers((prev) => [...prev, res.data.member]);
      setForm(EMPTY);
      clearImage();
    } catch (e) {
      setErr(e.response?.data?.message || 'Error adding member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/team-members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const founders   = members.filter((m) => m.coreTeam === 'Founder');
  const powerhouse = members.filter((m) => m.coreTeam !== 'Founder');

  return (
    <AdminLayout>
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?._id)}
        loading={deleting}
        title="Delete Team Member"
        message={`"${deleteTarget?.name}" will be permanently removed from the About page.`}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
          About Page — Team
        </h1>
        <p style={{ color: MUTED, fontSize: '0.8rem' }}>
          Founders → <strong style={{ color: ACCENT }}>The Visionaries</strong> &nbsp;·&nbsp;
          Head of Department &amp; Core Team → <strong style={{ color: ACCENT }}>Our Powerhouse</strong>
        </p>
      </motion.div>

      {/* ── Add Member Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Add Team Member
          </span>
        </div>

        {err && (
          <div style={{ background: 'rgba(255,61,16,0.1)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '8px', padding: '0.6rem 1rem', color: '#FF3D10', fontSize: '0.8rem', marginBottom: '1rem' }}>
            ⚠ {err}
          </div>
        )}

        {/* Row 1 — name · role · category */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Full Name *"
            value={form.name}
            onChange={setField('name')}
            style={{ ...inp, flex: '1 1 160px' }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <input
            type="text"
            placeholder="Role title (e.g. CEO, Lead Editor)"
            value={form.role}
            onChange={setField('role')}
            style={{ ...inp, flex: '1 1 200px' }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <select
            value={form.coreTeam}
            onChange={setField('coreTeam')}
            style={{ ...inp, flex: '0 0 200px', cursor: 'pointer' }}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o} value={o} style={{ background: '#1a1a1a' }}>{o}</option>
            ))}
          </select>
        </div>

        {/* Row 2 — photo picker · social link · add button */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Hidden file input + styled label */}
          <div style={{ flex: '0 0 auto' }}>
            <input
              ref={fileRef}
              id="team-photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="team-photo-upload"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1.1rem',
                background: imagePreview ? 'rgba(228,241,65,0.08)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${imagePreview ? ACCENT : DIM}`,
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: imagePreview ? ACCENT : 'rgba(255,255,255,0.5)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', border: `1px solid ${ACCENT}` }}
                  />
                  Photo Selected ✓
                </>
              ) : (
                <>📷 Choose Photo</>
              )}
            </label>
            {imagePreview && (
              <button
                onClick={clearImage}
                style={{ display: 'block', marginTop: '6px', background: 'none', border: 'none', color: 'rgba(255,100,100,0.7)', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
              >
                ✕ Remove
              </button>
            )}
          </div>

          {/* Social link */}
          <input
            type="url"
            placeholder="Social Link (Instagram / LinkedIn)"
            value={form.socialLink}
            onChange={setField('socialLink')}
            style={{ ...inp, flex: '1 1 200px' }}
            onFocus={onFocus}
            onBlur={onBlur}
          />

          {/* Add button */}
          <motion.button
            whileHover={!saving ? { scale: 1.04, boxShadow: '0 6px 20px rgba(228,241,65,0.3)' } : {}}
            whileTap={!saving ? { scale: 0.97 } : {}}
            onClick={handleAdd}
            disabled={saving}
            style={{
              padding: '0.75rem 1.5rem',
              background: saving ? 'rgba(228,241,65,0.4)' : ACCENT,
              border: 'none',
              borderRadius: '10px',
              color: '#000',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              alignSelf: 'flex-start',
            }}
          >
            {saving ? 'Adding...' : 'ADD MEMBER'}
          </motion.button>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)' }}>
          💡 Choose a photo from your desktop — it uploads to the server and stays visible after deployment.
          {form.coreTeam === 'Founder' && (
            <span style={{ color: 'rgba(228,241,65,0.55)', marginLeft: '8px' }}>
              · Founders appear in <strong>The Visionaries</strong> section with their social link.
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Members Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              style={{ height: '240px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          ))}
        </div>
      ) : members.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
          No team members yet. Add one above.
        </motion.div>
      ) : (
        <>
          {founders.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '2rem' }}>
              <SectionDivider label="✦ The Visionaries — Founders" color={ACCENT} colorAlpha="rgba(228,241,65,0.15)" count={founders.length} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                <AnimatePresence>
                  {founders.map((m, i) => (
                    <MemberCard key={m._id} m={m} i={i} onDelete={setDeleteTarget} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {powerhouse.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SectionDivider label="✦ Our Powerhouse — HOD & Core Team" color="#a78bfa" colorAlpha="rgba(167,139,250,0.15)" count={powerhouse.length} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                <AnimatePresence>
                  {powerhouse.map((m, i) => (
                    <MemberCard key={m._id} m={m} i={i} onDelete={setDeleteTarget} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function SectionDivider({ label, color, colorAlpha, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 800, color, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: colorAlpha }} />
      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
        {count} member{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

function MemberCard({ m, i, onDelete }) {
  const imgSrc = resolveImg(m.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ delay: i * 0.06, duration: 0.4 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderColor: 'rgba(228,241,65,0.3)' }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Photo area */}
      <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={m.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)', transition: 'filter 0.3s, transform 0.4s' }}
            onMouseEnter={(e) => { e.target.style.filter = 'grayscale(0%)'; e.target.style.transform = 'scale(1.06)'; }}
            onMouseLeave={(e) => { e.target.style.filter = 'grayscale(20%)'; e.target.style.transform = 'scale(1)'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'rgba(255,255,255,0.15)' }}>
            👤
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)', pointerEvents: 'none' }} />

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '8px', left: '8px',
          padding: '2px 8px',
          background: m.coreTeam === 'Founder' ? 'rgba(228,241,65,0.15)' : 'rgba(167,139,250,0.15)',
          border: `1px solid ${m.coreTeam === 'Founder' ? 'rgba(228,241,65,0.35)' : 'rgba(167,139,250,0.35)'}`,
          borderRadius: '20px',
          fontSize: '0.6rem',
          fontWeight: 800,
          color: m.coreTeam === 'Founder' ? ACCENT : '#a78bfa',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {m.coreTeam}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '0.85rem 1rem 0.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
          {m.name}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {m.role || m.coreTeam}
        </div>
        {m.socialLink && (
          <a
            href={m.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.65rem', color: 'rgba(228,241,65,0.6)', textDecoration: 'none', letterSpacing: '0.04em' }}
          >
            🔗 Social Link
          </a>
        )}
      </div>

      {/* Delete */}
      <motion.button
        whileHover={{ scale: 1.1, background: 'rgba(255,61,16,0.3)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(m)}
        style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '26px', height: '26px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,61,16,0.25)',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', color: '#ff6b35',
        }}
      >
        🗑
      </motion.button>
    </motion.div>
  );
}
