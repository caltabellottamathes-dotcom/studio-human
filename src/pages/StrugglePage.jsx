import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import FadeSection from '@/components/FadeSection';
import PremiumImage from '@/components/motion/PremiumImage';


const struggles = {
  'stress-overwhelm': {
    title: 'Stress & Overwhelm',
    subtitle: 'When the noise of daily life drowns out your inner voice.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/42b1d4724_generated_image.png',
    intro: 'The pace of modern life can quietly accumulate — until one day the weight feels impossible to lift alone. Stress and overwhelm are not signs of weakness. They are your body and mind asking for a gentler pace — for a place to sit down.',
    body: [
      { heading: 'What this looks like', text: "You may find yourself constantly 'on,' unable to switch off even when you have the time. Small tasks feel enormous. Your mind races at night. You feel irritable, depleted, and disconnected from the things that once brought you joy." },
      { heading: 'How we can help', text: 'In our sessions we slow down together. We identify the sources of pressure — external and internal — and begin to create small, meaningful shifts. You leave each session with practical tools and a deeper understanding of your own nervous system and needs.' },
      { heading: "You don't have to earn rest", text: 'One of the most common things we hear is guilt about needing rest. Together we work to dissolve that guilt and build a relationship with yourself rooted in compassion, not productivity.' },
    ],
  },
  'burnout': {
    title: 'Burnout',
    subtitle: 'Gently sifting through the ashes of exhaustion.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/21edd95a2_generated_image.png',
    intro: 'Burnout is not simply being tired. It is a deep exhaustion — of energy, of meaning, of the sense that things will ever feel different. Recovery asks for patience, gentleness, and a space where you are not expected to perform.',
    body: [
      { heading: 'Recognizing burnout', text: 'You may feel emotionally numb, or swing between exhaustion and anxiety. Work that once gave you meaning now feels hollow. You find it hard to concentrate, to make decisions, or to feel much at all. This is burnout, and it is real.' },
      { heading: 'A pace that belongs to you', text: 'Recovery cannot be rushed. In our work together we honour the pace your body and mind need — no timelines, no performance standards. We begin simply by naming what has happened, and slowly, carefully, build from there.' },
      { heading: 'Prevention and long-term resilience', text: 'As you begin to stabilize, we explore the patterns and beliefs that contributed to your burnout — so you can build a more sustainable relationship with work, rest, and your own expectations.' },
    ],
  },
  'caregiving': {
    title: 'Caregiving',
    subtitle: 'A considered space for the caregiver.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/d567b0e7c_generated_image.png',
    intro: 'Caring for someone you love is one of the most selfless things a person can offer. It is also one of the most exhausting. studioHuman offers a safe, dedicated space for caregivers who have forgotten to care for themselves.',
    body: [
      { heading: 'The invisible weight of caring', text: 'Caregivers often carry enormous emotional and practical burdens while remaining invisible in their own right. You may grieve the person you care for while they are still present. You may feel frustration, and then guilt about that frustration. All of it is normal. Everything has a place here.' },
      { heading: 'Finding yourself again', text: 'In our sessions we create room for your experience — not only your role. You are not just a caregiver. You are a whole person with needs, desires, and limits. Together we work to honour that truth.' },
      { heading: 'Practical support too', text: 'Alongside emotional guidance, we help with practical navigation — coordinating with other care providers, clarifying paperwork, and finding the support structures that can lighten the load.' },
    ],
  },
  'grief-loss': {
    title: 'Grief & Loss',
    subtitle: 'Honouring the space that remains.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/aa5459e8e_generated_image.png',
    intro: 'Grief is not a problem to solve. It is a testament to love and connection. At studioHuman, grief is surrounded with the reverence it deserves — at whatever pace your heart needs.',
    body: [
      { heading: 'All grief is valid', text: "Loss takes many forms: the death of a loved one, the end of a relationship, a diagnosis, the loss of a future you had imagined. You don't need to justify your grief or compare it to another's. If it is real for you, it belongs here." },
      { heading: 'No timeline, no expectations', text: "There is no right way to grieve, and there is no deadline. In our sessions we don't rush toward acceptance. Instead we honour where you are now — and move from there, slowly, together." },
      { heading: 'Rebuilding meaning', text: 'Over time, many people find that grief opens a door to deeper self-understanding. We explore what the person or thing you lost meant to you, and how that meaning can live on in you in new ways.' },
    ],
  },
  'life-transitions': {
    title: 'Life Transitions',
    subtitle: 'Finding your footing in the blur.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/62cb3ee5c_generated_image.png',
    intro: 'Every major life transition — a new job, a move, retirement, becoming a parent, a relationship ending — disrupts our sense of who we are. This disorientation is normal. And navigating it with support makes all the difference.',
    body: [
      { heading: 'When the map no longer fits the territory', text: 'You may feel lost, anxious, or strangely grief-stricken — even when the transition is one you chose or wanted. Change, even positive change, asks us to let something go. That letting go asks for courage, and it asks for time.' },
      { heading: 'A steady frame in the blur', text: 'In our sessions we create space to process what is ending and what is beginning. We hold steady while your old edges dissolve and new perspectives form — and then we build toward what comes next, step by step.' },
      { heading: 'You are not behind', text: 'There is no schedule for life transitions. At any age, in any phase, a new beginning is possible. Our role is to walk beside you as you find your own way — at your pace, on your terms.' },
    ],
  },
  'emotional-exhaustion': {
    title: 'Emotional Exhaustion',
    subtitle: 'Replenishing empty reserves.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/af1d0a950_generated_image.png',
    intro: 'Emotional exhaustion is what happens when we give more than we receive — for too long. It is not a character flaw. It is a deeply human response to an untenable situation. And it can be gently, carefully undone.',
    body: [
      { heading: 'How emotional exhaustion feels', text: 'You may feel hollow, numb, or disconnected from the people and things you love. Empathy that once came naturally now takes enormous effort. You go through the motions but feel absent from your own life. Even small decisions feel overwhelming.' },
      { heading: 'Learning to receive', text: 'Often, people who experience emotional exhaustion have spent years giving — to others, to work, to ideals — while receiving little. In our sessions we explore the beliefs that made this pattern necessary, and begin the gentle work of restoration.' },
      { heading: 'Boundaries as an act of love', text: 'Setting boundaries is not selfish. It is what allows you to keep showing up — for yourself and for the people who matter to you. We work together to understand your limits, voice them with confidence, and hold them without guilt.' },
    ],
  },
};

