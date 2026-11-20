import React from 'react';
import { Check } from 'lucide-react';
import { formatDateTime } from '../../utils/date';

const MILESTONES = [
  {
    status: 'REGISTERED',
    title: 'Parcel Registered',
    defaultDesc: 'Consignment intake recorded at origin agency.',
  },
  {
    status: 'IN_TRANSIT',
    title: 'In Transit',
    defaultDesc: 'Parcel is traveling toward the destination agency.',
  },
  {
    status: 'ARRIVED',
    title: 'Arrived at Destination Hub',
    defaultDesc: 'Parcel has arrived at the destination agency and is ready for collection.',
  },
  {
    status: 'COLLECTED',
    title: 'Collected by Recipient',
    defaultDesc: 'Parcel has been picked up by the recipient.',
  },
];

const STATUS_RANK = {
  REGISTERED: 1,
  IN_TRANSIT: 2,
  ARRIVED: 3,
  COLLECTED: 4,
};

export default function TrackingTimeline({ history = [], currentStatus }) {
  const currentRank = STATUS_RANK[currentStatus] || 0;

  // Build a lookup for recorded history milestones
  const historyMap = {};
  history.forEach((item) => {
    historyMap[item.status] = item;
  });

  return (
    <div className="bg-surface rounded-xl border border-border shadow-xs p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <h2 className="text-base font-bold text-primary">Shipment Journey Timeline</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Custody progression across transit milestones
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-low text-text-muted font-mono">
          {currentRank} of 4 Milestones Completed
        </span>
      </div>

      {/* Stepper Vertical Tree */}
      <div className="relative pl-7 sm:pl-9 space-y-7 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-3 before:w-0.5 before:bg-border">
        {MILESTONES.map((step, idx) => {
          const stepRank = STATUS_RANK[step.status];
          const isCompleted = stepRank <= currentRank;
          const isCurrent = step.status === currentStatus;
          const historyEntry = historyMap[step.status];

          return (
            <div key={step.status} className="relative group">
              {/* Stepper Dot Pin */}
              <div
                className={`absolute -left-7 sm:-left-9 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCurrent && isCompleted
                    ? 'bg-secondary text-white ring-4 ring-secondary/20'
                    : isCompleted
                    ? 'bg-primary text-white'
                    : 'bg-surface border-2 border-border text-text-muted'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span className="text-[10px]">{idx + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-sm ${
                        isCompleted ? 'text-primary' : 'text-text-muted'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </div>

                  {historyEntry?.timestamp && (
                    <span className="text-xs text-text-muted font-mono">
                      {formatDateTime(historyEntry.timestamp)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  {historyEntry?.note || step.defaultDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
