import React from 'react';
import { Link } from 'react-router-dom';
import { wordmarkImg } from '@/data/content';

export default function PortalAuthLayout({ variant = 'client', image, children }) {
  const isClient = variant === 'client';
  const portalLabel = isClient ? 'Client Portal' : 'Admin Portal';

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Image side — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <span className="font-serif text-2xl tracking-tight text-white mb-6 block">studioHuman</span>
          <p className="text-white/90 text-sm font-light max-w-md leading-relaxed">
            {isClient
              ? 'A safe space for your wellbeing — where you are, as you are.'
              : 'The admin environment — caring for those who care.'}
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block lg:hidden mb-6">
              <span className="font-serif text-lg tracking-tight text-neutral-800 mx-auto block">studioHuman</span>
            </Link>
            <span className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-body">
              {portalLabel}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}