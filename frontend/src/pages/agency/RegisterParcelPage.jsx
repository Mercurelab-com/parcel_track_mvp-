import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Loader2,
  MapPin,
  PackagePlus,
  Phone,
  User,
} from 'lucide-react';
import ApiErrorBanner from '../../components/common/ApiErrorBanner';
import RegistrationSuccessCard from '../../components/agency/RegistrationSuccessCard';
import { createParcel } from '../../services/parcelService';

const INITIAL_FORM = {
  sender_name: '',
  sender_phone: '',
  recipient_name: '',
  recipient_phone: '',
  origin: '',
  destination: '',
  description: '',
};

const FIELD_LIMITS = {
  sender_name: { label: 'Sender name', max: 100 },
  sender_phone: { label: 'Sender phone', max: 20 },
  recipient_name: { label: 'Recipient name', max: 100 },
  recipient_phone: { label: 'Recipient phone', max: 20 },
  origin: { label: 'Origin city / branch', max: 50 },
  destination: { label: 'Destination city / branch', max: 50 },
  description: { label: 'Parcel description', max: 255 },
};

const SUGGESTED_BRANCHES = [
  'Douala',
  'Yaoundé',
  'Bamenda',
  'Bafoussam',
  'Buea',
  'Limbe',
  'Ngaoundéré',
  'Garoua',
  'Kribi',
  'Ebolowa',
];

function validateForm(values) {
  const errors = {};
  Object.entries(FIELD_LIMITS).forEach(([key, { label, max }]) => {
    const trimmed = (values[key] || '').trim();
    if (!trimmed) {
      errors[key] = `${label} is required.`;
    } else if (trimmed.length > max) {
      errors[key] = `${label} must be ${max} characters or fewer.`;
    }
  });
  return errors;
}

