import React from 'react';
import { Link } from 'react-router-dom';
import { wordmarkImg } from '@/data/content';

export default function PortalAuthLayout({ variant = 'client', image, children }) {
  const isClient = variant === 'client';
  const portalLabel = isClient ? 'Cliëntportaal' : 'Beheerdersportaal';

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Image side — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <img src={wordmarkImg} alt="amorvitae." className="h-6 w-auto brightness-0 invert mb-6" />
          <p className="text-white/90 text-sm font-light max-w-md leading-relaxed">
            {isClient
              ? 'Een veilige ruimte voor jouw welzijn — waar je bent, zoals je bent.'
              : 'Beheerdersomgeving — zorg dragen voor wie zorg draagt.'}
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block lg:hidden mb-6">
              <img src={wordmarkImg} alt="amorvitae." className="h-5 w-auto mx-auto" />
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