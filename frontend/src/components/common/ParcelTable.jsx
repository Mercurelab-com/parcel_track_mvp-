/**
 * ParcelTable.jsx
 * Displays the filtered list of parcels in a sortable table.
 * Also contains the Search + Status filter toolbar above the table.
 *
 * Props:
 *   parcels      – Parcel[]  (from parent)
 *   loading      – boolean
 *   search       – string    (controlled)
 *   onSearch     – fn(string)
 *   statusFilter – string    (controlled)
 *   onStatus     – fn(string)
 *   onRowClick   – fn(parcel)   optional — called when a row is clicked
 */
import { STATUS_LABELS, STATUS_OPTIONS, statusBadgeClass, formatXAF, formatDate } from '../../utils/formatters'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

// ─── Search & Filter bar ──────────────────────────────────────────────────────

function ToolBar({ search, onSearch, statusFilter, onStatus }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </span>
        <Input
          type="search"
          placeholder="Search tracking ID or recipient…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status filter */}
      <Select
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value)}
        className="sm:w-44"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Select>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={statusBadgeClass(status)}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ search, statusFilter }) {
  const hasFilter = search || statusFilter
  return (
    <tr>
      <td colSpan={8} className="px-4 py-14 text-center text-sm text-gray-500">
        {hasFilter
          ? 'No parcels match your search or filter.'
          : 'No parcels registered yet. Use the form above to add one.'}
      </td>
    </tr>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ParcelTable({
  parcels,
  loading,
  search,
  onSearch,
  statusFilter,
  onStatus,
  onRowClick,
}) {
  const columns = [
    { label: 'Tracking ID' },
    { label: 'Sender' },
    { label: 'Recipient' },
    { label: 'Route' },
    { label: 'Weight' },
    { label: 'Fee (XAF)' },
    { label: 'Status' },
    { label: 'Registered' },
  ]

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <ToolBar
          search={search}
          onSearch={onSearch}
          statusFilter={statusFilter}
          onStatus={onStatus}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : parcels.length === 0
              ? <EmptyState search={search} statusFilter={statusFilter} />
              : parcels.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onRowClick?.(p)}
                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {p.tracking_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{p.sender_name}</p>
                      <p className="text-xs text-gray-500">{p.sender_phone}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{p.recipient_name}</p>
                      <p className="text-xs text-gray-500">{p.recipient_phone}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {p.origin} → {p.destination}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {p.weight_kg} kg
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                      {formatXAF(p.fee_xaf)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                      {formatDate(p.created_at)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!loading && parcels.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400">
          Showing {parcels.length} parcel{parcels.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
