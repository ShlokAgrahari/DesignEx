"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

export default function SignupPage() {
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session Data:", session, "Status:", status);
  }, [session, status]);

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(!(user.username && user.email && user.password));
  }, [user]);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signup", user);
      router.replace(`/verify/${user.email}`);
      console.log("Signup success", response.data);
      toast.success("Signup successful! Redirecting to login...");
    } catch (error: any) {
      console.log("Sign up error", error.message);
      if (error.response?.data?.error === "User already exists") {
        toast.error("User already exists! Please log in.");
      } else {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen w-full bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(/signupbg.webp)` }}
    >
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

      <div className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg p-8 sm:p-12 rounded-xl w-full max-w-md md:max-w-lg lg:max-w-xl flex flex-col justify-center">
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
            className="w-full p-3 bg-white/20 border border-white/30 rounded dark:text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white "
          />

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded dark:text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded dark:text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="w-full bg-gray-900 text-white p-4 rounded-2xl font-bold hover:bg-gray-700 transition-all duration-300 text-xl font-sans backdrop-blur-3xl hover:shadow-xl"
            disabled={buttonDisabled}
          >
            Sign Up
          </button>
        </form>

        <div className="social-signup w-full flex flex-wrap items-center justify-center gap-4 mt-6">
          <p className="text-gray-900 font-semibold text-lg drop-shadow-lg">
            Or Signup via
          </p>
          <button
            onClick={() => signIn("google")}
            className="group flex items-center justify-center p-3 rounded-xl hover:bg-gray-900/10 transition-all duration-300 backdrop-blur-3xl shadow-lg"
          >
            <img
              src="googlelogo.webp"
              alt="Google Logo"
              className="w-12 h-12"
            />
          </button>
          <button
            onClick={() => signIn("github")}
            className="group flex items-center justify-center p-3 rounded-xl hover:bg-gray-900/10 transition-all duration-300 backdrop-blur-3xl shadow-lg"
          >
            <img src="Glogo.png" alt="Github Logo" className="w-12 h-12" />
          </button>
        </div>

        <div className="mt-6 text-center text-md text-gray-900 font-semibold drop-shadow-lg">
          Already have an account?
          <Link
            href="/login"
            className="text-gray-900 ml-1 font-bold hover:underline text-xl font-sans hover:text-gray-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
