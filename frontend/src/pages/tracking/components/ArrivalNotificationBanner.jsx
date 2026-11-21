import React from 'react';

/**
 * Arrival alert banner displayed prominently when a package has reached
 * the destination hub (status === ARRIVED) as specified in DEMO_FLOW.md.
 */
export function ArrivalNotificationBanner({ parcel }) {
  return (
    <aside
      role="alert"
      className="rounded-lg bg-warning-container/40 border-2 border-warning p-gutter-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-gutter-md shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-warning text-on-warning flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
            notifications_active
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-headline text-title-md text-on-warning-container font-bold">
              Parcel Ready for Counter Pickup!
            </span>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-warning text-on-warning font-bold">
              Arrived
            </span>
          </div>
          <p className="font-body text-body-sm text-on-warning-container">
            Your parcel has arrived at <strong className="font-semibold">{parcel.pickupBranch || parcel.destination}</strong>.
            Please present a valid National Identity Card (CNI) or receipt code at the counter.
          </p>
          {parcel.pickupHours && (
            <span className="text-xs font-mono text-on-warning-container/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Counter Hours: {parcel.pickupHours}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          alert(
            `Pickup Instructions for ${parcel.recipientName || 'Recipient'}:\n\n` +
            `Destination Hub: ${parcel.destination}\n` +
            `Counter: ${parcel.pickupBranch || 'Counter 1'}\n` +
            `Tracking Code: ${parcel.trackingNumber}\n\n` +
            `Requirements:\n` +
            `1. Original National ID Card (CNI) or Passport\n` +
            `2. SMS Notification code or physical receipt`
          );
        }}
        className="px-gutter-md py-2.5 rounded-md bg-warning text-on-warning font-label text-label-md hover:brightness-95 transition-all shadow-sm shrink-0 cursor-pointer font-bold"
      >
        View Pickup Instructions
      </button>
    </aside>
  );
}
