import React from 'react';

export default function Logo({ variant = 'light', className = '', light = false }) {
  if (variant === 'dark') {
    return <span className={`font-serif text-lg tracking-tight text-neutral-800 ${className}`}>studioHuman</span>;
  }
  return <span className={`font-serif text-lg tracking-tight ${light ? 'text-white md:text-neutral-800' : 'text-neutral-800'} ${className}`}>studioHuman</span>;
}