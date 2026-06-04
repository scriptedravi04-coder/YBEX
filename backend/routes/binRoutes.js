const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Contact = require('../models/Contact');
const TeamMember = require('../models/TeamMember');
const Suggestion = require('../models/Suggestion');
const Brand = require('../models/Brand');
const SuccessStory = require('../models/SuccessStory');
const Influencer = require('../models/Influencer');
const HiringApplication = require('../models/HiringApplication');
const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const Scholarship = require('../models/Scholarship');
const { protect, adminOnly } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');

// Apply auth middleware to all routes
router.use(protect, adminOnly);

// Get all deleted items from bin
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;

    const deletedFilter = { deletedAt: { $ne: null } };

    const queryPromises = [];

    // Users
    if (!type || type === 'USER') {
      queryPromises.push(
        User.find(deletedFilter)
          .select('-password')
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'USER', itemName: item.name })))
      );
    }

    // Contacts/Enquiries
    if (!type || type === 'ENQUIRY') {
      queryPromises.push(
        Contact.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'ENQUIRY', itemName: item.name || item.subject })))
      );
    }

    // Team Members
    if (!type || type === 'TEAM_MEMBER') {
      queryPromises.push(
        TeamMember.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'TEAM_MEMBER', itemName: item.name })))
      );
    }

    // Suggestions
    if (!type || type === 'SUGGESTION') {
      queryPromises.push(
        Suggestion.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .populate('submittedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'SUGGESTION', itemName: item.title })))
      );
    }

    // Brands
    if (!type || type === 'BRAND') {
      queryPromises.push(
        Brand.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'BRAND', itemName: item.name })))
      );
    }

    // Success Stories
    if (!type || type === 'SUCCESS_STORY') {
      queryPromises.push(
        SuccessStory.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'SUCCESS_STORY', itemName: item.name })))
      );
    }

    // Influencers
    if (!type || type === 'INFLUENCER') {
      queryPromises.push(
        Influencer.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'INFLUENCER', itemName: item.name })))
      );
    }

    // Hiring Applications
    if (!type || type === 'HIRING') {
      queryPromises.push(
        HiringApplication.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'HIRING', itemName: item.name })))
      );
    }

    // Invoices
    if (!type || type === 'INVOICE') {
      queryPromises.push(
        Invoice.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'INVOICE', itemName: item.invoiceNumber || 'Invoice' })))
      );
    }

    // Portfolio Projects
    if (!type || type === 'PORTFOLIO') {
      queryPromises.push(
        Project.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'PORTFOLIO', itemName: item.title })))
      );
    }

    // Scholarships
    if (!type || type === 'SCHOLARSHIP') {
      queryPromises.push(
        Scholarship.find(deletedFilter)
          .populate('deletedBy', 'name email')
          .sort({ deletedAt: -1 })
          .lean()
          .then(items => items.map(item => ({ ...item, itemType: 'SCHOLARSHIP', itemName: item.fullName })))
      );
    }

    const results = await Promise.all(queryPromises);
    const allItems = results.flat().sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    // Get counts by type
    const counts = {
      USER: 0, ENQUIRY: 0, TEAM_MEMBER: 0, SUGGESTION: 0,
      BRAND: 0, SUCCESS_STORY: 0, INFLUENCER: 0, HIRING: 0, INVOICE: 0,
      PORTFOLIO: 0, SCHOLARSHIP: 0
    };
    allItems.forEach(item => {
      if (counts[item.itemType] !== undefined) {
        counts[item.itemType]++;
      }
    });

    res.json({
      success: true,
      items: allItems,
      counts,
      totalCount: allItems.length
    });
  } catch (e) { next(e); }
});

// Get bin stats
router.get('/stats', async (req, res, next) => {
  try {
    const deletedFilter = { deletedAt: { $ne: null } };

    const counts = await Promise.all([
      User.countDocuments(deletedFilter),
      Contact.countDocuments(deletedFilter),
      TeamMember.countDocuments(deletedFilter),
      Suggestion.countDocuments(deletedFilter),
      Brand.countDocuments(deletedFilter),
      SuccessStory.countDocuments(deletedFilter),
      Influencer.countDocuments(deletedFilter),
      HiringApplication.countDocuments(deletedFilter),
      Invoice.countDocuments(deletedFilter),
      Project.countDocuments(deletedFilter),
      Scholarship.countDocuments(deletedFilter)
    ]);

    res.json({
      success: true,
      stats: {
        USER: counts[0],
        ENQUIRY: counts[1],
        TEAM_MEMBER: counts[2],
        SUGGESTION: counts[3],
        BRAND: counts[4],
        SUCCESS_STORY: counts[5],
        INFLUENCER: counts[6],
        HIRING: counts[7],
        INVOICE: counts[8],
        PORTFOLIO: counts[9],
        SCHOLARSHIP: counts[10],
        total: counts.reduce((a, b) => a + b, 0)
      }
    });
  } catch (e) { next(e); }
});

