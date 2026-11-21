import React from 'react';

/**
 * Public customer tracking footer matching the Stitch design.
 */
export function TrackingFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant py-gutter-lg mt-auto">
      <div className="max-w-6xl mx-auto px-page-margin flex flex-col sm:flex-row items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-sm text-on-surface-variant">
          <span className="font-title text-title-md text-primary font-semibold">ParcelTrack</span>
          <span className="font-body text-body-sm text-outline">·</span>
          <span className="font-body text-body-sm text-on-surface-variant">
            Public Customer Tracking Service
          </span>
        </div>
        <p className="font-body text-body-sm text-on-surface-variant text-center sm:text-right">
          © 2026 ParcelTrack. Douala ↔ Bamenda Inter-City Express. Need help? Visit your nearest transport agency.
        </p>
      </div>
    </footer>
  );
}
