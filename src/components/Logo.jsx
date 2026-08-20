import React from 'react';
import { useBrand } from '@/hooks/useBrand';

export default function Logo({ variant = 'light', className = '', light = false }) {
  const { name } = useBrand();
  if (variant === 'dark') {
    return <span className={`font-serif text-lg tracking-tight text-neutral-800 ${className}`}>{name}</span>;
  }
  return <span className={`font-serif text-lg tracking-tight ${light ? 'text-white md:text-neutral-800' : 'text-neutral-800'} ${className}`}>{name}</span>;
}