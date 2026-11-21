import React from 'react';

/**
 * Parcel Information card displaying verified registration, route,
 * sender/recipient information matching the Stitch design.
 */
export function ParcelInfoCard({ parcel }) {
  return (
    <article className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-gutter-lg flex flex-col gap-gutter-lg">
      <header className="flex items-center justify-between border-b border-outline-variant pb-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h2 className="font-headline text-title-lg text-primary">Parcel Information</h2>
          <p className="font-body text-body-sm text-on-surface-variant">
            Verified agency registration and route details
          </p>
        </div>
        <span className="material-symbols-outlined text-headline-md text-outline" aria-hidden="true">
          package_2
        </span>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter-lg gap-y-gutter-md">
        {/* Tracking Number */}
        <div className="flex flex-col gap-gutter-xs">
          <dt className="font-label text-label-sm text-on-surface-variant">Tracking Number</dt>
          <dd className="font-mono text-mono-md text-primary tabular-nums font-bold">
            {parcel.trackingNumber}
          </dd>
        </div>

        {/* Registration Date */}
        <div className="flex flex-col gap-gutter-xs">
          <dt className="font-label text-label-sm text-on-surface-variant">Registration Date</dt>
          <dd className="font-body text-body-md text-on-surface tabular-nums">
            {parcel.registrationDate}
          </dd>
        </div>

        {/* Sender Name */}
        <div className="flex flex-col gap-gutter-xs">
          <dt className="font-label text-label-sm text-on-surface-variant">Sender</dt>
          <dd className="font-title text-title-md text-on-surface">
            {parcel.senderName || 'Not specified'}
          </dd>
        </div>

        {/* Recipient Name */}
        <div className="flex flex-col gap-gutter-xs">
          <dt className="font-label text-label-sm text-on-surface-variant">Recipient</dt>
          <dd className="font-title text-title-md text-on-surface">
            {parcel.recipientName || 'Not specified'}
            {parcel.recipientPhone && (
              <span className="block text-xs font-mono text-on-surface-variant">
                {parcel.recipientPhone}
              </span>
            )}
          </dd>
        </div>

        {/* Origin Agency */}
        <div className="flex flex-col gap-gutter-xs">
          <dt className="font-label text-label-sm text-on-surface-variant">Origin Agency</dt>
          <dd className="font-body text-body-md text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-body-lg text-primary" aria-hidden="true">
              trip_origin
            </span>
            <span>{parcel.origin}</span>
          </dd>
        </div>

        {/* Destination Agency */}
        <div className="flex flex-col gap-gutter-xs">
          <dt className="font-label text-label-sm text-on-surface-variant">Destination Agency</dt>
          <dd className="font-body text-body-md text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-body-lg text-secondary" aria-hidden="true">
              location_on
            </span>
            <span>{parcel.destination}</span>
          </dd>
        </div>

        {/* Package Specifications */}
        {parcel.weightKg && (
          <div className="flex flex-col gap-gutter-xs">
            <dt className="font-label text-label-sm text-on-surface-variant">Weight & Type</dt>
            <dd className="font-body text-body-md text-on-surface">
              {parcel.weightKg} kg · {parcel.packageType || 'General Cargo'}
            </dd>
          </div>
        )}

        {/* Expected Arrival */}
        <div className="flex flex-col gap-gutter-xs sm:col-span-2 pt-gutter-sm border-t border-outline-variant">
          <dt className="font-label text-label-sm text-on-surface-variant">Expected Arrival</dt>
          <dd className="font-title text-title-md text-primary tabular-nums font-semibold">
            {parcel.expectedArrival}
          </dd>
        </div>
      </dl>
    </article>
  );
}
