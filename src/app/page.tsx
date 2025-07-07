"use client";

import { useEffect, useState } from "react";
import {
  Orbitron,
  Audiowide,
  Rubik_Doodle_Shadow,
  Press_Start_2P,
  Dancing_Script,
} from "next/font/google";

export const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });
export const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });
export const rubik = Rubik_Doodle_Shadow({ subsets: ["latin"], weight: "400" });
export const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });
export const script = Dancing_Script({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const features = [
    {
      heading: "Brain Storm Ideas",
      description:
        "Craft stunning posters, presentations, invites, and more — no design experience needed. Just drag, drop, and publish.",
      image:
        "https://i.pinimg.com/736x/66/79/5e/66795eef1e6cddbf23f9957f8facb4c8.jpg",
    },
    {
      heading: "Real-Time Collaboration",
      description:
        "Work with your team on the same design live. Brainstorm, edit, comment — all in real time.",
      image: "/team2.jpg",
    },
    {
      heading: "Team Management",
      description:
        "Create groups for clubs or events. Assign roles, manage designs, and track progress effortlessly.",
      image: "/team.jpg",
    },
    {
      heading: "Meet & Chat",
      description:
        "Chat instantly or schedule video calls — all within the platform. Stay connected anytime.",
      image: "https://i.pinimg.com/736x/75/12/9d/75129d061858c9f219c9328eafce797e.jpg",
    },
    {
      heading: "Local Discovery",
      description:
        "Find nearby printers, suppliers, or decorators easily through our integrated location-based tool.",
      image: "/locate2.jpg",
    },
  ];

  return (
    <div className="min-h-screen font-display bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-4 px-8 z-50 bg-[#0f0f0f] shadow-xl border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <img
            src="/designX.jpg"
            alt="logo"
            className="h-14 w-14 rounded-full border-2 border-[#fdff00] shadow-lg hover:scale-110 transition-transform"
          />
          <span className={`${orbitron.className} text-3xl font-extrabold uppercase tracking-widest text-white`}>
            DesignEX
          </span>
        </div>
        <div className="space-x-8 flex items-center text-lg font-semibold">
          <a href="#about" className="text-white hover:text-[#fe7e0f]">About Us</a>
          <a href="#solutions" className="text-white hover:text-[#fe7e0f]">Solutions</a>
          <a href="/login" className="text-white hover:text-[#fe7e0f]">Login</a>
          <a href="/signup" className="px-6 py-2 rounded-full bg-[#fe7e0f] text-black font-bold shadow-md hover:scale-110 hover:bg-orange-600 transition">Sign Up</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-gray-900/40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl gap-8 items-center justify-center">
          <div className="w-50 md:w-1/2 flex justify-center">
            <img
              src="https://i.pinimg.com/736x/59/82/2a/59822a27a2dbaeaf2039377035fc62e6.jpg"
              alt="Design Collaboration"
              className="w-[500px] h-[500px] object-contain shadow-lg"
            />
          </div>
          <div className={`${orbitron.className} w-full md:w-1/2 text-left text-white space-y-6 flex flex-col items-start`}>
            <h1 className="text-7xl font-bold">DESIGN</h1>
            <h1 className="text-7xl font-bold text-[#fe7e0f]">WITHOUT</h1>
            <h1 className="text-7xl font-bold">LIMITS</h1>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 text-center">
        <h2 className={`${orbitron.className} text-5xl font-bold mb-6 text-white hover:drop-shadow-[0_0_12px_#c084fc]`}>
          Why DESIGNEX<span>?</span>
        </h2>
        <p className={`${audiowide.className} max-w-2xl mx-auto text-xl text-gray-400`}>
          DESIGNEX is your all-in-one creative hub — effortlessly design stunning visuals, collaborate in real-time with your team, brainstorm ideas together, chat seamlessly, and host video conferences without switching platforms.
        </p>
      </section>

      {/* Solutions */}
      <section id="solutions" className="pt-20 pb-8">
        <h2 className={`${orbitron.className} text-4xl font-bold text-center mb-12 text-white`}>
          Design Smarter. Collaborate Faster. Stand Out.
        </h2>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col relative z-10">
            {features.map((feature, index) => {
              const isEven = index % 2 === 1;
              const num = index + 1;
              return (
                <div key={num} className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                  {!isEven ? (
                    <>
                      <div className="flex justify-end">
                        <img src={feature.image} alt="Feature" className="w-60 h-[200px] object-cover" />
                      </div>
                      <div className="flex flex-col items-center justify-center relative h-[200px]">
                        {num !== 1 && <div className="absolute top-0 bottom-1/2 w-1 bg-white z-0" />}
                        <div className="w-16 h-16 rounded-full border-4 border-purple-600 text-2xl text-[#fdff00] font-bold flex items-center justify-center bg-[#0f0f0f] z-10">{num}</div>
                        {num !== features.length && <div className="absolute top-1/2 bottom-0 w-1 bg-white z-0" />}
                      </div>
                      <div className="text-left space-y-2">
                        <h3 className={`${orbitron.className} text-xl font-semibold`}>{feature.heading}</h3>
                        <p className={`${audiowide.className} text-sm text-gray-300`}>{feature.description}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-right space-y-2">
                        <h3 className={`${orbitron.className} text-xl font-semibold`}>{feature.heading}</h3>
                        <p className={`${audiowide.className} text-sm text-gray-300`}>{feature.description}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center relative h-[200px]">
                        {num !== 1 && <div className="absolute top-0 bottom-1/2 w-1 bg-white z-0" />}
                        <div className="w-16 h-16 rounded-full border-4 border-purple-600 text-2xl text-[#fdff00] font-bold flex items-center justify-center bg-[#0f0f0f] z-10">{num}</div>
                        {num !== features.length && <div className="absolute top-1/2 bottom-0 w-1 bg-white z-0" />}
                      </div>
                      <div className="flex justify-start">
                        <img src={feature.image} alt="Feature" className="w-60 h-[200px] object-cover" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Better Marquee Section */}
{/* Enhanced Marquee Section */}
<section className="mt-20">
  <div className="flex flex-col gap-16">

    {/* Marquee 1 */}
    <div className="relative h-[140px] overflow-hidden whitespace-nowrap">
      <div className="absolute w-max flex animate-marquee gap-32">
        {[1, 2].map((i) => (
          <h1 key={i} className="text-[6vw] flex gap-12 items-center">
            <span className={`${orbitron.className} font-bold italic uppercase text-white`}>Innovate</span>
            <span className={`${rubik.className} uppercase`} style={{ WebkitTextStroke: "1.5px #ffffff", color: "transparent" }}>Ideate</span>
            <span className={`${audiowide.className} uppercase `}>Collaborate</span>
            <span className={`${script.className} italic text-white`}>Inspire</span>
            <span className={`${pixel.className} text-white uppercase`}>Build</span>
          </h1>
        ))}
      </div>
    </div>

    {/* Marquee 2 */}
    <div className="relative h-[140px] overflow-hidden whitespace-nowrap">
      <div className="absolute w-max flex animate-marquee-reverse gap-32">
        {[1, 2].map((i) => (
          <h1 key={i} className="text-[6vw] flex gap-12 items-center">
            <span className={`${rubik.className}`} style={{ WebkitTextStroke: "1.5px #fff", color: "transparent" }}>Sketch</span>
            <span className={`${audiowide.className} font-bold uppercase `}>Create</span>
            <span className={`${script.className} italic text-white`}>Design</span>
            <span className={`${orbitron.className} uppercase text-white`}>Animate</span>
            <span className={`${pixel.className} uppercase text-white`}>Ship</span>
          </h1>
        ))}
      </div>
    </div>

    {/* Marquee 3 */}
    <div className="relative h-[140px] overflow-hidden whitespace-nowrap">
      <div className="absolute w-max flex animate-marquee gap-32">
        {[1, 2].map((i) => (
          <h1 key={i} className="text-[6vw] flex gap-12 items-center">
            <span className={`${audiowide.className} uppercase text-white`}>Code</span>
            <span className={`${rubik.className}`} style={{ WebkitTextStroke: "1.5px #fff", color: "transparent" }}>Prototype</span>
            <span className={`${orbitron.className} uppercase font-bold `}>Repeat</span>
            <span className={`${script.className} italic text-white`}>Refine</span>
            <span className={`${pixel.className} text-white uppercase`}>Deliver</span>
          </h1>
        ))}
      </div>
    </div>

    {/* Marquee 4 */}
    <div className="relative h-[140px] overflow-hidden whitespace-nowrap">
      <div className="absolute w-max flex animate-marquee-reverse gap-32">
        {[1, 2].map((i) => (
          <h1 key={i} className="text-[6vw] flex gap-12 items-center">
            <span className={`${rubik.className}`} style={{ WebkitTextStroke: "1.5px #fff", color: "transparent" }}>Curate</span>
            <span className={`${audiowide.className} uppercase `}>Instruct</span>
            <span className={`${orbitron.className} uppercase font-bold italic text-white`}>Strategize</span>
            <span className={`${script.className} text-white italic`}>Compose</span>
            <span className={`${pixel.className} uppercase text-white`}>Structure</span>
          </h1>
        ))}
      </div>
    </div>

  </div>
</section>


    </div>
  );
}
