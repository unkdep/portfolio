"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  FileDown,
  ExternalLink,
  Menu,
  X,
  ArrowUp,
  MapPin,
  Briefcase,
} from "lucide-react";

type Lang = "pt" | "en";

type Project = {
  id: string;
  name: string;
  desc: string;
  link: string;
  techs: string[];
  image: string;
  accent: string;
  featured?: boolean;
};

type ExperienceItem = {
  role: string;
  company: string;
  dates: string;
  duration: string;
  desc: string;
  skills: string[];
  location: string;
  type: string;
  logo: string;
};

type Translation = {
  available: string;
  heroName: string;
  heroRole: string;
  heroDesc: string;
  downloadCv: string;
  contact: string;
  cardLocation: string;
  cardLocVal: string;
  cardStatus: string;
  cardStatusVal: string;
  cardFocus: string;
  cardFocusVal: string;
  scroll: string;

  sec01: string;
  sobre: string;
  aboutTitle: string;
  aboutSub: string;
  about1: string;
  about2: string;
  about3: string;
  skills: string;

  sec02: string;
  exp: string;
  expTitle: string;
  experiences: ExperienceItem[];

  sec03: string;
  tech: string;
  techTitle: string;

  sec04: string;
  proj: string;
  projTitle: string;
  projBtn: string;
  otherProjects: string;
  featuredLabel: string;

  sec05: string;
  ctaSec: string;
  ctaTitle: string;
  ctaSub: string;
  namePh: string;
  emailPh: string;
  msgPh: string;
  sendBtn: string;
  sending: string;
  sent: string;

  footer: string;
  nav: string[];
  projects: Project[];
};

