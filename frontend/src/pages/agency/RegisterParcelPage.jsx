import React from 'react';
import { PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterParcelPage() {
  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Consignment Intake Desk
          </div>
          <h1 className="text-2xl font-bold text-primary mt-1">Register New Parcel</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Route: <code className="bg-surface-low px-1.5 py-0.5 rounded text-primary font-mono text-xs">/parcels/new</code>
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-surface-low flex items-center justify-center text-primary">
          <PackagePlus className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-surface p-8 rounded-lg border border-border text-center space-y-3">
        <p className="text-text-muted">Parcel intake form placeholder ready for Phase D.2.</p>
        <Link
          to="/parcels"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-low text-text-main rounded text-sm font-medium hover:bg-border transition-colors"
        >
          &larr; Back to Parcels List
        </Link>
      </div>
    </div>
  );
}
