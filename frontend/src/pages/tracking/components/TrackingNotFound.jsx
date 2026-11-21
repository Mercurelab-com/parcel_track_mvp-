import React, { useState } from 'react';

/**
 * Friendly Not-Found card matching the Stitch design:
 * "We couldn't find your parcel. Please check your tracking number and try again."
 */
export function TrackingNotFound({ trackingNumber, onRetry, onReset }) {
  const [retryInput, setRetryInput] = useState(trackingNumber || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (retryInput.trim()) {
      onRetry(retryInput.trim());
    }
  };

  return (
    <article className="w-full max-w-xl mx-auto bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-gutter-xl flex flex-col items-center text-center gap-gutter-lg">
      {/* Friendly Search Illustration */}
      <div className="w-40 h-40 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant/60 shadow-inner">
        <div className="relative">
          <span className="material-symbols-outlined text-6xl text-outline" aria-hidden="true">
            package_2
          </span>
          <span className="material-symbols-outlined text-4xl text-error absolute -bottom-2 -right-2 bg-surface-container-lowest rounded-full p-1 shadow">
            search_off
          </span>
        </div>
      </div>

      {/* Error Message */}
      <div className="flex flex-col gap-gutter-sm">
        <h1 className="font-headline text-headline-md sm:text-headline-lg text-primary">
          We couldn't find your parcel.
        </h1>
        <p className="font-body text-body-md sm:text-body-lg text-on-surface-variant max-w-md mx-auto">
          No package was found matching <code className="font-mono text-error font-semibold bg-error-container/50 px-1.5 py-0.5 rounded">{trackingNumber}</code>.
          Please check the code on your receipt and try again.
        </p>
      </div>

      {/* Retry Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-gutter-md text-left">
        <div className="flex flex-col sm:flex-row gap-gutter-md items-stretch sm:items-start">
          <label className="flex-1 flex flex-col gap-gutter-sm">
            <span className="sr-only">Tracking Number</span>
            <div className="relative flex items-center w-full">
              <span
                aria-hidden="true"
                className="material-symbols-outlined absolute left-4 text-outline pointer-events-none"
              >
                inventory_2
              </span>
              <input
                type="text"
                value={retryInput}
                onChange={(e) => setRetryInput(e.target.value)}
                placeholder="Enter tracking number (e.g. PT-2026-001)"
                aria-describedby="retry-tracking-hint"
                className="w-full pl-12 pr-gutter-md py-3.5 rounded-md bg-surface-container-lowest border border-outline-variant font-mono text-mono-md text-on-surface placeholder:font-body placeholder:text-body-md placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-colors duration-state-change"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={!retryInput.trim()}
            className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-md bg-secondary text-on-secondary font-label text-label-lg shadow-sm hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary transition-colors duration-state-change cursor-pointer shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              refresh
            </span>
            <span>Try Again</span>
          </button>
        </div>

        <p id="retry-tracking-hint" className="font-body text-body-sm text-on-surface-variant text-center">
          Tracking IDs are typically formatted as <span className="font-mono">PT-2026-001</span> or <span className="font-mono">PT-DLA-BDA-001</span>.
        </p>
      </form>

      {/* Return Button */}
      <div className="pt-2 border-t border-outline-variant/60 w-full flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-label text-secondary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Return to Tracking Homepage
        </button>
      </div>
    </article>
  );
}
