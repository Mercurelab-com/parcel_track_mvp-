import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Copy,
  Package,
  PackageCheck,
  PackagePlus,
  Radar,
  RefreshCw,
  Truck,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ApiErrorBanner from '../../components/common/ApiErrorBanner';
import { getDashboardStats, listParcels } from '../../services/parcelService';
import { formatDateTime } from '../../utils/date';

const RECENT_PARCELS_LIMIT = 8;

function classifyError(err) {
  return {
    title:
      err?.type === 'NETWORK_ERROR'
        ? 'Connection Error'
        : err?.type === 'SERVER_ERROR'
        ? 'Server Error'
        : 'Unable to Load Dashboard',
    message: err?.message || 'An unexpected error occurred while loading dashboard data.',
    type: err?.type || 'CLIENT_ERROR',
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [statsData, parcelsData] = await Promise.all([
        getDashboardStats(),
        listParcels(),
      ]);
      setStats(statsData);
      setParcels(Array.isArray(parcelsData) ? parcelsData : []);
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleCopyTrackingId = async (e, trackingId) => {
    e.stopPropagation();
    if (!trackingId) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(trackingId);
        setCopiedId(trackingId);
        setTimeout(() => {
          setCopiedId((prev) => (prev === trackingId ? null : prev));
        }, 1800);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const recentParcels = parcels.slice(0, RECENT_PARCELS_LIMIT);

  const kpiCards = [
    {
      key: 'total',
      label: 'Total Parcels',
      value: stats?.total ?? 0,
      subtitle: 'All logged consignments',
      icon: Package,
      iconBg: 'bg-primary/10 text-primary',
      to: '/parcels',
    },
    {
      key: 'registered',
      label: 'Registered',
      value: stats?.registered ?? 0,
      subtitle: 'Awaiting dispatch',
      icon: ClipboardList,
      iconBg: 'bg-[#F1F5F9] text-[#475569]',
      to: '/parcels?status=REGISTERED',
    },
    {
      key: 'in_transit',
      label: 'In Transit',
      value: stats?.in_transit ?? 0,
      subtitle: 'Moving between hubs',
      icon: Truck,
      iconBg: 'bg-[#EFF6FF] text-[#2563EB]',
      to: '/parcels?status=IN_TRANSIT',
    },
    {
      key: 'arrived',
      label: 'Arrived',
      value: stats?.arrived ?? 0,
      subtitle: 'Ready for collection',
      icon: CheckCircle2,
      iconBg: 'bg-[#F0FDFA] text-[#0D9488]',
      to: '/parcels?status=ARRIVED',
    },
    {
      key: 'collected',
      label: 'Collected',
      value: stats?.collected ?? 0,
      subtitle: 'Completed handovers',
      icon: PackageCheck,
      iconBg: 'bg-[#F8FAFC] text-[#334155] border border-border',
      to: '/parcels?status=COLLECTED',
    },
  ];

  const lifecycleBreakdown = [
    {
      status: 'REGISTERED',
      label: 'Registered',
      count: stats?.registered ?? 0,
      barColor: 'bg-[#64748B]',
    },
    {
      status: 'IN_TRANSIT',
      label: 'In Transit',
      count: stats?.in_transit ?? 0,
      barColor: 'bg-[#2563EB]',
    },
    {
      status: 'ARRIVED',
      label: 'Arrived',
      count: stats?.arrived ?? 0,
      barColor: 'bg-[#0D9488]',
    },
    {
      status: 'COLLECTED',
      label: 'Collected',
      count: stats?.collected ?? 0,
      barColor: 'bg-[#334155]',
    },
  ];

  const totalCount = stats?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-surface p-5 sm:p-6 rounded-[8px] border border-border shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-secondary font-semibold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Agency Operations Overview
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Agency Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Live parcel counts and recent consignments across agency branches.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => loadDashboard({ silent: true })}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[4px] bg-surface-low text-text-main border border-border text-xs font-semibold hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[4px] bg-surface text-text-main border border-border text-xs font-semibold hover:bg-surface-low transition-colors"
          >
            <Radar className="w-3.5 h-3.5 text-secondary" />
            <span>Public Tracking</span>
          </Link>

          <Link
            to="/parcels/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[4px] bg-primary text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Register New Parcel</span>
          </Link>
        </div>
      </section>

      {/* API Error Alert */}
      {error && (
        <ApiErrorBanner
          error={error}
          onRetry={() => loadDashboard()}
          isRetrying={isLoading || isRefreshing}
        />
      )}

      {/* KPI Summary Cards */}
      <section aria-label="Parcel Status Summary">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-surface p-5 rounded-[8px] border border-border shadow-2xs space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-surface-low rounded" />
                  <div className="h-8 w-8 bg-surface-low rounded-[4px]" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-14 bg-surface-low rounded" />
                  <div className="h-3 w-28 bg-surface-low rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.key}
                  to={card.to}
                  className="bg-surface p-5 rounded-[8px] border border-border shadow-2xs hover:border-secondary/50 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      {card.label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-[4px] flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-bold text-primary tracking-tight tabular-nums">
                      {error && !stats ? '—' : card.value}
                    </div>
                    <p className="text-xs text-text-muted mt-1">{card.subtitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Main Content Split Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Parcels Overview Table */}
        <div className="xl:col-span-8 bg-surface rounded-[8px] border border-border shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-primary">Recent Parcels</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Latest registered shipments ordered newest first.
              </p>
            </div>

            <Link
              to="/parcels"
              className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline self-start sm:self-auto"
            >
              <span>View all parcels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-12 bg-surface-low rounded-[4px] w-full"
                />
              ))}
            </div>
          ) : !error && parcels.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-[8px] bg-surface-low border border-border flex items-center justify-center text-text-muted mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-primary">
                  No parcels registered yet
                </h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  Start by registering the first consignment at the agency intake desk.
                </p>
              </div>
              <div className="pt-1">
                <Link
                  to="/parcels/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-primary text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <PackagePlus className="w-4 h-4" />
                  <span>Register New Parcel</span>
                </Link>
              </div>
            </div>
          ) : error && parcels.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              Recent parcels could not be retrieved. Use the retry control above to try again.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-low border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      <th className="py-3 px-4" scope="col">Tracking ID</th>
                      <th className="py-3 px-4" scope="col">Route</th>
                      <th className="py-3 px-4" scope="col">Consignment</th>
                      <th className="py-3 px-4" scope="col">Status</th>
                      <th className="py-3 px-4" scope="col">Created</th>
                      <th className="py-3 px-4 text-right" scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {recentParcels.map((parcel) => (
                      <tr
                        key={parcel.id ?? parcel.tracking_id}
                        onClick={() =>
                          navigate(`/parcels/${encodeURIComponent(parcel.tracking_id)}`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/parcels/${encodeURIComponent(parcel.tracking_id)}`);
                          }
                        }}
                        tabIndex={0}
                        className="hover:bg-surface-low/60 focus:outline-none focus:bg-surface-low/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-primary tabular-nums tracking-wide">
                              {parcel.tracking_id}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyTrackingId(e, parcel.tracking_id)}
                              className="p-1 rounded-[4px] text-text-muted/70 hover:text-primary hover:bg-surface-low transition-colors cursor-pointer"
                              title="Copy tracking ID"
                              aria-label={`Copy tracking ID ${parcel.tracking_id}`}
                            >
                              {copiedId === parcel.tracking_id ? (
                                <Check className="w-3.5 h-3.5 text-secondary" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 font-medium text-text-main">
                            <span>{parcel.origin}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                            <span className="font-semibold text-primary">{parcel.destination}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-[220px]">
                          <p
                            className="font-medium text-text-main truncate"
                            title={parcel.description}
                          >
                            {parcel.description}
                          </p>
                          <p className="text-[11px] text-text-muted truncate mt-0.5">
                            To: {parcel.recipient_name}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={parcel.status} />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-text-muted tabular-nums">
                          {formatDateTime(parcel.created_at)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <Link
                            to={`/parcels/${encodeURIComponent(parcel.tracking_id)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] bg-surface-low border border-border text-primary font-semibold hover:bg-slate-200/70 transition-colors"
                          >
                            <span>View Details</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Compact Cards */}
              <div className="md:hidden divide-y divide-border">
                {recentParcels.map((parcel) => (
                  <div
                    key={parcel.id ?? parcel.tracking_id}
                    onClick={() =>
                      navigate(`/parcels/${encodeURIComponent(parcel.tracking_id)}`)
                    }
                    className="p-4 space-y-2.5 hover:bg-surface-low/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-primary tabular-nums">
                        {parcel.tracking_id}
                      </span>
                      <StatusBadge status={parcel.status} />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span>{parcel.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      <span>{parcel.destination}</span>
                    </div>

                    <p className="text-xs text-text-muted truncate">
                      {parcel.description} • Recipient: {parcel.recipient_name}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-text-muted">
                      <span className="tabular-nums">{formatDateTime(parcel.created_at)}</span>
                      <Link
                        to={`/parcels/${encodeURIComponent(parcel.tracking_id)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-secondary hover:underline"
                      >
                        View Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Summary */}
              <div className="px-4 sm:px-5 py-3 bg-surface-low/40 border-t border-border flex items-center justify-between text-xs text-text-muted">
                <span className="tabular-nums">
                  Showing <strong className="text-primary">{recentParcels.length}</strong> of{' '}
                  <strong className="text-primary">{parcels.length}</strong> parcels
                </span>
                <Link
                  to="/parcels"
                  className="font-semibold text-secondary hover:underline"
                >
                  Open full manifest
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Supporting Operational Panels */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-surface p-5 rounded-[8px] border border-border shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-primary">Quick Actions</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Direct navigation for daily desk operations.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/parcels/new"
                className="w-full p-3 rounded-[4px] bg-surface-low hover:bg-slate-200/70 border border-border/80 transition-colors flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-[4px] bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                    Register a Parcel
                  </div>
                  <div className="text-[11px] text-text-muted truncate">
                    Log sender, recipient, route, and package description
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>

              <Link
                to="/parcels"
                className="w-full p-3 rounded-[4px] bg-surface-low hover:bg-slate-200/70 border border-border/80 transition-colors flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-[4px] bg-surface border border-border text-primary flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                    Manage All Parcels
                  </div>
                  <div className="text-[11px] text-text-muted truncate">
                    Search consignments and filter by lifecycle status
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>

              <Link
                to="/track"
                className="w-full p-3 rounded-[4px] bg-surface-low hover:bg-slate-200/70 border border-border/80 transition-colors flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-[4px] bg-[#F0FDFA] border border-[#99F6E4] text-secondary flex items-center justify-center flex-shrink-0">
                  <Radar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                    Public Tracking Portal
                  </div>
                  <div className="text-[11px] text-text-muted truncate">
                    Inspect customer-facing tracking by tracking ID
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            </div>
          </div>

          {/* Lifecycle Distribution Card (100% derived from GET /api/parcels/stats/summary) */}
          <div className="bg-surface p-5 rounded-[8px] border border-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-primary">Status Breakdown</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Share of total parcels by lifecycle stage.
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-surface-low px-2 py-0.5 rounded-[4px] border border-border tabular-nums">
                {isLoading ? '…' : `${totalCount} Total`}
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="h-3 w-28 bg-surface-low rounded" />
                    <div className="h-2 w-full bg-surface-low rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {lifecycleBreakdown.map((item) => {
                  const pct =
                    totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;

                  return (
                    <div key={item.status} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-text-main">{item.label}</span>
                        <span className="font-mono text-text-muted tabular-nums">
                          <strong className="text-primary">{item.count}</strong> ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-low rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${item.barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
