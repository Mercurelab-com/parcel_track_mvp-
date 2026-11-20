import React from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';

export default function TrackingSearchForm({
  trackingId,
  onChange,
  onSubmit,
  isLoading,
}) {
  return (
    <div className="max-w-2xl mx-auto bg-surface rounded-xl p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="relative flex-1 flex items-center">
          <Search className="w-5 h-5 absolute left-3.5 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={trackingId}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter tracking number (e.g. PT-BAM-8F31A2)"
            aria-label="Tracking number input"
            disabled={isLoading}
            className="w-full h-12 pl-11 pr-4 bg-surface-low text-text-main font-mono text-sm rounded-lg border border-transparent focus:border-secondary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all uppercase placeholder:normal-case placeholder:text-text-muted"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !trackingId.trim()}
          className="h-12 px-6 rounded-lg bg-secondary hover:bg-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span>Track Parcel</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
