import React from 'react';
import BrandedButton from '@/components/BrandedButton';
import { RotateCcw } from 'lucide-react';

const sections = [
  { key: 'reflection', label: 'Een reflectie voor jou' },
  { key: 'recognition', label: 'Wat je antwoorden suggereren' },
  { key: 'encouragement', label: 'Een zachte herinnering' },
  { key: 'how_debora_helps', label: 'Hoe Debora kan helpen' },
  { key: 'invitation', label: 'Een uitnodiging' },
];

export default function ResultCard({ result, onRestart }) {
  const relatedUrl = result.related_slug ? `/zorgvragen/${result.related_slug}` : '/zorgvragen';

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block mb-4">Jouw reflectie</span>
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
        <BrandedButton to={relatedUrl}>Lees meer over dit thema</BrandedButton>
      </div>

      <div className="mt-8 p-5 border border-neutral-200 rounded-xl bg-neutral-50">
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          Deze reflectie is geen diagnostisch instrument. Het is enkel een uitnodiging om even stil te staan bij hoe het met je gaat. Als je antwoorden je aanspreken, kan een gesprek je helpen verkennen wat je nodig hebt.
        </p>
      </div>

      <div className="mt-6">
        <button onClick={onRestart} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors">
          <RotateCcw className="w-3 h-3" /> Opnieuw reflecteren
        </button>
      </div>
    </div>
  );
}