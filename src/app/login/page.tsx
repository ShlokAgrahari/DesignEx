"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function SignIn() {
  const router = useRouter();
  const [user, setUser] = React.useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  const onSignIn = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signin", user);
      console.log("Sign-in success", response.data);
      toast.success("Signed in successfully!");
      router.push("/");
    } catch (error: any) {
      console.log("Sign-in error", error.message);
      toast.error("Invalid credentials. Try again.");
    }
  };

  return (
    <div
      className="flex min-h-screen w-full bg-cover bg-center p-6 sm:p-12 items-center justify-center"
      style={{ backgroundImage: "url('/loginbgc.jpg')" }}
    >
      <div className="bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        <div className="relative w-full md:w-1/2 h-96 md:h-auto">
          <Image
            src="/designImage.jpg"
            alt="DesignEx Work Showcase"
            fill
            className="object-cover"
          />
        </div>

        <div className="p-8 sm:p-12 w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl text-center font-extrabold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Welcome to DesignEx
          </h2>
          <form onSubmit={onSignIn} className="flex flex-col gap-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold transition-all duration-300 hover:bg-indigo-600 ${
                buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={buttonDisabled}
            >
              {buttonDisabled ? "Enter all details" : "Sign In"}
            </button>
          </form>
          <div className="flex items-center justify-center mt-6">
            <div className="w-full h-px bg-gray-300"></div>
            <p className="mx-4 text-gray-500 text-sm">OR</p>
            <div className="w-full h-px bg-gray-300"></div>
          </div>
          <button
            onClick={() => signIn("google")}
            className="mt-4 flex items-center justify-center gap-3 bg-gray-100 text-gray-800 p-3 rounded-lg w-full hover:bg-gray-200 transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="googleGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="50%" stopColor="#EA4335" />
                  <stop offset="75%" stopColor="#FBBC05" />
                  <stop offset="100%" stopColor="#34A853" />
                </linearGradient>
              </defs>
              <path
                fill="url(#googleGradient)"
                d="M24 19.6v8.8h12.5c-1.2 3.6-4.6 6.1-8.5 6.1-5.2 0-9.5-4.2-9.5-9.5S18.8 15.5 24 15.5c2.3 0 4.3.8 5.9 2.1l6.6-6.6c-3.2-2.9-7.3-4.7-12.5-4.7-10.5 0-19 8.5-19 19s8.5 19 19 19c9.3 0 17.3-6.6 18.8-15.5H24z"
              />
            </svg>
            Continue with Google
          </button>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?
            <Link
              href="/signup"
              className="text-indigo-500 ml-1 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
