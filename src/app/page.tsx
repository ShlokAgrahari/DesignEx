"use client";

import { Orbitron, Audiowide } from "next/font/google";
import Navbar from "./section/navbar";
import Hero from "./section/hero";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });
const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-display">
      <div className="container mx-auto max-w-7xl">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}
