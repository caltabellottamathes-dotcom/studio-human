import React from 'react';

const WORDMARK_URL = 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/1707afa06_AmorVitaeLogo.png';

export default function Logo({ variant = 'light', className = '', light = false }) {
  if (variant === 'dark') {
    return <img src={WORDMARK_URL} alt="amorvitae." className={`h-5 md:h-6 w-auto ${className}`} />;
  }
  return <span className={`font-serif text-lg lowercase tracking-normal ${light ? 'text-white md:text-neutral-800' : 'text-neutral-800'} ${className}`}>amorvitae.</span>;
}