import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, RefreshCw, WifiOff, ServerCrash, HelpCircle } from 'lucide-react';
import TrackingSearchForm from '../../components/tracking/TrackingSearchForm';
import TrackingOverviewCard from '../../components/tracking/TrackingOverviewCard';
import TrackingTimeline from '../../components/tracking/TrackingTimeline';
import ArrivalNotice from '../../components/tracking/ArrivalNotice';
import { fetchParcelTracking } from '../../services/parcelService';

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamId = (searchParams.get('id') || searchParams.get('trackingId') || '').trim();

  const [trackingId, setTrackingId] = useState(queryParamId);
  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performLookup = useCallback(async (idToSearch) => {
    const cleanId = (idToSearch || '').trim().toUpperCase();
    if (!cleanId) {
      setError({
        title: 'Input Required',
        message: 'Please enter a tracking number.',
        type: 'VALIDATION_ERROR',
      });
      setParcel(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchParcelTracking(cleanId);
      setParcel(data);
    } catch (err) {
      setError({
        title:
          err.type === 'NOT_FOUND'
            ? 'Parcel Not Found'
            : err.type === 'NETWORK_ERROR'
            ? 'Connection Error'
            : err.type === 'SERVER_ERROR'
            ? 'Server Error'
            : 'Tracking Error',
        message: err.message,
        type: err.type || 'UNKNOWN',
      });
      setParcel(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync with URL query parameter on mount and when query changes
  useEffect(() => {
    if (queryParamId) {
      setTrackingId(queryParamId);
      performLookup(queryParamId);
    }
  }, [queryParamId, performLookup]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const cleanId = trackingId.trim().toUpperCase();
    if (cleanId) {
      if (cleanId === queryParamId) {
        performLookup(cleanId);
      } else {
        setSearchParams({ id: cleanId });
      }
    } else {
      performLookup('');
    }
  };

  const getErrorIcon = (type) => {
    switch (type) {
      case 'NETWORK_ERROR':
        return <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />;
      case 'SERVER_ERROR':
        return <ServerCrash className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
      case 'NOT_FOUND':
        return <HelpCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />;
    }
  };

  const getErrorClasses = (type) => {
    if (type === 'NETWORK_ERROR' || type === 'VALIDATION_ERROR') {
      return 'bg-amber-50 border-amber-200 text-amber-900';
    }
    return 'bg-red-50 border-red-200 text-red-900';
  };

  return (
    <div className="space-y-8 w-full py-4">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          Public Tracking Portal
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
          Track your parcel, <br className="hidden sm:inline" />
          every step of the way.
        </h1>

        <p className="text-sm text-text-muted leading-relaxed">
          Enter your unique tracking code to follow consignment progression across inter-city transit corridors.
        </p>
      </div>

      {/* Search Input Card */}
      <TrackingSearchForm
        trackingId={trackingId}
        onChange={setTrackingId}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      {/* Structured Error Message Box */}
      {error && (
        <div className={`max-w-2xl mx-auto p-4 rounded-xl border flex items-start gap-3 shadow-2xs animate-in fade-in duration-200 ${getErrorClasses(error.type)}`}>
          {getErrorIcon(error.type)}
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold block">{error.title}</span>
            <span>{error.message}</span>
          </div>
        </div>
      )}

      {/* Results Area */}
      {parcel && (
        <div className="space-y-6 max-w-3xl mx-auto pt-2 animate-in fade-in duration-200">
          {/* Quick Refresh Button */}
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <span>Results for <strong className="font-mono text-primary">{parcel.tracking_id}</strong></span>
            <button
              type="button"
              onClick={() => performLookup(parcel.tracking_id)}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-secondary hover:underline font-semibold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Prominent Arrival or Collected Alert */}
          <ArrivalNotice parcel={parcel} />

          {/* Shipment Overview Card */}
          <TrackingOverviewCard parcel={parcel} />

          {/* Stepper Timeline */}
          <TrackingTimeline history={parcel.status_history} currentStatus={parcel.status} />
        </div>
      )}
    </div>
  );
}
