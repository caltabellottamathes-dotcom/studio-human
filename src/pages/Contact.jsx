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
      setError('Something went wrong sending your message. Please try again later or email hello@studiohuman.com');
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
        <h3 className="font-display text-2xl text-neutral-800 mb-3">Your message has been received.</h3>
        <p className="text-neutral-500 font-light text-base max-w-[38ch] leading-normal">Thank you for your message. We'll be in touch within two business days to schedule our introductory call.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-100/40 p-8 md:p-12 rounded-[2rem] border border-neutral-200/60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="first_name" className="text-xs uppercase tracking-widest text-neutral-500 block">First name</label>
          <input type="text" id="first_name" required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light"
            placeholder="Your first name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="last_name" className="text-xs uppercase tracking-widest text-neutral-500 block">Last name</label>
          <input type="text" id="last_name" required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light"
            placeholder="Your last name" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs uppercase tracking-widest text-neutral-500 block">Email address</label>
        <input type="email" id="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light"
          placeholder="name@example.com" />
      </div>
      <div className="space-y-2">
        <label htmlFor="struggle" className="text-xs uppercase tracking-widest text-neutral-500 block">What are you carrying? <span className="normal-case">(Optional)</span></label>
        <select id="struggle" value={form.struggle} onChange={e => setForm({ ...form, struggle: e.target.value })}
          className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-600 focus:outline-none transition-colors duration-300 font-light appearance-none">
          <option value="">Select a concern</option>
          <option value="stress">Stress & Overwhelm</option>
          <option value="burnout">Burnout</option>
          <option value="caregiving">Caregiving</option>
          <option value="grief">Grief & Loss</option>
          <option value="transitions">Life Transitions</option>
          <option value="exhaustion">Emotional Exhaustion</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-500 block">Your message</label>
        <textarea id="message" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full bg-transparent border-b border-neutral-300 focus:border-red-600 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none transition-colors duration-300 font-light resize-none"
          placeholder="Share as much or as little as you wish…" />
      </div>
      <div className="pt-2">
        <BrandedButton type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send message'}</BrandedButton>
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
        label="Start the conversation"
        title={<>Take your first <span className="italic font-light text-red-600/90">gentle</span> step.</>}
        intro="Fill in the form and we'll get back to you within two business days to schedule a no-obligation introductory call."
      />

      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <FadeSection className="col-span-1 lg:col-span-5">
            <StaggerGroup stagger={0.1}>
              <StaggerItem>
                <p className="flex items-center gap-3 text-neutral-600 text-sm font-light">
                  <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
                  Strictly confidential handling of your information.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="flex items-center gap-3 text-neutral-600 text-sm font-light">
                  <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
                  No commitment required for the first conversation.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="flex items-center gap-3 text-neutral-600 text-sm font-light">
                  <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
                  A reply within two business days.
                </p>
              </StaggerItem>
            </StaggerGroup>
            <div className="mt-12 pt-8 border-t border-neutral-200 space-y-2 text-sm font-light text-neutral-500">
              <p>14 Linden Walk, Portland</p>
              <p><a href="tel:+15035550142" className="hover:text-red-600 transition-colors">+1 (503) 555 0142</a></p>
              <p><a href="mailto:hello@studiohuman.com" className="hover:text-red-600 transition-colors">hello@studiohuman.com</a></p>
            </div>
          </FadeSection>
          <FadeSection delay={0.1} className="col-span-1 lg:col-span-7">
            <ContactForm />
          </FadeSection>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-glacier-50/70 rounded-[2rem] md:rounded-[4rem] mx-4 md:mx-8 mb-12">
        <div className="max-w-[112rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeSection className="col-span-1 lg:col-span-4">
            <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Answers to your questions</span>
            <h2 className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight">
              Frequently asked <span className="italic font-light text-red-600/90">questions</span>.
            </h2>
            <p className="text-neutral-500 text-sm md:text-base font-light mt-6 leading-normal">
              If your question isn't answered here, feel free to reach out via the form above.
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
                <span className="font-light text-red-600/90">You don't need to know what you'll say.</span> You only need to begin.
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