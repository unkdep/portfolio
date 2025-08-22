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
    techTitle: "Tecnologias",
    techList: [
      "React",
      "Next.js",
      "Java",
      "HTML5",
      "CSS3",
      "Node.js",
      "TypeScript",
      "SQL",
    ],
    projectsTitle: "Projetos",
    project1Name: "Projeto 1",
    project1Desc: "Aplicação web moderna desenvolvida com React e Node.js.",
    project2Name: "Projeto 2",
    project2Desc: "Sistema de gestão de dados usando Spring Boot e SQL.",
    contactTitle: "Entre em Contato",
    contactText:
      "Quer trabalhar comigo ou apenas dizer um oi? Me envie uma mensagem!",
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
    techTitle: "Technologies",
    techList: [
      "React",
      "Next.js",
      "Java",
      "HTML5",
      "CSS3",
      "Node.js",
      "TypeScript",
      "SQL",
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

export default function Início() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const t = translations[lang];

  return (
    <>
      <Head>
        <title>Portfólio | Rafael Es</title>
        <meta
          name="description"
          content="Portfólio de Rafael, desenvolvedor fullstack."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 relative overflow-hidden scroll-smooth">
        <Navbar lang={lang} setLang={setLang} />

        {/* BOTÕES DE IDIOMA - agora responsivo */}
        <div className="flex gap-2 justify-center md:justify-end mt-6 md:mt-4 z-20">
          <button
            onClick={() => setLang("pt")}
            className={`px-3 py-1 rounded border ${
              lang === "pt" ? "bg-blue-500 text-white" : "border-blue-400"
            }`}
          >
            PT
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded border ${
              lang === "en" ? "bg-blue-500 text-white" : "border-blue-400"
            }`}
          >
            EN
          </button>
        </div>

        {/* HERO */}
        <section
          id="inicio"
          className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 pt-20 relative z-10"
        >
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="shadow-lg rounded-2xl overflow-hidden p-6 md:p-10 bg-gray-900/70 backdrop-blur-md text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              {t.heroGreeting}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-transparent bg-clip-text px-2 rounded">
                Rafael
              </span>
            </h1>
            <h2 className="mt-4 text-xl md:text-3xl font-light text-gray-300">
              {t.heroRole}
            </h2>
            <p className="mt-6 text-gray-400 leading-relaxed">
              {t.heroDescription}
            </p>

            {/* Botões */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <a
                href="/cv.pdf"
                target="_blank"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg shadow-lg transition"
              >
                <FileDown className="w-5 h-5" /> {t.cv}
              </a>
              <a
                href="mailto:seuemail@gmail.com"
                className="flex items-center gap-2 border border-gray-600 hover:border-indigo-400 px-5 py-2 rounded-lg transition"
              >
                <Mail className="w-5 h-5" /> {t.contact}
              </a>
            </div>

            {/* Links sociais */}
            <div className="flex gap-6 mt-6 justify-center md:justify-start">
              <a href="https://github.com/unkdep" target="_blank">
                <Github className="w-7 h-7 hover:text-indigo-400 transition" />
              </a>
              <a href="https://www.linkedin.com/in/rafaelunk" target="_blank">
                <Linkedin className="w-7 h-7 hover:text-indigo-400 transition" />
              </a>
            </div>
          </motion.div>

          {/* Espaço para modelo 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-72 h-72 md:w-96 md:h-96 bg-gray-800/50 rounded-2xl flex items-center justify-center shadow-lg mx-auto"
          >
            <ThreeDModel />
          </motion.div>
        </section>

        {/* SOBRE */}
        <section
          id="about"
          className="py-20 max-w-3xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-10 leading-tight"
          >
            {t.aboutTitle.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h3>

          {/* Foto circular */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg"
          >
            <img
              src="/iconesobre.png"
              alt="Rafael"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-gray-400 leading-relaxed">{t.aboutText1}</p>
            <p className="text-gray-400 leading-relaxed">{t.aboutText2}</p>
            <p className="text-gray-400 leading-relaxed">{t.aboutText3}</p>
          </motion.div>
        </section>

              {/* EXPERIÊNCIA PROFISSIONAL */}
      <section
        id="experience"
        className="py-20 bg-gray-900/70 backdrop-blur-md relative z-10"
      >
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold text-center mb-12"
        >
          {t.experienceTitle}
        </motion.h3>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 hover:scale-105 transition"
          >
            {/* Logo da empresa */}
            <img
              src="/logo-agco.png"
              alt="AGCO Corporation"
              className="w-32 h-32 object-contain rounded-lg shadow-lg"
            />

            {/* Informações */}
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-1">Estagiário</h4>
              <p className="text-blue-400 font-medium mb-1">AGCO Corporation · Estágio</p>
              <p className="text-gray-400 mb-1">Mogi das Cruzes - SP, Brasil · Presencial</p>
              <p className="text-gray-400 mb-3">Mar de 2024 - Mar de 2025 · 1 ano</p>

              {/* Skills / áreas */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm">Ciência de Dados e Análise</span>
                <span className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm">Projetos com Power Platform</span>
                <span className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm">Engenharia de Processos</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

        {/* TECNOLOGIAS */}
        <section id="tech" className="py-20 relative z-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-center mb-12"
          >
            {t.techTitle}
          </motion.h3>

          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
            {t.techList.map((tech) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-4 rounded-lg shadow hover:scale-105 transition"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJETOS */}
        <section
          id="projects"
          className="py-20 bg-gray-900/70 backdrop-blur-md relative z-10"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-center mb-12"
          >
            {t.projectsTitle}
          </motion.h3>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src="/projeto1.jpg"
                alt="Projeto 1"
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-semibold">{t.project1Name}</h4>
                <p className="mt-2 text-gray-300">{t.project1Desc}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src="/projeto2.jpg"
                alt="Projeto 2"
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-semibold">{t.project2Name}</h4>
                <p className="mt-2 text-gray-300">{t.project2Desc}</p>
              </div>
            </motion.div>
          </div>
        </section>

{/* CONTATO MODERNIZADO DISCRETO */}
<section
  id="contact"
  className="py-20 bg-gray-900/70 backdrop-blur-md relative z-10 rounded-xl"
>
  <motion.h3
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-3xl font-semibold text-center mb-12 text-white"
  >
    {t.contactTitle}
  </motion.h3>

  <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
    {/* Formulário */}
<motion.form
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className="w-full md:w-1/2 bg-black p-8 rounded-xl shadow-lg flex flex-col gap-4"
  onSubmit={(e) => {
    e.preventDefault();
    alert("Mensagem enviada!");
  }}
>
  <input
    type="text"
    placeholder="Seu nome"
    required
    className="px-4 py-3 bg-black border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <input
    type="email"
    placeholder="Seu e-mail"
    required
    className="px-4 py-3 bg-black border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <textarea
    placeholder="Sua mensagem"
    required
    rows={5}
    className="px-4 py-3 bg-black border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <button
    type="submit"
    className="px-6 py-3 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-semibold rounded-lg shadow transition"
  >
    Enviar Mensagem
  </button>
</motion.form>


    {/* Links de Contato */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-4 items-center md:items-start"
    >
      <a
        href="mailto:fristmts@gmail.com"
        className="flex items-center gap-3 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition"
      >
        <Mail className="w-6 h-6" /> E-mail
      </a>
      <a
        href="https://www.linkedin.com/in/rafaelunk"
        target="_blank"
        className="flex items-center gap-3 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition"
      >
        <Linkedin className="w-6 h-6" /> LinkedIn
      </a>
    </motion.div>
  </div>
</section>

      </main>
    </>
  );
}
