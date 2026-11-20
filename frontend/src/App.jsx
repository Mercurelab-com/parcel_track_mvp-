import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AgencyLayout from './layouts/AgencyLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardPage from './pages/agency/DashboardPage.jsx';
import ParcelsPage from './pages/agency/ParcelsPage.jsx';
import RegisterParcelPage from './pages/agency/RegisterParcelPage.jsx';
import ParcelDetailsPage from './pages/agency/ParcelDetailsPage.jsx';
import TrackingPage from './pages/public/TrackingPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Agency Staff Protected / Operations Shell */}
        <Route element={<AgencyLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/parcels" element={<ParcelsPage />} />
          <Route path="/parcels/new" element={<RegisterParcelPage />} />
          <Route path="/parcels/:trackingId" element={<ParcelDetailsPage />} />
        </Route>

        {/* Public Customer Tracking Shell (No Agency Sidebar or Topbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/track" element={<TrackingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
