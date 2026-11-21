import React, { useState, useEffect } from 'react';
import { fetchTrackingInfo } from './mockData.js';
import { STATUS_METADATA, PARCEL_STATUS } from './types.js';
import { TrackingHeader } from './components/TrackingHeader.jsx';
import { TrackingFooter } from './components/TrackingFooter.jsx';
import { TrackingSearchBar } from './components/TrackingSearchBar.jsx';
import { TrackingStatusCard } from './components/TrackingStatusCard.jsx';
import { ParcelInfoCard } from './components/ParcelInfoCard.jsx';
import { JourneyTimeline } from './components/JourneyTimeline.jsx';
import { ArrivalNotificationBanner } from './components/ArrivalNotificationBanner.jsx';
import { TrackingNotFound } from './components/TrackingNotFound.jsx';
import { TrackingLoading } from './components/TrackingLoading.jsx';

/**
 * Main Public Customer Tracking Page Component.
 * Faithfully implements the Google Stitch UI designs for desktop and mobile,
 * supporting all four required statuses: REGISTERED, IN_TRANSIT, ARRIVED, COLLECTED.
 */
export default function TrackingPage({ initialTrackingNumber = '' }) {
  const [viewState, setViewState] = useState('landing'); // 'landing' | 'loading' | 'results' | 'not_found'
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [parcelData, setParcelData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle URL query parameters or initial props on mount
  useEffect(() => {
    if (initialTrackingNumber) {
      handleSearch(initialTrackingNumber);
    } else {
      // Check window location for ?tracking=XYZ parameter
      try {
        const params = new URLSearchParams(window.location.search);
        const queryCode = params.get('tracking') || params.get('track');
        if (queryCode) {
          handleSearch(queryCode);
        }
      } catch (e) {
        // Safe fallback in non-browser environments
      }
    }
  }, [initialTrackingNumber]);

  const handleSearch = async (codeToSearch) => {
    if (!codeToSearch || !codeToSearch.trim()) return;

    const query = codeToSearch.trim().toUpperCase();
    setTrackingNumber(query);
    setViewState('loading');
    setErrorMessage('');

    try {
      const data = await fetchTrackingInfo(query);
      setParcelData(data);
      setViewState('results');
    } catch (err) {
      setParcelData(null);
      setErrorMessage(err.message || 'Tracking number not found');
      setViewState('not_found');
    }
  };

  const handleReset = () => {
    setViewState('landing');
    setTrackingNumber('');
    setParcelData(null);
    setErrorMessage('');
  };

  // Badge metadata for results view
  const currentStatusMeta = parcelData
    ? STATUS_METADATA[parcelData.status] || STATUS_METADATA[PARCEL_STATUS.REGISTERED]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body antialiased">
      {/* Shared Stitch Header */}
      <TrackingHeader onReset={handleReset} />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* 1. LANDING VIEW                                                           */}
        {/* ========================================================================= */}
        {viewState === 'landing' && (
          <section className="flex-1 flex items-center py-section">
            <div className="max-w-6xl mx-auto px-page-margin w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
                {/* Left Column: Headline & Primary Tracking Form */}
                <div className="lg:col-span-7 flex flex-col gap-gutter-lg">
                  <div className="flex flex-col gap-gutter-md">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-bold uppercase tracking-wider w-fit">
                      <span className="material-symbols-outlined text-sm">route</span>
                      Inter-City Parcel Express (Douala ↔ Bamenda)
                    </span>
                    <h1 className="font-display text-display-lg-mobile sm:text-display-lg text-primary text-balance leading-tight">
                      Your Parcel, Every Step of the Way.
                    </h1>
                    <p className="font-body text-body-lg text-on-surface-variant max-w-prose">
                      Stay informed about your shipment. Enter your tracking number below to check real-time dispatch progress, route updates, and arrival pickup notifications.
                    </p>
                  </div>

                  {/* Tracking Search Card */}
                  <article className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-gutter-lg flex flex-col gap-gutter-md">
                    <TrackingSearchBar
                      initialValue={trackingNumber}
                      onSubmit={handleSearch}
                      isLoading={false}
                    />
                  </article>
                </div>

                {/* Right Column: Visual Feature Card */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-gutter-lg w-full flex flex-col gap-4">
                    <div className="h-64 rounded-lg bg-gradient-to-br from-primary via-secondary to-primary-container p-6 flex flex-col justify-between text-on-primary shadow-inner relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl">local_shipping</span>
                      </div>
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-2xl">hub</span>
                          <span className="font-bold text-sm tracking-wide uppercase">ParcelTrack Network</span>
                        </div>
                        <span className="text-xs bg-white/20 backdrop-blur px-2.5 py-1 rounded-full font-mono">
                          Live Active
                        </span>
                      </div>

                      <div className="z-10 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-mono text-white/80 border-b border-white/20 pb-2">
                          <span>Origin Hub: Douala</span>
                          <span>Destination: Bamenda</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white text-secondary flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined">package_2</span>
                          </div>
                          <div>
                            <div className="font-bold text-base">Direct Highway Route</div>
                            <div className="text-xs text-white/80">Average Transit Time: 6 - 8 Hours</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-surface-container-low rounded-lg">
                        <span className="block font-headline text-lg font-bold text-primary">100%</span>
                        <span className="text-xs text-on-surface-variant font-medium">Public Access</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-lg">
                        <span className="block font-headline text-lg font-bold text-secondary">Instant</span>
                        <span className="text-xs text-on-surface-variant font-medium">Arrival Alerts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 2. LOADING VIEW                                                           */}
        {/* ========================================================================= */}
        {viewState === 'loading' && (
          <section className="flex-1 flex items-center justify-center py-section px-page-margin">
            <TrackingLoading trackingNumber={trackingNumber} />
          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. NOT FOUND VIEW                                                         */}
        {/* ========================================================================= */}
        {viewState === 'not_found' && (
          <section className="flex-1 flex items-center justify-center py-section px-page-margin">
            <TrackingNotFound
              trackingNumber={trackingNumber}
              onRetry={handleSearch}
              onReset={handleReset}
            />
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. RESULTS VIEW                                                           */}
        {/* ========================================================================= */}
        {viewState === 'results' && parcelData && (
          <section className="flex-1 py-gutter-xl">
            <div className="max-w-5xl mx-auto px-page-margin flex flex-col gap-gutter-lg">
              {/* Top Bar: Title, Status Badge, Tracking Number, Track Another Action */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md">
                <div className="flex flex-col gap-gutter-sm">
                  <div className="flex flex-wrap items-center gap-gutter-md">
                    <h1 className="font-headline text-headline-md sm:text-headline-lg text-primary">
                      Tracking Results
                    </h1>
                    {/* Status Badge */}
                    <span
                      role="status"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-label-md font-semibold ${currentStatusMeta.bgBadge} ${currentStatusMeta.textBadge}`}
                    >
                      <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                        {currentStatusMeta.icon}
                      </span>
                      <span>{currentStatusMeta.label}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-gutter-sm text-on-surface-variant">
                    <span className="font-body text-body-md">Tracking Number:</span>
                    <span className="font-mono text-mono-md text-primary font-bold tabular-nums bg-surface-container-low px-2.5 py-0.5 rounded-sm border border-outline-variant">
                      {parcelData.trackingNumber}
                    </span>
                    <span className="text-outline">·</span>
                    <span className="font-body text-body-md text-on-surface-variant">
                      Shipment route: {parcelData.origin} → {parcelData.destination}
                    </span>
                  </div>
                </div>

                {/* Track Another Parcel Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded-md bg-surface-container-lowest text-primary border border-outline-variant font-label text-label-md hover:bg-surface-container-low transition-colors duration-state-change shrink-0 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-body-lg" aria-hidden="true">
                    search
                  </span>
                  <span>Track Another Parcel</span>
                </button>
              </div>

              {/* Special Arrival Alert Notice if parcel status is ARRIVED */}
              {parcelData.status === PARCEL_STATUS.ARRIVED && (
                <ArrivalNotificationBanner parcel={parcelData} />
              )}

              {/* Current Delivery Status Highlight Card */}
              <TrackingStatusCard parcel={parcelData} />

              {/* Two-Column Layout: Parcel Information (7 cols) + Parcel Journey Timeline (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
                <div className="lg:col-span-7">
                  <ParcelInfoCard parcel={parcelData} />
                </div>
                <div className="lg:col-span-5">
                  <JourneyTimeline
                    currentStatus={parcelData.status}
                    timelineEvents={parcelData.timeline || []}
                  />
                </div>
              </div>

              {/* Mini Search Bar at bottom for rapid re-queries */}
              <div className="pt-6 border-t border-outline-variant/60 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Quick Query Another Package
                </span>
                <TrackingSearchBar
                  initialValue=""
                  onSubmit={handleSearch}
                  isLoading={false}
                  compact={true}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Shared Stitch Footer */}
      <TrackingFooter />
    </div>
  );
}
