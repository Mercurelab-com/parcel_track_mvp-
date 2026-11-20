import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function ParcelDetailsPage() {
  const { trackingId } = useParams();

  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Consignment Tracking View
          </div>
          <h1 className="text-2xl font-bold text-primary mt-1">Parcel Details</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Tracking ID:{' '}
            <code className="bg-surface-low px-2 py-0.5 rounded text-primary font-mono font-bold text-sm">
              {trackingId || 'PT-BAM-8F31A2'}
            </code>
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-surface-low flex items-center justify-center text-primary">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-surface p-8 rounded-lg border border-border text-center space-y-3">
        <p className="text-text-muted">
          Parcel status stepper & custody history placeholder for{' '}
          <span className="font-mono font-bold text-primary">{trackingId}</span>.
        </p>
        <Link
          to="/parcels"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-low text-text-main rounded text-sm font-medium hover:bg-border transition-colors"
        >
          &larr; Return to Parcels
        </Link>
      </div>
    </div>
  );
}
