import React from 'react';
import BrandedButton from '@/components/BrandedButton';
import { RotateCcw } from 'lucide-react';

const sections = [
  { key: 'reflection', label: 'A reflection for you' },
  { key: 'recognition', label: 'What your answers suggest' },
  { key: 'encouragement', label: 'A gentle reminder' },
  { key: 'how_debora_helps', label: 'How the studio can help' },
  { key: 'invitation', label: 'An invitation' },
];

export default function ResultCard({ result, onRestart }) {
  const relatedUrl = result.related_slug ? `/concerns/${result.related_slug}` : '/concerns';

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block mb-4">Your reflection</span>
      <h3 className="font-display text-2xl md:text-3xl text-neutral-800 leading-[1.2] tracking-tight mb-8">
        {result.title}
      </h3>

      <div className="space-y-6">
        {sections.map(section => result[section.key] && (
          <div key={section.key}>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">{section.label}</h4>
            <p className="text-neutral-700 font-light leading-relaxed text-base md:text-lg">{result[section.key]}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <BrandedButton to={relatedUrl}>Read more about this theme</BrandedButton>
      </div>

      <div className="mt-8 p-5 border border-neutral-200 rounded-xl bg-neutral-50">
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          This reflection is not a diagnostic tool. It is an invitation to sit down and notice how you are doing. If your answers resonate, a conversation can help you explore what you need.
        </p>
      </div>

      <div className="mt-6">
        <button onClick={onRestart} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors">
          <RotateCcw className="w-3 h-3" /> Reflect again
        </button>
      </div>
    </div>
  );
}