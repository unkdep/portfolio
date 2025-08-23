"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileDown } from "lucide-react";
import ThreeDModel from "./components/ThreeDModel";
import { useState } from "react";
import Head from "next/head";
import Navbar from "./components/Navbar";

// Traduções com palavras-chave para destaque
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
          desenvolvedor fullstack
        </span>
        , gosto de transformar ideias em soluções digitais modernas.
      </>
    ),
    aboutText2: (
      <>
        Tenho experiência tanto no{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          front-end
        </span>{" "}
        quanto no{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          back-end
        </span>
        , e estou sempre em busca de aprender novas tecnologias.
      </>
    ),
    aboutText3: (
      <>
        Adoro contribuir em{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          projetos desafiadores
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
    experienceSkills: [
      "Ciência de Dados e Análise",
      "Projetos com Power Platform",
      "Engenharia de Processos",
    ],
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
    project1Name: "Projeto 1",
    project1Desc: "Aplicação web moderna desenvolvida com React e Node.js.",
    project2Name: "Projeto 2",
    project2Desc: "Sistema de gestão de dados usando Spring Boot e SQL.",
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
          fullstack developer
        </span>
        , I enjoy turning ideas into modern digital solutions.
      </>
    ),
    aboutText2: (
      <>
        I have experience in both{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          front-end
        </span>{" "}
        and{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          back-end
        </span>
        , and I am always looking to learn new technologies.
      </>
    ),
    aboutText3: (
      <>
        I love contributing to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">
          challenging projects
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
    experienceSkills: [
      "Data Science & Analytics",
      "Power Platform Projects",
      "Process Engineering",
    ],
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
    project1Name: "Project 1",
    project1Desc: "Modern web application developed with React and Node.js.",
    project2Name: "Project 2",
    project2Desc: "Data management system using Spring Boot and SQL.",
    contactTitle: "Get in Touch",
    contactText: "Want to work with me or just say hi? Send me a message!",
    contactEmail: "Send Email",
    contactLinkedin: "LinkedIn",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const t = translations[lang];

  const techs = t.techList;

  return (
    <>
      <Head>
        <title>Portfólio | Rafael Es</title>
        <meta name="description" content="Portfólio de Rafael, desenvolvedor fullstack." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 relative overflow-hidden scroll-smooth">
        <Navbar lang={lang} setLang={setLang} />

        {/* BOTÕES DE IDIOMA */}
        <div className="flex gap-2 justify-center md:justify-end mt-6 md:mt-4 z-20">
          <button
            onClick={() => setLang("pt")}
            className={`px-3 py-1 rounded border ${lang === "pt" ? "bg-blue-500 text-white" : "border-blue-400"}`}
          >
            PT
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded border ${lang === "en" ? "bg-blue-500 text-white" : "border-blue-400"}`}
          >
            EN
          </button>
        </div>

        {/* HERO */}
        <section id="inicio" className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 pt-20 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="shadow-lg rounded-2xl overflow-hidden p-6 md:p-10 bg-gray-900/70 backdrop-blur-md text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold">
              {t.heroGreeting}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-transparent bg-clip-text px-2 rounded">
                Rafael
              </span>
            </h1>
            <h2 className="mt-4 text-xl md:text-3xl font-light text-gray-300">{t.heroRole}</h2>
            <p className="mt-6 text-gray-400 leading-relaxed">{t.heroDescription}</p>

            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <a href="/cv.pdf" target="_blank" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg shadow-lg transition">
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

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="w-72 h-72 md:w-96 md:h-96 bg-gray-800/50 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <ThreeDModel />
          </motion.div>
        </section>

        {/* SOBRE */}
        <section id="about" className="py-20 max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
            {t.aboutTitle.split("\n").map((line, i) => (<span key={i} className="block">{line}</span>))}
          </motion.h3>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
            <img src="/iconesobre.png" alt="Rafael" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-4">
            <p className="text-gray-400 leading-relaxed">{t.aboutText1}</p>
            <p className="text-gray-400 leading-relaxed">{t.aboutText2}</p>
            <p className="text-gray-400 leading-relaxed">{t.aboutText3}</p>
          </motion.div>
        </section>

        {/* EXPERIÊNCIA PROFISSIONAL */}
        <section id="experience" className="py-20 bg-gray-900/70 backdrop-blur-md relative z-10">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl font-semibold text-center mb-12">{t.experienceTitle}</motion.h3>

          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 hover:scale-105 transition">
              <img src="/logo-agco.png" alt={t.experienceCompany} className="w-32 h-32 object-contain rounded-lg shadow-lg" />
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-1">{t.experienceRole}</h4>
                <p className="text-blue-400 font-medium mb-1">{t.experienceCompany} · {t.experienceType}</p>
                <p className="text-gray-400 mb-1">{t.experienceLocation}</p>
                <p className="text-gray-400 mb-3">{t.experienceDates}</p>
                <div className="flex flex-wrap gap-2">
                  {t.experienceSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TECNOLOGIAS - CARROSSEL */}
        <section id="tech" className="py-20 relative z-10 overflow-hidden">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-12">{t.techTitle}</motion.h3>

          <div className="relative w-full overflow-hidden">
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
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />

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

        {/* PROJETOS */}
        <section id="projects" className="py-20 bg-gray-900/70 backdrop-blur-md relative z-10">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl font-semibold text-center mb-12">{t.projectsTitle}</motion.h3>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <img src="/projeto1.jpg" alt={t.project1Name} className="w-full h-52 object-cover" />
              <div className="p-6">
                <h4 className="text-xl font-semibold">{t.project1Name}</h4>
                <p className="mt-2 text-gray-300">{t.project1Desc}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <img src="/projeto2.jpg" alt={t.project2Name} className="w-full h-52 object-cover" />
              <div className="p-6">
                <h4 className="text-xl font-semibold">{t.project2Name}</h4>
                <p className="mt-2 text-gray-300">{t.project2Desc}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONTATO */}
        <section id="contact" className="py-20 bg-gray-900/70 backdrop-blur-md relative z-10 rounded-xl">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl font-semibold text-center mb-12 text-white">{t.contactTitle}</motion.h3>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
            <motion.form initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full md:w-1/2 bg-black p-8 rounded-xl shadow-lg flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert("Mensagem enviada!"); }}>
              <input type="text" placeholder="Seu nome" required className="px-4 py-3 bg-black border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="email" placeholder="Seu e-mail" required className="px-4 py-3 bg-black border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea placeholder="Sua mensagem" required rows={5} className="px-4 py-3 bg-black border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <button type="submit" className="px-6 py-3 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-semibold rounded-lg shadow transition">
                Enviar Mensagem
              </button>
            </motion.form>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex flex-col gap-4 items-center md:items-start">
              <a href="mailto:fristmts@gmail.com" className="flex items-center gap-3 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition">
                <Mail className="w-6 h-6" /> E-mail
              </a>
              <a href="https://www.linkedin.com/in/rafaelunk" target="_blank" className="flex items-center gap-3 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition">
                <Linkedin className="w-6 h-6" /> LinkedIn
              </a>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
