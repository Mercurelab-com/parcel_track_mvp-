import React, { useState } from 'react';

/**
 * Tracking Search Bar component with input, icon, submit button,
 * hint text, and quick demonstration pills.
 */
export function TrackingSearchBar({
  initialValue = '',
  onSubmit,
  isLoading = false,
  compact = false,
}) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleQuickSelect = (trackingId) => {
    setValue(trackingId);
    onSubmit(trackingId);
  };

  return (
    <div className="flex flex-col gap-gutter-md w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md">
        <div className="flex flex-col sm:flex-row gap-gutter-md items-stretch sm:items-start">
          {/* Tracking Number Input */}
          <label className="flex-1 flex flex-col gap-gutter-sm">
            <span className="sr-only">Tracking Number</span>
            <div className="relative flex items-center w-full">
              <span
                aria-hidden="true"
                className="material-symbols-outlined absolute left-4 text-outline pointer-events-none select-none"
              >
                inventory_2
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter tracking number (e.g. PT-2026-001)"
                aria-describedby="tracking-input-hint"
                disabled={isLoading}
                className="w-full pl-12 pr-gutter-md py-3.5 rounded-md bg-surface-container-lowest border border-outline-variant font-mono text-mono-md text-on-surface placeholder:font-body placeholder:text-body-md placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-colors duration-state-change disabled:opacity-60"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => setValue('')}
                  aria-label="Clear tracking input"
                  className="absolute right-3 text-outline hover:text-on-surface-variant p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-body-md">close</span>
                </button>
              )}
            </div>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="inline-flex items-center justify-center gap-gutter-sm px-gutter-xl py-3.5 rounded-md bg-secondary text-on-secondary font-label text-label-lg shadow-sm hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 transition-colors duration-state-change cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  search
                </span>
                <span>Track Parcel</span>
              </>
            )}
          </button>
        </div>

        {/* Receipt Hint */}
        <div className="flex items-center gap-gutter-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-body-lg text-outline" aria-hidden="true">
            receipt_long
          </span>
          <span id="tracking-input-hint" className="font-body text-body-sm text-on-surface-variant">
            Your tracking code is printed on your dispatch paper ledger receipt.
          </span>
        </div>
      </form>

      {/* Demo helper badges to test all 4 lifecycle statuses easily */}
      <div className="pt-2 border-t border-outline-variant/60 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          Demo Quick Try:
        </span>
        <button
          type="button"
          onClick={() => handleQuickSelect('PT-2026-001')}
          className="text-xs font-mono px-2 py-1 rounded bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer"
          title="In Transit State"
        >
          PT-2026-001 (In Transit)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('PT-DLA-BDA-001')}
          className="text-xs font-mono px-2 py-1 rounded bg-warning-container text-on-warning-container hover:bg-warning hover:text-on-warning transition-colors cursor-pointer"
          title="Arrived at Hub / Ready for Pickup"
        >
          PT-DLA-BDA-001 (Arrived)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('PT-DLA-BDA-002')}
          className="text-xs font-mono px-2 py-1 rounded bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
          title="Newly Registered"
        >
          PT-DLA-BDA-002 (Registered)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('PT-DLA-BDA-003')}
          className="text-xs font-mono px-2 py-1 rounded bg-success-container text-on-success-container hover:bg-success hover:text-on-success transition-colors cursor-pointer"
          title="Recipient Collected"
        >
          PT-DLA-BDA-003 (Collected)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('PT-2026-999')}
          className="text-xs font-mono px-2 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-outline-variant transition-colors cursor-pointer"
          title="Simulate Not Found"
        >
          PT-2026-999 (Not Found)
        </button>
      </div>
    </div>
  );
}