// Restore item from bin
router.post('/restore/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params;

    let Model;
    switch (type) {
      case 'USER': Model = User; break;
      case 'ENQUIRY': Model = Contact; break;
      case 'TEAM_MEMBER': Model = TeamMember; break;
      case 'SUGGESTION': Model = Suggestion; break;
      case 'BRAND': Model = Brand; break;
      case 'SUCCESS_STORY': Model = SuccessStory; break;
      case 'INFLUENCER': Model = Influencer; break;
      case 'HIRING': Model = HiringApplication; break;
      case 'INVOICE': Model = Invoice; break;
      case 'PORTFOLIO': Model = Project; break;
      case 'SCHOLARSHIP': Model = Scholarship; break;
      default: return res.status(400).json({ message: 'Invalid item type' });
    }

    const item = await Model.findByIdAndUpdate(
      id,
      { deletedAt: null, deletedBy: null },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in bin' });
    }

    // Log restoration
    await logActivity({
      req,
      action: 'RESTORE',
      entityType: type,
      entityId: id,
      entityName: item.name || item.title || item.fullName || item.invoiceNumber || 'Item',
      details: { restoredFromBin: true }
    });

    res.json({ success: true, message: 'Item restored successfully', item });
  } catch (e) { next(e); }
});

// Helper function to delete local files
const deleteLocalFile = (imageUrl) => {
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    const fp = path.join(__dirname, '../uploads', path.basename(imageUrl));
    if (fs.existsSync(fp)) {
      try {
        fs.unlinkSync(fp);
      } catch (err) {
        console.error('Error deleting file:', fp, err);
      }
    }
  }
};

// Permanently delete single item
router.delete('/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params;

    let Model;
    let entityName = 'Item';
    switch (type) {
      case 'USER': Model = User; break;
      case 'ENQUIRY': Model = Contact; break;
      case 'TEAM_MEMBER': Model = TeamMember; break;
      case 'SUGGESTION': Model = Suggestion; break;
      case 'BRAND': Model = Brand; break;
      case 'SUCCESS_STORY': Model = SuccessStory; break;
      case 'INFLUENCER': Model = Influencer; break;
      case 'HIRING': Model = HiringApplication; break;
      case 'INVOICE': Model = Invoice; break;
      case 'PORTFOLIO': Model = Project; break;
      case 'SCHOLARSHIP': Model = Scholarship; break;
      default: return res.status(400).json({ message: 'Invalid item type' });
    }

    const item = await Model.findOne({ _id: id, deletedAt: { $ne: null } });
    if (!item) {
      return res.status(404).json({ message: 'Item not found in bin' });
    }

    entityName = item.name || item.title || item.fullName || item.invoiceNumber || item.subject || 'Item';

    // File cleanup before unlinking model entry
    if (type === 'BRAND') {
      deleteLocalFile(item.logoUrl);
    } else if (type === 'INFLUENCER') {
      deleteLocalFile(item.imageUrl);
    } else if (type === 'PORTFOLIO') {
      deleteLocalFile(item.coverImage);
    } else if (type === 'TEAM_MEMBER') {
      deleteLocalFile(item.imageUrl);
    }

    await Model.findByIdAndDelete(id);

    // Log permanent deletion
    await logActivity({
      req,
      action: 'PERMANENT_DELETE',
      entityType: type,
      entityId: id,
      entityName,
      details: { deletedFromBin: true, permanentlyDeleted: true }
    });

    res.json({ success: true, message: 'Item permanently deleted' });
  } catch (e) { next(e); }
});

// Clear entire bin (permanently delete all)
router.delete('/clear', async (req, res, next) => {
  try {
    const deletedFilter = { deletedAt: { $ne: null } };

    // File cleanup for all deleted items before database purge
    const [brands, influencers, projects, members] = await Promise.all([
      Brand.find(deletedFilter),
      Influencer.find(deletedFilter),
      Project.find(deletedFilter),
      TeamMember.find(deletedFilter)
    ]);

    brands.forEach(item => deleteLocalFile(item.logoUrl));
    influencers.forEach(item => deleteLocalFile(item.imageUrl));
    projects.forEach(item => deleteLocalFile(item.coverImage));
    members.forEach(item => deleteLocalFile(item.imageUrl));

    const deletePromises = [
      User.deleteMany(deletedFilter),
      Contact.deleteMany(deletedFilter),
      TeamMember.deleteMany(deletedFilter),
      Suggestion.deleteMany(deletedFilter),
      Brand.deleteMany(deletedFilter),
      SuccessStory.deleteMany(deletedFilter),
      Influencer.deleteMany(deletedFilter),
      HiringApplication.deleteMany(deletedFilter),
      Invoice.deleteMany(deletedFilter),
      Project.deleteMany(deletedFilter),
      Scholarship.deleteMany(deletedFilter)
    ];

    const results = await Promise.all(deletePromises);
    const totalDeleted = results.reduce((sum, result) => sum + (result.deletedCount || 0), 0);

    // Log bin clear
    await logActivity({
      req,
      action: 'CLEAR_BIN',
      entityType: 'SYSTEM',
      entityId: 'bin',
      entityName: 'Recycle Bin',
      details: { itemsDeleted: totalDeleted, permanentlyDeleted: true }
    });

    res.json({
      success: true,
      message: `Bin cleared successfully. ${totalDeleted} items permanently deleted.`,
      deletedCount: totalDeleted
    });
  } catch (e) { next(e); }
});

module.exports = router;
