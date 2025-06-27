"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Paintbrush  ,  Handshake,Users, PrinterCheck} from 'lucide-react';
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Navbar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

import { createRoom } from "@/actions/rooms";
import RoomsView from "@/components/dashboard/RoomsView";
import { getUserRooms } from "@/lib/getRooms";
import JoinForm from "@/components/Navbar/JoinForm";

export default function Dashboard() {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  const user = useAuthStore((state) => state.user);
  const setOwnedRooms = useAuthStore((state) => state.setOwnedRooms);
  const setRoomInvites = useAuthStore((state) => state.setRoomInvites);
  const ownedRooms = useAuthStore((state) => state.ownedRooms);
  const roomInvites = useAuthStore((state) => state.roomInvites);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      setOwnedRooms(data.ownedRooms);
      setRoomInvites(data.sharedRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchRooms();
    }
  }, [user?.id]);

  const [joinForm, setJoin] = useState(false);
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
      const updatedUser = {
        id: session.user.id ?? "",
        name: session.user.name ?? "Guest",
        email: session.user.email ?? "",
      };
      setUser(updatedUser);
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

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamName || !projectName) return alert("Please fill all fields");

    try {
      const res = await axios.post("/api/createTeam", {
        teamName,
        projectName,
        user,
      });
      const { redirectUrl } = res.data;
      setShowForm(false);
      setTeamName("");
      setProjectName("");
      fetchRooms();
      router.push(redirectUrl);
    } catch (error: any) {
      console.error(error);
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

  const [current, setCurrent] = useState(0);
  const slides = [
    {
      image: "/carousel1.jpg",
      text: "Create eye-catching posters with powerful tools",
    },
    {
      image: "/carousel2.jpg",
      text: "Design together, no matter where you are",
    },
    {
      image: "/carousel3.png",
      text: "Craft unique, professional logos effortlessly",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex w-screen font-[Poppins] bg-black overflow-hidden px-2 sm:px-8">
     

      <div
        className={`flex-1 flex flex-col p-2 sm:p-6  scrollbar-hide overflow-auto }`}
      >
        <Navbar />
        <div className="flex flex-col items-center justify-center mb-8 py-4 mt-5 px-3">
          <h1 className="text-purple-500 text-4xl font-bold">Let's start designing with DesignEx</h1>
          <h2 className="text-orange-800 text-xl font-semibold">logos or postors or many things with your team</h2>
        </div>

        <div className="h-[200px] w-full rounded-sm relative items-center justify-center mb-6 overflow-hidden">
          <div
            className={`flex transition ease-out duration-300 h-full`}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((s, index) => (
              <div
                key={index}
                className="h-full w-full bg-center bg-cover bg-no-repeat min-w-full relative bg-black/50"
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="absolute inset-0 bg-black/50 z-0" />
                <div className="absolute bottom-4 left-4 text-white px-4 py-2 rounded-sm max-w-[70%] md:max-w-[50%]">
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">
                    {s.text}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 h-full w-full justify-between flex text-white px-2 sm:px-5 text-xl items-center">
            <button onClick={prevSlide}>
              <ChevronLeft />
            </button>
            <button onClick={nextSlide}>
              <ChevronRight />
            </button>
          </div>
        </div>

       

        <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-950 rounded-md justify-between">
          <div className="border flex-1 flex-col border-orange-400 rounded-md p-3 bg-black hover:scale-105 transition-transform min-w-[200px] ">
            <Paintbrush stroke="currentColor" size={44} className=" text-orange-400"/>
            <h3 className="text-orange-400 text-xl mb-2 mt-2">Create design</h3>
            <button
              onClick={() => createRoom()}
              className=" text-white bg-orange-400 px-2 py-1 rounded-md text-lg shadow-xl hover:bg-orange-600 w-full"
            >
              Create
            </button>
          </div>

          <div className="border flex-1 flex-col border-violet-500 rounded-md p-3 bg-black hover:scale-105 transition-transform  min-w-[200px]">
            <Users stroke="currentColor" size={44} className=" text-violet-500"/>
            <h3 className="text-violet-500 text-xl mb-2 mt-2">Create team</h3>
            <button
              onClick={() => setShowForm(true)}
              className=" text-white bg-violet-500 px-2 py-1 rounded-md text-lg shadow-xl hover:bg-violet-800 w-full"
            >
              Add team 
            </button>
          </div>
          
          <div className="border flex-1 flex-col border-red-700 rounded-md p-3 bg-black hover:scale-105 transition-transform min-w-[200px] ">
            <Handshake stroke="currentColor" size={44} className=" text-red-700"/>
            <h3 className="text-red-700 text-xl mb-2 mt-2">collab with team</h3>
            <button
              onClick={() => setJoin(true)}
              className=" text-white bg-red-700 px-2 py-1 rounded-md text-lg shadow-xl hover:bg-red-900 w-full"
            >
              Join team 
            </button>
          </div>


          <div className="border flex-1 flex-col border-green-700 rounded-md p-3 bg-black hover:scale-105 transition-transform min-w-[200px]">
            <PrinterCheck  stroke="currentColor" size={44} className=" text-green-700"/>
            <h3 className="text-green-700 text-xl mb-2 mt-2">Nearby shop</h3>
            <button
              onClick={handleNearbyPrintShops}
              className=" text-white bg-green-700 px-2 py-1 rounded-md text-lg shadow-xl hover:bg-green-900 w-full "
            >
              Printing
            </button>
          </div>
         
        </div>

        <RoomsView ownedRooms={ownedRooms} roomInvites={roomInvites} />

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
      </div>
    </div>
  );
}
