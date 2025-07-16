"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orbitron, Audiowide } from "next/font/google";
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });
const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });
const links = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "SignUp" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-[#0f0f0f]/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <img
          src="/designX.jpg"
          alt="DesignEx logo"
          className="h-12 w-12 rounded-full border-2 border-yellow-300 shadow-md"
        />
        <span
          className={`${orbitron.className} text-2xl font-extrabold uppercase tracking-wider`}
        >
          DesignEX
        </span>

        {/* Desktop links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-10">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center h-9 w-9 rounded hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {/* Simple icon with 3 bars */}
          <span className="sr-only">Menu</span>
          <div className="space-y-[3px]">
            <span
              className={`block h-[2px] w-6 bg-white transition-transform ${
                open ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-transform ${
                open ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="mobileNav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden bg-[#0f0f0f]/90"
          >
            <ul className="flex flex-col items-center gap-6 py-6">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="text-neutral-300 hover:text-white text-lg transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
