"use client";

export default function Home() {
  return (
    <div className="font-display bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-4 px-8 z-50 bg-white/10 backdrop-blur-xl shadow-lg border-b border-gray-300/50 rounded-b-2xl transition-all duration-300 hover:shadow-2xl hover:bg-white/20">
        <div className="flex items-center space-x-4">
          <img
            src="logo.png"
            alt="logo"
            className="h-14 w-14 rounded-full border-2 border-black shadow-lg hover:scale-110 transition-transform duration-300"
          />
          <span className="text-3xl font-extrabold uppercase tracking-widest text-black drop-shadow-md">
            DESIGNEX
          </span>
        </div>
        <div className="space-x-8 flex items-center text-lg font-semibold">
          <a
            href="#about"
            className="relative text-black hover:text-gray-700 transition duration-300 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-1 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            About Us
          </a>
          <a
            href="#solutions"
            className="relative text-black hover:text-gray-700 transition duration-300 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-1 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Solutions
          </a>
          <a
            href="/login"
            className="text-black font-semibold hover:text-gray-700 transition-colors duration-300"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-6 py-2 rounded-full bg-black text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-xl hover:bg-gray-700"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-gray-900/40 blur-3xl opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-black">
            DESIGNEX
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Your Ultimate Creative Studio — Design posters, banners,
            presentations & more with ease.
          </p>
          <div className="mt-6 space-x-4">
            <a
              href="#explore"
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
            >
              Explore Now
            </a>
            <a
              href="#features"
              className="px-8 py-3 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 text-center">
        <h2 className="text-4xl font-bold mb-6 text-black">Why DESIGNEX?</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          DESIGNEX is a powerful yet simple creative platform tailored for
          students, clubs, creators, and professionals who need fast, beautiful
          designs without any design experience.
        </p>
      </section>

      {/* Solutions Section - Glass Cards Grid */}
      <section id="solutions" className="py-16 bg-gray-200 dark:bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12 text-black">
          What You Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <div className="glass p-6 rounded-xl hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-3">🎨 Drag & Drop Editor</h3>
            <p>Create anything visually — no coding or design skills needed.</p>
          </div>
          <div className="glass p-6 rounded-xl hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-3">📂 100+ Templates</h3>
            <p>
              Choose from ready-made designs tailored for colleges, clubs, and
              festivals.
            </p>
          </div>
          <div className="glass p-6 rounded-xl hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-3">🔗 Share & Collaborate</h3>
            <p>
              Instantly share your designs with your team for feedback &
              approval.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="explore" className="py-16 text-center">
        <h2 className="text-4xl font-bold text-black">
          Ready to Create Stunning Designs?
        </h2>
        <p className="mt-3 max-w-2xl mx-auto">
          Start your creative journey today and make your campus events shine
          like never before!
        </p>
        <a
          href="#"
          className="mt-6 inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
        >
          Start Designing
        </a>
      </section>
    </div>
  );
}
