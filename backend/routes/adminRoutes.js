const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly, ownerAdminOnly } = require('../middleware/auth');
const {
  getDashboardStats,
  getAdminContacts, updateContactStatus, approveContact, rejectContact, replyContact, deleteContact,
  getAdminUsers, createAdmin, updateUserRole, updateUser, deleteAdminUser,
  getAdminSuggestions, updateAdminSuggestion, deleteAdminSuggestion,
  getTeamMembers, addTeamMember, deleteTeamMember,
} = require('../controllers/adminController');
const Influencer = require('../models/Influencer');
const Brand = require('../models/Brand');
const Project = require('../models/Project');
const HiringApplication = require('../models/HiringApplication');
const Creator = require('../models/Creator');

const router = express.Router();

// ── Multer ────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const fileFilter = (req, file, cb) => {
  file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Auth guard ────────────────────────────────────────────────────
router.use(protect, adminOnly);

// ── Dashboard ─────────────────────────────────────────────────────
router.get('/stats', getDashboardStats);

// ── Contacts / Enquiries ──────────────────────────────────────────
router.get('/contacts',              getAdminContacts);
router.patch('/contacts/:id',        updateContactStatus);
router.patch('/contacts/:id/approve', approveContact);
router.patch('/contacts/:id/reject',  rejectContact);
router.post('/contacts/:id/reply',    replyContact);
router.delete('/contacts/:id',        deleteContact);

// ── Users ─────────────────────────────────────────────────────────
router.get('/users',              getAdminUsers);
router.post('/users',             protect, ownerAdminOnly, createAdmin);
router.patch('/users/:id',        updateUser);
router.patch('/users/:id/role',   updateUserRole);
router.delete('/users/:id',       protect, ownerAdminOnly, deleteAdminUser);

// ── Suggestions ───────────────────────────────────────────────────
router.get('/suggestions',          getAdminSuggestions);
router.patch('/suggestions/:id',    updateAdminSuggestion);
router.delete('/suggestions/:id',   deleteAdminSuggestion);

// ── Team Members ──────────────────────────────────────────────────
router.get('/team-members', getTeamMembers);

router.post('/team-members', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Multer error (file too large, wrong type, etc.)
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
}, addTeamMember);

router.delete('/team-members/:id', deleteTeamMember);

// ── Influencers ───────────────────────────────────────────────────
router.get('/influencers', async (req, res, next) => {
  try {
    const influencers = await Influencer.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, influencers });
  } catch (e) { next(e); }
});

router.post('/influencers', async (req, res, next) => {
  try {
    const { name, profileLink, imageUrl } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const influencer = await Influencer.create({
      name: name.trim(),
      profileLink: profileLink || '',
      imageUrl: imageUrl?.trim() || null,
    });
    res.status(201).json({ success: true, influencer });
  } catch (e) { next(e); }
});

router.delete('/influencers/:id', async (req, res, next) => {
  try {
    const inf = await Influencer.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!inf) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ── Brands ────────────────────────────────────────────────────────
router.get('/brands', async (req, res, next) => {
  try {
    const brands = await Brand.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, brands });
  } catch (e) { next(e); }
});

router.post('/brands', async (req, res, next) => {
  try {
    const { name, websiteLink, logoUrl } = req.body;
    if (!name?.trim())        return res.status(400).json({ message: 'Brand name is required' });
    if (!websiteLink?.trim()) return res.status(400).json({ message: 'Website link is required' });
    if (!logoUrl?.trim())     return res.status(400).json({ message: 'Logo image URL is required' });
    const brand = await Brand.create({
      name: name.trim(),
      logoUrl: logoUrl.trim(),
      websiteLink: websiteLink.trim(),
    });
    res.status(201).json({ success: true, brand });
  } catch (e) { next(e); }
});

router.delete('/brands/:id', async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!brand) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ── Hiring Applications ───────────────────────────────────────────
router.get('/hiring', async (req, res, next) => {
  try {
    const filter = { deletedAt: null };
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    const applications = await HiringApplication.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (e) { next(e); }
});

router.patch('/hiring/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    const application = await HiringApplication.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, application });
  } catch (e) { next(e); }
});

