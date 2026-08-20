import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import BrandedButton from '@/components/BrandedButton';
import Marquee from '@/components/motion/Marquee';
import PremiumImage from '@/components/motion/PremiumImage';
import AnimatedCounter from '@/components/motion/AnimatedCounter';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import ClosingCTA from '@/components/ClosingCTA';
import { heroVideo, deboraCurtainImg, doorFrameImg, handsWritingImg, preparingSpaceImg } from '@/data/content';

const ease = [0.25, 0.1, 0.25, 1];

const heroItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } }
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], [0, 30]);
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
        {/* Video: tall vertical, bottom-right corner */}
        <motion.div
          initial={{ clipPath: 'inset(6% 0 0 6% round 0px)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0 0 0 round 0px)', opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease }}
          className="absolute bottom-0 right-0 w-[44%] h-[48vh] md:w-[38%] md:h-screen overflow-hidden rounded-tl-[3rem] md:rounded-tl-none md:rounded-bl-[12rem] pointer-events-none z-0"
          aria-hidden>
          
          <motion.div style={{ y: heroImageY }} className="w-full h-full">
            <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 scale-110" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-neutral-50/50" />
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
                Psychosocial Counselor
              </span>
              <span className="h-px w-12 bg-neutral-300" />
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-800 font-medium mt-1">
              Maya Hartwell
            </p>
          </motion.div>

          <motion.h1 variants={heroItem} className="font-display text-5xl md:text-7xl lg:text-[7.5rem] text-neutral-800 leading-[0.92] md:leading-[0.82] tracking-tight max-w-[15ch]">
            You don't have to<br className="hidden md:inline" /> carry it{' '}
            <span className="italic text-red-600/90 font-light">alone</span>.
          </motion.h1>

          <motion.div variants={heroItem} className="mt-10 md:mt-12 md:pl-0 md:max-w-[42ch] pr-[48%] md:pr-0">
            <p className="text-neutral-600 text-base md:text-lg font-light leading-normal max-w-[40ch] normal-case text-left">
              Psychosocial counseling in Portland. For moments when life asks more of you than you should have to carry alone.
            </p>
          </motion.div>
        </motion.div>

        <Marquee className="absolute bottom-16 md:bottom-0 left-0 w-full z-20 py-3 bg-neutral-50/85 backdrop-blur-sm border-t border-neutral-200/60" speed={12}>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Love for life</span>
          <span className="text-red-600/30 text-xs">✦</span>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Care for the soul</span>
          <span className="text-red-600/30 text-xs">✦</span>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Psychosocial counseling</span>
          <span className="text-red-600/30 text-xs">✦</span>
          <span className="font-body uppercase tracking-widest text-sm md:text-base px-10 text-neutral-500">Portland & at home</span>
          <span className="text-red-600/30 text-xs">✦</span>
        </Marquee>
      </section>

      {/* Editorial intro — tall portrait with parallax, no rounded corners */}
      <section className="pb-16 md:pb-24 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-5 md:col-start-1 -ml-6 md:-ml-12">
            <PremiumImage src={deboraCurtainImg} alt="Maya Hartwell" height="85vh" rounded="br" className="w-[54vw] md:w-full mobile-h-xs" />
          </div>
          <StaggerGroup className="col-span-1 md:col-span-6 md:col-start-7" stagger={0.15}>
            <StaggerItem>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-6 font-medium">studioHuman</span>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight leading-tight mb-6">
                Love for life,<br className="hidden md:inline" /> <span className="italic font-light text-red-600/90">care for the soul</span>.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-[52ch]">
                Sometimes life brings you to a point where everything becomes too much. You carry a lot, think a lot, feel a lot. Perhaps you care for others and lose yourself a little along the way. Perhaps you stand at a crossroads, sensing that something needs to change, but you're not quite sure how or where to begin.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-[52ch] mt-4">
                In such moments it can make a difference not to go through it alone. Someone who listens without judgment, helps carry what feels heavy, and searches with you for a new direction — step by step.
              </p>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 px-6 md:px-12 relative overflow-hidden border-y border-neutral-100">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <img src={preparingSpaceImg} alt="" className="w-full h-full object-cover opacity-[0.07]" />
        </div>
        <div className="max-w-[112rem] mx-auto">
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-y-14 gap-x-6 md:gap-8" stagger={0.12}>
            <StaggerItem className="text-center">
              <AnimatedCounter to={10} suffix="+" className="[font-family:'Lekton',_ui-monospace,_monospace] font-normal text-4xl md:text-6xl text-red-600 block" />
              <span className="text-xs uppercase tracking-widest text-neutral-500 mt-2 block">Years of experience</span>
            </StaggerItem>
            <StaggerItem className="text-center">
              <AnimatedCounter to={100} suffix="%" className="[font-family:'Lekton',_ui-monospace,_monospace] font-normal text-4xl md:text-6xl text-red-600 block" />
              <span className="text-xs uppercase tracking-widest text-neutral-500 mt-2 block">Confidential</span>
            </StaggerItem>
            <StaggerItem className="text-center">
              <AnimatedCounter to={15} suffix=" min" className="[font-family:'Lekton',_ui-monospace,_monospace] font-normal text-4xl md:text-6xl text-red-600 block" />
              <span className="text-xs uppercase tracking-widest text-neutral-500 mt-2 block">Free intro call</span>
            </StaggerItem>
            <StaggerItem className="text-center">
              <span className="text-4xl md:text-6xl text-red-600 block font-normal [font-family:'Lekton',_ui-monospace,_monospace]">Portland</span>
              <span className="text-xs uppercase tracking-widest text-neutral-500 mt-2 block">and beyond</span>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* Over mij section — same text style as closing, links to Over */}
      <section className="py-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-1 md:col-span-4 md:col-start-1">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">About me</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug mb-8">
                At studioHuman you find space to <span className="font-light text-red-600/90">pause</span>, to breathe, and to find direction again.
              </p>
              <Link to="/about" className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-800 border-b border-neutral-400 py-2 hover:gap-3 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                Get to know me
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeSection>
          </div>
          <div className="md:col-span-7 md:col-start-6 md:-mr-12">
            <PremiumImage src={doorFrameImg} alt="" height="58vh" rounded="bl" className="w-full -mr-6 md:mx-0 mobile-h-xs" />
          </div>
        </div>
      </section>

      {/* Closing text + vertical image behind footer */}
      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-32 md:-mb-72 z-0 w-[60vw] -ml-6 order-2 md:order-1">
            <PremiumImage src={handsWritingImg} alt="" height="90vh" rounded="tr" className="w-full mobile-h-closing" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">My approach</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug mb-8">
                Guidance that adapts to <span className="font-light text-red-600/90">your needs</span> — personal, accessible, and tailored.
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