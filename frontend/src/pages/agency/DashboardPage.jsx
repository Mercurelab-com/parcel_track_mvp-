import React from 'react';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Banner Card */}
      <div className="bg-surface p-6 rounded-lg border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-secondary font-semibold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Phase D.2 Shell Active
          </div>
          <h1 className="text-2xl font-bold text-primary mt-1">Agency Dashboard</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Welcome to the ParcelTrack agency operations center.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/parcels/new"
            className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Register Parcel
          </Link>
          <Link
            to="/track"
            className="px-4 py-2 bg-surface-low text-text-main border border-border rounded text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Open Public Tracking
          </Link>
        </div>
      </div>

      {/* StatusBadge Component Verification Section */}
      <div className="bg-surface p-6 rounded-lg border border-border shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-primary">StatusBadge Component Verification</h2>
          <p className="text-xs text-text-muted">
            Conforming to Equatorial Precision design tokens for the 4 lifecycle states:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-3 bg-surface-low rounded border border-border/60 flex flex-col items-center gap-2 text-center">
            <span className="text-[11px] font-bold text-text-muted uppercase">1. Registered</span>
            <StatusBadge status="REGISTERED" />
          </div>

          <div className="p-3 bg-surface-low rounded border border-border/60 flex flex-col items-center gap-2 text-center">
            <span className="text-[11px] font-bold text-text-muted uppercase">2. In Transit</span>
            <StatusBadge status="IN_TRANSIT" />
          </div>

          <div className="p-3 bg-surface-low rounded border border-border/60 flex flex-col items-center gap-2 text-center">
            <span className="text-[11px] font-bold text-text-muted uppercase">3. Arrived</span>
            <StatusBadge status="ARRIVED" />
          </div>

          <div className="p-3 bg-surface-low rounded border border-border/60 flex flex-col items-center gap-2 text-center">
            <span className="text-[11px] font-bold text-text-muted uppercase">4. Collected</span>
            <StatusBadge status="COLLECTED" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/parcels"
          className="bg-surface p-5 rounded-lg border border-border hover:border-secondary/40 hover:shadow-xs transition-all group"
        >
          <span className="text-xs uppercase tracking-wider text-text-muted font-bold">Consignments</span>
          <h3 className="text-base font-bold text-primary mt-1 group-hover:text-secondary transition-colors">
            Parcels Management
          </h3>
          <p className="text-xs text-text-muted mt-1">View, search and filter all registered shipments.</p>
          <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-3">
            <span>Explore list</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/parcels/PT-BAM-8F31A2"
          className="bg-surface p-5 rounded-lg border border-border hover:border-secondary/40 hover:shadow-xs transition-all group"
        >
          <span className="text-xs uppercase tracking-wider text-text-muted font-bold">Consignment Details</span>
          <h3 className="text-base font-bold text-primary mt-1 group-hover:text-secondary transition-colors">
            Parcel Details (Demo)
          </h3>
          <p className="text-xs text-text-muted mt-1">Lifecycle stepper and custody progression log.</p>
          <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-3">
            <span>View demo consignment</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/track"
          className="bg-surface p-5 rounded-lg border border-border hover:border-secondary/40 hover:shadow-xs transition-all group"
        >
          <span className="text-xs uppercase tracking-wider text-text-muted font-bold">Public Portal</span>
          <h3 className="text-base font-bold text-primary mt-1 group-hover:text-secondary transition-colors">
            Customer Tracking
          </h3>
          <p className="text-xs text-text-muted mt-1">Isolated public lookup without agency navigation.</p>
          <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-3">
            <span>Open portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
