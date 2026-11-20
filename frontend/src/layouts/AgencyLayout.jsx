import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

/**
 * AgencyLayout: Shared application shell for all agency staff routes.
 * Persistent desktop 240px sidebar, fixed topbar, responsive mobile drawer.
 */
export default function AgencyLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-text-main antialiased flex flex-col">
      {/* Agency Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Agency Topbar */}
      <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main Workspace */}
      <div className="lg:pl-60 pt-16 flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>

        {/* Minimal Agency Footer */}
        <footer className="py-3 px-6 text-center text-xs text-text-muted border-t border-border bg-surface">
          ParcelTrack Cameroon • Agency Logistics Portal • Branch: <code className="font-mono font-semibold">backup-demo-ui</code>
        </footer>
      </div>
    </div>
  );
}
