import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../../api/axiosInstance';
import AdminLayout from './AdminLayout';
const ACCENT = '#e4f141';
const BORDER = 'rgba(255,255,255,0.06)';
const MUTED  = 'rgba(255,255,255,0.55)';
const DIM    = 'rgba(255,255,255,0.1)';

export default function AdminSuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    earning: '',
    company: '',
    socialLink: '',
    initials: '',
    isActive: true
  });

  // Fetch stories
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/success-stories/admin');
      setStories(res.data.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (story = null) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        name: story.name,
        role: story.role,
        quote: story.quote,
        earning: story.earning,
        company: story.company,
        socialLink: story.socialLink || '',
        initials: story.initials || getInitials(story.name),
        isActive: story.isActive
      });
      setPreviewImage(story.imageUrl);
    } else {
      setEditingStory(null);
      setFormData({
        name: '',
        role: '',
        quote: '',
        earning: '',
        company: '',
        socialLink: '',
        initials: '',
        isActive: true
      });
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStory(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Compress image before setting preview
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress image to avoid 413 Payload Too Large error
        const compressedImage = await compressImage(file, 800, 0.8);
        setPreviewImage(compressedImage);
      } catch (err) {
        console.error('Error compressing image:', err);
        alert('Error processing image. Please try a smaller image.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        imageUrl: previewImage
      };

      if (editingStory) {
        await axiosInstance.put(`/success-stories/${editingStory._id}`, submitData);
      } else {
        await axiosInstance.post('/success-stories', submitData);
      }

      handleCloseModal();
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await axiosInstance.delete(`/success-stories/${id}`);
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, rgba(228,241,65,0.15) 0%, rgba(228,241,65,0.05) 100%)',
                border: '1px solid rgba(228,241,65,0.25)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.4rem',
                boxShadow: '0 8px 32px rgba(228,241,65,0.15)',
              }}
            >🏆</motion.div>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: 800, 
              color: '#fff', 
              letterSpacing: '-0.03em', 
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>Success Stories</h1>
          </div>
          <p style={{ color: MUTED, fontSize: '0.85rem', margin: 0, paddingLeft: '56px' }}>{stories.length} stor{stories.length !== 1 ? 'ies' : 'y'} · shown on Academy page</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.03, boxShadow: '0 12px 35px rgba(228,241,65,0.35)' }} 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleOpenModal()}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '0.85rem 1.6rem', 
            background: 'linear-gradient(135deg, #e4f141 0%, #d4e130 100%)', 
            border: 'none', 
            borderRadius: '14px', 
            color: '#000', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(228,241,65,0.2)',
          }}
        >+ Add Success Story</motion.button>
      </motion.div>

      {/* Info Tip */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        style={{ background: 'rgba(228,241,65,0.04)', border: '1px solid rgba(228,241,65,0.13)', borderRadius: '14px', padding: '0.9rem 1.2rem', marginBottom: '1.8rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.48)' }}
      >
        💡 Add inspiring student success stories to showcase on the Academy page. Include a photo, role, earnings, and testimonial quote.
      </motion.div>

      {/* Stories Grid - Scrollable Section */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
              style={{ height: '320px', borderRadius: '24px', background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid ' + BORDER }} />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{ 
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', 
            border: '1px solid ' + BORDER, 
            borderRadius: '24px', 
            padding: '5rem 2rem', 
            textAlign: 'center',
          }}
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(228,241,65,0.3))' }}
          >🏆</motion.div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>No success stories yet</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Click "Add Success Story" to add your first student testimonial.</div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}
        >
          <AnimatePresence>
          {stories.map((story, index) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                borderRadius: '20px',
                padding: '1.5rem',
                border: `1px solid ${story.isActive ? 'rgba(228,241,65,0.25)' : 'rgba(255,255,255,0.08)'}`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(228,241,65,0.4) 0%, rgba(255,77,0,0.2) 50%, rgba(228,241,65,0.4) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                  opacity: 0
                }}
              />
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: story.isActive ? 'rgba(255,77,0,0.2)' : 'rgba(255,255,255,0.1)',
                color: story.isActive ? '#ff6b35' : 'rgba(255,255,255,0.5)'
              }}>
                {story.isActive ? 'ACTIVE' : 'INACTIVE'}
              </div>

              {/* Avatar with B&W to Color Hover Effect */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.2rem' }}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'relative',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(228,241,65,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                >
                  {story.imageUrl ? (
                    <>
                      <img
                        src={story.imageUrl}
                        alt={story.name}
                        className="story-avatar-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'grayscale(100%) contrast(1.1)',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                      {/* Glow overlay on hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(circle, rgba(228,241,65,0.3) 0%, transparent 70%)',
                          pointerEvents: 'none',
                          transition: 'opacity 0.4s ease'
                        }}
                      />
                    </>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700
                    }}>
                      {story.initials || getInitials(story.name)}
                    </div>
                  )}
                </motion.div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: 700, 
                    margin: 0,
                    background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{story.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: ACCENT, margin: '4px 0 0 0', fontWeight: 500 }}>{story.role}</p>
                  {story.socialLink && (
                    <motion.a 
                      href={story.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, x: 3 }}
                      style={{ 
                        fontSize: '0.7rem', 
                        color: 'rgba(255,255,255,0.4)', 
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                      }}
                    >
                      🔗 Social Profile
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Quote with shimmer */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.03, scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: -5,
                    fontSize: '4rem',
                    color: ACCENT,
                    fontFamily: 'serif',
                    pointerEvents: 'none'
                  }}
                >"</motion.div>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  paddingLeft: '8px',
                  borderLeft: '2px solid rgba(228,241,65,0.3)'
                }}>
                  {story.quote.substring(0, 100)}{story.quote.length > 100 ? '...' : ''}
                </p>
              </div>

              {/* Stats with glow effect */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)'
              }}>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    fontWeight: 800, 
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #e4f141 0%, #d4e130 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(228,241,65,0.3)'
                  }}
                >
                  {story.earning}
                </motion.span>
                <span style={{ 
                  color: 'rgba(255,255,255,0.4)', 
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em'
                }}>{story.company}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '1.2rem' }}>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(story); }}
                  whileHover={{ scale: 1.05, background: 'rgba(228,241,65,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(228,241,65,0.2)',
                    color: ACCENT,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✏️ Edit
                </motion.button>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleDelete(story._id); }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,61,16,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(255,61,16,0.08)',
                    border: '1px solid rgba(255,61,16,0.25)',
                    color: '#FF3D10',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  🗑️ Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* CSS for B&W to Color Hover Effect */}
      <style>{`
        .story-avatar-img:hover {
          filter: grayscale(0%) contrast(1) !important;
          transform: scale(1.1);
        }
      `}</style>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(255,77,0,0.3)',
                padding: '2rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  📝
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
                  {editingStory ? 'Edit Success Story' : 'Add Success Story'}
                </h2>
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  Profile Photo
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(255,77,0,0.5)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '2px dashed rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      📷
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {previewImage ? 'Change Photo' : 'Upload Photo'}
                    </motion.button>
                    {previewImage && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          marginLeft: '8px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(255,61,16,0.1)',
                          border: '1px solid rgba(255,61,16,0.3)',
                          color: '#FF3D10',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Remove
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. ARYAN MEHTA"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. CONTENT CREATOR"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Revenue *
                    </label>
                    <input
                      type="text"
                      name="earning"
                      value={formData.earning}
                      onChange={handleInputChange}
                      placeholder="e.g. ₹3.2L/mo"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}>
                      Company/Status *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. SELF-BUILT"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Social Link Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px'
                  }}>
                    🔗 Social Media Link
                  </label>
                  <input
                    type="url"
                    name="socialLink"
                    value={formData.socialLink}
                    onChange={handleInputChange}
                    placeholder="e.g. https://instagram.com/username or https://linkedin.com/in/username"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(228,241,65,0.2)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    Optional: Link to student's Instagram, LinkedIn, or other social profile
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px'
                  }}>
                    Student Quote *
                  </label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    placeholder="Enter the student's testimonial..."
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Active Toggle */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                      Active (visible on Academy page)
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ff4d00, #ff6b35)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {editingStory ? 'Update Story' : 'Add Story'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
