import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import PageHeader from '@/components/PageHeader';
import ClosingCTA from '@/components/ClosingCTA';
import ClipReveal from '@/components/motion/ClipReveal';
import PremiumImage from '@/components/motion/PremiumImage';
import AnimatedCounter from '@/components/motion/AnimatedCounter';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { deboraPortraitImg, deboraChairImg, linenTableImg } from '@/data/content';

export default function Over() {
  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      <PageHeader
        label="Over mij"
        title={<>Amor Vitae — <span className="font-light text-red-600/90">liefde voor het leven</span>.</>}
        intro="Ik ben Debora Caltabellotta, psychosociaal consulent en oprichter van Amor Vitae. In mijn praktijk begeleid ik mensen met uiteenlopende hulpvragen — persoonlijk, laagdrempelig en op maat."
        hideIntroMobile />
      

      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <FadeSection className="col-span-1 lg:col-span-5 lg:sticky lg:top-28 self-start">
            <div className="relative -ml-6 lg:mr-0 lg:-ml-12">
              <div className="flex flex-row gap-3 lg:block">
                <div className="w-2/5 lg:w-auto">
                  <PremiumImage src={deboraPortraitImg} alt="Debora Caltabellotta, psychosociale consulent bij Amor Vitae" height="72vh" rounded="tr" className="w-full mobile-h-sm" />
                </div>
                <p className="lg:hidden text-neutral-600 text-base md:text-lg font-light leading-normal flex-1 self-center pr-2 text-left">Ik ben Debora Caltabellotta, psychosociaal consulent en oprichter van Amor Vitae. In mijn praktijk begeleid ik mensen met uiteenlopende hulpvragen — persoonlijk, laagdrempelig en op maat.

                </p>
              </div>
              <div className="hidden lg:block absolute bottom-0 left-0 right-0 bg-neutral-50/85 backdrop-blur-md border-t border-neutral-200/50 px-6 py-4 md:px-8">
                <span className="font-display text-lg md:text-xl text-neutral-800 block leading-tight">Debora Caltabellotta</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-red-600/80 font-medium block mt-0.5">Psychosociale Consulent</span>
              </div>
            </div>
          </FadeSection>

          <div className="col-span-1 lg:col-span-7 flex flex-col justify-end">
            <FadeSection>
              <div className="space-y-6 text-neutral-600 text-base md:text-lg font-light leading-normal max-w-[72ch]">
                <p>
                  Amor Vitae betekent 'liefde voor het leven'. Voor mij draait dat om zorgzaamheid, menselijke nabijheid en ruimte maken voor wie jij bent — in elke fase van je leven.
                </p>
                <p>
                  Mijn begeleiding is persoonlijk, laagdrempelig en op maat — bij mij in de praktijk, bij jou thuis of in jouw context. Altijd dichtbij. Altijd menselijk.
                </p>
                <p className="font-display text-red-600 text-lg md:text-xl my-8 leading-normal">
                  &ldquo;Wat mij drijft, is de ontmoeting van mens tot mens. Met aandacht, zonder haast, en met ruimte voor jouw verhaal zoals het is.&rdquo;
                </p>
                <p>
                  Ik geloof dat echte verandering begint bij erkenning: jezelf mogen zijn, ook in je kwetsbaarheid. Daarom werk ik niet met standaardtrajecten, maar stem ik mijn aanpak af op jouw noden en ritme.
                </p>
                <p>
                  Naast psychosociale begeleiding breng ik ook klinische expertise mee. Ik heb een brede ervaring met psychiatrische problematiek en bied ondersteuning en advies rond psychofarmacagebruik, steeds in afstemming met de behandelende arts of zorgverlener.
                </p>
              </div>
            </FadeSection>
            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-neutral-200" stagger={0.12}>
              <StaggerItem>
                <AnimatedCounter to={10} suffix="+" className="block [font-family:'Lekton',_ui-monospace,_monospace] font-normal text-3xl md:text-4xl text-red-600" />
                <span className="text-xs uppercase tracking-widest text-neutral-500 mt-1 block">Jaren Ervaring</span>
              </StaggerItem>
              <StaggerItem>
                <AnimatedCounter to={100} suffix="%" className="block [font-family:'Lekton',_ui-monospace,_monospace] font-normal text-3xl md:text-4xl text-red-600" />
                <span className="text-xs uppercase tracking-widest text-neutral-500 mt-1 block">Vertrouwelijk</span>
              </StaggerItem>
              <StaggerItem className="col-span-2 md:col-span-1">
                <span className="block [font-family:'Lekton',_ui-monospace,_monospace] font-normal text-3xl md:text-4xl text-red-600">Hasselt</span>
                <span className="text-xs uppercase tracking-widest text-neutral-500 mt-1 block">en omgeving</span>
              </StaggerItem>
            </StaggerGroup>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-1 md:col-span-4 md:col-start-1 order-2 md:order-1">
            <FadeSection>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-tight tracking-tight">
                Wil je weten waarmee ik je kan helpen? <span className="font-light text-red-600/90">Hier lees je meer over mijn begeleiding.</span>
              </p>
              <Link to="/aanpak" className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-800 border-b border-neutral-400 py-2 mt-8 hover:gap-3 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                Ontdek de aanpak
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeSection>
          </div>
          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 md:-mr-12">
            <PremiumImage src={deboraChairImg} alt="" height="58vh" rounded="bl" className="w-full -mr-6 md:mx-0 mobile-h-xs" />
          </div>
        </div>
      </section>

      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-32 md:-mb-72 z-0 w-[56vw] -ml-6 order-2 md:order-1">
            <PremiumImage src={linenTableImg} alt="Praktijkruimte detail" height="90vh" rounded="tr" className="w-full mobile-h-closing" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Mijn visie</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug max-w-[48ch]">
                Amor Vitae is geboren vanuit de overtuiging dat zorg geen pasklare oplossing hoeft te zijn, maar een zorgzame aanwezigheid kan bieden. <span className="font-light text-red-600/90">Een plek waar je je gedragen voelt, even mag ademen, en stap voor stap weer richting vindt.</span>
              </p>
            </FadeSection>
          </div>
        </div>
      </section>

      <ClosingCTA />

      <Footer />
    </div>);

}