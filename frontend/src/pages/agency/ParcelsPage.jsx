import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Copy,
  Eye,
  Package,
  PackagePlus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ApiErrorBanner from '../../components/common/ApiErrorBanner';
import { listParcels } from '../../services/parcelService';
import { formatDateTime } from '../../utils/date';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'REGISTERED', label: 'Registered' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'ARRIVED', label: 'Arrived' },
  { key: 'COLLECTED', label: 'Collected' },
];

const VALID_STATUS_KEYS = new Set(STATUS_FILTERS.map((f) => f.key));

function classifyError(err) {
  return {
    title:
      err?.type === 'NETWORK_ERROR'
        ? 'Connection Error'
        : err?.type === 'SERVER_ERROR'
        ? 'Server Error'
        : 'Unable to Load Parcels',
    message: err?.message || 'An unexpected error occurred while fetching parcels.',
    type: err?.type || 'CLIENT_ERROR',
  };
}

export default function ParcelsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatusParam = (searchParams.get('status') || 'ALL').toUpperCase().trim();
  const initialStatus = VALID_STATUS_KEYS.has(initialStatusParam)
    ? initialStatusParam
    : 'ALL';

  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [copiedId, setCopiedId] = useState(null);

  // Keep statusFilter synchronized if user navigates with a ?status= query param
  useEffect(() => {
    const param = (searchParams.get('status') || 'ALL').toUpperCase().trim();
    const nextStatus = VALID_STATUS_KEYS.has(param) ? param : 'ALL';
    setStatusFilter(nextStatus);
  }, [searchParams]);

  const loadParcels = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await listParcels();
      setParcels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadParcels();
  }, [loadParcels]);

  const handleStatusSelect = (nextStatus) => {
    setStatusFilter(nextStatus);
    if (nextStatus === 'ALL') {
      const next = new URLSearchParams(searchParams);
      next.delete('status');
      setSearchParams(next, { replace: true });
    } else {
      setSearchParams({ status: nextStatus }, { replace: true });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    handleStatusSelect('ALL');
  };

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

  // Real counts per status derived strictly from the fetched parcels array
  const statusCounts = useMemo(() => {
    const counts = {
      ALL: parcels.length,
      REGISTERED: 0,
      IN_TRANSIT: 0,
      ARRIVED: 0,
      COLLECTED: 0,
    };
    parcels.forEach((parcel) => {
      const st = (parcel.status || '').toUpperCase().trim();
      if (st in counts) {
        counts[st] += 1;
      }
    });
    return counts;
  }, [parcels]);

  // Client-side search & status filtering on the fetched list
  const filteredParcels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return parcels.filter((parcel) => {
      const parcelStatus = (parcel.status || '').toUpperCase().trim();
      if (statusFilter !== 'ALL' && parcelStatus !== statusFilter) {
        return false;
      }

      if (!query) return true;

      const searchableFields = [
        parcel.tracking_id,
        parcel.origin,
        parcel.destination,
        parcel.description,
        parcel.sender_name,
        parcel.sender_phone,
        parcel.recipient_name,
        parcel.recipient_phone,
      ];

      return searchableFields.some((field) =>
        String(field || '').toLowerCase().includes(query)
      );
    });
  }, [parcels, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== 'ALL';

  const navigateToDetails = (trackingId) => {
    navigate(`/parcels/${encodeURIComponent(trackingId)}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="bg-surface p-5 sm:p-6 rounded-[8px] border border-border shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-secondary font-semibold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Consignment Manifest
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Parcels Management
          </h1>
          <p className="text-sm text-text-muted">
            Search, filter, and inspect all registered parcels across agency corridors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => loadParcels({ silent: true })}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[4px] bg-surface-low text-text-main border border-border text-xs font-semibold hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

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
          onRetry={() => loadParcels()}
          isRetrying={isLoading || isRefreshing}
        />
      )}

      {/* Search & Status Filter Bar */}
      <section
        aria-label="Search and filter parcels"
        className="bg-surface p-4 sm:p-5 rounded-[8px] border border-border shadow-2xs space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Client-Side Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking ID, origin, destination, description, sender, or recipient..."
              aria-label="Search parcels"
              className="w-full h-10 pl-9 pr-9 rounded-[4px] bg-surface-low text-xs sm:text-sm text-text-main placeholder:text-text-muted border border-border focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:bg-surface transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-[4px] text-text-muted hover:text-primary hover:bg-surface-low cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Count & Reset Control */}
          <div className="flex items-center justify-between lg:justify-end gap-3 text-xs text-text-muted">
            <span className="tabular-nums">
              Showing <strong className="text-primary">{filteredParcels.length}</strong> of{' '}
              <strong className="text-primary">{parcels.length}</strong> parcels
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter parcels by status"
          className="flex items-center gap-2 flex-wrap pt-1"
        >
          {STATUS_FILTERS.map((pill) => {
            const isActive = statusFilter === pill.key;
            const count = statusCounts[pill.key] ?? 0;

            return (
              <button
                key={pill.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleStatusSelect(pill.key)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-xs font-semibold border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-2xs'
                    : 'bg-surface-low text-text-muted border-border hover:text-primary hover:bg-slate-200/70'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-mono tabular-nums ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-surface text-text-muted border border-border/80'
                  }`}
                >
                  {isLoading ? '–' : count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Parcels Table / Responsive List Card */}
      <section className="bg-surface rounded-[8px] border border-border shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3 animate-pulse">
            <div className="h-10 bg-surface-low rounded-[4px] w-full" />
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-14 bg-surface-low/80 rounded-[4px] w-full"
              />
            ))}
          </div>
        ) : !error && parcels.length === 0 ? (
          /* Empty State: Zero Parcels in System */
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-[8px] bg-surface-low border border-border flex items-center justify-center text-text-muted mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-primary">
                No parcels registered yet
              </h2>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                There are currently no consignments recorded in the system. Register a parcel to begin tracking it through the lifecycle.
              </p>
            </div>
            <div className="pt-2">
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
          <div className="p-10 text-center text-xs text-text-muted">
            Parcels list is unavailable while the API request is failing. Use the Retry button above.
          </div>
        ) : filteredParcels.length === 0 ? (
          /* Empty State: No Filter Matches */
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-[8px] bg-surface-low border border-border flex items-center justify-center text-text-muted mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-primary">
                No parcels match your filters
              </h2>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                {searchQuery.trim()
                  ? `No parcels matched "${searchQuery.trim()}"`
                  : 'No parcels found'}
                {statusFilter !== 'ALL' ? ` with status ${statusFilter.replace('_', ' ')}` : ''}.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-surface-low text-primary border border-border text-xs font-semibold hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Search &amp; Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Responsive Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-3 px-4" scope="col">Tracking ID</th>
                    <th className="py-3 px-4" scope="col">Route</th>
                    <th className="py-3 px-4" scope="col">Description</th>
                    <th className="py-3 px-4" scope="col">Sender</th>
                    <th className="py-3 px-4" scope="col">Recipient</th>
                    <th className="py-3 px-4" scope="col">Status</th>
                    <th className="py-3 px-4" scope="col">Timestamps</th>
                    <th className="py-3 px-4 text-right" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredParcels.map((parcel) => (
                    <tr
                      key={parcel.id ?? parcel.tracking_id}
                      onClick={() => navigateToDetails(parcel.tracking_id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigateToDetails(parcel.tracking_id);
                        }
                      }}
                      tabIndex={0}
                      className="hover:bg-surface-low/60 focus:outline-none focus:bg-surface-low/80 transition-colors cursor-pointer"
                    >
                      {/* Tracking ID */}
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

                      {/* Route */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-text-main font-medium">{parcel.origin}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span className="text-primary font-semibold">{parcel.destination}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span
                          className="block text-text-main truncate"
                          title={parcel.description}
                        >
                          {parcel.description}
                        </span>
                      </td>

                      {/* Sender */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-main">
                            {parcel.sender_name}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted tabular-nums">
                            {parcel.sender_phone}
                          </span>
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-main">
                            {parcel.recipient_name}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted tabular-nums">
                            {parcel.recipient_phone}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={parcel.status} />
                      </td>

                      {/* Created & Updated Timestamps */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col tabular-nums">
                          <span className="text-text-main font-medium">
                            {formatDateTime(parcel.created_at)}
                          </span>
                          <span className="text-[11px] text-text-muted">
                            Updated: {formatDateTime(parcel.updated_at)}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <Link
                          to={`/parcels/${encodeURIComponent(parcel.tracking_id)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] bg-surface-low border border-border text-primary font-semibold hover:bg-slate-200/70 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-text-muted" />
                          <span>View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-border">
              {filteredParcels.map((parcel) => (
                <div
                  key={parcel.id ?? parcel.tracking_id}
                  onClick={() => navigateToDetails(parcel.tracking_id)}
                  className="p-4 space-y-3 hover:bg-surface-low/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-primary tabular-nums">
                        {parcel.tracking_id}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyTrackingId(e, parcel.tracking_id)}
                        className="p-1 rounded-[4px] text-text-muted hover:text-primary"
                        aria-label={`Copy tracking ID ${parcel.tracking_id}`}
                      >
                        {copiedId === parcel.tracking_id ? (
                          <Check className="w-3.5 h-3.5 text-secondary" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <StatusBadge status={parcel.status} />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span>{parcel.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    <span>{parcel.destination}</span>
                  </div>

                  <p className="text-xs text-text-main">{parcel.description}</p>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[4px] bg-surface-low border border-border/60 text-[11px]">
                    <div className="min-w-0">
                      <span className="text-text-muted block uppercase font-bold tracking-wider text-[10px]">
                        Sender
                      </span>
                      <span className="font-semibold text-text-main block truncate">
                        {parcel.sender_name}
                      </span>
                      <span className="font-mono text-text-muted tabular-nums">
                        {parcel.sender_phone}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-text-muted block uppercase font-bold tracking-wider text-[10px]">
                        Recipient
                      </span>
                      <span className="font-semibold text-text-main block truncate">
                        {parcel.recipient_name}
                      </span>
                      <span className="font-mono text-text-muted tabular-nums">
                        {parcel.recipient_phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-text-muted">
                    <div className="flex flex-col tabular-nums">
                      <span>Created: {formatDateTime(parcel.created_at)}</span>
                      <span>Updated: {formatDateTime(parcel.updated_at)}</span>
                    </div>
                    <Link
                      to={`/parcels/${encodeURIComponent(parcel.tracking_id)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] bg-surface-low border border-border text-primary font-semibold flex-shrink-0"
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
