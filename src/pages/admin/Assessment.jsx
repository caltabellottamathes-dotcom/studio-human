import React, { useState } from 'react';
import { ClipboardList, FileText, BarChart3 } from 'lucide-react';
import AssessmentQuestionManager from '@/components/admin/AssessmentQuestionManager';
import AssessmentProfileManager from '@/components/admin/AssessmentProfileManager';
import AssessmentStats from '@/components/admin/AssessmentStats';

const tabs = [
  { key: 'questions', label: 'Questions', icon: ClipboardList },
  { key: 'profiles', label: 'Profiles', icon: FileText },
  { key: 'stats', label: 'Statistics', icon: BarChart3 },
];

export default function AdminAssessment() {
  const [tab, setTab] = useState('questions');

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Self-reflection</h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-neutral-200">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest font-body transition-colors border-b-2 -mb-px ${
              tab === t.key ? 'border-red-600 text-red-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" strokeWidth={1.5} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'questions' && <AssessmentQuestionManager />}
      {tab === 'profiles' && <AssessmentProfileManager />}
      {tab === 'stats' && <AssessmentStats />}
    </div>
  );
}