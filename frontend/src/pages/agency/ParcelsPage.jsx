import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ParcelsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Parcels Inventory
          </div>
          <h1 className="text-2xl font-bold text-primary mt-1">Parcels Management</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Route: <code className="bg-surface-low px-1.5 py-0.5 rounded text-primary font-mono text-xs">/parcels</code>
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-surface-low flex items-center justify-center text-primary">
          <Package className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-surface p-8 rounded-lg border border-border text-center space-y-3">
        <p className="text-text-muted">Parcels Management inventory placeholder ready for implementation in next phase.</p>
        <Link
          to="/parcels/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Go to Register Parcel
        </Link>
      </div>
    </div>
  );
}
