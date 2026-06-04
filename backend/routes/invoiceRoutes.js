const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/auth');

// @route   POST /api/invoices
// @desc    Create or update invoice (upsert by invoiceNumber)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const items = req.body.items.map(item => ({
      ...item,
      amount: item.amount || (item.quantity * item.rate)
    }));

    const invoiceData = { ...req.body, items };

    // Upsert — if same invoiceNumber exists, update it instead of failing
    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber: invoiceData.invoiceNumber },
      invoiceData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Public (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/invoices/stats
// @desc    Get invoice statistics
// @access  Public (for admin dashboard)
router.get('/stats', async (req, res) => {
  try {
    const total = await Invoice.countDocuments({ deletedAt: null });
    const generated = await Invoice.countDocuments({ status: 'generated', deletedAt: null });
    const sent = await Invoice.countDocuments({ status: 'sent', deletedAt: null });
    const paid = await Invoice.countDocuments({ status: 'paid', deletedAt: null });

    // Calculate total revenue from paid invoices
    const paidInvoices = await Invoice.find({ status: 'paid', deletedAt: null });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

    res.json({
      success: true,
      data: {
        total,
        generated,
        sent,
        paid,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/invoices/:id/status
// @desc    Update invoice status
// @access  Public
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete an invoice
// @access  Public
router.delete('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