router.delete('/hiring/:id', async (req, res, next) => {
  try {
    const app = await HiringApplication.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ── Portfolio Projects ────────────────────────────────────────────
router.get('/projects', async (req, res, next) => {
  try {
    const projects = await Project.find({ deletedAt: null }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (e) { next(e); }
});

router.post('/projects', upload.single('coverImage'), async (req, res, next) => {
  try {
    const { brandName, title, tagBadge, year, description, category, bgColor, accentColor, stats, projectLink, sortOrder } = req.body;
    if (!brandName?.trim()) return res.status(400).json({ message: 'Brand name is required' });
    if (!title?.trim())     return res.status(400).json({ message: 'Title is required' });
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;
    const project = await Project.create({
      brandName: brandName.trim(),
      title: title.trim(),
      tagBadge: tagBadge?.trim() || '',
      year: year?.trim() || new Date().getFullYear().toString(),
      description: description?.trim() || '',
      category: category || 'Brand Identity',
      bgColor: bgColor?.trim() || '#111111',
      accentColor: accentColor?.trim() || '#e4f141',
      stats: stats?.trim() || '',
      coverImage,
      projectLink: projectLink?.trim() || '',
      sortOrder: parseInt(sortOrder) || 0,
    });
    res.status(201).json({ success: true, project });
  } catch (e) { next(e); }
});

router.patch('/projects/:id', upload.single('coverImage'), async (req, res, next) => {
  try {
    const { brandName, title, tagBadge, year, description, category, bgColor, accentColor, stats, projectLink, sortOrder } = req.body;
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const updates = {
      brandName: brandName?.trim() || existing.brandName,
      title: title?.trim() || existing.title,
      tagBadge: tagBadge?.trim() ?? existing.tagBadge,
      year: year?.trim() || existing.year,
      description: description?.trim() ?? existing.description,
      category: category || existing.category,
      bgColor: bgColor?.trim() || existing.bgColor,
      accentColor: accentColor?.trim() || existing.accentColor,
      stats: stats?.trim() ?? existing.stats,
      projectLink: projectLink?.trim() ?? existing.projectLink,
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder,
    };
    if (req.file) {
      // Delete old image if local
      if (existing.coverImage && existing.coverImage.startsWith('/uploads/')) {
        const fp = path.join(__dirname, '../uploads', path.basename(existing.coverImage));
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      }
      updates.coverImage = `/uploads/${req.file.filename}`;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, project });
  } catch (e) { next(e); }
});

router.delete('/projects/:id', async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ── Creators ──────────────────────────────────────────────────────
router.get('/creators', async (req, res, next) => {
  try {
    const creators = await Creator.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, creators });
  } catch (e) { next(e); }
});

router.post('/creators', upload.single('image'), async (req, res, next) => {
  try {
    const { name, instagramFollowers, averageReach, socialLink, backgroundText } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const creator = await Creator.create({
      name: name.trim(),
      imageUrl,
      instagramFollowers: instagramFollowers?.trim() || '',
      averageReach: averageReach?.trim() || '',
      socialLink: socialLink?.trim() || '',
      backgroundText: backgroundText?.trim() || 'YBEX',
    });
    res.status(201).json({ success: true, creator });
  } catch (e) { next(e); }
});

router.patch('/creators/:id', upload.single('image'), async (req, res, next) => {
  try {
    const { name, instagramFollowers, averageReach, socialLink, backgroundText } = req.body;
    const existing = await Creator.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const updates = {
      name: name?.trim() || existing.name,
      instagramFollowers: instagramFollowers?.trim() ?? existing.instagramFollowers,
      averageReach: averageReach?.trim() ?? existing.averageReach,
      socialLink: socialLink?.trim() ?? existing.socialLink,
      backgroundText: backgroundText?.trim() ?? existing.backgroundText,
    };
    if (req.file) {
      // Delete old image if local
      if (existing.imageUrl && existing.imageUrl.startsWith('/uploads/')) {
        const fp = path.join(__dirname, '../uploads', path.basename(existing.imageUrl));
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      }
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }
    const creator = await Creator.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, creator });
  } catch (e) { next(e); }
});

router.delete('/creators/:id', async (req, res, next) => {
  try {
    const creator = await Creator.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!creator) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
