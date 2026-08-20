import React from 'react';

const WORDMARK_URL = 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/1707afa06_AmorVitaeLogo.png';

export default function Logo({ variant = 'light', className = '', light = false }) {
  if (variant === 'dark') {
    return <span className={`font-serif text-lg tracking-tight text-neutral-800 ${className}`}>studioHuman</span>;
  }
  return <span className={`font-serif text-lg tracking-tight ${light ? 'text-white md:text-neutral-800' : 'text-neutral-800'} ${className}`}>studioHuman</span>;
}