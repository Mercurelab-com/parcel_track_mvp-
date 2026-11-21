/**
 * ParcelForm.jsx
 * Registration form for new parcels.
 * Validates all required fields before calling parcelService.createParcel.
 *
 * Props:
 *   onSuccess – fn(newParcel)  called after successful registration
 *   onCancel  – fn()           optional cancel handler
 */
import { useState } from 'react'
import { createParcel } from '../../services/parcelService'
import { CITY_OPTIONS } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

// ─── Validation ───────────────────────────────────────────────────────────────

const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/

function validate(fields) {
  const errors = {}
  if (!fields.sender_name.trim()) errors.sender_name = 'Sender name is required.'
  if (!fields.sender_phone.trim()) {
    errors.sender_phone = 'Sender phone is required.'
  } else if (!PHONE_RE.test(fields.sender_phone)) {
    errors.sender_phone = 'Enter a valid phone number.'
  }
  if (!fields.recipient_name.trim()) errors.recipient_name = 'Recipient name is required.'
  if (!fields.recipient_phone.trim()) {
    errors.recipient_phone = 'Recipient phone is required.'
  } else if (!PHONE_RE.test(fields.recipient_phone)) {
    errors.recipient_phone = 'Enter a valid phone number.'
  }
  if (!fields.origin) errors.origin = 'Origin city is required.'
  if (!fields.destination) errors.destination = 'Destination city is required.'
  if (fields.origin && fields.destination && fields.origin === fields.destination) {
    errors.destination = 'Destination must differ from origin.'
  }
  if (!fields.description.trim()) errors.description = 'Package description is required.'
  if (!fields.weight_kg) {
    errors.weight_kg = 'Weight is required.'
  } else if (isNaN(Number(fields.weight_kg)) || Number(fields.weight_kg) <= 0) {
    errors.weight_kg = 'Weight must be a positive number.'
  }
  if (!fields.fee_xaf) {
    errors.fee_xaf = 'Fee is required.'
  } else if (isNaN(Number(fields.fee_xaf)) || Number(fields.fee_xaf) < 0) {
    errors.fee_xaf = 'Fee must be a non-negative number.'
  }
  return errors
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ─── Initial state ────────────────────────────────────────────────────────────

const EMPTY = {
  sender_name: '',
  sender_phone: '',
  recipient_name: '',
  recipient_phone: '',
  origin: '',
  destination: '',
  description: '',
  weight_kg: '',
  fee_xaf: '',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ParcelForm({ onSuccess, onCancel }) {
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  function set(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    // Clear field error on change
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setServerError(null)
    try {
      const payload = {
        ...fields,
        weight_kg: Number(fields.weight_kg),
        fee_xaf: Number(fields.fee_xaf),
      }
      const created = await createParcel(payload)
      setFields(EMPTY)
      setErrors({})
      onSuccess?.(created)
    } catch (err) {
      setServerError(err.message ?? 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* ── Sender Info ── */}
      <fieldset>
        <legend className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100 w-full">
          Sender Information
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.sender_name} required>
            <Input
              type="text"
              placeholder="e.g. Jean-Paul Mba"
              value={fields.sender_name}
              onChange={(e) => set('sender_name', e.target.value)}
              error={errors.sender_name}
            />
          </Field>
          <Field label="Phone Number" error={errors.sender_phone} required>
            <Input
              type="tel"
              placeholder="+237 6XX XXX XXX"
              value={fields.sender_phone}
              onChange={(e) => set('sender_phone', e.target.value)}
              error={errors.sender_phone}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Recipient Info ── */}
      <fieldset>
        <legend className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100 w-full">
          Recipient Information
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.recipient_name} required>
            <Input
              type="text"
              placeholder="e.g. Marie Nkeng"
              value={fields.recipient_name}
              onChange={(e) => set('recipient_name', e.target.value)}
              error={errors.recipient_name}
            />
          </Field>
          <Field label="Phone Number" error={errors.recipient_phone} required>
            <Input
              type="tel"
              placeholder="+237 6XX XXX XXX"
              value={fields.recipient_phone}
              onChange={(e) => set('recipient_phone', e.target.value)}
              error={errors.recipient_phone}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Route ── */}
      <fieldset>
        <legend className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100 w-full">
          Route
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Origin City" error={errors.origin} required>
            <Select
              value={fields.origin}
              onChange={(e) => set('origin', e.target.value)}
              error={errors.origin}
            >
              <option value="">Select origin…</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Destination City" error={errors.destination} required>
            <Select
              value={fields.destination}
              onChange={(e) => set('destination', e.target.value)}
              error={errors.destination}
            >
              <option value="">Select destination…</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      {/* ── Package Details ── */}
      <fieldset>
        <legend className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100 w-full">
          Package Details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Description" error={errors.description} required>
            <Input
              type="text"
              placeholder="e.g. Electronic spare parts"
              value={fields.description}
              onChange={(e) => set('description', e.target.value)}
              error={errors.description}
              className="sm:col-span-1"
            />
          </Field>
          <Field label="Weight (kg)" error={errors.weight_kg} required>
            <Input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="0.0"
              value={fields.weight_kg}
              onChange={(e) => set('weight_kg', e.target.value)}
              error={errors.weight_kg}
            />
          </Field>
          <Field label="Fee (XAF)" error={errors.fee_xaf} required>
            <Input
              type="number"
              min="0"
              step="100"
              placeholder="0"
              value={fields.fee_xaf}
              onChange={(e) => set('fee_xaf', e.target.value)}
              error={errors.fee_xaf}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Registering…
            </>
          ) : (
            'Register Parcel'
          )}
        </Button>
      </div>
    </form>
  )
}
