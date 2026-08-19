import React from 'react';
import { Check } from 'lucide-react';

export default function QuestionCard({ question, selectedIndices, onSelect }) {
  const isMultiple = question.question_type === 'multiple';

  const handleClick = (index) => {
    if (isMultiple) {
      onSelect(selectedIndices.includes(index)
        ? selectedIndices.filter(i => i !== index)
        : [...selectedIndices, index]);
    } else {
      onSelect([index]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {isMultiple && (
        <p className="text-center text-xs uppercase tracking-widest text-neutral-400 mb-8">
          Selecteer alles wat van toepassing is
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl text-neutral-800 leading-tight tracking-tight mb-10 text-center">
        {question.question_text}
      </h2>
      <div className="space-y-3">
        {question.answers.map((answer, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-full text-left px-6 py-5 rounded-xl border transition-all duration-300 group ${
                isSelected
                  ? 'border-red-600/50 bg-red-50/40'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 ${isMultiple ? 'rounded-md' : 'rounded-full'} border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-red-600 bg-red-600' : 'border-neutral-300 group-hover:border-neutral-400'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm md:text-base text-neutral-700 font-body leading-snug">{answer.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}