const T: Record<Lang, Translation> = {
  pt: {
    available: "DISPONÍVEL PARA PROJETOS",
    heroName: "Rafael",
    heroRole: "Fullstack",
    heroDesc:
      "Desenvolvedor apaixonado por tecnologia e aplicações modernas, escaláveis e com foco em performance. Experiência em React, Next.js e bancos de dados SQL/NoSQL.",
    downloadCv: "BAIXAR CV",
    contact: "CONTATO",
    cardLocation: "Localização",
    cardLocVal: "Mogi das Cruzes, SP",
    cardStatus: "Status",
    cardStatusVal: "Disponível",
    cardFocus: "Foco",
    cardFocusVal: "React · Next.js",
    scroll: "SCROLL",

    sec01: "// 01",
    sobre: "Sobre",
    aboutTitle: "Olá, eu sou Rafael.",
    aboutSub: "DESENVOLVEDOR WEB · FULLSTACK",
    about1:
      "Sou desenvolvedor fullstack — transformo ideias em soluções digitais modernas e escaláveis.",
    about2:
      "Experiência em front-end e back-end, sempre buscando aprender novas tecnologias e resolver problemas reais.",
    about3:
      "Apaixonado por projetos desafiadores e pela criação de experiências digitais únicas.",
    skills: "HABILIDADES",

    sec02: "// 02",
    exp: "Experiência",
    expTitle: "Trajetória profissional.",
    experiences: [
      {
        role: "Estagiário",
        company: "AGCO Corporation",
        dates: "MAR 2024 — MAR 2025",
        duration: "1 ANO",
        desc: "Suporte no desenvolvimento de novas tecnologias, análise de dados e apoio em soluções internas voltadas à eficiência de processos.",
        skills: ["Análise de Dados", "Power Apps", "Eng. Processos"],
        location: "Mogi das Cruzes, SP — Brasil",
        type: "Estágio · Presencial",
        logo: "/logo-agco.png",
      },
      {
        role: "Analista de Sistemas Jr",
        company: "Empreendedor Web",
        dates: "MAR 2026 — ATUAL",
        duration: "ATUAL",
        desc: "Atuação no estudo e suporte de sistemas de atendimento e gestão comercial, com foco em implantação em ambientes de clientes, acompanhamento operacional, configuração de fluxos e suporte técnico contínuo.",
        skills: ["CRM", "Chatbot", "Suporte Técnico"],
        location: "Tatuapé, SP — Brasil",
        type: "CLT · Híbrido",
        logo: "/empreendedorweb.png",
      },
    ],

    sec03: "// 03",
    tech: "Tecnologias",
    techTitle: "Stack técnico.",

    sec04: "// 04",
    proj: "Projetos",
    projTitle: "Projetos",
    projBtn: "Ver projeto",
    otherProjects: "OUTROS PROJETOS",
    featuredLabel: "DESTAQUE",

    sec05: "// 05",
    ctaSec: "Contato",
    ctaTitle: "Vamos conversar.",
    ctaSub: "ABERTO A NOVAS OPORTUNIDADES",
    namePh: "Seu nome",
    emailPh: "Seu e-mail",
    msgPh: "Sua mensagem",
    sendBtn: "ENVIAR MENSAGEM",
    sending: "ENVIANDO...",
    sent: "MENSAGEM ENVIADA",

    footer: "TODOS OS DIREITOS RESERVADOS",

    nav: ["Início", "Sobre", "Experiência", "Tecnologias", "Projetos", "Contato"],

    projects: [
      {
        id: "01",
        name: "ZapFlow360",
        desc: "Plataforma SaaS completa de automatização de agendamentos pelo WhatsApp com IA, fluxos inteligentes e painel de gestão premium.",
        link: "https://zapflow360.vercel.app/",
        techs: ["React", "TypeScript", "Vite", "Framer Motion", "Tailwind CSS"],
        image: "/zapflow-360.png",
        accent: "#34d399",
        featured: true,
      },
      {
        id: "02",
        name: "CGN Construções",
        desc: "Landing page moderna e responsiva para empresa de serralheria e estruturas metálicas.",
        link: "https://cgnconstrucoes.vercel.app/",
        techs: ["React", "TypeScript"],
        image: "/cgn-construcoes-thumb.png",
        accent: "#3b82f6",
      },
      {
        id: "03",
        name: "Barbearia",
        desc: "Website elegante para barbearia local com foco em agendamento online e apresentação de serviços.",
        link: "https://thiagoygor.vercel.app/",
        techs: ["HTML5", "CSS3"],
        image: "/barbearia-thumb.png",
        accent: "#60a5fa",
      },
      {
        id: "04",
        name: "Véu de Íris",
        desc: "Landing page para leitora de tarot — apresentação de serviços, energia e agendamento.",
        link: "https://tarotvenus.vercel.app/",
        techs: ["React", "TypeScript", "Vite"],
        image: "/arcana_portfolio_cover.png",
        accent: "#818cf8",
      },
      {
        id: "05",
        name: "Yuki Ramen",
        desc: "Landing page para restaurante japonês especializado em ramen — cardápio e experiência gastronômica.",
        link: "https://yukiramen.vercel.app/",
        techs: ["HTML5", "CSS3"],
        image: "/yuki-ramen-thumb.png",
        accent: "#f87171",
      },
    ],
  },

  en: {
    available: "AVAILABLE FOR PROJECTS",
    heroName: "Rafael",
    heroRole: "Fullstack",
    heroDesc:
      "Developer passionate about technology and modern, scalable applications focused on performance. Experience with React, Next.js, and SQL/NoSQL databases.",
    downloadCv: "DOWNLOAD CV",
    contact: "CONTACT",
    cardLocation: "Location",
    cardLocVal: "Mogi das Cruzes, SP",
    cardStatus: "Status",
    cardStatusVal: "Available",
    cardFocus: "Focus",
    cardFocusVal: "React · Next.js",
    scroll: "SCROLL",

    sec01: "// 01",
    sobre: "About",
    aboutTitle: "Hi, I'm Rafael.",
    aboutSub: "WEB DEVELOPER · FULLSTACK",
    about1: "I'm a fullstack developer — I turn ideas into modern, scalable digital solutions.",
    about2:
      "Experience in front-end and back-end, always looking to learn new technologies and solve real problems.",
    about3: "Passionate about challenging projects and creating unique digital experiences.",
    skills: "SKILLS",

    sec02: "// 02",
    exp: "Experience",
    expTitle: "Professional background.",
    experiences: [
      {
        role: "Intern",
        company: "AGCO Corporation",
        dates: "MAR 2024 — MAR 2025",
        duration: "1 YEAR",
        desc: "Support in the development of new technologies, data analysis, and assistance with internal solutions focused on process efficiency.",
        skills: ["Data Analysis", "Power Apps", "Process Eng."],
        location: "Mogi das Cruzes, SP — Brazil",
        type: "Internship · On-site",
        logo: "/logo-agco.png",
      },
      {
        role: "Junior Systems Analyst",
        company: "Empreendedor Web",
        dates: "MAR 2026 — PRESENT",
        duration: "CURRENT",
        desc: "Working on the study and support of customer service and commercial management systems, focusing on client environment implementation, operational follow-up, flow configuration, and ongoing technical support.",
        skills: ["CRM", "Chatbot", "Technical Support"],
        location: "Tatuapé, SP — Brazil",
        type: "CLT · Hybrid",
        logo: "/empreendedorweb.png",
      },
    ],

    sec03: "// 03",
    tech: "Technologies",
    techTitle: "Tech stack.",

    sec04: "// 04",
    proj: "Projects",
    projTitle: "Projects",
    projBtn: "View project",
    otherProjects: "OTHER PROJECTS",
    featuredLabel: "FEATURED",

    sec05: "// 05",
    ctaSec: "Contact",
    ctaTitle: "Let's talk.",
    ctaSub: "OPEN TO NEW OPPORTUNITIES",
    namePh: "Your name",
    emailPh: "Your email",
    msgPh: "Your message",
    sendBtn: "SEND MESSAGE",
    sending: "SENDING...",
    sent: "MESSAGE SENT",

    footer: "ALL RIGHTS RESERVED",

    nav: ["Home", "About", "Experience", "Technologies", "Projects", "Contact"],

    projects: [
      {
        id: "01",
        name: "ZapFlow360",
        desc: "Full SaaS platform for WhatsApp scheduling automation with AI, smart flows, and a premium management dashboard.",
        link: "https://zapflow360.vercel.app/",
        techs: ["React", "TypeScript", "Vite", "Framer Motion", "Tailwind CSS"],
        image: "/zapflow-360.png",
        accent: "#34d399",
        featured: true,
      },
      {
        id: "02",
        name: "CGN Construções",
        desc: "Modern responsive landing page for a metalwork and steel structures company.",
        link: "https://cgnconstrucoes.vercel.app/",
        techs: ["React", "TypeScript"],
        image: "/cgn-construcoes-thumb.png",
        accent: "#3b82f6",
      },
      {
        id: "03",
        name: "Barbershop",
        desc: "Elegant website for a local barbershop focused on online booking and service presentation.",
        link: "https://thiagoygor.vercel.app/",
        techs: ["HTML5", "CSS3"],
        image: "/barbearia-thumb.png",
        accent: "#60a5fa",
      },
      {
        id: "04",
        name: "Véu de Íris",
        desc: "Mystical landing page for a tarot reader — services, energy and scheduling.",
        link: "https://tarotvenus.vercel.app/",
        techs: ["React", "TypeScript", "Vite"],
        image: "/arcana_portfolio_cover.png",
        accent: "#818cf8",
      },
      {
        id: "05",
        name: "Yuki Ramen",
        desc: "Modern landing page for a Japanese ramen restaurant — menu, atmosphere and dining experience.",
        link: "https://yukiramen.vercel.app/",
        techs: ["HTML5", "CSS3"],
        image: "/yuki-ramen-thumb.png",
        accent: "#f87171",
      },
    ],
  },
};

