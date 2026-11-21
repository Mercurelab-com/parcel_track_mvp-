import React from 'react';

/**
 * Public customer tracking header matching the Stitch design.
 */
export function TrackingHeader({ onReset }) {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-page-margin h-20 flex items-center justify-between gap-gutter-lg">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-md cursor-pointer text-left"
          title="Return to ParcelTrack Home"
        >
          <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              local_shipping
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-title-lg text-primary tracking-tight">ParcelTrack</span>
            <span className="text-[11px] font-body text-on-surface-variant uppercase tracking-wider -mt-1 hidden sm:inline">
              Customer Portal
            </span>
          </div>
        </button>

        <nav aria-label="Main navigation" className="flex items-center gap-4 sm:gap-gutter-xl">
          <button
            type="button"
            onClick={onReset}
            className="font-label text-label-md sm:text-label-lg text-secondary border-b-2 border-secondary py-1 cursor-pointer"
          >
            Track Parcel
          </button>
          <a
            href="#help"
            onClick={(e) => {
              e.preventDefault();
              alert('ParcelTrack Customer Help Desk\nRoute: Douala ↔ Bamenda Express Corridor\nFor assistance, visit your origin dispatch counter or destination pickup hub.');
            }}
            className="font-label text-label-md sm:text-label-lg text-on-surface-variant hover:text-primary transition-colors py-1 cursor-pointer"
          >
            Help & Agencies
          </a>
        </nav>
      </div>
    </header>
  );
}
