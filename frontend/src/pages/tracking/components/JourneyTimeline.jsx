import React from 'react';
import { PARCEL_STATUS, STATUS_METADATA } from '../types.js';

/**
 * 4-Stage Vertical Journey Timeline matching the Stitch design.
 * Statuses:
 * 1. REGISTERED
 * 2. IN_TRANSIT
 * 3. ARRIVED
 * 4. COLLECTED
 */
export function JourneyTimeline({ currentStatus, timelineEvents = [] }) {
  const steps = [
    PARCEL_STATUS.REGISTERED,
    PARCEL_STATUS.IN_TRANSIT,
    PARCEL_STATUS.ARRIVED,
    PARCEL_STATUS.COLLECTED,
  ];

  const currentStepIndex = steps.indexOf(currentStatus);

  // Map any timestamps from timelineEvents
  const eventMap = {};
  timelineEvents.forEach((ev) => {
    eventMap[ev.status] = ev;
  });

  return (
    <article className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-gutter-lg flex flex-col gap-gutter-lg">
      <header className="flex flex-col gap-gutter-xs border-b border-outline-variant pb-gutter-md">
        <h2 className="font-headline text-title-lg text-primary">Parcel Journey</h2>
        <p className="font-body text-body-sm text-on-surface-variant">
          Step-by-step delivery milestones
        </p>
      </header>

      <ol className="flex flex-col" aria-label="Parcel delivery timeline">
        {steps.map((stepKey, idx) => {
          const meta = STATUS_METADATA[stepKey];
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;
          const isLast = idx === steps.length - 1;

          const event = eventMap[stepKey];
          const timeText = event?.timestamp || (isUpcoming ? 'Pending' : '');

          return (
            <li
              key={stepKey}
              className={`relative flex gap-gutter-md ${!isLast ? 'pb-gutter-lg' : ''}`}
            >
              {/* Stepper Node & Connecting Line */}
              <div className="flex flex-col items-center">
                {isCompleted && (
                  <div className="w-9 h-9 rounded-full bg-success text-on-primary flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                      check
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary ring-4 ring-secondary-container flex items-center justify-center shrink-0 z-10 shadow-sm animate-pulse">
                    <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                      {meta.icon}
                    </span>
                  </div>
                )}

                {isUpcoming && (
                  <div className="w-9 h-9 rounded-full bg-surface-container-low border-2 border-outline-variant text-on-surface-variant flex items-center justify-center shrink-0 z-10">
                    <span className="material-symbols-outlined text-title-lg text-outline" aria-hidden="true">
                      {meta.icon}
                    </span>
                  </div>
                )}

                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 mt-1 ${
                      isCompleted ? 'bg-success' : 'bg-outline-variant'
                    }`}
                  />
                )}
              </div>

              {/* Step Information */}
              <div className="flex flex-col gap-gutter-xs pt-1 flex-1">
                <div className="flex items-center gap-gutter-sm flex-wrap">
                  <span
                    className={`font-label text-label-lg ${
                      isCurrent
                        ? 'text-secondary font-bold'
                        : isCompleted
                        ? 'text-primary font-semibold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {meta.label}
                  </span>

                  {isCompleted && (
                    <span className="font-label text-label-sm text-on-success-container bg-success-container px-2 py-0.5 rounded-full font-medium">
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="font-label text-label-sm text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full font-semibold">
                      Current
                    </span>
                  )}
                </div>

                <p
                  className={`font-body text-body-md ${
                    isCurrent ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                  }`}
                >
                  {event?.note || meta.timelineDesc}
                </p>

                {timeText && (
                  <time
                    className={`font-mono text-mono-sm tabular-nums ${
                      isCurrent
                        ? 'text-secondary font-semibold'
                        : isCompleted
                        ? 'text-on-surface-variant'
                        : 'text-outline italic'
                    }`}
                  >
                    {timeText}
                  </time>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
