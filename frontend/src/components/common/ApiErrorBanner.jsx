import React from 'react';
import { AlertCircle, RefreshCw, ServerCrash, WifiOff } from 'lucide-react';

/**
 * Structured API error banner for agency operational views with retry support.
 */
export default function ApiErrorBanner({ error, onRetry, isRetrying = false }) {
  if (!error) return null;

  const isNetwork = error.type === 'NETWORK_ERROR';
  const isServer = error.type === 'SERVER_ERROR';

  const containerClasses = isNetwork
    ? 'bg-amber-50 border-amber-200 text-amber-900'
    : 'bg-red-50 border-red-200 text-red-900';

  const buttonClasses = isNetwork
    ? 'bg-amber-900/10 hover:bg-amber-900/15 text-amber-950 border-amber-300'
    : 'bg-red-900/10 hover:bg-red-900/15 text-red-950 border-red-300';

  const renderIcon = () => {
    if (isNetwork) {
      return <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />;
    }
    if (isServer) {
      return <ServerCrash className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
  };

  return (
    <div
      role="alert"
      className={`rounded-[8px] border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${containerClasses}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {renderIcon()}
        <div className="text-xs sm:text-sm min-w-0">
          <p className="font-bold leading-snug">{error.title || 'Request Failed'}</p>
          <p className="mt-0.5 opacity-90 leading-relaxed">{error.message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[4px] border text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0 ${buttonClasses}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
        </button>
      )}
    </div>
  );
}
