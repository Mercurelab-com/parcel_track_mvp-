import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, MapPin, Menu, Search, ChevronDown } from 'lucide-react';

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();

  // Dynamic breadcrumb mapping
  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/') {
      return {
        title: 'Dashboard',
        subtitle: 'Monitor and manage your parcel operations.',
      };
    }
    if (path === '/parcels') {
      return {
        title: 'Parcels Management',
        subtitle: 'Consignment manifest across all inter-city hubs.',
      };
    }
    if (path === '/parcels/new') {
      return {
        title: 'Register Parcel',
        subtitle: 'Consignment intake and waybill issuance desk.',
      };
    }
    if (path.startsWith('/parcels/')) {
      return {
        title: 'Parcel Details',
        subtitle: 'Real-time custody tracking and lifecycle milestone progression.',
      };
    }
    return {
      title: 'Agency Operations',
      subtitle: 'Central inter-city transport logistics portal.',
    };
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-border z-30 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all">
      {/* Left: Mobile Toggle & Page Title Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-low lg:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-sm sm:text-base text-primary truncate">
            {title}
          </span>
          <span className="text-text-muted hidden sm:inline">/</span>
          <span className="text-xs text-text-muted truncate hidden sm:inline">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right: Search, Notifications & Hub Selector */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Visual Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search tracking ID..."
            className="w-full h-9 pl-9 pr-3 rounded bg-surface-low text-xs text-text-main placeholder:text-text-muted border border-border/60 focus:outline-none focus:ring-1 focus:ring-secondary focus:bg-surface transition-all"
            readOnly
          />
        </div>

        {/* Notifications Icon (Visual Only) */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-low transition-colors"
          aria-label="Notifications"
          title="Notifications (Visual only)"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />
        </button>

        {/* Active Hub Chip (Demo Static) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-low border border-border/80 text-xs text-text-main font-semibold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
          <span className="hidden xs:inline">Akwa Hub</span>
          <span className="text-[10px] text-text-muted font-normal hidden lg:inline">
            (Douala)
          </span>
          <ChevronDown className="w-3 h-3 text-text-muted" />
        </div>
      </div>
    </header>
  );
}
