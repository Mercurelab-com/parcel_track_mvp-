/**
 * DashboardPage.jsx
 * Landing page of the agency portal.
 * Shows StatsCards + a live read-only ParcelTable (last 10 parcels).
 */
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import StatsCards from '../../components/common/StatsCards'
import ParcelTable from '../../components/common/ParcelTable'
import { useParcelList } from '../../hooks/useParcelList'

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { parcels, loading, error } = useParcelList({ search, status: statusFilter })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of all parcel movements handled by this branch.
          </p>
        </div>
        <Link to="/parcels/new" className="btn-primary shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Parcel
        </Link>
      </div>

      {/* Stats */}
      <StatsCards refreshKey={0} />

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">All Parcels</h2>
        <ParcelTable
          parcels={parcels}
          loading={loading}
          search={search}
          onSearch={setSearch}
          statusFilter={statusFilter}
          onStatus={setStatusFilter}
        />
      </div>
    </div>
  )
}
