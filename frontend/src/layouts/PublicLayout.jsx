import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col font-sans">
      {/* Standalone Public Navigation Header */}
      <header className="h-16 border-b border-border bg-surface px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link to="/track" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-primary tracking-tight">
                  ParcelTrack
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-secondary/15 text-secondary uppercase">
                  CMR
                </span>
              </div>
              <span className="text-[10px] text-text-muted hidden sm:inline -mt-0.5">
                Inter-City Logistics Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Public Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-text-muted">
            <Link to="/track" className="text-secondary hover:underline">
              Track Parcel
            </Link>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-low hover:bg-border text-xs font-semibold text-text-main transition-colors border border-border/60"
          >
            <span>Agency Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
          </Link>
        </div>
      </header>

      {/* Main Public Tracking Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-xs text-text-muted bg-surface">
        &copy; 2026 ParcelTrack Cameroon Logistics S.A. &bull; Inter-City Transport Corridor Tracking across Douala, Yaoundé, Bafoussam & Bamenda.
      </footer>
    </div>
  );
}
