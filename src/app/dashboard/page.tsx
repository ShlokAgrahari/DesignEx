"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  Paintbrush,
  Handshake,
  Users,
  PrinterCheck,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar/Navbar";
import { createRoom } from "@/actions/rooms";
import RoomsView from "@/components/dashboard/RoomsView";
import JoinForm from "@/components/Navbar/JoinForm";
import { color } from "html2canvas/dist/types/css/types/color";

export default function Dashboard() {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const setOwnedRooms = useAuthStore((state) => state.setOwnedRooms);
  const setRoomInvites = useAuthStore((state) => state.setRoomInvites);
  const ownedRooms = useAuthStore((state) => state.ownedRooms);
  const roomInvites = useAuthStore((state) => state.roomInvites);

  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [joinForm, setJoin] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      image: "/carousel1.jpg",
      text: "Design posters with next-gen tools",
    },
    {
      image: "/carousel2.jpg",
      text: "Collaborate live from anywhere",
    },
    {
      image: "/carousel3.png",
      text: "Craft standout logos for your team",
    },
  ];

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id ?? "",
        name: session.user.name ?? "Guest",
        email: session.user.email ?? "",
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
        console.error("Location error:", error);
      }
    );
  }, [session]);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setOwnedRooms(data.ownedRooms);
      setRoomInvites(data.sharedRooms);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchRooms();
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamName || !projectName) return alert("Please fill all fields");

    try {
      const res = await axios.post("/api/createTeam", {
        teamName,
        projectName,
        user,
      });
      setShowForm(false);
      setTeamName("");
      setProjectName("");
      fetchRooms();
      router.push(res.data.redirectUrl);
    } catch (error) {
      console.error("Create Team Error:", error);
    }
  };

  const handleNearbyPrintShops = () => {
    if (!userLocation) return alert("Location not available.");
    const { lat, lng } = userLocation;
    window.open(
      `https://www.google.com/maps/search/printing+shops/@${lat},${lng},15z`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#101010] text-white font-[Poppins]">
      <Navbar />
      <main className="px-4 sm:px-10 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 text-transparent bg-clip-text mb-2">
            DesignEx: Your Creative Powerhouse
          </h1>
          <p className="text-zinc-300 text-lg sm:text-xl">
            Collaborate, Create, and Deliver with Ease
          </p>
        </section>

        <div className="relative overflow-hidden rounded-3xl h-56 sm:h-64 mb-14 shadow-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div
                key={i}
                className="min-w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-4 left-6 text-white text-lg sm:text-3xl md:text-4xl font-semibold z-10">
                  {s.text}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex justify-between items-center px-4 z-10 text-white text-2xl">
            <button
              onClick={() =>
                setCurrent((current - 1 + slides.length) % slides.length)
              }
            >
              <ChevronLeft />
            </button>
            <button onClick={() => setCurrent((current + 1) % slides.length)}>
              <ChevronRight />
            </button>
          </div>
        </div>

        <section className="bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 backdrop-blur-lg rounded-3xl px-6 py-10 shadow-2xl mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Design Workspace",
                desc: "Create stunning graphics with our advanced design tools.",
                icon: <Paintbrush size={42} className="text-orange-400" />,
                color: "from-orange-500 to-orange-400",
                action: () => createRoom(),
                button: "Launch Editor",
              },
              {
                title: "Team Builder",
                desc: "Easily form and manage your creative teams.",
                icon: <Users size={42} className="text-purple-400" />,
                color: "from-purple-500 to-purple-400",
                action: () => setShowForm(true),
                button: "Create Team",
              },
              {
                title: "Join Collaborations",
                desc: "Join teams to work on shared creative projects.",
                icon: <Handshake size={42} className="text-pink-400" />,
                color: "from-pink-500 to-pink-400",
                action: () => setJoin(true),
                button: "Join Team",
              },
              {
                title: "Print & Ship Nearby",
                desc: "Find local print shops for your final delivery.",
                icon: <PrinterCheck size={42} className="text-green-400" />,
                color: "from-green-500 to-green-400",
                action: handleNearbyPrintShops,
                button: "Locate Shops",
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/70 hover:bg-zinc-800/70 transition-all duration-300 border border-white/10 p-6 rounded-2xl text-white shadow-xl hover:shadow-md flex flex-col justify-between h-full"
              >
                <div>
                  {card.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/80">{card.desc}</p>
                </div>
                <button
                  onClick={card.action}
                  className={`mt-6 bg-gradient-to-r ${card.color} text-white font-bold py-2 rounded-full hover:opacity-90 transition`}
                >
                  {card.button}
                </button>
              </div>
            ))}
          </div>
        </section>

        <RoomsView ownedRooms={ownedRooms} roomInvites={roomInvites} />

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
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
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {joinForm && <JoinForm setJoin={setJoin} />}
      </main>
    </div>
  );
}
