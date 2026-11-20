import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Radar,
  LifeBuoy,
  Truck,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  // Navigation styling conforming to Equatorial Precision
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-text-muted hover:text-text-main hover:bg-surface-low'
    }`;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-60 bg-surface border-r border-border z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shadow-xs">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-primary">
                ParcelTrack
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-surface-low text-text-muted font-mono text-[10px] uppercase font-bold tracking-wider">
                CM Hub
              </span>
              <button
                type="button"
                className="p-1 rounded text-text-muted hover:text-text-main hover:bg-surface-low lg:hidden"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Section: Operations */}
          <div className="px-4 pt-5 pb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Operations
            </span>
          </div>

          <nav className="flex flex-col gap-1 px-3" aria-label="Agency Navigation">
            <NavLink to="/" end className={navLinkClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/parcels" end className={navLinkClass} onClick={onClose}>
              <Package className="w-4 h-4 flex-shrink-0" />
              <span>Parcels</span>
            </NavLink>

            <NavLink to="/parcels/new" className={navLinkClass} onClick={onClose}>
              <PackagePlus className="w-4 h-4 flex-shrink-0" />
              <span>Register Parcel</span>
            </NavLink>

            <NavLink to="/track" className={navLinkClass} onClick={onClose}>
              <Radar className="w-4 h-4 flex-shrink-0 text-secondary" />
              <span>Track Parcel</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Section: Support & Administrator Profile */}
        <div className="p-3 border-t border-border/60 space-y-3">
          <nav aria-label="Support Navigation">
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-main hover:bg-surface-low transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Help & Support</span>
            </a>
          </nav>

          {/* Agency Operator Identity Card */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-low border border-border/60">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AA
              </div>
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-white"
                title="Online Desk"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-text-main truncate leading-tight">
                Agency Administrator
              </span>
              <span className="text-[11px] text-text-muted truncate mt-0.5">
                Akwa Hub • Douala
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