const SKILLS = [
  { name: "React", level: 95, color: "#60a5fa" },
  { name: "Next.js", level: 90, color: "#93c5fd" },
  { name: "TypeScript", level: 85, color: "#3b82f6" },
  { name: "Node.js", level: 82, color: "#60a5fa" },
  { name: "SQL", level: 75, color: "#94a3b8" },
  { name: "HTML5 & CSS3", level: 80, color: "#7dd3fc" },
];

const TECHS_GRID = [
  { name: "React", icon: "/icon-react.png", color: "#60a5fa" },
  { name: "Next.js", icon: "/icon-nextjs.png", color: "#e2e8f0" },
  { name: "TypeScript", icon: "/icon-typescript.png", color: "#3b82f6" },
  { name: "Node.js", icon: "/icon-nodejs.png", color: "#4ade80" },
  { name: "HTML5", icon: "/icon-html5.png", color: "#f97316" },
  { name: "CSS3", icon: "/icon-css3.png", color: "#38bdf8" },
  { name: "SQL", icon: "/icon-sql.png", color: "#94a3b8" },
];

const NAV_IDS = ["inicio", "sobre", "experiencia", "tecnologias", "projetos", "contato"];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const fn = () => {
      let cur = ids[0];

      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          cur = id;
        }
      });

      setActive(cur);
    };

    window.addEventListener("scroll", fn, { passive: true });
    fn();

    return () => window.removeEventListener("scroll", fn);
  }, [ids]);

  return active;
}

function AmbientParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.25 + 0.05,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(147,197,253,0.6)",
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 10, -8, 6, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity * 0.5, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 0,
        backgroundImage:
          "linear-gradient(rgba(59,130,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.035) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  );
}

function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={vis ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "rgba(147,197,253,0.4)",
          letterSpacing: "0.3em",
        }}
      >
        {number}
      </span>
      <div style={{ height: 1, width: 40, background: "rgba(147,197,253,0.15)" }} />
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: "rgba(147,197,253,0.5)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
  accent = "rgba(59,130,246,0.5)",
  style = {},
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      className={className}
      style={{
        borderRadius: 16,
        border: `1px solid ${hov ? accent : "rgba(255,255,255,0.07)"}`,
        background: hov ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        boxShadow: hov
          ? `0 0 0 1px ${accent}, 0 20px 60px rgba(0,0,0,0.4)`
          : "0 4px 40px rgba(0,0,0,0.3)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <motion.button
      onClick={() => setLang(lang === "pt" ? "en" : "pt")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "5px 14px",
        borderRadius: 8,
        cursor: "pointer",
        border: "1px solid rgba(59,130,246,0.25)",
        background: "rgba(59,130,246,0.08)",
        color: "#60a5fa",
        fontFamily: "monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        fontWeight: 700,
        transition: "all 0.2s",
      }}
    >
      {lang === "pt" ? "EN" : "PT"}
    </motion.button>
  );
}