const slugList = Object.keys(struggles);

export default function StrugglePage() {
  const { slug } = useParams();
  const data = struggles[slug];

  if (!data) {
    return (
      <div className="bg-neutral-50 min-h-screen">
        <Header />
        <div className="pt-40 px-6 max-w-xl mx-auto text-center">
          <h1 className="font-display text-3xl text-neutral-800 mb-4">Page not found</h1>
          <Link to="/" className="text-red-600 underline text-sm">Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentIndex = slugList.indexOf(slug);
  const nextSlug = slugList[(currentIndex + 1) % slugList.length];
  const nextData = struggles[nextSlug];

  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 md:px-12 max-w-[120rem] mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}>
          <Link to="/concerns" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to concerns
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6">Concerns</span>
          <h1 className="font-display text-5xl md:text-7xl text-neutral-800 leading-tight tracking-tight max-w-[18ch] mb-6">{data.title}</h1>
          <p className="text-neutral-600 text-base md:text-lg font-light max-w-[44ch] leading-normal">{data.subtitle}</p>
        </motion.div>
      </section>

      {/* Image + intro text side by side */}
      <section className="pb-16 md:pb-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-5 md:grid-cols-12 gap-4 lg:gap-12 items-center">
          <div className="col-span-2 md:col-span-5 md:col-start-1 order-1 md:order-1">
            <FadeSection>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-normal">{data.intro}</p>
            </FadeSection>
          </div>
          <div className="col-span-3 md:col-span-7 md:col-start-6 order-2 md:order-2 md:-mr-12">
            <PremiumImage src={data.img} alt={data.title} height="70vh" rounded="bl" className="w-full mobile-h-sm md:w-full" />
          </div>
        </div>
      </section>

      {/* Body blocks — alternating layout */}
      <section className="py-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="space-y-12 md:space-y-20">
          {data.body.map((block, i) => (
            <FadeSection key={i} delay={i * 0.05}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className={`col-span-1 md:col-span-4 ${i % 2 === 1 ? 'md:order-2 md:col-start-9' : 'md:order-1'}`}>
                  <span className={`font-display italic text-5xl md:text-6xl block leading-none mb-4 ${i % 2 === 0 ? 'text-cliff-400' : 'text-glacier-400'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl md:text-2xl text-neutral-800">{block.heading}</h3>
                </div>
                <div className={`col-span-1 md:col-span-7 ${i % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:order-2 md:col-start-6'}`}>
                  <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">{block.text}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Closing — image behind footer */}
      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-40 md:-mb-72 z-0 w-[60vw] -ml-6 order-2 md:order-1">
            <PremiumImage src="https://media.base44.com/images/public/6a863d1d060de4a10b195ae3/a9d0dc67a_Man_leaning_on_foam_2K_202608201954.jpeg" alt="A figure leaning back in repose" height="90vh" rounded="tr" className="w-full mobile-h-sm" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Rest</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug max-w-[48ch]">
                Sometimes sitting down is already the first step. You don't need to know where you're going — only that you don't have to get there alone.
              </p>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* Next topic */}
      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-16">
        <div className="border-t border-neutral-200 pt-8 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-neutral-400">Next topic</span>
          <Link to={`/concerns/${nextSlug}`} className="group flex items-center gap-3 hover:gap-4 transition-all duration-300">
            <span className="font-display text-xl md:text-2xl text-neutral-800 group-hover:text-red-600 transition-colors">{nextData.title}</span>
            <ArrowRight className="w-5 h-5 text-red-600" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}