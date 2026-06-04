import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Offerings from '../pages/Offerings/Offerings';
import Services from '../pages/Services/Services';
import Creators from '../pages/Creators/Creators';
import Portfolio from '../pages/Portfolio/Portfolio';
import Academy from '../pages/Academy/Academy';
import Contact from '../pages/Contact/Contact';
import About from '../pages/About/About';
import GetStarted from '../pages/GetStarted/GetStarted';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminEnquiries from '../pages/Admin/AdminEnquiries';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminSuggestions from '../pages/Admin/AdminSuggestions';
import AdminPlaceholder from '../pages/Admin/AdminPlaceholder';
import AdminAboutTeam from '../pages/Admin/AdminAboutTeam';
import AdminInfluencers from '../pages/Admin/AdminInfluencers';
import AdminBrands from '../pages/Admin/AdminBrands';
import AdminHiring from '../pages/Admin/AdminHiring';
import AdminInvoices from '../pages/Admin/AdminInvoices';
import AdminSuccessStories from '../pages/Admin/AdminSuccessStories';
import AdminScholarship from '../pages/Admin/AdminScholarship';
import AdminRoute from '../components/common/AdminRoute';
import SubAdminDashboard from '../pages/Admin/SubAdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offerings" element={<Offerings />} />
      <Route path="/services" element={<Services />} />
      <Route path="/creators" element={<Creators />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/academy" element={<Academy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/enquiries" replace />} />
      <Route path="/sub-admin/dashboard" element={<AdminRoute><SubAdminDashboard /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/suggestions" element={<AdminRoute><AdminSuggestions /></AdminRoute>} />
      <Route path="/admin/about-team" element={<AdminRoute><AdminAboutTeam /></AdminRoute>} />
      <Route path="/admin/hiring" element={<AdminRoute><AdminHiring /></AdminRoute>} />
      <Route path="/admin/influencers" element={<AdminRoute><AdminInfluencers /></AdminRoute>} />
      <Route path="/admin/brands" element={<AdminRoute><AdminBrands /></AdminRoute>} />
      <Route path="/admin/school-mentors" element={<AdminRoute><AdminPlaceholder title="School Mentors" icon="edu" description="Manage school mentor profiles and assignments." /></AdminRoute>} />
      <Route path="/admin/success-stories" element={<AdminRoute><AdminPlaceholder title="Success Stories" icon="win" description="Manage and publish success stories." /></AdminRoute>} />
      <Route path="/admin/scholarship" element={<AdminRoute><AdminScholarship /></AdminRoute>} />
      <Route path="/admin/activity-logs" element={<AdminRoute><AdminPlaceholder title="Activity Logs" icon="log" description="View all admin and user activity logs." /></AdminRoute>} />
      <Route path="/admin/invoices" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
      <Route path="/admin/portfolio" element={<AdminRoute><AdminPlaceholder title="Portfolio" icon="port" description="Manage portfolio projects and case studies." /></AdminRoute>} />
      <Route path="/admin/bin" element={<AdminRoute><AdminPlaceholder title="Bin" icon="bin" description="Review and restore deleted items." /></AdminRoute>} />
      <Route path="/admin/website-settings" element={<AdminRoute><AdminPlaceholder title="Website Settings" icon="set" description="Configure global website settings and preferences." /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;