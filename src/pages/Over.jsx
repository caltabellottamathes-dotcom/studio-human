import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import PageHeader from '@/components/PageHeader';

import CalmPanel from '@/components/CalmPanel';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { principles } from '@/data/content';

export default function Over() {
  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      <PageHeader
        label="The practice"
        title={<>A considered space for <span className="font-light text-sky-600/90">the work of being human</span>.</>}
        intro="studioHuman is a collective of qualified psychologists offering a contemporary approach to mental wellbeing — a deliberate departure from clinical language and sterile spaces."
        hideIntroMobile />

      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <FadeSection className="col-span-1 lg:col-span-5 lg:sticky lg:top-28 self-start">
            <div className="relative -ml-6 lg:mr-0 lg:-ml-12">
              <CalmPanel height="72vh" rounded="tr" tone="glacier" className="w-full mobile-h-sm" />
              <div className="hidden lg:block absolute bottom-0 left-0 right-0 bg-neutral-50/85 backdrop-blur-md border-t border-neutral-200/50 px-6 py-4 md:px-8">
                <span className="font-display text-lg md:text-xl text-neutral-800 block leading-tight">studioHuman</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-red-600/80 font-medium block mt-0.5">A psychological practice</span>
              </div>
            </div>
          </FadeSection>

          <div className="col-span-1 lg:col-span-7 flex flex-col justify-end">
            <FadeSection>
              <div className="space-y-6 text-neutral-600 text-base md:text-lg font-light leading-normal max-w-[72ch]">
                <p>
                  Rather than presenting psychology as something clinical or problem-focused, studioHuman creates a calm, considered environment for reflection, conversation and growth — a quiet architecture for the mind.
                </p>
                <p>
                  <span className="font-display text-neutral-800">Studio</span> suggests a place where things are explored — a space for observation, experimentation and change. We have stepped away from sterile facilities and pathologizing language, toward human connection and deep understanding.
                </p>
                <p>
                  <span className="font-display text-neutral-800">Human</span> keeps that process grounded in the person. Before anything else, there is someone with a history, a particular way of experiencing the world, and the capacity to change.
                </p>
                <p className="font-display text-red-600 text-lg md:text-xl my-8 leading-normal">
                  &ldquo;To move forward, you first need to sit down. Genuine momentum cannot be forced from a place of exhaustion.&rdquo;
                </p>
                <p>
                  The website is an extension of the practice itself: a quiet space rather than a clinical interface. A place where you can arrive exactly as you are — and let the dust settle before the real work begins.
                </p>
              </div>
            </FadeSection>

            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-neutral-200" stagger={0.12}>
              {principles.map((p) => (
                <StaggerItem key={p.num}>
                  <span className="font-display text-2xl md:text-3xl text-ember-500 block mb-2">{p.title}</span>
                  <p className="text-neutral-500 text-sm font-light leading-relaxed">{p.desc}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-1 md:col-span-4 md:col-start-1 order-2 md:order-1">
            <FadeSection>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-tight tracking-tight">
                Curious how it works in practice? <span className="font-light text-red-600/90">Read more about our approach.</span>
              </p>
              <Link to="/approach" className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-800 border-b border-neutral-400 py-2 mt-8 hover:gap-3 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                Explore the approach
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeSection>
          </div>
          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 md:-mr-12">
            <CalmPanel height="58vh" rounded="bl" tone="cliff" className="w-full -mr-6 md:mx-0 mobile-h-xs" />
          </div>
        </div>
      </section>

      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-32 md:-mb-72 z-0 w-[56vw] -ml-6 order-2 md:order-1">
            <CalmPanel height="90vh" rounded="tr" tone="glacier" className="w-full mobile-h-closing" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Our vision</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug max-w-[48ch]">
                Muted tones, soft architecture and generous whitespace — a space that feels <span className="font-light text-red-600/90">safe, intelligent and human</span>, without the visual language of clinical healthcare.
              </p>
            </FadeSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
}