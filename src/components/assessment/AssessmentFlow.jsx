import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import QuestionCard from './QuestionCard';
import ResultCard from './ResultCard';

const ease = [0.25, 0.1, 0.25, 1];

export default function AssessmentFlow({ title, description }) {
  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {loadQuestions();}, []);

  const loadQuestions = async () => {
    try {
      const res = await base44.functions.invoke('getAssessmentData', {});
      const qs = res.data.questions || [];
      if (!qs.length) {
        setError('The self-reflection questionnaire is not available yet. Please check back soon.');
        return;
      }
      setQuestions(qs);
      setPhase('idle');
    } catch {setError('The questionnaire could not be loaded. Please try again later.');}
  };

  const handleSelect = (indices) => {
    const q = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: indices }));
    if (q.question_type === 'single' && indices.length > 0) {
      setTimeout(() => advance(), 350);
    }
  };

  const advance = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);else
    submit();
  };

  const submit = async () => {
    setPhase('submitting');
    try {
      const arr = Object.entries(answers).map(([questionId, selectedIndices]) => ({ questionId, selectedIndices }));
      const res = await base44.functions.invoke('submitAssessment', { answers: arr });
      setResult(res.data.profile);
      setPhase('result');
    } catch {setError('Something went wrong. Please try again.');setPhase('questions');}
  };

  const restart = () => {setAnswers({});setCurrentIndex(0);setResult(null);setPhase('idle');};

  const containerClass = "py-8 md:py-10";

  if (phase === 'loading')
  return <div className={`${containerClass} flex items-center justify-center min-h-[280px]`}><Loader2 className="w-6 h-6 text-red-600 animate-spin" /></div>;

  if (error)
  return <div className={`${containerClass} flex items-center justify-center min-h-[280px]`}><p className="text-sm text-neutral-400">{error}</p></div>;

  if (phase === 'submitting')
  return (
    <div className={`${containerClass} flex items-center justify-center min-h-[280px]`}>
        <div className="text-center">
          <Loader2 className="w-6 h-6 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">Summarizing your answers...</p>
        </div>
      </div>);


  if (phase === 'result' && result)
  return <div className={containerClass}><ResultCard result={result} onRestart={restart} /></div>;

  if (phase === 'idle')
  return (
    <div className="p-8 md:p-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
        <div className="md:flex-1">
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block mb-4 font-medium">Self-reflection</span>
          {title && (
            <h2 className="font-display text-2xl md:text-4xl text-neutral-800 tracking-tight mb-4">
              {title}
            </h2>
          )}
          <p className="text-neutral-600 text-base md:text-lg font-light leading-normal max-w-[42ch]">
            {description || 'Not sure which concern fits you? Take a few minutes to recognize your current landscape.'}
          </p>
        </div>
        <div className="md:flex-shrink-0 flex flex-col md:items-end gap-4">
          <button
            onClick={() => setPhase('questions')}
            className="group inline-flex items-center gap-3 bg-neutral-900 hover:bg-black text-white px-6 py-4 rounded-full text-xs uppercase tracking-widest font-body transition-all duration-300"
          >
            Begin self-reflection
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-red-600" strokeWidth={1.5} />
            </span>
          </button>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">± 2 minutes · No obligation</p>
        </div>
      </div>
    </div>);


  const q = questions[currentIndex];
  if (!q) {
    return (
      <div className={`${containerClass} flex items-center justify-center min-h-[280px]`}>
        <p className="text-sm text-neutral-400">No question available.</p>
      </div>
    );
  }
  const selected = answers[q.id] || [];
  const progress = currentIndex / questions.length;
  const isMultiple = q.question_type === 'multiple';

  return (
    <div className={containerClass}>
      <div className="mb-8 max-w-md mx-auto">
        <div className="h-px bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-red-600/70"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease }} />
          
        </div>
      </div>

      {currentIndex > 0 &&
      <button
        onClick={() => setCurrentIndex((i) => i - 1)}
        className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-2 mb-6">
        
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      }

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease }}>
          
          <QuestionCard question={q} selectedIndices={selected} onSelect={handleSelect} />
        </motion.div>
      </AnimatePresence>

      {isMultiple && selected.length > 0 &&
      <div className="text-center mt-8">
          <button
          onClick={advance}
          className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest font-body transition-colors">
          
            {currentIndex < questions.length - 1 ? 'Next' : 'See my reflection'} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      }
    </div>);

}