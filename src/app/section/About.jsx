import { useRef } from "react";
import { Globe } from "../minicomponents/Globe";

const About = () => {
  const grid2Container = useRef();
  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">About Us</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div className="relative flex items-end grid-default-color grid-1 overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-2xl cursor-pointer group p-6 sm:p-8">
          <video
            src="assets/DesignEx_Ad_Video_Generation.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 ease-in-out group-hover:from-black/90 group-hover:via-black/50"></div>

          <div className="relative z-20 w-full text-white pb-4 md:pb-0">
            <p
              className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-2 text-shadow-md transform transition-transform duration-300 ease-out group-hover:translate-y-[-4px]"
              style={{
                textShadow: "0 3px 8px rgba(0, 0, 0, 0.7)",
              }}
            >
              Unleash Your Creative Power with DesignEx
            </p>
            <p className="font-sans text-base sm:text-lg md:text-xl font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300 ease-out group-hover:translate-y-[-2px] delay-100">
              Your all-in-one design platform built for students, clubs, and
              creators. Design, collaborate, and bring campus ideas to
              life—effortlessly.
            </p>
          </div>
        </div>
        {/* Grid 2 */}
        <div
          className="relative flex items-center justify-center grid-default-color grid-2 overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-2xl cursor-pointer group"
          style={{
            backgroundImage: 'url("/grid2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            willChange: "transform, box-shadow",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-blue-700/20 to-purple-800/40 backdrop-blur-[0.5px] transition-all duration-500 ease-in-out group-hover:from-indigo-900/50 group-hover:via-blue-800/25 group-hover:to-purple-900/50 group-hover:backdrop-blur-[1px]"></div>

          <div
            ref={grid2Container}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 text-center text-white"
          >
            <p
              className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-shadow-md transform transition-transform duration-300 ease-out group-hover:scale-102"
              style={{
                textShadow:
                  "0 4px 10px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 0, 0, 0.3)",
              }}
            >
              DESIGN DRIVES IMPACT
            </p>

            <span className="mt-4 text-base sm:text-lg md:text-xl font-light italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out delay-150"></span>
          </div>
        </div>
        {/* Grid 3 */}
        <div
          className="relative flex items-center justify-start grid-black-color grid-3 overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-2xl cursor-pointer group p-6 sm:p-8"
          style={{
            background: "linear-gradient(135deg, #1A1A1A 0%, #000000 100%)",
            willChange: "transform, box-shadow",
          }}
        >
          <div
            className="absolute inset-0 z-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E\")",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 flex flex-col justify-end h-full w-[calc(100%-8rem)] md:w-[60%] text-left text-white">
            <p
              className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-2 text-shadow-md transform transition-transform duration-300 ease-out group-hover:translate-x-1"
              style={{
                textShadow: "0 2px 5px rgba(0, 0, 0, 0.4)",
              }}
            >
              DesignEx Around the World
            </p>

            <p className="font-sans text-base sm:text-lg md:text-xl font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300 ease-out group-hover:translate-x-1">
              Empowering creators everywhere—no matter the time zone
            </p>
          </div>

          <figure className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 z-10 opacity-80 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-6">
            <Globe />
          </figure>
        </div>
        {/* Grid 4 */}
        <div className="relative flex items-center justify-center grid-special-color grid-4 overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-2xl cursor-pointer group p-6 sm:p-8">
          <div
            className="absolute inset-0 rounded-2xl z-30 pointer-events-none"
            style={{
              boxShadow:
                "inset 0 0 5px rgba(255, 215, 0, 0.2), 0 0 0px 2px transparent",
            }}
          ></div>

          <img
            src="/grid4.jpg"
            alt="Background visual for collaboration"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent backdrop-blur-[0.5px] transition-all duration-500 ease-in-out group-hover:from-black/80 group-hover:backdrop-blur-[1px]"></div>

          <div className="relative z-20 flex flex-col items-center justify-end w-full h-full text-center text-white pb-6 sm:pb-8 md:pb-10 lg:pb-12">
            <p
              // Changed font-serif back to font-sans (or a custom font if configured)
              // Increased font weight to extra-bold for more impact
              // Removed 'italic' for a cleaner, modern look
              className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug tracking-wide text-shadow-lg transform transition-transform duration-300 ease-out group-hover:scale-105"
              style={{
                textShadow: "0 3px 8px rgba(0, 0, 0, 0.7)",
              }}
            >
              Start Building
            </p>
          </div>

          <div
            className="absolute inset-0 rounded-2xl z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow:
                "0 0 0px 2px #FFD700, 0 0 15px 5px rgba(255, 215, 0, 0.4)",
            }}
          ></div>
        </div>
        {/* Grid 5 */}
        <div className="relative flex items-end grid-default-color grid-5 overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-2xl cursor-pointer group p-6 sm:p-8">
          {/* Video Background */}
          <video
            src="assets/video2.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 ease-in-out group-hover:from-black/90 group-hover:via-black/50"></div>

          <div className="relative z-20 w-[90%] md:w-[70%] text-white pb-4">
            <p
              className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-2 text-shadow-md transform transition-transform duration-300 ease-out group-hover:translate-y-[-4px]"
              style={{
                textShadow: "0 3px 8px rgba(0, 0, 0, 0.7)",
              }}
            >
              Print & Ship Nearby
            </p>

            <p className="font-sans text-base sm:text-lg md:text-xl font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300 ease-out group-hover:translate-y-[-2px] delay-100">
              Find local shops. Print your designs faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
