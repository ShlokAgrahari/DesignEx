"use client";

export default function Home() {
  return (
    <div className="font-display bg-gradient-to-br from-gray-100 to-gray-300 dark:from-darkBg dark:to-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="glass fixed top-0 left-0 w-full flex justify-between items-center py-4 px-6 z-50 bg-white/30 backdrop-blur-lg shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-xl font-bold uppercase tracking-widest">
            DESIGNEX
          </span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#about" className="hover:text-primary transition">
            About Us
          </a>
          <a href="#solutions" className="hover:text-primary transition">
            Solutions
          </a>
        </div>
        <div className="space-x-3">
          <a href="/login" className="text-primary font-semibold">
            Login
          </a>
          <a
            href="/signup"
            className="px-5 py-2 rounded-full bg-primary text-white hover:bg-secondary transition"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            DESIGNEX
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Your Ultimate Creative Studio — Design posters, banners,
            presentations & more with ease.
          </p>
          <div className="mt-6 space-x-4">
            <a
              href="#explore"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Explore Now
            </a>
            <a
              href="#features"
              className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">Why DESIGNEX?</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          DESIGNEX is a powerful yet simple creative platform tailored for
          students, clubs, creators, and professionals who need fast, beautiful
          designs without any design experience.
        </p>
      </section>

      {/* Solutions Section - Glass Cards Grid */}
      <section id="solutions" className="py-16 bg-gray-200 dark:bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">
          What You Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">🎨 Drag & Drop Editor</h3>
            <p>Create anything visually — no coding or design skills needed.</p>
          </div>
          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">📂 100+ Templates</h3>
            <p>
              Choose from ready-made designs tailored for colleges, clubs, and
              festivals.
            </p>
          </div>
          <div className="glass p-6 rounded-xl">
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
        <h2 className="text-4xl font-bold">
          Ready to Create Stunning Designs?
        </h2>
        <p className="mt-3 max-w-2xl mx-auto">
          Start your creative journey today and make your campus events shine
          like never before!
        </p>
        <a
          href="#"
          className="mt-6 inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
        >
          Start Designing
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-200 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          © 2025 DESIGNEX - All rights reserved
        </p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
