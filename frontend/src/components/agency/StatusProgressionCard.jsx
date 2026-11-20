import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/date';

const LIFECYCLE_STAGES = [
  { key: 'REGISTERED', label: 'Registered' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'ARRIVED', label: 'Arrived' },
  { key: 'COLLECTED', label: 'Collected' },
];

const STAGE_INDEX = {
  REGISTERED: 0,
  IN_TRANSIT: 1,
  ARRIVED: 2,
  COLLECTED: 3,
};

/**
 * Authoritative forward-only sequential transitions matching backend VALID_TRANSITIONS.
 */
const NEXT_TRANSITION = {
  REGISTERED: {
    nextStatus: 'IN_TRANSIT',
    buttonLabel: 'Mark as In Transit',
    buttonClasses: 'bg-[#2563EB] hover:bg-blue-700 text-white',
    helperText:
      'Confirm that this parcel has been dispatched from the origin agency.',
    notePlaceholder: 'e.g., Dispatched on morning departure from origin branch',
  },
  IN_TRANSIT: {
    nextStatus: 'ARRIVED',
    buttonLabel: 'Mark as Arrived',
    buttonClasses: 'bg-[#0D9488] hover:bg-teal-700 text-white',
    helperText:
      'Confirm that this parcel has reached the destination agency and is ready for pickup.',
    notePlaceholder: 'e.g., Received and logged at destination agency counter',
  },
  ARRIVED: {
    nextStatus: 'COLLECTED',
    buttonLabel: 'Mark as Collected',
    buttonClasses: 'bg-[#0F172A] hover:bg-slate-800 text-white',
    helperText:
      'Confirm recipient handover. Marking as collected completes the parcel lifecycle.',
    notePlaceholder: 'e.g., Collected by recipient at destination desk',
  },
};

const MAX_NOTE_LENGTH = 250;

export default function StatusProgressionCard({
  parcel,
  onAdvanceStatus,
  isUpdating = false,
  updateError = null,
  lastSuccessMessage = null,
}) {
  const [note, setNote] = useState('');

  const currentStatus = (parcel?.status || '').toUpperCase().trim();
  const currentIdx = STAGE_INDEX[currentStatus] ?? -1;
  const nextStep = NEXT_TRANSITION[currentStatus] || null;
  const isComplete = currentStatus === 'COLLECTED';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nextStep || isUpdating) return;

    const succeeded = await onAdvanceStatus({
      status: nextStep.nextStatus,
      note: note.trim(),
    });

    if (succeeded) {
      setNote('');
    }
  };

  return (
    <div className="bg-surface rounded-[8px] border border-border shadow-2xs p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/80">
        <div>
          <h2 className="text-base font-bold text-primary">Status Management</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Sequential custody lifecycle progression
          </p>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* 4-Step Lifecycle Progress Indicator */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isReached = currentIdx >= idx;
          const isCurrent = currentIdx === idx;
          return (
            <div key={stage.key} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'bg-secondary text-white ring-4 ring-secondary/15'
                    : isReached
                    ? 'bg-primary text-white'
                    : 'bg-surface-low border border-border text-text-muted'
                }`}
              >
                {isReached ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="tabular-nums">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[11px] leading-tight ${
                  isCurrent
                    ? 'font-bold text-primary'
                    : isReached
                    ? 'font-semibold text-text-main'
                    : 'text-text-muted'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Success Feedback Banner */}
      {lastSuccessMessage && (
        <div
          role="status"
          className="p-3 rounded-[4px] bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] text-xs font-medium flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-secondary" />
          <span>{lastSuccessMessage}</span>
        </div>
      )}

      {/* Completed Lifecycle State OR Next Transition Form */}
      {isComplete ? (
        <div className="p-4 rounded-[8px] bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="w-8 h-8 rounded-[4px] bg-slate-200 flex items-center justify-center text-primary flex-shrink-0">
              <CheckCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">
                Lifecycle Complete — Parcel Collected
              </h3>
              <p className="text-xs text-text-muted">
                No further status transitions are permitted for this consignment.
              </p>
            </div>
          </div>
          {parcel?.updated_at && (
            <p className="text-[11px] text-text-muted pt-1 border-t border-border tabular-nums">
              Finalized on{' '}
              <span className="font-semibold text-text-main">
                {formatDateTime(parcel.updated_at)}
              </span>
            </p>
          )}
        </div>
      ) : nextStep ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Next Step Preview */}
          <div className="p-3.5 rounded-[8px] bg-surface-low border border-border/80 space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                Next Valid Stage
              </span>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={currentStatus} />
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                <StatusBadge status={nextStep.nextStatus} />
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {nextStep.helperText}
            </p>
          </div>

          {/* Optional Note Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="status-transition-note"
                className="text-xs font-semibold text-primary"
              >
                Operational Note <span className="font-normal text-text-muted">(optional)</span>
              </label>
              <span className="text-[11px] text-text-muted font-mono tabular-nums">
                {note.length}/{MAX_NOTE_LENGTH}
              </span>
            </div>
            <textarea
              id="status-transition-note"
              rows={3}
              maxLength={MAX_NOTE_LENGTH}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isUpdating}
              placeholder={nextStep.notePlaceholder}
              className="w-full p-2.5 rounded-[4px] bg-surface text-xs sm:text-sm text-text-main placeholder:text-text-muted border border-border focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none disabled:opacity-60"
            />
          </div>

          {/* Inline Error Feedback */}
          {updateError && (
            <div
              role="alert"
              className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{updateError}</span>
            </div>
          )}

          {/* Submit Transition Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full h-10 px-4 rounded-[4px] text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${nextStep.buttonClasses}`}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Status...</span>
              </>
            ) : (
              <>
                <span>{nextStep.buttonLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="p-4 rounded-[8px] bg-surface-low border border-border text-xs text-text-muted">
          Status transition controls are unavailable for status &ldquo;{currentStatus || 'Unknown'}&rdquo;.
        </div>
      )}
    </div>
  );
}