function Navbar({
  active,
  lang,
  setLang,
  t,
}: {
  active: string;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          background: scrolled ? "rgba(8,12,22,0.94)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "all 0.4s",
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(1.5rem,5vw,3rem)",
          gap: 24,
        }}
      >
        <a
          href="#inicio"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(59,130,246,0.3)",
            }}
          >
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "#fff" }}>R</span>
          </div>
          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", color: "#e2e8f0" }}>
            Rafael<span style={{ color: "rgba(59,130,246,0.8)" }}>.</span>dev
          </span>
        </a>

        <nav className="nav-desktop" style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "auto" }}>
          {t.nav.map((label, i) => {
            const isActive = active === NAV_IDS[i];

            return (
              <a
                key={NAV_IDS[i]}
                href={`#${NAV_IDS[i]}`}
                style={{
                  padding: "6px 13px",
                  borderRadius: 8,
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: isActive ? "#93c5fd" : "rgba(148,163,184,0.65)",
                  textDecoration: "none",
                  background: isActive ? "rgba(59,130,246,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="nav-desktop-right" style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
          <LangToggle lang={lang} setLang={setLang} />
          {[
            { href: "https://github.com/unkdep", Icon: Github },
            { href: "https://www.linkedin.com/in/rafaelunk", Icon: Linkedin },
          ].map(({ href, Icon }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -1 }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(148,163,184,0.6)",
              }}
            >
              <Icon size={14} />
            </motion.a>
          ))}
        </div>

        <div className="nav-mobile" style={{ display: "none", marginLeft: "auto", alignItems: "center", gap: 8 }}>
          <LangToggle lang={lang} setLang={setLang} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.04)",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(8,12,22,0.98)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(24px)",
              padding: "12px 24px 20px",
            }}
          >
            {t.nav.map((label, i) => (
              <motion.a
                key={NAV_IDS[i]}
                href={`#${NAV_IDS[i]}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: active === NAV_IDS[i] ? "#93c5fd" : "#475569",
                  textDecoration: "none",
                }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero({ t }: { t: Translation }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px clamp(1.5rem,5vw,4rem) 60px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <motion.div style={{ y, opacity, width: "100%", maxWidth: 1180, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 12px #3b82f6" }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", color: "rgba(147,197,253,0.55)" }}>
            {t.available}
          </span>
        </motion.div>

        <div className="hero-grid-inner" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center" }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <h1 style={{ fontSize: "clamp(3.5rem,9vw,6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: "#f1f5f9", marginBottom: 10 }}>
                {t.heroName}
              </h1>
              <h1
                style={{
                  fontSize: "clamp(3.5rem,9vw,6.5rem)",
                  fontWeight: 800,
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  marginBottom: 28,
                  background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #93c5fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.heroRole}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ color: "#64748b", fontSize: "clamp(1rem,2vw,1.12rem)", lineHeight: 1.85, maxWidth: 520, marginBottom: 36 }}
            >
              {t.heroDesc}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <motion.a
                href="/cv.pdf"
                download
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 22px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "1px solid rgba(59,130,246,0.5)",
                  color: "#fff",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  fontWeight: 700,
                  boxShadow: "0 0 28px rgba(59,130,246,0.25)",
                }}
              >
                <FileDown size={14} /> {t.downloadCv}
              </motion.a>

              <motion.a
                href="#contato"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                <Mail size={14} /> {t.contact}
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="hero-card"
          >
            <GlassCard style={{ padding: 40, minWidth: 390, maxWidth: 430, width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: "50%",
                    border: "2px solid rgba(59,130,246,0.4)",
                    overflow: "hidden",
                    boxShadow: "0 0 28px rgba(59,130,246,0.2)",
                    background: "rgba(15,23,42,0.8)",
                  }}
                >
                  <img src="/iconesobre.png" alt="Rafael" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 21, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>Rafael</p>
                  <p style={{ fontFamily: "monospace", fontSize: 11, color: "#3b82f6", letterSpacing: "0.18em" }}>
                    FULLSTACK DEVELOPER
                  </p>
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: t.cardLocation, value: t.cardLocVal },
                    { label: t.cardStatus, value: t.cardStatusVal, green: true },
                    { label: t.cardFocus, value: t.cardFocusVal },
                  ].map(({ label, value, green }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "9px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        gap: 18,
                      }}
                    >
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#475569", letterSpacing: "0.08em" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: green ? "#4ade80" : "#94a3b8", textAlign: "right" }}>
                        {green && <span style={{ marginRight: 4 }}>●</span>}
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(59,130,246,0.6), transparent)" }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "#1e293b" }}>{t.scroll}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Sobre({ t }: { t: Translation }) {
  return (
    <section id="sobre" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px clamp(1.5rem,5vw,4rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number={t.sec01} label={t.sobre} />
          <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 48 }}>
            {t.aboutTitle}
          </h2>
        </Reveal>

        <div className="grid-responsive" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[t.about1, t.about2, t.about3].map((text, i) => (
              <Reveal key={i} delay={i * 0.1} x={-20}>
                <GlassCard style={{ padding: "18px 22px" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "monospace", color: "rgba(59,130,246,0.45)", fontSize: 11, flexShrink: 0, marginTop: 2 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ color: "#64748b", lineHeight: 1.85, fontSize: 15 }}>{text}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} x={20}>
            <GlassCard style={{ padding: 26, height: "100%" }}>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 22 }}>{t.skills}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {SKILLS.map((skill, i) => (
                  <div key={skill.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em" }}>{skill.name}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#475569" }}>{skill.level}%</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", background: `linear-gradient(to right, ${skill.color}88, ${skill.color})`, borderRadius: 2, boxShadow: `0 0 8px ${skill.color}44` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Experiencia({ t }: { t: Translation }) {
  return (
    <section id="experiencia" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px clamp(1.5rem,5vw,4rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number={t.sec02} label={t.exp} />
          <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 48 }}>
            {t.expTitle}
          </h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {t.experiences.map((item, index) => (
            <Reveal key={`${item.company}-${item.role}`} delay={0.08 * (index + 1)}>
              <GlassCard style={{ padding: "30px 34px" }}>
                <div style={{ display: "flex", gap: 26, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ width: 78, height: 78, borderRadius: 12, flexShrink: 0, background: "#0f172a", padding: 10, border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={item.logo} alt={item.company} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                      <h3 style={{ fontSize: 21, fontWeight: 700, color: "#f1f5f9" }}>{item.role}</h3>
                      <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", color: "#3b82f6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)", padding: "3px 10px", borderRadius: 6 }}>
                        {item.duration}
                      </span>
                    </div>

                    <p style={{ fontFamily: "monospace", color: "#3b82f6", fontSize: 12, letterSpacing: "0.1em", marginBottom: 3 }}>{item.company}</p>
                    <p style={{ fontFamily: "monospace", color: "#334155", fontSize: 10, letterSpacing: "0.12em", marginBottom: 18 }}>{item.dates}</p>
                    <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>{item.desc}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                      {item.skills.map((s) => (
                        <span key={s} style={{ fontFamily: "monospace", padding: "4px 12px", borderRadius: 6, fontSize: 11, letterSpacing: "0.08em", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", background: "rgba(59,130,246,0.07)" }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                      {[
                        { Icon: MapPin, text: item.location },
                        { Icon: Briefcase, text: item.type },
                      ].map(({ Icon, text }) => (
                        <span key={text} style={{ display: "flex", alignItems: "center", gap: 7, color: "#334155", fontSize: 13 }}>
                          <Icon size={12} color="#3b82f6" /> {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tecnologias({ t }: { t: Translation }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="tecnologias" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px clamp(1.5rem,5vw,4rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number={t.sec03} label={t.tech} />
          <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 48 }}>
            {t.techTitle}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 14 }}>
            {TECHS_GRID.map((tech, i) => (
              <motion.div key={tech.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }} onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    padding: "22px 14px",
                    borderRadius: 14,
                    border: `1px solid ${hovered === i ? `${tech.color}38` : "rgba(255,255,255,0.06)"}`,
                    background: hovered === i ? `${tech.color}0b` : "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    cursor: "default",
                    boxShadow: hovered === i ? `0 0 28px ${tech.color}14` : "none",
                  }}
                >
                  <img src={tech.icon} alt={tech.name} style={{ width: 34, height: 34, objectFit: "contain", filter: hovered === i ? "none" : "grayscale(0.3) brightness(0.8)" }} />
                  <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: hovered === i ? tech.color : "#475569" }}>
                    {tech.name}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ proj, projBtn, featuredLabel }: { proj: Project; projBtn: string; featuredLabel: string }) {
  const isFeatured = proj.featured === true;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} style={{ height: "100%" }}>
      <GlassCard accent={`${proj.accent}80`} style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        {isFeatured && (
          <div
            style={{
              position: "absolute",
              top: 48,
              right: 16,
              zIndex: 10,
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.18em",
              color: proj.accent,
              background: `${proj.accent}18`,
              border: `1px solid ${proj.accent}40`,
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {featuredLabel}
          </div>
        )}

        <div style={{ padding: "11px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: `${proj.accent}08` }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: proj.accent }}>PROJ-{proj.id}</span>
          <div style={{ display: "flex", gap: 5 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c, idx) => (
              <div key={idx} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
        </div>

        <div style={{ height: 185, overflow: "hidden", background: "#060a12", position: "relative", flexShrink: 0 }}>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            src={proj.image}
            alt={proj.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,10,18,0.65) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: "#f1f5f9" }}>{proj.name}</h3>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.75, flex: 1 }}>{proj.desc}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {proj.techs.map((tc) => (
              <span key={tc} style={{ fontFamily: "monospace", padding: "3px 9px", borderRadius: 6, fontSize: 10, letterSpacing: "0.1em", border: `1px solid ${proj.accent}30`, color: proj.accent, background: `${proj.accent}0c` }}>
                {tc}
              </span>
            ))}
          </div>

          <motion.a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "11px", borderRadius: 10, border: `1px solid ${proj.accent}28`, background: `${proj.accent}09`, color: proj.accent, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textDecoration: "none", marginTop: 4 }}
          >
            {projBtn} <ExternalLink size={13} />
          </motion.a>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Projetos({ t }: { t: Translation }) {
  return (
    <section id="projetos" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px clamp(1.5rem,5vw,4rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1060, width: "100%", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number={t.sec04} label={t.proj} />
          <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 48 }}>
            {t.projTitle}
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))", gap: 22 }}>
          {t.projects.map((proj, i) => (
            <Reveal key={proj.id} delay={i * 0.09}>
              <ProjectCard proj={proj} projBtn={t.projBtn} featuredLabel={t.featuredLabel} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contato({ t }: { t: Translation }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = () => {
    if (state !== "idle") return;
    setState("sending");
    setTimeout(() => {
      setState("sent");
      setTimeout(() => setState("idle"), 4000);
    }, 2000);
  };

  return (
    <section id="contato" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px clamp(1.5rem,5vw,4rem)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 540, width: "100%", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number={t.sec05} label={t.ctaSec} />
          <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: 8 }}>
            {t.ctaTitle}
          </h2>
          <p style={{ fontFamily: "monospace", fontSize: 10, color: "#334155", letterSpacing: "0.2em", marginBottom: 36 }}>{t.ctaSub}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard style={{ padding: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[
                { type: "text", placeholder: t.namePh },
                { type: "email", placeholder: t.emailPh },
              ].map(({ type, placeholder }) => (
                <input
                  key={placeholder}
                  type={type}
                  placeholder={placeholder}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#e2e8f0",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              ))}

              <textarea
                rows={4}
                placeholder={t.msgPh}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#e2e8f0",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                }}
              />

              <motion.button
                onClick={handleSubmit}
                whileHover={state === "idle" ? { scale: 1.01 } : {}}
                whileTap={state === "idle" ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 10,
                  border: "none",
                  cursor: state === "idle" ? "pointer" : "default",
                  color: "#fff",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  background: state === "sent" ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  boxShadow: state === "sent" ? "0 0 28px rgba(5,150,105,0.3)" : "0 0 28px rgba(59,130,246,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {state === "idle" && t.sendBtn}
                {state === "sending" && (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                      ◈
                    </motion.span>
                    {t.sending}
                  </span>
                )}
                {state === "sent" && (
                  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    ✓ {t.sent}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
            {[
              { href: "mailto:seuemail@gmail.com", Icon: Mail, label: "Email" },
              { href: "https://www.linkedin.com/in/rafaelunk", Icon: Linkedin, label: "LinkedIn" },
              { href: "https://github.com/unkdep", Icon: Github, label: "GitHub" },
            ].map(({ href, Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.02 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#64748b",
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                <Icon size={12} /> {label}
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = T[lang];
  const active = useActiveSection(NAV_IDS);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: #080c16;
          color: #f1f5f9;
          overflow-x: hidden;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080c16; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.35); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.55); }
        input::placeholder, textarea::placeholder { color: #1e293b; font-size: 13px; }
        a { text-decoration: none; color: inherit; }

        .nav-desktop { display: flex !important; }
        .nav-desktop-right { display: flex !important; }
        .nav-mobile { display: none !important; }
        .hero-card { display: block !important; }

        @media (max-width: 1024px) {
          .hero-grid-inner {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-card {
            justify-self: start;
          }
        }

        @media (max-width: 820px) {
          .nav-desktop { display: none !important; }
          .nav-desktop-right { display: none !important; }
          .nav-mobile { display: flex !important; }
          .hero-card { display: none !important; }
          .grid-responsive { grid-template-columns: 1fr !important; }
        }

        body::after {
          content: '';
          position: fixed; inset: 0; z-index: 1;
          pointer-events: none;
          opacity: 0.28;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }

        .glow-tl {
          position: fixed; top: -180px; left: -180px;
          width: 560px; height: 560px; border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .glow-br {
          position: fixed; bottom: -180px; right: -180px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(29,78,216,0.05) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
      `}</style>

      <div className="glow-tl" />
      <div className="glow-br" />
      <GridBackground />
      <AmbientParticles />

      <Navbar active={active} lang={lang} setLang={setLang} t={t} />

      <main style={{ position: "relative", zIndex: 2 }}>
        <Hero t={t} />
        <Sobre t={t} />
        <Experiencia t={t} />
        <Tecnologias t={t} />
        <Projetos t={t} />
        <Contato t={t} />
      </main>

      <footer style={{ position: "relative", zIndex: 2, padding: "28px 20px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", color: "#334155" }}>
          © {new Date().getFullYear()} RAFAEL — {t.footer}
        </p>
      </footer>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              position: "fixed",
              right: 20,
              bottom: 20,
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "1px solid rgba(59,130,246,0.25)",
              background: "rgba(8,12,22,0.85)",
              backdropFilter: "blur(14px)",
              color: "#93c5fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 120,
              boxShadow: "0 0 24px rgba(59,130,246,0.18)",
            }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}