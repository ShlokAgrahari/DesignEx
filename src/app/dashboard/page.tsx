"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: session } = useSession();

  console.log("user ",user);
  const[joinForm,setJoin]=useState(false);
  const[teamId,setTeamId]=useState("")

  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (session?.user?.name && session?.user?.email) {
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

  const handleFormSubmit = async (e: React.FormEvent) => {
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
      {/* Sidebar */}
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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-hide">
        {/* Top Bar */}
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

        {/* Carousel */}
        <div className="h-[30vh] w-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-6">
          DesignEx Carousel
        </div>

        {/* Action Buttons */}
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

        {/* Join Form Modal */}
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
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Create a Team
              </h2>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Recent Work */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Recent Work
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-[20vh] bg-gray-200 rounded-md overflow-hidden flex justify-center items-center">
                <img
                  src={`https://via.placeholder.com/150?text=Image+${num}`}
                  alt={`Thumbnail ${num}`}
                  className="h-full w-full object-cover hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-800">
                Title {num}
              </h3>
              <p className="text-sm text-gray-500">
                Edited:{" "}
                {
                  ["2 hours ago", "5 hours ago", "Yesterday", "3 days ago"][
                    num - 1
                  ]
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
