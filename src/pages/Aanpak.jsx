import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import PageHeader from '@/components/PageHeader';
import ClosingCTA from '@/components/ClosingCTA';
import PremiumImage from '@/components/motion/PremiumImage';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { services, steps, deboraWindowImg, redBowlImg } from '@/data/content';

export default function Aanpak() {
  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      <PageHeader
        label="Mijn aanpak"
        title={<>Vier pijlers van <span className="italic font-light text-red-600/90">zachte</span> begeleiding.</>}
        intro="Mijn begeleiding is persoonlijk en op maat. Zonder oordeel, zonder vast stramien — wel met aandacht voor jouw verhaal en jouw tempo." />

      {/* Pillars — two-column grid on desktop */}
      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-20 md:pb-32">
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200" stagger={0.1}>
          {services.map((s) => (
            <StaggerItem key={s.num}>
              <div className="group bg-neutral-50 hover:bg-white py-10 md:py-14 px-6 md:px-12 flex items-start gap-6 md:gap-10 h-full transition-colors duration-300 cursor-default">
                <span className="font-display text-3xl md:text-5xl text-red-600 leading-none flex-shrink-0 w-10 md:w-14 transition-transform duration-300 group-hover:scale-110">{s.num}</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl md:text-3xl text-neutral-800 mb-3 md:mb-4">{s.title}</h3>
                  <p className="text-neutral-500 text-base md:text-lg font-light leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Image right edge-attached with text left */}
      <section className="pt-4 pb-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-1 md:col-span-5 md:col-start-1 order-2 md:order-1">
            <FadeSection>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-tight tracking-tight">
                Soms is dat een verhelderend gesprek, soms praktische ondersteuning, soms gewoon even samen <span className="italic font-light text-red-600/90">stilstaan</span>.
              </p>
            </FadeSection>
          </div>
          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 md:-mr-12">
            <PremiumImage src={deboraWindowImg} alt="" height="52vh" rounded="bl" className="w-full -mr-6 md:mx-0 mobile-h-xs" />
          </div>
        </div>
      </section>

      {/* Process — centered vertical timeline */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-[120rem] mx-auto">
        <FadeSection className="max-w-2xl mx-auto mb-16 md:mb-24 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Het proces</span>
          <h2 className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight">
            Hoe we samen <span className="italic font-light text-red-600/90">gaan</span>.
          </h2>
          <p className="text-neutral-500 text-base md:text-lg font-light mt-4">Vier heldere, onoverhaaste stappen om je begeleidingstraject te beginnen.</p>
        </FadeSection>

        <div className="relative max-w-3xl mx-auto">
          {/* Center vertical line */}
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-neutral-300 -translate-x-px hidden md:block" aria-hidden />

          <StaggerGroup className="space-y-12 md:space-y-20" stagger={0.12}>
            {steps.map((step, i) => (
              <StaggerItem key={step.num}>
                <div className={`relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-16 md:items-center`}>
                  {/* Dot on the line */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
                    className="absolute left-2 md:left-1/2 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600 ring-4 ring-neutral-50"
                    aria-hidden
                  />
                  {/* Alternating: odd steps text left, even steps text right */}
                  <div className={i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2 md:row-start-1'}>
                    <span className="font-mono italic text-red-600 block mb-1 text-sm md:text-base">Stap {step.num}</span>
                    <h3 className="font-display text-xl md:text-2xl text-neutral-800 mb-2">{step.title}</h3>
                    <p className="text-neutral-500 text-base md:text-lg font-light leading-normal">{step.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Closing quote + vertical image behind footer */}
      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-32 md:-mb-72 z-0 w-[54vw] -ml-6 order-2 md:order-1">
            <PremiumImage src={redBowlImg} alt="" height="90vh" rounded="tr" className="w-full mobile-h-closing" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Veerkracht</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug">
                Veerkracht betekent niet dat je alles moet blijven volhouden. Het betekent leren schakelen, keuzes maken en opnieuw beweging brengen — <span className="font-light text-red-600/90">met mildheid, maar ook met realisme</span>.
              </p>
            </FadeSection>
          </div>
        </div>
      </section>

      <ClosingCTA />
      <Footer />
    </div>
  );
}