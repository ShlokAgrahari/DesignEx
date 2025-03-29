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

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center px-4"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1729433321403-69cf73e9720a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
      }}
    >
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

          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
            minLength={8}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-secondary transition"
            disabled={buttonDisabled}
          >
            {buttonDisabled ? "Enter all details" : "Sign Up"}
          </button>
        </form>

        <div className="social-signup w-full flex flex-wrap items-center justify-center gap-2 mt-4">
          <p className="text-white">Or Signup via</p>

          <button
            onClick={() => signIn("google")}
            className="group flex items-center justify-center p-3 rounded-lg hover:bg-white/20 transition"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="text-indigo-500 group-hover:text-secondary transition duration-300"
              style={{ fontSize: "1.8rem" }}
            />
          </button>

          <button
            onClick={() => signIn("github")}
            className="group flex items-center justify-center p-3 rounded-lg hover:bg-white/20 transition"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="text-indigo-500 group-hover:text-secondary transition duration-300"
              style={{ fontSize: "1.8rem" }}
            />
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-glassDark">
          Already have an account?
          <Link
            href="/login"
            className="text-secondary text-[2.2vh]  ml-1 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
