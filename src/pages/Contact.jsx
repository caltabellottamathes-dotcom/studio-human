import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import PageHeader from '@/components/PageHeader';
import FAQItem from '@/components/FAQItem';
import BrandedButton from '@/components/BrandedButton';
import PremiumImage from '@/components/motion/PremiumImage';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { faqs, contactConversationImg } from '@/data/content';
import { base44 } from '@/api/base44Client';

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', struggle: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await base44.entities.ContactRequest.create({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        struggle: form.struggle,
        message: form.message,
        status: 'new'
      });
      setSubmitted(true);
    } catch (err) {
      setError('Er ging iets mis bij het verzenden. Probeer het later opnieuw of mail direct naar debora@amorvitae.be');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-red-50 border border-red-100 rounded-[2rem] p-10 md:p-14 text-center flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-6"
        >
          <Check className="w-7 h-7 text-white" strokeWidth={2} />
        </motion.div>
        <h3 className="font-display text-2xl text-neutral-800 mb-3">Je bericht is ontvangen.</h3>
        <p className="text-neutral-500 font-light text-base max-w-[38ch] leading-normal">Dank je voor je bericht. Ik neem binnen twee werkdagen contact op om ons kennismakingsgesprek in te plannen.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-100/40 p-8 md:p-12 rounded-[2rem] border border-neutral-200/60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="first_name" className="text-xs uppercase tracking-widest text-neutral-500 block">Voornaam</label>
          <input type="text" id="first_name" required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light"
            placeholder="Jouw voornaam" />
        </div>
        <div className="space-y-2">
          <label htmlFor="last_name" className="text-xs uppercase tracking-widest text-neutral-500 block">Achternaam</label>
          <input type="text" id="last_name" required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light"
            placeholder="Jouw achternaam" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs uppercase tracking-widest text-neutral-500 block">E-mailadres</label>
        <input type="email" id="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light"
          placeholder="naam@voorbeeld.be" />
      </div>
      <div className="space-y-2">
        <label htmlFor="struggle" className="text-xs uppercase tracking-widest text-neutral-500 block">Wat draag je met je mee? <span className="normal-case">(Optioneel)</span></label>
        <select id="struggle" value={form.struggle} onChange={e => setForm({ ...form, struggle: e.target.value })}
          className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-600 focus:outline-none transition-colors duration-300 font-light appearance-none">
          <option value="">Selecteer een zorgvraag</option>
          <option value="stress">Stress & Overweldiging</option>
          <option value="burnout">Burn-out</option>
          <option value="caregiving">Mantelzorg</option>
          <option value="grief">Rouw & Verlies</option>
          <option value="transitions">Levensovergangen</option>
          <option value="exhaustion">Emotionele Uitputting</option>
          <option value="other">Iets anders</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-500 block">Jouw bericht</label>
        <textarea id="message" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light resize-none"
          placeholder="Deel zoveel of zo weinig als je wilt…" />
      </div>
      <div className="pt-2">
        <BrandedButton type="submit" disabled={submitting}>{submitting ? 'Verzenden…' : 'Verstuur bericht'}</BrandedButton>
      </div>
      {error && <p className="text-sm text-red-600 mt-4 font-light">{error}</p>}
    </form>
  );
}

export default function Contact() {
  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      <PageHeader
        label="Start het gesprek"
        title={<>Zet je eerste <span className="italic font-light text-red-600/90">zachte</span> stap.</>}
        intro="Vul het formulier in, en ik neem persoonlijk binnen twee werkdagen contact op om ons vrijblijvend kennismakingsgesprek in te plannen."
      />

      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <FadeSection className="col-span-1 lg:col-span-5">
            <StaggerGroup stagger={0.1}>
              <StaggerItem>
                <p className="flex items-center gap-3 text-neutral-600 text-sm font-light">
                  <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
                  Strikt vertrouwelijke verwerking van je gegevens.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="flex items-center gap-3 text-neutral-600 text-sm font-light">
                  <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
                  Geen verbintenis vereist voor het eerste gesprek.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="flex items-center gap-3 text-neutral-600 text-sm font-light">
                  <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
                  Antwoord binnen twee werkdagen.
                </p>
              </StaggerItem>
            </StaggerGroup>
            <div className="mt-12 pt-8 border-t border-neutral-200 space-y-2 text-sm font-light text-neutral-500">
              <p>De Gaer 8, 3510 Hasselt</p>
              <p><a href="tel:+32476376675" className="hover:text-red-600 transition-colors">+32 476 37 66 75</a></p>
              <p><a href="mailto:debora@amorvitae.be" className="hover:text-red-600 transition-colors">debora@amorvitae.be</a></p>
            </div>
          </FadeSection>
          <FadeSection delay={0.1} className="col-span-1 lg:col-span-7">
            <ContactForm />
          </FadeSection>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-neutral-100/60 rounded-[2rem] md:rounded-[4rem] mx-4 md:mx-8 mb-12">
        <div className="max-w-[112rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeSection className="col-span-1 lg:col-span-4">
            <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Antwoorden op je vragen</span>
            <h2 className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight">
              Veelgestelde <span className="italic font-light text-red-600/90">vragen</span>.
            </h2>
            <p className="text-neutral-500 text-sm md:text-base font-light mt-6 leading-normal">
              Als je vraag hier niet wordt beantwoord, neem dan gerust contact op via het formulier hierboven.
            </p>
          </FadeSection>
          <div className="col-span-1 lg:col-start-6 lg:col-span-7 space-y-4">
            {faqs.map((item, i) => (
              <FadeSection key={i} delay={i * 0.06}>
                <FAQItem item={item} />
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Closing text + vertical image behind footer */}
      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Contact</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug">
                <span className="font-light text-red-600/90">Je hoeft niet te weten wat je gaat zeggen.</span> Je hoeft enkel te beginnen.
              </p>
            </FadeSection>
          </div>
          <div className="md:w-[42%] relative md:-mr-12 -mb-32 md:-mb-72 z-0 w-[50vw] -mr-6 ml-auto md:ml-0">
            <PremiumImage src={contactConversationImg} alt="" height="85vh" rounded="tl" className="w-full mobile-h-closing" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}