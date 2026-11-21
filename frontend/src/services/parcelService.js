/**
 * parcelService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of data access for the Agency Dashboard / Parcel Registration
 * module.  Currently uses in-memory mock data so the UI can run without the
 * backend.  When the FastAPI backend is ready, flip VITE_API_URL in .env and
 * replace every mock implementation with the commented-out fetch blocks below.
 *
 * API contract follows docs/API_CONTRACT.md:
 *   POST   /api/v1/parcels
 *   GET    /api/v1/parcels          ?search=&status=&page=&limit=
 *   GET    /api/v1/parcels/:id
 *   PATCH  /api/v1/parcels/:id/status
 *   GET    /api/v1/tracking/:tracking_id   (public, not used here)
 *
 * Parcel schema (follows docs/DATABASE_SCHEMA.md + README):
 * {
 *   id:               string  (UUID)
 *   tracking_id:      string  ("PT-YYYYMMDD-XXXX")
 *   sender_name:      string
 *   sender_phone:     string
 *   recipient_name:   string
 *   recipient_phone:  string
 *   origin:           string  (city name)
 *   destination:      string  (city name)
 *   description:      string  (package description)
 *   weight_kg:        number
 *   fee_xaf:          number  (amount in CFA Francs)
 *   status:           "registered" | "in_transit" | "arrived" | "collected"
 *   created_at:       ISO 8601 string
 *   updated_at:       ISO 8601 string
 * }
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const USE_MOCK = !import.meta.env.VITE_API_URL   // switch to false to go live

// ─── Mock Data ───────────────────────────────────────────────────────────────

let _mockParcels = [
  {
    id: 'a1b2c3d4-0001',
    tracking_id: 'PT-20261118-0001',
    sender_name: 'Jean-Paul Mba',
    sender_phone: '+237 677 100 001',
    recipient_name: 'Marie Nkeng',
    recipient_phone: '+237 699 200 001',
    origin: 'Douala',
    destination: 'Bamenda',
    description: 'Electronic spare parts',
    weight_kg: 3.5,
    fee_xaf: 4500,
    status: 'collected',
    created_at: '2026-11-18T08:14:00Z',
    updated_at: '2026-11-19T16:30:00Z',
  },
  {
    id: 'a1b2c3d4-0002',
    tracking_id: 'PT-20261119-0002',
    sender_name: 'Fatima Bello',
    sender_phone: '+237 677 100 002',
    recipient_name: 'Samuel Fon',
    recipient_phone: '+237 699 200 002',
    origin: 'Douala',
    destination: 'Bafoussam',
    description: 'Clothing and textiles',
    weight_kg: 8.0,
    fee_xaf: 7000,
    status: 'arrived',
    created_at: '2026-11-19T10:00:00Z',
    updated_at: '2026-11-20T09:15:00Z',
  },
  {
    id: 'a1b2c3d4-0003',
    tracking_id: 'PT-20261120-0003',
    sender_name: 'Alain Tchoua',
    sender_phone: '+237 677 100 003',
    recipient_name: 'Grace Nji',
    recipient_phone: '+237 699 200 003',
    origin: 'Yaoundé',
    destination: 'Bamenda',
    description: 'Medical supplies',
    weight_kg: 2.0,
    fee_xaf: 3500,
    status: 'in_transit',
    created_at: '2026-11-20T07:45:00Z',
    updated_at: '2026-11-20T07:45:00Z',
  },
  {
    id: 'a1b2c3d4-0004',
    tracking_id: 'PT-20261120-0004',
    sender_name: 'Pierre Djomo',
    sender_phone: '+237 677 100 004',
    recipient_name: 'Hélène Atanga',
    recipient_phone: '+237 699 200 004',
    origin: 'Douala',
    destination: 'Ngaoundéré',
    description: 'Agricultural seeds',
    weight_kg: 15.0,
    fee_xaf: 12000,
    status: 'in_transit',
    created_at: '2026-11-20T11:20:00Z',
    updated_at: '2026-11-20T11:20:00Z',
  },
  {
    id: 'a1b2c3d4-0005',
    tracking_id: 'PT-20261121-0005',
    sender_name: 'Chantal Mvogo',
    sender_phone: '+237 677 100 005',
    recipient_name: 'Boris Kamga',
    recipient_phone: '+237 699 200 005',
    origin: 'Yaoundé',
    destination: 'Douala',
    description: 'Documents and books',
    weight_kg: 1.2,
    fee_xaf: 2000,
    status: 'registered',
    created_at: '2026-11-21T01:05:00Z',
    updated_at: '2026-11-21T01:05:00Z',
  },
  {
    id: 'a1b2c3d4-0006',
    tracking_id: 'PT-20261121-0006',
    sender_name: 'Rodrigue Essomba',
    sender_phone: '+237 677 100 006',
    recipient_name: 'Nadège Fouda',
    recipient_phone: '+237 699 200 006',
    origin: 'Douala',
    destination: 'Bamenda',
    description: 'Household items',
    weight_kg: 10.0,
    fee_xaf: 9500,
    status: 'registered',
    created_at: '2026-11-21T02:00:00Z',
    updated_at: '2026-11-21T02:00:00Z',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId() {
  return crypto.randomUUID()
}

function generateTrackingId() {
  const today = new Date()
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(_mockParcels.length + 1).padStart(4, '0')
  return `PT-${datePart}-${seq}`
}

function simulateDelay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms))
}

// ─── Mock Implementation ─────────────────────────────────────────────────────

const mock = {
  async getParcels({ search = '', status = '' } = {}) {
    await simulateDelay()
    let results = [..._mockParcels]
    if (status) {
      results = results.filter((p) => p.status === status)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      results = results.filter(
        (p) =>
          p.tracking_id.toLowerCase().includes(q) ||
          p.recipient_name.toLowerCase().includes(q) ||
          p.sender_name.toLowerCase().includes(q)
      )
    }
    // Most recent first
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return results
  },

  async getParcel(id) {
    await simulateDelay()
    const parcel = _mockParcels.find((p) => p.id === id)
    if (!parcel) throw new Error(`Parcel ${id} not found`)
    return parcel
  },

  async createParcel(data) {
    await simulateDelay(500)
    const now = new Date().toISOString()
    const newParcel = {
      ...data,
      id: generateId(),
      tracking_id: generateTrackingId(),
      status: 'registered',
      created_at: now,
      updated_at: now,
    }
    _mockParcels.push(newParcel)
    return newParcel
  },
}

// ─── Live (fetch) Implementation ──────────────────────────────────────────────
// Uncomment and use when VITE_API_URL is set.

const live = {
  async getParcels({ search = '', status = '' } = {}) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const res = await fetch(`${BASE_URL}/api/v1/parcels?${params}`)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async getParcel(id) {
    const res = await fetch(`${BASE_URL}/api/v1/parcels/${id}`)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async createParcel(data) {
    const res = await fetch(`${BASE_URL}/api/v1/parcels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}

// ─── Exported API ─────────────────────────────────────────────────────────────

const adapter = USE_MOCK ? mock : live

/**
 * Fetch the list of parcels, optionally filtered.
 * @param {{ search?: string, status?: string }} filters
 * @returns {Promise<Parcel[]>}
 */
export async function getParcels(filters) {
  return adapter.getParcels(filters)
}

/**
 * Fetch a single parcel by its internal ID.
 * @param {string} id
 * @returns {Promise<Parcel>}
 */
export async function getParcel(id) {
  return adapter.getParcel(id)
}

/**
 * Register a new parcel.  Returns the created parcel including generated
 * tracking_id and id.
 * @param {Omit<Parcel, 'id'|'tracking_id'|'status'|'created_at'|'updated_at'>} data
 * @returns {Promise<Parcel>}
 */
export async function createParcel(data) {
  return adapter.createParcel(data)
}

/**
 * Returns aggregate stats for the StatsCards component.
 * Uses a local pass over the full list rather than a dedicated endpoint.
 * @returns {Promise<{ total: number, in_transit: number, arrived: number, collected: number }>}
 */
export async function getStats() {
  const all = await adapter.getParcels()
  return {
    total: all.length,
    in_transit: all.filter((p) => p.status === 'in_transit').length,
    arrived: all.filter((p) => p.status === 'arrived').length,
    collected: all.filter((p) => p.status === 'collected').length,
  }
}
