"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  setLang: (lang: "pt" | "en") => void;
  lang: "pt" | "en";
  activeSection?: string;
}

export default function Navbar({ setLang, lang, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#inicio", id: "inicio" },
    { label: "Sobre", href: "#about", id: "about" },
    { label: "Experiência", href: "#experience", id: "experience" },
    { label: "Tecnologias", href: "#tech", id: "tech" },
    { label: "Projetos", href: "#projects", id: "projects" },
    { label: "Contato", href: "#contact", id: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-gray-900/80 backdrop-blur-md shadow-md">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="text-2xl font-bold text-blue-500">Rafael</div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-lg font-medium transition-all py-2 ${
                activeSection === item.id
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-300 hover:text-blue-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setLang("pt")}
              className={`px-3 py-1 rounded border ${
                lang === "pt" ? "border-blue-400 bg-blue-500 text-white" : "border-gray-500"
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded border ${
                lang === "en" ? "border-blue-400 bg-blue-500 text-white" : "border-gray-500"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-md w-full absolute top-16 left-0 flex flex-col items-center py-4 gap-4 shadow-lg"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-blue-400 text-lg transition"
              >
                {item.label}
              </a>
            ))}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { setLang("pt"); setIsOpen(false); }}
                className={`px-3 py-1 rounded border ${
                  lang === "pt" ? "border-blue-400 bg-blue-500 text-white" : "border-gray-500"
                }`}
              >
                PT
              </button>
              <button
                onClick={() => { setLang("en"); setIsOpen(false); }}
                className={`px-3 py-1 rounded border ${
                  lang === "en" ? "border-blue-400 bg-blue-500 text-white" : "border-gray-500"
                }`}
              >
                EN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
