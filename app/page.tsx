"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileDown, ArrowUp, ExternalLink } from "lucide-react";
import ThreeDModel from "./components/ThreeDModel";
import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "./components/Navbar";

const translations = {
  pt: {
    nav: ["Início", "Sobre", "Experiência", "Tecnologias", "Projetos", "Contato"],
    heroGreeting: "Olá, meu nome é",
    heroRole: "Desenvolvedor Fullstack",
    heroDescription:
      "Apaixonado por tecnologia e desenvolvimento de aplicações modernas, escaláveis e com foco em performance. Experiência em Java, Spring Boot, React, Next.js e bancos de dados SQL/NoSQL.",
    cv: "Baixar CV",
    contact: "Contato",
    aboutTitle: "Olá, meu nome é Rafael\nDesenvolvedor Web",
    aboutText1: (
      <>
        Sou{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          desenvolvedor fullstack{" "}
        </span>{" "}
        , gosto de transformar ideias em soluções digitais modernas.
      </>
    ),
    aboutText2: (
      <>
        Tenho experiência tanto no{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          front-end{" "}
        </span>{" "}
        quanto no{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          back-end{" "}
        </span>{" "}
        , e estou sempre em busca de aprender novas tecnologias.
      </>
    ),
    aboutText3: (
      <>
        Adoro contribuir em{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          projetos desafiadores{" "}
        </span>{" "}
        e criar experiências digitais únicas.
      </>
    ),
    experienceTitle: "Experiência Profissional",
    experienceRole: "Estagiário",
    experienceCompany: "AGCO Corporation",
    experienceLocation: "Mogi das Cruzes - SP, Brasil",
    experienceType: "Estágio · Presencial",
    experienceDates: "Mar de 2024 - Mar de 2025 · 1 ano",
    experienceDesc: "Suporte no desenvolvimento de novas tecnologias.",
    experienceSkills: ["Ciência de Dados e Análise", "Projetos com Power Platform", "Engenharia de Processos"],
    techTitle: "Tecnologias",
    techList: [
      { name: "React", icon: "/icon-react.png" },
      { name: "Next.js", icon: "/icon-nextjs.png" },
      { name: "Java", icon: "/icon-java.png" },
      { name: "HTML5", icon: "/icon-html5.png" },
      { name: "CSS3", icon: "/icon-css3.png" },
      { name: "Node.js", icon: "/icon-nodejs.png" },
      { name: "TypeScript", icon: "/icon-typescript.png" },
      { name: "SQL", icon: "/icon-sql.png" },
    ],
    projectsTitle: "Projetos",
    contactTitle: "Entre em Contato",
    contactText: "Quer trabalhar comigo ou apenas dizer um oi? Me envie uma mensagem!",
    contactEmail: "Enviar Email",
    contactLinkedin: "LinkedIn",
  },
  en: {
    nav: ["Home", "About", "Experience", "Technologies", "Projects", "Contact"],
    heroGreeting: "Hi, my name is",
    heroRole: "Fullstack Developer",
    heroDescription:
      "Passionate about technology and developing modern, scalable applications focused on performance. Experience in Java, Spring Boot, React, Next.js, and SQL/NoSQL databases.",
    cv: "Download CV",
    contact: "Contact",
    aboutTitle: "Hi, my name is Rafael\nWeb Developer",
    aboutText1: (
      <>
        I am a{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          fullstack developer{" "}
        </span>
        , I enjoy turning ideas into modern digital solutions.
      </>
    ),
    aboutText2: (
      <>
        I have experience in both{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          front-end{" "}
        </span>{" "}
        and{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          back-end{" "}
        </span>
        , and I am always looking to learn new technologies.
      </>
    ),
    aboutText3: (
      <>
        I love contributing to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          {" "}
          challenging projects{" "}
        </span>{" "}
        and creating unique digital experiences.
      </>
    ),
    experienceTitle: "Professional Experience",
    experienceRole: "Intern",
    experienceCompany: "AGCO Corporation",
    experienceLocation: "Mogi das Cruzes - SP, Brazil",
    experienceType: "Full-time · On-site",
    experienceDates: "Mar 2024 - Mar 2025 · 1 year",
    experienceDesc: "Support in developing new technologies.",
    experienceSkills: ["Data Science & Analytics", "Power Platform Projects", "Process Engineering"],
    techTitle: "Technologies",
    techList: [
      { name: "React", icon: "/icon-react.png" },
      { name: "Next.js", icon: "/icon-nextjs.png" },
      { name: "Java", icon: "/icon-java.png" },
      { name: "HTML5", icon: "/icon-html5.png" },
      { name: "CSS3", icon: "/icon-css3.png" },
      { name: "Node.js", icon: "/icon-nodejs.png" },
      { name: "TypeScript", icon: "/icon-typescript.png" },
      { name: "SQL", icon: "/icon-sql.png" },
    ],
    projectsTitle: "Projects",
    contactTitle: "Get in Touch",
    contactText: "Want to work with me or just say hi? Send me a message!",
    contactEmail: "Send Email",
    contactLinkedin: "LinkedIn",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const t = translations[lang];
  const techs = t.techList;

  const projects = [
    {
      name: "CGN Construções",
      desc: (
        <>
          Landing page{" "}
          <span className="text-blue-400 font-semibold">moderna</span> e{" "}
          <span className="text-blue-400 font-semibold">responsiva</span> para empresa de{" "}
          <span className="text-blue-400 font-semibold">serralheria</span> e estruturas metálicas.
        </>
      ),
      link: "https://cgnconstrucoes.vercel.app/",
      techs: ["React", "TypeScript"],
      image: "/cgn-construcoes-thumb.png",
    },
    {
      name: "Barbearia",
      desc: (
        <>
          Website elegante e{" "}
          <span className="text-blue-400 font-semibold">moderno</span> para uma barbearia local,
          focado em{" "}
          <span className="text-blue-400 font-semibold">agendamento online</span> e apresentação de serviços.
        </>
      ),
      link: "https://example.com/barbearia",
      techs: ["Next.js", "TailwindCSS", "React"],
      image: "/barbearia-thumb.png", // Espaço reservado para a foto do projeto
    },
  ];

  // Detectar seção ativa no scroll e highlight navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "about", "experience", "tech", "projects", "contact"];
      let current = "";
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = section;
          }
        }
      });
      setActiveSection(current || "inicio");
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Portfólio | Rafael</title>
        <meta name="description" content="Portfólio de Rafael, desenvolvedor fullstack." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 relative overflow-x-hidden scroll-smooth">
        {/* Navbar com activeSection */}
        <Navbar lang={lang} setLang={setLang} activeSection={activeSection} />

        {/* INÍCIO */}
        <section
          id="inicio"
          className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 pt-20 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={activeSection === "inicio" ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="shadow-lg rounded-2xl overflow-hidden p-6 md:p-10 bg-gray-900/70 backdrop-blur-md text-center md:text-left flex-1"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              {t.heroGreeting}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-transparent bg-clip-text px-2 rounded">
                Rafael
              </span>
            </h1>
            <h2 className="mt-4 text-xl md:text-3xl font-light text-gray-300">{t.heroRole}</h2>
            <p className="mt-6 text-gray-400 leading-relaxed">{t.heroDescription}</p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <a
                href="/cv.pdf"
                target="_blank"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg shadow-lg transition"
              >
                <FileDown className="w-5 h-5" /> {t.cv}
              </a>
              <a href="mailto:seuemail@gmail.com" className="flex items-center gap-2 border border-gray-600 hover:border-indigo-400 px-5 py-2 rounded-lg transition">
                <Mail className="w-5 h-5" /> {t.contact}
              </a>
            </div>
            <div className="flex gap-6 mt-6 justify-center md:justify-start">
              <a href="https://github.com/unkdep" target="_blank">
                <Github className="w-7 h-7 hover:text-indigo-400 transition" />
              </a>
              <a href="https://www.linkedin.com/in/rafaelunk" target="_blank">
                <Linkedin className="w-7 h-7 hover:text-indigo-400 transition" />
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={activeSection === "inicio" ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-72 h-72 md:w-96 md:h-96 bg-gray-800/50 rounded-2xl flex items-center justify-center shadow-lg mx-auto flex-shrink-0"
          >
            <ThreeDModel />
          </motion.div>
        </section>

        {/* SOBRE - com ondas circulares ao redor da imagem */}
        <section
          id="about"
          className="min-h-screen flex flex-col items-center justify-center py-20 max-w-3xl mx-auto px-6 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={activeSection === "about" ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
            transition={{ duration: 0.6 }}
            className="w-full relative"
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
              {t.aboutTitle.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <div className="relative w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              {/* Ondas circulares */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full border border-blue-400 opacity-60"
                    style={{
                      width: `${120 + i * 40}px`,
                      height: `${120 + i * 40}px`,
                      animation: `circulaire-wave 4s ease-in-out ${i * 1.3}s infinite`,
                    }}
                  />
                ))}
              </div>
              <img src="/iconesobre.png" alt="Rafael" className="w-full h-full object-cover rounded-full relative z-10" />
            </div>
            <div className="space-y-4 max-w-2xl">
              <p className="text-gray-400 leading-relaxed text-lg">{t.aboutText1}</p>
              <p className="text-gray-400 leading-relaxed text-lg">{t.aboutText2}</p>
              <p className="text-gray-400 leading-relaxed text-lg">{t.aboutText3}</p>
            </div>
          </motion.div>
          <style jsx>{`
            @keyframes circulaire-wave {
              0% {
                transform: scale(1);
                opacity: 0.6;
              }
              50% {
                transform: scale(1.15);
                opacity: 0.3;
              }
              100% {
                transform: scale(1);
                opacity: 0.6;
              }
            }
          `}</style>
        </section>

        {/* EXPERIÊNCIA - Ondas somente ao redor da grid da info */}
        <section
          id="experience"
          className="min-h-screen flex flex-col items-center justify-center py-20 bg-gray-900/70 backdrop-blur-md relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={activeSection === "experience" ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <h3 className="text-3xl font-semibold text-center mb-12">{t.experienceTitle}</h3>
            <div className="mx-auto max-w-3xl relative">
              {/* Ondas ao redor da grid */}
              <div className="absolute -inset-1 rounded-3xl border border-blue-500 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-wave"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-wave delay-2000"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 animate-wave-vertical"></div>
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 animate-wave-vertical delay-2000"></div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 relative z-10">
                <img src="/logo-agco.png" alt={t.experienceCompany} className="w-32 h-32 object-contain rounded-lg shadow-lg" />
                <div className="flex-1 text-left">
                  <h4 className="text-2xl font-bold mb-1">{t.experienceRole}</h4>
                  <p className="text-blue-400 font-medium mb-1">
                    {t.experienceCompany} · {t.experienceType}
                  </p>
                  <p className="text-gray-400 mb-1">{t.experienceLocation}</p>
                  <p className="text-gray-400 mb-3">{t.experienceDates}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.experienceSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            @keyframes wave {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
            .animate-wave {
              animation: wave 4s linear infinite;
            }
            .animate-wave.delay-2000 {
              animation-delay: 2s;
            }
            @keyframes wave-vertical {
              0% {
                transform: translateY(-100%);
              }
              100% {
                transform: translateY(100%);
              }
            }
            .animate-wave-vertical {
              animation: wave-vertical 4s linear infinite;
            }
            .animate-wave-vertical.delay-2000 {
              animation-delay: 2s;
            }
          `}</style>
        </section>

        {/* TECNOLOGIAS */}
        <section id="tech" className="min-h-screen flex flex-col items-center justify-center py-20 relative z-10 overflow-hidden">
          <motion.h3
            initial={{ opacity: 0, y: 50 }}
            animate={activeSection === "tech" ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            {t.techTitle}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={activeSection === "tech" ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-6xl overflow-hidden"
          >
            <div className="marquee flex gap-16 will-change-transform">
              {[...techs, ...techs].map((tech, idx) => (
                <div key={`${tech.name}-${idx}`} className="flex flex-col items-center min-w-[140px]">
                  <div className="w-24 h-24 bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-blue-500/40 transition duration-300">
                    <img src={tech.icon} alt={tech.name} className="w-12 h-12 object-contain" />
                  </div>
                  <p className="mt-3 text-white text-sm md:text-base">{tech.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <style jsx>{`
            .marquee {
              width: max-content;
              animation: marquee 24s linear infinite;
            }
            .marquee:hover {
              animation-play-state: paused;
            }
            @keyframes marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </section>

        {/* PROJETOS - Com animação moderna (pulse leve) */}
        <section
          id="projects"
          className="min-h-screen flex flex-col items-center justify-center py-20 max-w-5xl mx-auto relative z-10"
        >
          <motion.h3
            initial={{ opacity: 0, y: 50 }}
            animate={activeSection === "projects" ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            {t.projectsTitle}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={activeSection === "projects" ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 w-full"
          >
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                className={`group bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/70 shadow-xl hover:shadow-blue-500/20 transition-all duration-400 overflow-hidden hover:scale-[1.02] ${
                  !project.name ? "opacity-40 cursor-default" : ""
                }`}
                style={{ minHeight: "380px" }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px #3b82f6, 0 0 30px #60a5fa" }}
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 0 10px #2563eb66",
                    "0 0 20px #3b82f666",
                    "0 0 10px #2563eb66",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
              >
                <div className="w-full h-48 rounded-xl overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-500">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={typeof project.name === "string" ? project.name : "Projeto"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-sm rounded-xl">
                      Em Breve
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h4
                    className={`text-2xl font-bold text-center ${
                      project.name
                        ? "bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-500"
                        : "text-gray-500"
                    }`}
                  >
                    {project.name || "Em Breve"}
                  </h4>
                  <p className="text-gray-300 text-center text-base leading-relaxed">
                    {typeof project.desc === "string" ? project.desc : project.desc}
                  </p>
                  {project.techs && project.techs.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {project.techs.map((tech, tIdx) => (
                        <motion.span
                          key={tIdx}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 bg-blue-500/30 backdrop-blur-sm border border-blue-500/40 rounded-lg text-blue-300 text-xs font-medium hover:bg-blue-500/50 hover:text-white hover:border-blue-400 hover:shadow-md transition-all duration-300"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}
                  {project.link && project.name && (
                    <div className="pt-4 flex justify-center">
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                      >
                        Ver Projeto <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CONTATO MODERNO COM ONDAS */}
        <section id="contact" className="min-h-screen flex flex-col items-center justify-center py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={activeSection === "contact" ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md px-6 py-10 relative bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-blue-500 shadow-lg overflow-hidden"
          >
            {/* Linhas estilo ondas sonoras */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-wave"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-wave delay-2000"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 animate-wave-vertical"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 animate-wave-vertical delay-2000"></div>
            </div>

            <h3 className="text-3xl font-bold text-center mb-8 text-white relative z-10">Entre em Contato</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mensagem enviada! (Funcionalidade de backend não implementada)");
              }}
              className="flex flex-col gap-5 relative z-10"
            >
              <motion.input
                whileFocus={{ scale: 1.03 }}
                type="text"
                placeholder="Seu nome"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
              <motion.input
                whileFocus={{ scale: 1.03 }}
                type="email"
                placeholder="Seu e-mail"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
              <motion.textarea
                whileFocus={{ scale: 1.03 }}
                placeholder="Sua mensagem"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 resize-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px #3b82f6, 0 0 25px #60a5fa" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-400 transition-all duration-300"
              >
                Enviar
              </motion.button>
            </form>

            <div className="mt-8 flex justify-center gap-6 relative z-10">
              <a href="mailto:seuemail@gmail.com" className="px-5 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition text-sm">
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/rafaelunk"
                target="_blank"
                className="px-5 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition text-sm"
              >
                LinkedIn
              </a>
            </div>

            {/* Estilos CSS para animação das ondas */}
            <style jsx>{`
              @keyframes wave {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(100%);
                }
              }
              .animate-wave {
                animation: wave 4s linear infinite;
              }
              .animate-wave.delay-2000 {
                animation-delay: 2s;
              }
              @keyframes wave-vertical {
                0% {
                  transform: translateY(-100%);
                }
                100% {
                  transform: translateY(100%);
                }
              }
              .animate-wave-vertical {
                animation: wave-vertical 4s linear infinite;
              }
              .animate-wave-vertical.delay-2000 {
                animation-delay: 2s;
              }
            `}</style>
          </motion.div>
        </section>

        {showTopBtn && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg z-50 transition"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
        )}
      </main>
    </>
  );
}
