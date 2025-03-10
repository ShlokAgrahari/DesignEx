"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
export default function SignUp() {
const router=useRouter();


  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: ""
  });

  const [buttonDisabled,setButtonDisabled]=React.useState(false);
  useEffect(()=>{
    if(user.username.length>0 && user.email.length>0 && user.password.length>0 ){
        setButtonDisabled(false)
    }else{
        setButtonDisabled(true)
    }
  },[user])


  const onSignup = async (e:any) => {
    e.preventDefault();
    try {
        const response=await axios.post("/api/users/signup",user);
        console.log("Signup success",response.data)
        router.push("/");
    } catch (error:any) {
        console.log("Sign up error",error.message);
        toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1503455637927-730bce8583c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`
      }}
    >
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg p-12 rounded-xl w-[40vw] h-[60vh] flex flex-col justify-center">
        <h2 className="text-2xl text-center text-primary font-semibold mb-6">Sign Up</h2>

        <form onSubmit={onSignup} className="flex flex-col gap-6">
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={(e)=>setUser({...user,username:e.target.value})}
            placeholder="Username"
            className="w-full p-3 bg-white/20 border border-white/30 rounded text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={(e)=>setUser({...user,email:e.target.value})}
            placeholder="Email"
            className="w-full p-3 bg-white/20 border border-white/30 rounded text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e)=>setUser({...user,password:e.target.value})}
            placeholder="Password"
            className="w-full p-3 bg-white/20 border border-white/30 rounded text-glassDark placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-secondary transition"
          >
            {buttonDisabled?"Enter all details":"SignUp"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-glassDark">
          Already have an account?
          <Link href="/login" className="text-secondary ml-1 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
