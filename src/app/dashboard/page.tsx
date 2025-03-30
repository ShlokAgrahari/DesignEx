"use client"

import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
export default function Dashboard() {
  
  const user = useAuthStore((state) => state.user);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      console.log("Logged-in user:", session.user);
      console.log("User ID:","No ID available");
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.name && session?.user?.email) {
      useAuthStore.getState().setUser({
        id:  "",
        name: session.user.name || "Guest",
        email: session.user.email || "No Email",
      });
    }
  }, [session]); 
  
  

  
  return (
    <div className="flex h-screen w-screen font-[Poppins]">
      {/* Sidebar */}
      <div className="bg-purple-200 h-full w-[15%] p-4 flex flex-col items-center shadow-lg">
        <div className="bg-purple-500 h-[6vh] w-[6vh] flex items-center justify-center text-white font-bold rounded-lg mb-6">
          Logo
        </div>
        <nav className="flex flex-col gap-4 w-full">
          {["Home", "Templates", "My Designs", "My Teams", "Apps"].map((item) => (
            <button
              key={item}
              className="bg-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-300 transition-all duration-300"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-purple-100 h-full w-[85%] flex flex-col px-[2vw] py-[1vw] items-center text-gray-900 text-2xl font-bold">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-purple-300 to-purple-400 h-[20vh] w-full flex items-center justify-between px-6 shadow-lg rounded-xl">
  <input
    type="text"
    placeholder="Search..."
    className="px-3 py-[6px] w-[40%] text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm transition-all"
  />
  <div className="flex gap-4">
    
    <button className="bg-white h-[4vh] text-purple-700 text-sm font-medium px-4 py-[4px] rounded-md shadow-md hover:bg-purple-500 hover:text-white transition-all duration-300">
      Settings
    </button>
    <button className="bg-white h-[4vh] text-purple-700 text-sm font-medium px-4 py-[4px] rounded-md shadow-md hover:bg-purple-500 hover:text-white transition-all duration-300">
      Profile
    </button>
  </div>
</div>




        {/* Content Section */}
        <div className="bg-white h-[90vh] p-[1vw] w-full mt-2 rounded-lg shadow-lg">
          <div className="bg-purple-400 h-[30vh] flex items-center justify-center text-white text-2xl font-semibold rounded-lg shadow-md">
            Carousel
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            {["Create a Design", "Create a Team", "Join a Team"].map((btnText, idx) => (
              <button
                key={idx}
                className="bg-gradient-to-r from-pink-300 to-purple-400 text-white border-none rounded-2xl h-[10vh] px-6 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
              >
                {btnText}
              </button>
            ))}
          </div>

          {/* Recent Work */}
          <h1 className="mt-6 text-gray-800 text-xl font-semibold">Recent Work</h1>
          <div className="min-w-full min-h-[30vh] bg-purple-200 p-4 rounded-lg shadow-md mt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="h-[20vh] bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://via.placeholder.com/150?text=Image+${num}`}
                      alt={`Thumbnail ${num}`}
                      className="h-full w-full object-cover rounded-md hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">Title {num}</h3>
                  <p className="text-sm text-gray-600">Edited: {num === 1 ? "2 hours ago" : num === 2 ? "5 hours ago" : num === 3 ? "Yesterday" : "3 days ago"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
