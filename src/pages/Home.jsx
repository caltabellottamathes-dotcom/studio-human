import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import Marquee from '@/components/motion/Marquee';
import CalmPanel from '@/components/CalmPanel';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import ClosingCTA from '@/components/ClosingCTA';
import { principles } from '@/data/content';

const ease = [0.25, 0.1, 0.25, 1];

const heroItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } }
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 600], [0, 80]);

  useEffect(() => {
    const onScroll = () => {
      if (sessionStorage.getItem('zelfreflectie-seen')) return;
      if (window.scrollY > 600) {
        sessionStorage.setItem('zelfreflectie-seen', 'true');
        window.dispatchEvent(new CustomEvent('open-zelfreflectie'));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      <Header />

      <section className="relative min-h-screen flex flex-col pt-32 md:pt-36 pb-16 px-6 md:px-12 max-w-[120rem] mx-auto">
        <motion.div
          initial={{ clipPath: 'inset(6% 0 0 6% round 0px)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0 0 0 round 0px)', opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease }}
          className="absolute bottom-0 right-0 w-[44%] h-[48vh] md:w-[38%] md:h-screen overflow-hidden rounded-tl-[3rem] md:rounded-bl-[12rem] pointer-events-none z-0"
          aria-hidden>
          <CalmPanel height="100%" rounded="bl" tone="glacier" className="h-full" />
        </motion.div>

        <motion.div
          className="mt-[2vh] md:mt-[8vh] relative z-10 py-8 md:py-12"
          style={{ y: heroTextY }}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}>

          <motion.div variants={heroItem} className="mb-10">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 font-medium">
                A psychological practice
              </span>
              <span className="h-px w-12 bg-neutral-300" />
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-800 font-medium mt-1">
              studioHuman
            </p>
          </motion.div>

          <motion.h1 variants={heroItem} className="font-display text-5xl md:text-7xl lg:text-[7rem] text-neutral-800 leading-[0.92] md:leading-[0.82] tracking-tight max-w-[16ch]">
            Understand yourself.<br className="hidden md:inline" /> Explore what shapes you.{' '}
            <span className="italic text-red-600/90 font-light">Move forward</span>.
          </motion.h1>

          <motion.div variants={heroItem} className="mt-10 md:mt-12 md:max-w-[42ch] pr-[48%] md:pr-0">
            <p className="text-neutral-600 text-base md:text-lg font-light leading-normal max-w-[40ch] text-left">
              A calm, considered space for reflection, conversation and psychological growth — not a clinical interface.
            </p>
          </motion.div>
        </motion.div>

        <Marquee className="absolute bottom-16 md:bottom-0 left-0 w-full z-20 py-3 bg-neutral-50/85 backdrop-blur-sm border-t border-neutral-200/60" speed={12}>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Understand</span>
          <span className="text-red-600/40 text-xs">✦</span>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Explore</span>
          <span className="text-red-600/40 text-xs">✦</span>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Move</span>
          <span className="text-red-600/40 text-xs">✦</span>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">A thoughtful space for psychological wellbeing</span>
          <span className="text-red-600/40 text-xs">✦</span>
        </Marquee>
      </section>

      {/* Manifesto */}
      <section className="pb-16 md:pb-24 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-5 md:col-start-1 -ml-6 md:-ml-12">
            <CalmPanel height="85vh" rounded="br" tone="cliff" className="w-[54vw] md:w-full mobile-h-xs" />
          </div>
          <StaggerGroup className="col-span-1 md:col-span-6 md:col-start-7" stagger={0.15}>
            <StaggerItem>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-6 font-medium">studioHuman</span>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight leading-tight mb-6">
                A thoughtful space for <span className="italic font-light text-red-600/90">psychological wellbeing</span>.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-[52ch]">
                Psychology is rarely about finding a single answer. It is an ongoing process of understanding patterns, emotions, behaviour, relationships and the circumstances that shape us.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-[52ch] mt-4">
                Before anything else, there is a person — with a history, a particular way of experiencing the world, strengths, vulnerabilities and the capacity to change.
              </p>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 md:py-20 px-6 md:px-12 border-y border-neutral-200">
        <div className="max-w-[112rem] mx-auto">
          <FadeSection className="max-w-2xl mb-12 md:mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Three principles</span>
            <h2 className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight">One ongoing <span className="italic font-light text-red-600/90">process</span>.</h2>
          </FadeSection>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200" stagger={0.12}>
            {principles.map((p) => (
              <StaggerItem key={p.num}>
                <div className="group bg-neutral-50 hover:bg-white h-full p-8 md:p-10 transition-colors duration-300">
                  <span className="font-display text-3xl md:text-4xl text-ember-500 leading-none block mb-4">{p.num}</span>
                  <h3 className="font-display text-2xl text-neutral-800 mb-3">{p.title}</h3>
                  <p className="text-neutral-500 text-base font-light leading-relaxed">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-1 md:col-span-4 md:col-start-1">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">The practice</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug mb-8">
                A quiet psychological space — where you can arrive without needing to have everything <span className="font-light text-red-600/90">figured out</span>.
              </p>
              <Link to="/about" className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-800 border-b border-neutral-400 py-2 hover:gap-3 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                About the studio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeSection>
          </div>
          <div className="md:col-span-7 md:col-start-6 md:-mr-12">
            <CalmPanel height="58vh" rounded="bl" tone="glacier" className="w-full -mr-6 md:mx-0 mobile-h-xs" />
          </div>
        </div>
      </section>

      {/* Approach teaser */}
      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-32 md:-mb-72 z-0 w-[60vw] -ml-6 order-2 md:order-1">
            <CalmPanel height="90vh" rounded="tr" tone="cliff" className="w-full mobile-h-closing" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Our approach</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug mb-8">
                Focus not only on what is <span className="font-light text-red-600/90">wrong</span> — but on what is happening, why, and what might help.
              </p>
              <Link to="/approach" className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-800 border-b border-neutral-400 py-2 hover:gap-3 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                Explore the approach
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeSection>
          </div>
        </div>
      </section>

      <ClosingCTA />

      <Footer />
    </div>);
}