export default function RegisterParcelPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdParcel, setCreatedParcel] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setFieldErrors({});
    setSubmitError(null);
  };

  const handleRegisterAnother = () => {
    setCreatedParcel(null);
    handleReset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setSubmitError({
        title: 'Validation Error',
        message: 'Please complete all required fields before registering the parcel.',
        type: 'VALIDATION_ERROR',
      });
      return;
    }

    const payload = {
      sender_name: formData.sender_name.trim(),
      sender_phone: formData.sender_phone.trim(),
      recipient_name: formData.recipient_name.trim(),
      recipient_phone: formData.recipient_phone.trim(),
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      description: formData.description.trim(),
    };

    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const created = await createParcel(payload);
      setCreatedParcel(created);
    } catch (err) {
      if (err?.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setSubmitError({
        title:
          err?.type === 'NETWORK_ERROR'
            ? 'Connection Error'
            : err?.type === 'VALIDATION_ERROR'
            ? 'Validation Error'
            : err?.type === 'SERVER_ERROR'
            ? 'Server Error'
            : 'Registration Failed',
        message: err?.message || 'Unable to register parcel. Please try again.',
        type: err?.type || 'CLIENT_ERROR',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full h-10 rounded-[4px] bg-surface text-sm text-text-main placeholder:text-text-muted/70 border transition-all focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:opacity-60 ${
      fieldErrors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-border'
    }`;

  if (createdParcel) {
    return (
      <div className="space-y-6">
        <RegistrationSuccessCard
          parcel={createdParcel}
          onRegisterAnother={handleRegisterAnother}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <section className="bg-surface p-5 sm:p-6 rounded-[8px] border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/parcels"
            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Parcels</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Register New Parcel
          </h1>
          <p className="text-sm text-text-muted">
            Record sender, recipient, route, and package contents to issue a tracking code.
          </p>
        </div>

        <div className="w-11 h-11 rounded-[8px] bg-surface-low border border-border flex items-center justify-center text-primary flex-shrink-0">
          <PackagePlus className="w-5 h-5" />
        </div>
      </section>

      {/* Error Banner */}
      {submitError && <ApiErrorBanner error={submitError} />}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Sender & Recipient Split Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender Details */}
          <div className="bg-surface p-5 sm:p-6 rounded-[8px] border border-border shadow-2xs space-y-4">
            <div className="pb-3 border-b border-border/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-primary">Sender Details</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Consignor depositing the parcel
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-surface-low text-text-muted">
                Step 01
              </span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="sender_name"
                className="text-xs font-semibold text-primary block"
              >
                Sender Full Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="sender_name"
                  name="sender_name"
                  type="text"
                  required
                  maxLength={100}
                  disabled={isSubmitting}
                  value={formData.sender_name}
                  onChange={handleChange('sender_name')}
                  placeholder="e.g., John Doe"
                  className={`${inputClass('sender_name')} pl-9 pr-3`}
                />
              </div>
              {fieldErrors.sender_name && (
                <p className="text-xs text-red-600">{fieldErrors.sender_name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="sender_phone"
                className="text-xs font-semibold text-primary block"
              >
                Sender Phone <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="sender_phone"
                  name="sender_phone"
                  type="tel"
                  required
                  maxLength={20}
                  disabled={isSubmitting}
                  value={formData.sender_phone}
                  onChange={handleChange('sender_phone')}
                  placeholder="e.g., 677123456"
                  className={`${inputClass('sender_phone')} pl-9 pr-3 font-mono tabular-nums`}
                />
              </div>
              {fieldErrors.sender_phone && (
                <p className="text-xs text-red-600">{fieldErrors.sender_phone}</p>
              )}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-surface p-5 sm:p-6 rounded-[8px] border border-border shadow-2xs space-y-4">
            <div className="pb-3 border-b border-border/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-primary">Recipient Details</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Consignee collecting at destination
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-surface-low text-text-muted">
                Step 02
              </span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="recipient_name"
                className="text-xs font-semibold text-primary block"
              >
                Recipient Full Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="recipient_name"
                  name="recipient_name"
                  type="text"
                  required
                  maxLength={100}
                  disabled={isSubmitting}
                  value={formData.recipient_name}
                  onChange={handleChange('recipient_name')}
                  placeholder="e.g., Mary Jane"
                  className={`${inputClass('recipient_name')} pl-9 pr-3`}
                />
              </div>
              {fieldErrors.recipient_name && (
                <p className="text-xs text-red-600">{fieldErrors.recipient_name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="recipient_phone"
                className="text-xs font-semibold text-primary block"
              >
                Recipient Phone <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="recipient_phone"
                  name="recipient_phone"
                  type="tel"
                  required
                  maxLength={20}
                  disabled={isSubmitting}
                  value={formData.recipient_phone}
                  onChange={handleChange('recipient_phone')}
                  placeholder="e.g., 690123456"
                  className={`${inputClass('recipient_phone')} pl-9 pr-3 font-mono tabular-nums`}
                />
              </div>
              {fieldErrors.recipient_phone && (
                <p className="text-xs text-red-600">{fieldErrors.recipient_phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Route & Parcel Information */}
        <div className="bg-surface p-5 sm:p-6 rounded-[8px] border border-border shadow-2xs space-y-5">
          <div className="pb-3 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-primary">
                Route &amp; Consignment Details
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Specify origin branch, destination branch, and package contents
              </p>
            </div>
            {(formData.origin.trim() || formData.destination.trim()) && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-surface-low border border-border text-xs font-semibold text-primary self-start sm:self-auto">
                <span>{formData.origin.trim() || 'Origin'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                <span>{formData.destination.trim() || 'Destination'}</span>
              </div>
            )}
          </div>

          <datalist id="agency-branch-suggestions">
            {SUGGESTED_BRANCHES.map((branch) => (
              <option key={branch} value={branch} />
            ))}
          </datalist>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="origin" className="text-xs font-semibold text-primary block">
                Origin Branch / City <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="origin"
                  name="origin"
                  type="text"
                  list="agency-branch-suggestions"
                  required
                  maxLength={50}
                  disabled={isSubmitting}
                  value={formData.origin}
                  onChange={handleChange('origin')}
                  placeholder="e.g., Douala"
                  className={`${inputClass('origin')} pl-9 pr-3`}
                />
              </div>
              {fieldErrors.origin && (
                <p className="text-xs text-red-600">{fieldErrors.origin}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="destination"
                className="text-xs font-semibold text-primary block"
              >
                Destination Branch / City <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  list="agency-branch-suggestions"
                  required
                  maxLength={50}
                  disabled={isSubmitting}
                  value={formData.destination}
                  onChange={handleChange('destination')}
                  placeholder="e.g., Bamenda"
                  className={`${inputClass('destination')} pl-9 pr-3`}
                />
              </div>
              {fieldErrors.destination && (
                <p className="text-xs text-red-600">{fieldErrors.destination}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="text-xs font-semibold text-primary flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-text-muted" />
                <span>
                  Package Description <span className="text-red-600">*</span>
                </span>
              </label>
              <span className="text-[11px] font-mono text-text-muted tabular-nums">
                {formData.description.length}/255
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              maxLength={255}
              disabled={isSubmitting}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="e.g., Box of clothes and textbooks"
              className={`w-full p-3 rounded-[4px] bg-surface text-sm text-text-main placeholder:text-text-muted/70 border transition-all focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary resize-none disabled:opacity-60 ${
                fieldErrors.description
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                  : 'border-border'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-600">{fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* Form Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs text-text-muted">
            Initial status will be set to <strong className="text-primary">REGISTERED</strong> with a unique tracking ID.
          </p>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-[4px] bg-surface text-text-main border border-border text-xs font-semibold hover:bg-surface-low transition-colors cursor-pointer disabled:opacity-50"
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[4px] bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Parcel...</span>
                </>
              ) : (
                <>
                  <PackagePlus className="w-4 h-4" />
                  <span>Register Parcel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
