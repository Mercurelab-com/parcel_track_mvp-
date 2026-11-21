import React from 'react';

/**
 * Animated Loading State matching the Stitch design.
 */
export function TrackingLoading({ trackingNumber }) {
  return (
    <article className="w-full max-w-xl mx-auto bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-gutter-xl flex flex-col items-center text-center gap-gutter-lg animate-pulse">
      {/* Animated Icon Ring */}
      <div className="w-24 h-24 rounded-full bg-secondary-container text-secondary flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin" />
        <span className="material-symbols-outlined text-4xl" aria-hidden="true">
          local_shipping
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-headline text-title-lg text-primary">
          Searching for Parcel...
        </h2>
        <p className="font-body text-body-md text-on-surface-variant">
          Connecting to transport dispatch ledger for{' '}
          <span className="font-mono text-secondary font-semibold">{trackingNumber}</span>
        </p>
      </div>

      {/* Skeleton placeholders */}
      <div className="w-full flex flex-col gap-3 pt-4 border-t border-outline-variant/60">
        <div className="h-4 bg-surface-container rounded-full w-3/4 mx-auto" />
        <div className="h-4 bg-surface-container rounded-full w-1/2 mx-auto" />
      </div>
    </article>
  );
}
