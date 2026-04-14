/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import UserLayout from './components/user/UserLayout';
import Home from './pages/user/Home';
import Memories from './pages/user/Memories';
import Explore from './pages/user/Explore';
import Referral from './pages/user/Referral';
import Profile from './pages/user/Profile';
import Scan from './pages/user/Scan';
import CustomFrames from './pages/user/CustomFrames';
import Booking from './pages/user/Booking';
import Queue from './pages/user/Queue';
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerUpload from './pages/partner/Upload';
import PartnerAnalytics from './pages/partner/Analytics';
import PartnerLayout from './components/partner/PartnerLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* User Side Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="memories" element={<Memories />} />
          <Route path="explore" element={<Explore />} />
          <Route path="referral" element={<Referral />} />
          <Route path="profile" element={<Profile />} />
          <Route path="scan" element={<Scan />} />
          <Route path="frames" element={<CustomFrames />} />
          <Route path="booking/:boothId" element={<Booking />} />
          <Route path="queue/:boothId" element={<Queue />} />
        </Route>

        {/* Partner Side Routes */}
        <Route path="/partner" element={<PartnerLayout />}>
          <Route index element={<PartnerDashboard />} />
          <Route path="upload" element={<PartnerUpload />} />
          <Route path="analytics" element={<PartnerAnalytics />} />
          <Route path="customers" element={<PartnerAnalytics />} /> {/* Placeholder */}
          <Route path="referral" element={<PartnerAnalytics />} /> {/* Placeholder */}
          <Route path="settings" element={<PartnerAnalytics />} /> {/* Placeholder */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PwaInstallPrompt />
    </Router>
  );
}
