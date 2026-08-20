import React from 'react';

export function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-neutral-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-neutral-100 rounded w-1/3" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
      {Icon && <Icon className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />}
      <p className="text-sm text-neutral-400 font-light">{title}</p>
      {message && <p className="text-xs text-neutral-400 mt-2">{message}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong loading this page.', onRetry }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
      <p className="text-sm text-neutral-500 font-light">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-xs uppercase tracking-widest text-red-600 hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}