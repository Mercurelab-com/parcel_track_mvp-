import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, Copy, PackagePlus } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/date';

/**
 * Confirmation panel displayed after POST /api/parcels succeeds.
 * Strictly reflects real returned ParcelResponse fields with no SMS/WhatsApp claims.
 */
export default function RegistrationSuccessCard({ parcel, onRegisterAnother }) {
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
    <section
      aria-label="Parcel Registration Confirmation"
      className="bg-surface rounded-[8px] border border-border shadow-xs overflow-hidden max-w-3xl mx-auto"
    >
      {/* Top Success Header */}
      <div className="p-5 sm:p-6 bg-[#F0FDFA] border-b border-[#99F6E4] flex items-start gap-3">
        <div className="w-10 h-10 rounded-[8px] bg-[#0D9488] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-[#0F766E]">
            Parcel Registered Successfully
          </h2>
          <p className="text-xs sm:text-sm text-[#0F766E]/90">
            The consignment has been recorded and assigned a unique tracking code.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Generated Tracking ID Highlight */}
        <div className="p-5 rounded-[8px] bg-surface-low border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
              Generated Tracking ID
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-primary tracking-wide tabular-nums">
              {parcel.tracking_id}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <StatusBadge status={parcel.status} />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[4px] bg-surface border border-border text-xs font-semibold text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-secondary">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-text-muted" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Returned Parcel Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-[8px] bg-surface border border-border space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
              Route
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <span>{parcel.origin}</span>
              <ArrowRight className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>{parcel.destination}</span>
            </div>
            <p className="text-text-muted pt-1">
              <strong className="text-text-main font-medium">Contents:</strong> {parcel.description}
            </p>
          </div>

          <div className="p-4 rounded-[8px] bg-surface border border-border space-y-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Sender
              </span>
              <span className="font-semibold text-text-main">{parcel.sender_name}</span>
              <span className="text-text-muted font-mono tabular-nums ml-2">
                {parcel.sender_phone}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Recipient
              </span>
              <span className="font-semibold text-text-main">{parcel.recipient_name}</span>
              <span className="text-text-muted font-mono tabular-nums ml-2">
                {parcel.recipient_phone}
              </span>
            </div>
            <div className="pt-1 border-t border-border/70 text-[11px] text-text-muted tabular-nums">
              Registered: <span className="text-text-main font-medium">{formatDateTime(parcel.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border">
          <Link
            to="/parcels"
            className="text-xs font-semibold text-text-muted hover:text-primary transition-colors"
          >
            &larr; Return to Parcels List
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onRegisterAnother}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-[4px] bg-surface-low text-primary border border-border text-xs font-semibold hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Register Another Parcel</span>
            </button>

            <Link
              to={`/parcels/${encodeURIComponent(parcel.tracking_id)}`}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-[4px] bg-primary text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>Open Parcel Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
