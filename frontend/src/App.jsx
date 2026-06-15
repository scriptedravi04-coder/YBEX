import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminRoute from './components/common/AdminRoute';

// Public pages
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Portfolio from './pages/Portfolio/Portfolio';
import Academy from './pages/Academy/Academy';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import GetStarted from './pages/GetStarted/GetStarted';import Creators from './pages/Creators/Creators';import Offerings from './pages/Offerings/Offerings';
import Invoice from './pages/Invoice/Invoice';
import InHouseTeam from './pages/Services/InHouseTeam';



// Admin pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminEnquiries from './pages/Admin/AdminEnquiries';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAboutTeam from './pages/Admin/AdminAboutTeam';
import AdminInfluencers from './pages/Admin/AdminInfluencers';
import AdminCreators from './pages/Admin/AdminCreators';
import AdminBrands from './pages/Admin/AdminBrands';
import AdminPlaceholder from './pages/Admin/AdminPlaceholder';
import AdminHiring from './pages/Admin/AdminHiring';
import AdminPortfolio from './pages/Admin/AdminPortfolio';
import AdminInvoices from './pages/Admin/AdminInvoices';
import AdminSuccessStories from './pages/Admin/AdminSuccessStories';
import AdminActivity from './pages/Admin/AdminActivity';
import AdminBin from './pages/Admin/AdminBin';
import SubAdminDashboard from './pages/Admin/SubAdminDashboard';

// Wraps public pages with Navbar + Footer
function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (with Navbar + Footer) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/offerings" element={<Offerings />} />
        <Route path="/services" element={<Services />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/inhouse-team" element={<InHouseTeam />} />
      </Route>

      {/* ── Admin routes (NO Navbar/Footer) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/enquiries" replace />} />
      <Route path="/sub-admin/dashboard" element={<AdminRoute><SubAdminDashboard /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/about-team" element={<AdminRoute><AdminAboutTeam /></AdminRoute>} />
      <Route path="/admin/hiring" element={<AdminRoute><AdminHiring /></AdminRoute>} />
      <Route path="/admin/influencers" element={<AdminRoute><AdminInfluencers /></AdminRoute>} />
      <Route path="/admin/creators" element={<AdminRoute><AdminCreators /></AdminRoute>} />
      <Route path="/admin/brands" element={<AdminRoute><AdminBrands /></AdminRoute>} />
      <Route path="/admin/school-mentors" element={<AdminRoute><AdminPlaceholder title="School Mentors" icon="🎓" description="Manage school mentor profiles and assignments." /></AdminRoute>} />
      <Route path="/admin/success-stories" element={<AdminRoute><AdminSuccessStories /></AdminRoute>} />
      <Route path="/admin/scholarship" element={<AdminRoute><AdminPlaceholder title="Scholarship" icon="🎖️" description="Manage scholarship applications and awards." /></AdminRoute>} />
      <Route path="/admin/activity-logs" element={<AdminRoute><AdminActivity /></AdminRoute>} />
      <Route path="/admin/invoices" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
      <Route path="/admin/portfolio" element={<AdminRoute><AdminPortfolio /></AdminRoute>} />
      <Route path="/admin/bin" element={<AdminRoute><AdminBin /></AdminRoute>} />
      <Route path="/admin/website-settings" element={<AdminRoute><AdminPlaceholder title="Website Settings" icon="⚙️" description="Configure global website settings and preferences." /></AdminRoute>} />
    </Routes>
  );
}
