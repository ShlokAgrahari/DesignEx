
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css'


export default function SignUp() {
  
  
  const router = useRouter();
  const session = useSession();
  console.log(session);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  useEffect(() => {
    setButtonDisabled(!(user.username && user.email && user.password));
  }, [user]);

  const onSignup = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signup", user);
      router.replace(`/verify/${user.email}`);
      console.log("Signup success", response.data);
      toast.success("Signup successful! Redirecting to login..."); // Delay for user feedback
    } catch (error: any) {
      console.log("Sign up error", error.message);
      if (error.response?.data?.error === "User already exists") {
        toast.error("User already exists! Please log in.");
      } else {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    }
  };


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

      <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss={false}
draggable
pauseOnHover={false}
theme="colored"
transition={Zoom}
/>
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg p-8 sm:p-12 rounded-xl w-full max-w-md md:max-w-lg lg:max-w-xl flex flex-col justify-center">
        <h2 className="text-2xl text-center text-primary font-semibold mb-6">
          Sign Up
        </h2>

        <form onSubmit={onSignup} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Username"
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
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
