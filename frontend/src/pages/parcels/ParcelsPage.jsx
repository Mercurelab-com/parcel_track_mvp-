/**
 * ParcelsPage.jsx
 * Full parcel list with inline registration form in a slide-in panel.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParcelTable from '../../components/common/ParcelTable'
import ParcelForm from '../../components/common/ParcelForm'
import StatsCards from '../../components/common/StatsCards'
import { useParcelList } from '../../hooks/useParcelList'

export default function ParcelsPage() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [successBanner, setSuccessBanner] = useState(null)

  const { parcels, loading, error, refresh } = useParcelList({ search, status: statusFilter, refreshKey })

  function handleSuccess(parcel) {
    setShowForm(false)
    setRefreshKey((k) => k + 1)
    setSuccessBanner(parcel.tracking_id)
    // Auto-dismiss after 6 s
    setTimeout(() => setSuccessBanner(null), 6000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parcel Registration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Register new parcels and browse all shipments for this branch.
          </p>
        </div>
        {!showForm && (
          <button className="btn-primary shrink-0" onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Parcel
          </button>
        )}
      </div>

      {/* Stats */}
      <StatsCards refreshKey={refreshKey} />

      {/* Success banner */}
      {successBanner && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Parcel registered successfully! Tracking ID:{' '}
            <span className="font-mono font-bold">{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-green-600 hover:text-green-800 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Registration form panel */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">New Parcel</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close form"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ParcelForm
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Parcel list */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Parcel Inventory</h2>
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
