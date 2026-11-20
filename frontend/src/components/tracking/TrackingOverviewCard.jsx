import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Package } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/date';

export default function TrackingOverviewCard({ parcel }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!parcel?.tracking_id) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(parcel.tracking_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Top Header Row */}
      <div className="p-4 sm:p-5 border-b border-border/80 bg-surface-low/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Tracking Code
          </span>
          <span className="font-mono text-base sm:text-lg font-bold text-primary tracking-wide">
            {parcel.tracking_id}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-surface-low text-text-muted hover:text-text-main transition-colors cursor-pointer"
            title="Copy tracking code"
            aria-label="Copy tracking code"
          >
            {copied ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div>
          <StatusBadge status={parcel.status} />
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Transit Corridor Route */}
        <div className="md:col-span-2 space-y-2">
          <div className="text-xs uppercase tracking-wider text-text-muted font-bold">
            Transit Corridor
          </div>
          <div className="flex items-center gap-3 text-lg sm:text-xl font-bold text-primary">
            <span>{parcel.origin}</span>
            <ArrowRight className="w-5 h-5 text-secondary flex-shrink-0" />
            <span>{parcel.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
            <Package className="w-4 h-4 text-text-muted" />
            <span>Consignment: <strong className="text-text-main font-medium">{parcel.description}</strong></span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="bg-surface-low p-4 rounded-lg border border-border/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Registered:</span>
            <span className="font-medium text-text-main">{formatDateTime(parcel.created_at)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Last Updated:</span>
            <span className="font-medium text-text-main">{formatDateTime(parcel.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
