"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FaEnvelope, FaLock } from "react-icons/fa";


export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  

  useEffect(() => {
    setButtonDisabled(!(formData.email && formData.password));
  }, [formData]);

  const onSignIn = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", formData);
      console.log("Sign-in success", response.data);
      const { user, token } = response.data;
      toast.success("Signed in successfully!");
      useAuthStore.getState().setUser({ name: user.name, email: user.email,id:user.id });
      router.push("/dashboard");
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
            <img src="googlelogo.webp" alt="Google Logo" className="w-9 h-9" />
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
