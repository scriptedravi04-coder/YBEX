const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const corsConfig = require('./config/corsConfig');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const activityRoutes = require('./routes/activityRoutes');
const binRoutes = require('./routes/binRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const hiringRoutes = require('./routes/hiringRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(corsConfig);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/bin', binRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/hiring', hiringRoutes);

// Public brands endpoint (no auth required)
const Brand = require('./models/Brand');
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await Brand.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, brands });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Public projects endpoint (no auth required)
const Project = require('./models/Project');
app.get('/api/projects', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category, deletedAt: null } : { deletedAt: null };
    const projects = await Project.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Public influencers endpoint (no auth required)
const Influencer = require('./models/Influencer');
app.get('/api/influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, influencers });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Public team members endpoint (no auth required)
const TeamMember = require('./models/TeamMember');
app.get('/api/team-members', async (req, res) => {
  try {
    const members = await TeamMember.find({ deletedAt: null }).sort({ createdAt: 1 });
    res.json({ success: true, members });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  // Detect local network IP dynamically
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
});
