import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  HelpCircle,
  Package,
  Phone,
  RefreshCw,
  User,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ApiErrorBanner from '../../components/common/ApiErrorBanner';
import TrackingTimeline from '../../components/tracking/TrackingTimeline';
import StatusProgressionCard from '../../components/agency/StatusProgressionCard';
import {
  getAgencyParcelDetail,
  updateParcelStatus,
} from '../../services/parcelService';
import { formatDateTime } from '../../utils/date';

const STATUS_LABELS = {
  REGISTERED: 'Registered',
  IN_TRANSIT: 'In Transit',
  ARRIVED: 'Arrived',
  COLLECTED: 'Collected',
};

function classifyError(err) {
  return {
    title:
      err?.type === 'NOT_FOUND'
        ? 'Parcel Not Found'
        : err?.type === 'NETWORK_ERROR'
        ? 'Connection Error'
        : err?.type === 'SERVER_ERROR'
        ? 'Server Error'
        : 'Unable to Load Parcel',
    message: err?.message || 'An unexpected error occurred while loading parcel details.',
    type: err?.type || 'CLIENT_ERROR',
  };
}

export default function ParcelDetailsPage() {
  const { trackingId } = useParams();

  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [lastSuccessMessage, setLastSuccessMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadParcel = useCallback(
    async ({ silent = false } = {}) => {
      if (!trackingId) {
        setError({
          title: 'Missing Tracking ID',
          message: 'No tracking ID was provided in the route.',
          type: 'NOT_FOUND',
        });
        setIsLoading(false);
        return;
      }

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await getAgencyParcelDetail(trackingId);
        setParcel(data);
      } catch (err) {
        setError(classifyError(err));
        if (!silent) {
          setParcel(null);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [trackingId]
  );

  useEffect(() => {
    setUpdateError(null);
    setLastSuccessMessage(null);
    loadParcel();
  }, [loadParcel]);

  const handleCopyTrackingId = async () => {
    if (!parcel?.tracking_id) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(parcel.tracking_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const handleAdvanceStatus = async ({ status, note }) => {
    if (!parcel?.tracking_id || isUpdating) return false;

    setIsUpdating(true);
    setUpdateError(null);
    setLastSuccessMessage(null);

    try {
      const updated = await updateParcelStatus(parcel.tracking_id, { status, note });
      setParcel(updated);
      setLastSuccessMessage(
        `Parcel status updated to ${STATUS_LABELS[updated.status] || updated.status}.`
      );
      // Immediately synchronize with authoritative detail fetch in the background
      loadParcel({ silent: true });
      return true;
    } catch (err) {
      setUpdateError(
        err?.message || 'Failed to update parcel status. Please try again.'
      );
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const hasContactDetails = Boolean(
    parcel?.sender_name ||
      parcel?.sender_phone ||
      parcel?.recipient_name ||
      parcel?.recipient_phone
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
            <Link
              to="/parcels"
              className="inline-flex items-center gap-1 font-semibold text-secondary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Parcels</span>
            </Link>
            <span>/</span>
            <span className="font-mono font-semibold text-primary tabular-nums">
              {parcel?.tracking_id || trackingId}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Parcel Details
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {parcel?.tracking_id && (
            <Link
              to={`/track?id=${encodeURIComponent(parcel.tracking_id)}`}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[4px] bg-surface text-text-main border border-border text-xs font-semibold hover:bg-surface-low transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-secondary" />
              <span>Public Tracking View</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => loadParcel({ silent: Boolean(parcel) })}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[4px] bg-surface-low text-text-main border border-border text-xs font-semibold hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="bg-surface rounded-[8px] border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-7 w-44 bg-surface-low rounded" />
              <div className="h-6 w-24 bg-surface-low rounded-full" />
            </div>
            <div className="h-6 w-64 bg-surface-low rounded" />
            <div className="h-4 w-80 bg-surface-low rounded" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="h-36 bg-surface rounded-[8px] border border-border" />
              <div className="h-64 bg-surface rounded-[8px] border border-border" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-72 bg-surface rounded-[8px] border border-border" />
            </div>
          </div>
        </div>
      ) : error?.type === 'NOT_FOUND' ? (
        /* 404 Not Found State */
        <section className="bg-surface rounded-[8px] border border-border p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-[8px] bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-primary">Parcel Not Found</h2>
            <p className="text-xs sm:text-sm text-text-muted">
              {error.message ||
                `No parcel record was found for tracking ID "${trackingId}".`}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <Link
              to="/parcels"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[4px] bg-primary text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Parcels</span>
            </Link>
            <Link
              to="/parcels/new"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[4px] bg-surface-low text-primary border border-border text-xs font-semibold hover:bg-slate-200/70 transition-colors"
            >
              <span>Register New Parcel</span>
            </Link>
          </div>
        </section>
      ) : error && !parcel ? (
        /* General API Error State */
        <div className="space-y-4">
          <ApiErrorBanner
            error={error}
            onRetry={() => loadParcel()}
            isRetrying={isLoading}
          />
          <Link
            to="/parcels"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Parcels List</span>
          </Link>
        </div>
      ) : parcel ? (
        <>
          {/* Non-blocking Refresh Error Banner */}
          {error && (
            <ApiErrorBanner
              error={error}
              onRetry={() => loadParcel({ silent: true })}
              isRetrying={isRefreshing}
            />
          )}

          {/* Overview Hero Card */}
          <section className="bg-surface rounded-[8px] border border-border shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 bg-surface-low/60 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Tracking ID
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-primary tracking-wide tabular-nums">
                  {parcel.tracking_id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrackingId}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] bg-surface border border-border text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
                  title="Copy tracking ID"
                  aria-label="Copy tracking ID"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-secondary">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <StatusBadge status={parcel.status} />
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                  Transit Route
                </span>
                <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-primary flex-wrap">
                  <span>{parcel.origin}</span>
                  <ArrowRight className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>{parcel.destination}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-text-muted pt-1">
                  <Package className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-main font-semibold">Description:</strong>{' '}
                    {parcel.description}
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 bg-surface-low rounded-[8px] border border-border/80 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-text-muted inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Registered
                  </span>
                  <span className="font-semibold text-text-main tabular-nums">
                    {formatDateTime(parcel.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/70">
                  <span className="text-text-muted inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Last Updated
                  </span>
                  <span className="font-semibold text-text-main tabular-nums">
                    {formatDateTime(parcel.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Main 12-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sender/Recipient + Chronological Status History */}
            <div className="lg:col-span-7 space-y-6">
              {hasContactDetails && (
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface rounded-[8px] border border-border shadow-2xs p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted pb-2 border-b border-border/70">
                      <User className="w-4 h-4 text-secondary" />
                      <span>Sender</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-sm font-bold text-primary">
                        {parcel.sender_name || '—'}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-text-muted font-mono tabular-nums">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{parcel.sender_phone || '—'}</span>
                      </p>
                      <p className="text-text-muted">Origin: {parcel.origin}</p>
                    </div>
                  </div>

                  <div className="bg-surface rounded-[8px] border border-border shadow-2xs p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted pb-2 border-b border-border/70">
                      <User className="w-4 h-4 text-secondary" />
                      <span>Recipient</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-sm font-bold text-primary">
                        {parcel.recipient_name || '—'}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-text-muted font-mono tabular-nums">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{parcel.recipient_phone || '—'}</span>
                      </p>
                      <p className="text-text-muted">Destination: {parcel.destination}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Chronological Custody Timeline (reusing neutral Phase D.3 component) */}
              <TrackingTimeline
                history={parcel.status_history || []}
                currentStatus={parcel.status}
              />
            </div>

            {/* Right Column: Status Progression Action Card */}
            <div className="lg:col-span-5">
              <StatusProgressionCard
                parcel={parcel}
                onAdvanceStatus={handleAdvanceStatus}
                isUpdating={isUpdating}
                updateError={updateError}
                lastSuccessMessage={lastSuccessMessage}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
