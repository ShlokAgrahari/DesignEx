import React from "react";

export default function SignupPage() {
  return (
    <div
      className="relative flex justify-center items-center min-h-screen w-full bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage: `url(/signupbg.webp)`,
      }}
    >
      {/* Logo in top left corner */}
      <img
        src="/logo.png"
        alt="DesignEx Logo"
        className="absolute top-6 left-6 w-16 h-16 rounded-full shadow-lg border-2 border-black"
      />

      <div className="flex justify-center items-center w-full max-w-lg">
        {/* Signup Card with Enhanced Glassmorphism */}
        <div className="backdrop-blur-3xl bg-white/5 shadow-2xl border border-black/10 p-12 sm:p-14 rounded-3xl w-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-5xl text-center font-extrabold text-gray-900 mb-6 font-sans drop-shadow-lg tracking-wide">
            Sign Up
          </h2>
          <form className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 bg-white/10 border border-black/20 rounded-xl text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 font-medium text-lg backdrop-blur-2xl transition-all duration-300 hover:bg-white/20"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 bg-white/10 border border-black/20 rounded-xl text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 font-medium text-lg backdrop-blur-2xl transition-all duration-300 hover:bg-white/20"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-white/10 border border-black/20 rounded-xl text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 font-medium text-lg backdrop-blur-2xl transition-all duration-300 hover:bg-white/20"
            />
            <button className="w-full bg-gray-900 text-white p-4 rounded-2xl font-bold hover:bg-gray-700 transition-all duration-300 text-xl font-sans backdrop-blur-3xl hover:shadow-xl">
              Sign Up
            </button>
          </form>
          <div className="social-signup w-full flex flex-wrap items-center justify-center gap-4 mt-6">
            <p className="text-gray-900 font-semibold text-lg drop-shadow-lg">
              Or Signup via
            </p>
            <button className="group flex items-center justify-center p-3 rounded-xl hover:bg-gray-900/10 transition-all duration-300 backdrop-blur-3xl shadow-lg">
              <img
                src="googlelogo.webp"
                alt="Google Logo"
                className="w-12 h-12"
              />
            </button>
            <button className="group flex items-center justify-center p-3 rounded-xl hover:bg-gray-900/10 transition-all duration-300 backdrop-blur-3xl shadow-lg">
              <img src="Glogo.png" alt="Github Logo" className="w-12 h-12" />
            </button>
          </div>
          <div className="mt-6 text-center text-md text-gray-900 font-semibold drop-shadow-lg">
            Already have an account?
            <a
              href="/login"
              className="text-gray-900 ml-1 font-bold hover:underline text-xl font-sans hover:text-gray-700"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
