import React from 'react';
import { Check, HelpCircle } from 'lucide-react';

/**
 * Reusable StatusBadge component conforming to Equatorial Precision design tokens.
 *
 * Status Colors:
 * - REGISTERED:  bg #F1F5F9, text #475569, border #CBD5E1, solid slate dot #94A3B8
 * - IN_TRANSIT:   bg #EFF6FF, text #1D4ED8, border #BFDBFE, pulsating blue dot #3B82F6
 * - ARRIVED:      bg #F0FDFA, text #0F766E, border #99F6E4, solid emerald teal dot #14B8A6
 * - COLLECTED:    bg #F8FAFC, text #334155, border #E2E8F0, checkmark icon #64748B
 */
export default function StatusBadge({ status, className = '' }) {
  const normalizedStatus = (status || '').toUpperCase().trim();

  switch (normalizedStatus) {
    case 'REGISTERED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] flex-shrink-0" />
          <span>Registered</span>
        </span>
      );

    case 'IN_TRANSIT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] ${className}`}
        >
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
          </span>
          <span>In Transit</span>
        </span>
      );

    case 'ARRIVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4] ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] flex-shrink-0" />
          <span>Arrived</span>
        </span>
      );

    case 'COLLECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] ${className}`}
        >
          <Check className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
          <span>Collected</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-low text-text-muted border border-border ${className}`}
        >
          <HelpCircle className="w-3 h-3 text-text-muted flex-shrink-0" />
          <span>{status || 'Unknown'}</span>
        </span>
      );
  }
}
