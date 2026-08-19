import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import FadeSection from '@/components/FadeSection';
import PremiumImage from '@/components/motion/PremiumImage';
import { handRestingImg } from '@/data/content';

const struggles = {
  'stress-overwhelm': {
    title: 'Stress & Overweldiging',
    subtitle: 'Als het geroezemoes van het dagelijks leven je innerlijke stem overstemt.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/42b1d4724_generated_image.png',
    intro: 'Het tempo van het moderne leven kan zich stilletjes opstapelen — tot de last op een dag onmogelijk alleen te tillen voelt. Stress en overweldiging zijn geen tekenen van zwakte. Ze zijn je lichaam en geest die om een zachter tempo vragen.',
    body: [
      { heading: 'Hoe dit eruitziet', text: "Je vindt jezelf misschien constant 'aan', niet in staat om uit te schakelen, zelfs als je de tijd hebt. Kleine taken voelen enorm. Je geest racet 's nachts. Je voelt je prikkelbaar, uitgeput en losgekoppeld van de dingen die je vroeger vreugde brachten." },
      { heading: 'Hoe ik kan helpen', text: 'In onze sessies vertragen we samen. We identificeren de bronnen van druk — extern en intern — en beginnen kleine, betekenisvolle verschuivingen te creëren. Je verlaat elke sessie met praktische tools en een dieper begrip van je eigen zenuwstelsel en behoeften.' },
      { heading: 'Je hoeft rust niet te verdienen', text: 'Een van de belangrijkste dingen die ik hoor van mensen in deze situatie is schuldgevoel over het nodig hebben van rust. Samen werken we eraan om dat schuldgevoel op te lossen en een relatie met jezelf op te bouwen die geworteld is in compassie, niet in productiviteit.' },
    ],
  },
  'burnout': {
    title: 'Burn-out',
    subtitle: 'Zachtjes door de as van uitputting schiften.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/21edd95a2_generated_image.png',
    intro: 'Burn-out is niet simpelweg moe zijn. Het is een diepe uitputting — van energie, van betekenis, van het gevoel dat dingen ooit anders zullen voelen. Herstel van burn-out vereist geduld, zachtheid en een ruimte waar je niet geacht wordt te presteren.',
    body: [
      { heading: 'Burn-out herkennen', text: 'Je kunt je emotioneel afgestompt voelen, of slingelen tussen uitputting en angst. Werk dat je ooit zingeving gaf, voelt nu hol. Je vindt het moeilijk om je te concentreren, beslissingen te nemen of iets te voelen. Dit is burn-out, en het is echt.' },
      { heading: 'Een tempo dat aan jou toebehoort', text: 'Herstel kan niet worden overhaast. In ons werk samen eren we het tempo dat je lichaam en geest nodig hebben — geen tijdlijnen, geen prestatienormen. We beginnen simpelweg met benoemen wat er is gebeurd, en langzaam, voorzichtig, bouwen we van daaruit verder.' },
      { heading: 'Preventie en langetermijnveerkracht', text: 'Wanneer je begint te stabiliseren, verkennen we de patronen en overtuigingen die hebben bijgedragen aan je burn-out — zodat je een duurzamere relatie kunt opbouwen met werk, rust en je eigen verwachtingen.' },
    ],
  },
  'caregiving': {
    title: 'Mantelzorg',
    subtitle: 'De zorgdrager ondersteund.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/d567b0e7c_generated_image.png',
    intro: 'Zorgen voor iemand van wie je houdt is een van de meest onbaatzuchtige dingen die een mens kan bieden. Het is ook een van de meest uitputtende. Amor Vitae biedt een veilige, toegewijde ruimte voor mantelzorgers die vergeten zijn voor zichzelf te zorgen.',
    body: [
      { heading: 'Het onzichtbare gewicht van zorgen', text: 'Mantelzorgers dragen vaak enorme emotionele en praktische lasten terwijl ze onzichtbaar blijven in hun eigen recht. Je kunt rouwen om de persoon voor wie je zorgt, terwijl ze nog aanwezig is. Je kunt frustratie voelen, en dan schuld over die frustratie. Dit is allemaal normaal. Alles heeft hier een plek.' },
      { heading: 'Jezelf terugvinden', text: 'In onze sessies creëren we ruimte voor jouw ervaring — niet alleen je rol. Je bent niet enkel een mantelzorger. Je bent een volledig mens met behoeften, verlangens en grenzen. Samen werken we eraan om die waarheid te eren.' },
      { heading: 'Ook praktische ondersteuning', text: 'Naast emotionele begeleiding help ik ook met praktische navigatie — coördineren met andere zorgverleners, administratie verduidelijken, en de ondersteuningsstructuren vinden die de last kunnen verlichten.' },
    ],
  },
  'grief-loss': {
    title: 'Rouw & Verlies',
    subtitle: 'De ruimte eren die achterblijft.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/aa5459e8e_generated_image.png',
    intro: 'Rouw is geen probleem om op te lossen. Het is een getuigenis van liefde en verbondenheid. Bij Amor Vitae wordt rouw omringd met de eerbied die ze verdient — in welk tempo je hart ook nodig heeft.',
    body: [
      { heading: 'Alle rouw is geldig', text: 'Verlies neemt vele vormen aan: het overlijden van een dierbare, het einde van een relatie, een diagnose, het verlies van een toekomst die je je had voorgesteld. Je hoeft je rouw niet te rechtvaardigen of te vergelijken met die van een ander. Als het echt voor jou is, hoort het hier.' },
      { heading: 'Geen tijdlijn, geen verwachtingen', text: 'Er is geen juiste manier om te rouwen, en er is geen deadline. In onze sessies haasten we ons niet naar anvaarding. In plaats daarvan eren we waar je nu bent — en we gaan van daaruit, langzaam, samen.' },
      { heading: 'Betekenis heropbouwen', text: 'Na verloop van tijd vinden veel mensen dat rouw een deur opent naar dieper zelfbegrip. We verkennen wat de persoon of datgene wat je verloren bent voor jou betekende, en hoe die betekenis op nieuwe manieren in je kan doorleven.' },
    ],
  },
  'life-transitions': {
    title: 'Levensovergangen',
    subtitle: 'Balans vinden op verschuivende grond.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/62cb3ee5c_generated_image.png',
    intro: 'Elke grote levensovergang — een nieuwe job, een verhuis, pensioen, ouder worden, een relatie die eindigt — verstoort ons gevoel van wie we zijn. Deze desoriëntatie is normaal. En ze navigeren met ondersteuning maakt alle verschil.',
    body: [
      { heading: 'Als de kaart niet meer bij het gebied past', text: 'Je kunt je verdwaald, angstig of vreemd genoeg rouwig voelen — zelfs als de overgang er een is die je koos of wilde. Verandering, zelfs positieve, vraagt ons om iets los te laten. Dat loslaten vraagt moed, en het vraagt tijd.' },
      { heading: 'Helderheid en richting', text: 'In onze sessies creëren we ruimte om te verwerken wat eindigt en wat begint. We verhelderen je waarden, je behoeften en wat je wilt dat dit volgende hoofdstuk voelt — en dan bouwen we daar naartoe, stap voor stap.' },
      { heading: 'Je bent niet achter', text: 'Er is geen schema voor levensovergangen. Op elke leeftijd, in elke fase is een nieuw begin mogelijk. Mijn rol is om naast je te wandelen terwijl je je eigen weg vindt — in jouw tempo, op jouw voorwaarden.' },
    ],
  },
  'emotional-exhaustion': {
    title: 'Emotionele Uitputting',
    subtitle: 'Lege reserves aanvullen.',
    img: 'https://media.base44.com/images/public/6a565889855ed729a11c1b91/af1d0a950_generated_image.png',
    intro: 'Emotionele uitputting is wat gebeurt als we meer geven dan we ontvangen — te lang. Het is geen karaktergebrek. Het is een zeer menselijke reactie op een onhoudbare situatie. En het kan zachtjes, voorzichtig ongedaan worden gemaakt.',
    body: [
      { heading: 'Hoe emotionele uitputting voelt', text: 'Je kunt je hol, afgestompt of losgekoppeld voelen van de mensen en dingen waar je van houdt. Empathie die ooit vanzelf kwam, vraagt nu enorme inspanning. Je gaat door de bewegingen, maar voelt afwezig in je eigen leven. Zelfs kleine beslissingen voelen overweldigend.' },
      { heading: 'Leren ontvangen', text: 'Vaak hebben mensen die emotionele uitputting ervaren jarenlang gegeven — aan anderen, aan werk, aan idealen — terwijl ze weinig ontvingen. In onze sessies verkennen we de overtuigingen die dit patroon noodzakelijk maakten, en beginnen we het zachte werk van herstel.' },
      { heading: 'Grenzen als een daad van liefde', text: 'Grenzen stellen is niet egoïstisch. Het is wat je in staat stelt om te blijven opkomen — voor jezelf en voor de mensen die er voor jou toe doen. We werken samen om je grenzen te begrijpen, ze met vertrouwen uit te spreken en ze te handhaven zonder schuldgevoel.' },
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
          <h1 className="font-display text-3xl text-neutral-800 mb-4">Pagina niet gevonden</h1>
          <Link to="/" className="text-red-600 underline text-sm">Terug naar home</Link>
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
          <Link to="/zorgvragen" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Terug naar zorgvragen
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6">Zorgvragen</span>
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
                  <span className="font-display italic text-red-600/40 text-5xl md:text-6xl block leading-none mb-4">{String(i + 1).padStart(2, '0')}</span>
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
            <PremiumImage src={handRestingImg} alt="" height="90vh" rounded="tr" className="w-full mobile-h-sm" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Rust</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug max-w-[48ch]">
                Soms is rust al de eerste stap. Je hoeft niet te weten waar je naartoe gaat — enkel dat je er niet alleen hoeft te zijn.
              </p>
            </FadeSection>
          </div>
        </div>
      </section>

      <ClosingCTA />

      {/* Next topic */}
      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-16">
        <div className="border-t border-neutral-200 pt-8 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-neutral-400">Volgend onderwerp</span>
          <Link to={`/zorgvragen/${nextSlug}`} className="group flex items-center gap-3 hover:gap-4 transition-all duration-300">
            <span className="font-display text-xl md:text-2xl text-neutral-800 group-hover:text-red-600 transition-colors">{nextData.title}</span>
            <ArrowRight className="w-5 h-5 text-red-600" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}