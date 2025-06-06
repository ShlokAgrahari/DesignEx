"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();

  const user = useAuthStore((state) => state.user);
  const [joinForm, setJoin] = useState(false);
  const [teamId, setTeamId] = useState("");


  console.log("user ",user);
 
  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      useAuthStore.getState().setUser({
        id: "",
        name: session.user.name || "Guest",
        email: session.user.email || "No Email",
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast.error("Logout failed.");
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamName || !projectName) return alert("Please fill all fields");

    try {
      await axios.post("/api/createTeam", { teamName, projectName, user });
      setShowForm(false);
      setTeamName("");
      setProjectName("");
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamId) return alert("Please provide team ID");

    try {
      const res = await axios.post("/api/joinTeam", { teamId, user });
      console.log("Joined team", res.data);
      setTeamId("");
      setJoin(false);
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert(error.response.data.message);
        setTeamId("");
        return;
      }
      console.log("Join error", error);
    }
  };

  const handleNearbyPrintShops = () => {
    if (!userLocation) {
      alert("Location not available. Please allow location access.");
      return;
    }
    const { lat, lng } = userLocation;
    const mapsUrl = `https://www.google.com/maps/search/printing+shops/@${lat},${lng},15z`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="flex h-screen w-screen font-[Poppins] bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
      <div className="bg-white h-full w-[15%] p-5 flex flex-col items-center shadow-xl border-r border-gray-300">
        <div className="relative w-full flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="DesignEx Logo"
            className="w-20 h-20 rounded-full shadow-2xl border-4 border-black hover:scale-110 transition-transform duration-300"
          />
        </div>
        <nav className="flex flex-col gap-4 w-full">
          {["Home", "Templates", "My Designs", "My Teams", "Apps"].map(
            (item) => (
              <button
                key={item}
                className="bg-gradient-to-r from-purple-300 to-pink-300 text-white py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-all duration-300"
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-all duration-300 mt-4"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-hide">
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-4 flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 w-[40%] rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
          />
          <div className="flex gap-4">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
              Settings
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
              Profile
            </button>
          </div>
        </div>

        <div className="h-[30vh] w-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-6">
          DesignEx Carousel
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:scale-105 transition-transform">
            Create a Design
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            Create a Team
          </button>
          <button
            onClick={() => setJoin(true)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            Join a Team
          </button>
          <button
            onClick={handleNearbyPrintShops}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            Nearby Printing Shop
          </button>
        </div>

        {joinForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Join a Team
              </h2>
              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Team ID"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setJoin(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
