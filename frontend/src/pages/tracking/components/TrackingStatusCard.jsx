import React from 'react';
import { STATUS_METADATA, PARCEL_STATUS } from '../types.js';

/**
 * Current status highlight card matching the Stitch design.
 */
export function TrackingStatusCard({ parcel }) {
  const meta = STATUS_METADATA[parcel.status] || STATUS_METADATA[PARCEL_STATUS.REGISTERED];

  // Specific icon background classes based on status
  const iconBgClasses = {
    [PARCEL_STATUS.REGISTERED]: 'bg-primary-container text-primary',
    [PARCEL_STATUS.IN_TRANSIT]: 'bg-secondary-container text-secondary',
    [PARCEL_STATUS.ARRIVED]: 'bg-warning-container text-warning',
    [PARCEL_STATUS.COLLECTED]: 'bg-success-container text-success',
  }[parcel.status] || 'bg-secondary-container text-secondary';

  return (
    <article className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-gutter-lg flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
      <div className="flex items-start sm:items-center gap-gutter-md">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBgClasses}`}>
          <span className="material-symbols-outlined text-headline-md" aria-hidden="true">
            {meta.icon}
          </span>
        </div>
        <div className="flex flex-col gap-gutter-xs">
          <span className="font-label text-label-sm uppercase tracking-wider text-secondary font-semibold">
            Current Delivery Status
          </span>
          <h2 className="font-headline text-title-lg text-primary">
            {meta.label}
          </h2>
          <p className="font-body text-body-md text-on-surface-variant">
            {meta.summaryDesc}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-gutter-xs border-t sm:border-t-0 pt-gutter-md sm:pt-0 border-outline-variant shrink-0">
        <span className="font-label text-label-sm text-on-surface-variant">
          Expected Arrival
        </span>
        <span className="font-title text-title-md text-primary tabular-nums font-semibold">
          {parcel.expectedArrivalShort || parcel.expectedArrival}
        </span>
      </div>
    </article>
  );
}
