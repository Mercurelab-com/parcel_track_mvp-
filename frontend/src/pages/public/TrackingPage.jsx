import React from 'react';
import { Radar, Search } from 'lucide-react';

export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Public Inter-City Telemetry
          </div>
          <h1 className="text-2xl font-bold text-primary mt-1">Public Parcel Tracking</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Route: <code className="bg-surface-low px-1.5 py-0.5 rounded text-primary font-mono text-xs">/track</code>
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
          <Radar className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-surface p-8 rounded-lg border border-border max-w-xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Enter tracking number (e.g. PT-BAM-8F31A2)"
            defaultValue="PT-BAM-8F31A2"
            className="w-full h-11 pl-11 pr-4 bg-surface-low border border-border rounded text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-secondary"
            readOnly
          />
        </div>
        <button
          type="button"
          className="w-full h-10 bg-secondary text-white font-medium text-sm rounded hover:bg-teal-700 transition-colors"
        >
          Track Parcel (Placeholder)
        </button>
      </div>
    </div>
  );
}
