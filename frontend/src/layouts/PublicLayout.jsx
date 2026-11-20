import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';

/**
 * PublicLayout: Clean customer-facing layout for public parcel tracking.
 * Strictly avoids rendering the internal agency sidebar or topbar.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col">
      {/* Minimal Public Navigation Header */}
      <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-primary tracking-tight">ParcelTrack</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase">
              Customer Portal
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-low transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Agency Desk</span>
        </Link>
      </header>

      {/* Public Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-xs text-text-muted bg-surface">
        © 2026 ParcelTrack Cameroon Logistics S.A. • Real-time Corridor Tracking
      </footer>
    </div>
  );
}
