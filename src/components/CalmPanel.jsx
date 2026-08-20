import React from 'react';
import { cn } from '@/lib/utils';

const tones = {
  ink: 'bg-gradient-to-br from-red-800 to-red-900',
  glacier: 'bg-gradient-to-br from-red-100 via-red-200 to-cliff-100',
  cliff: 'bg-gradient-to-br from-cliff-100 via-cliff-200 to-red-100',
  ember: 'bg-gradient-to-br from-ember-100 via-ember-200 to-cliff-100',
  neutral: 'bg-gradient-to-br from-neutral-100 to-neutral-200',
};

const roundedMap = {
  bl: 'rounded-bl-[3rem] md:rounded-bl-[14rem] rounded-tl-xl rounded-tr-xl rounded-br-xl',
  br: 'rounded-br-[3rem] md:rounded-br-[14rem] rounded-tl-xl rounded-tr-xl rounded-bl-xl',
  tl: 'rounded-tl-[3rem] md:rounded-tl-[14rem] rounded-tr-xl rounded-br-xl rounded-bl-xl',
  tr: 'rounded-tr-[3rem] md:rounded-tr-[14rem] rounded-tl-xl rounded-br-xl rounded-bl-xl',
  '': 'rounded-[1.5rem]',
};

export default function CalmPanel({ height = '60vh', rounded = '', tone = 'glacier', className = '' }) {
  return (
    <div
      className={cn('relative w-full overflow-hidden', tones[tone] || tones.glacier, roundedMap[rounded] || roundedMap[''], className)}
      style={{ height }}
      aria-hidden
    />
  );
}