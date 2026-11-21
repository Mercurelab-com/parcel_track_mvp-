import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layout/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import ParcelsPage from './pages/parcels/ParcelsPage'

import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Agency dashboard shell */}
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="parcels" element={<ParcelsPage />} />
          {/* /parcels/new scrolls into the form on ParcelsPage */}
          <Route path="parcels/new" element={<ParcelsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
