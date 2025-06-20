"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { Printer } from 'lucide-react';
import axios from "axios";
import { ChevronLeft ,ChevronRight} from 'lucide-react';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Navbar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

import { createRoom } from "@/actions/rooms";
import RoomsView from "@/components/dashboard/RoomsView";
import RoomInvite from "@/models/RoomInvite";
import Room from "@/models/room";
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

 // ⬇️ Move it outside
const fetchRooms = async () => {
  try {
    const res = await fetch("/api/rooms");
    if (!res.ok) throw new Error("Failed to fetch rooms");
    const data = await res.json();
    console.log("room in dashboard", data);
    setOwnedRooms(data.ownedRooms);
    setRoomInvites(data.sharedRooms); // ✅ matches your return shape

  } catch (err) {
    console.error("Error fetching rooms:", err);
  }
};

// ⬇️ Then use it here
useEffect(() => {
  if (user?.id) {
    fetchRooms();
  }
}, [user?.id]);

  const [joinForm, setJoin] = useState(false);
  
   

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
    console.log("Full session:", session);

    const updatedUser = {
      id: session.user.id ?? "",
      name: session.user.name ?? "Guest",
      email: session.user.email ?? "",
    };
    console.log("Updating Zustand store with user from session:", updatedUser);
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
      const res=await axios.post("/api/createTeam", { teamName, projectName, user });
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



  // -------------------------------------------------------------------

  const [current,setCurrent] = useState(0);
  const slides = [
    {image:"/carousel1.jpg", text:"Create eye-catching posters with powerful tools"},
    {image:"/carousel2.jpg" ,text:"Design together, no matter where you are"},
    {image:"/carousel3.png" ,text:"Craft unique, professional logos effortlessly"}
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); 

    return () => clearInterval(interval); 
  }, [slides.length]);

  let prevSlide = ()=>{
    setCurrent((current-1 + slides.length)%slides.length);
  }

  let nextSlide = ()=>{
    setCurrent((current+1)%slides.length);
  }

  const [expanded,setExpanded] = useState(true);
 

  // ----------------------------------------------------------------------


  return (
    <div className="flex h-screen w-screen font-[Poppins] bg-linear-to-t from-white to-violet-500 overflow-hidden ">
      <Sidebar expanded={expanded} setExpanded={setExpanded} setJoin={setJoin} activeLabel="Home"/>
     
        <div className={`flex-1 flex flex-col p-2 sm:p-6 overflow-y-auto scrollbar-hide overflow-auto ${expanded?"bg-white/30 backdrop-blur-lg blur-sm sm:blur-none":""}`}>
          <Navbar/>

          <div className="h-[300px] lg:h-[340px] w-full  rounded-sm relative items-center justify-center mb-6 overflow-hidden">
            <div className={`flex transition ease-out duration-300 h-full `} style={{transform:`translateX(-${current*100}%)`}}>
              {slides.map((s)=>{
                return (<div className="h-full w-full bg-center bg-cover bg-no-repeat min-w-full relative" style={{backgroundImage:`url(${s.image})`}}>
                    <div className="absolute bottom-4 left-4 text-white px-4 py-2 rounded-sm max-w-[70%] md:max-w-[50%]">
                      <h2 className="text-lg sm:text-2xl md:text-4xl font-bold">{s.text}</h2> 
                    </div>
                  </div>);
              })}
            </div>
            <div className="absolute top-0 h-full w-full justify-between flex text-white px-2 sm:px-5 text-xl items-center">
              <button onClick={prevSlide}>
                <ChevronLeft/>
              </button>
              <button onClick={nextSlide}>
                <ChevronRight/>
              </button>
            </div>
          </div>


          <div className="flex mb-6 w-full flex-col sm:flex-row rounded-md shadow-xl ">
              <div className="bg-white w-full h-[160px] lg:h-[200px]  flex flex-col justify-center p-4 md:p-5 lg:p-7 sm:rounded-tl-md sm:rounded-bl-md">
                <h2 className="text-2xl leading-6 md:text-3xl font-semibold text-[#de49eb] mb-1">Printing shop nearby you</h2>
                <p className="text-md ">Easily locate trusted printing shops near you in just one click</p>
              </div>
              <div className="w-full h-[160px] lg:h-[200px] sm:rounded-tr-md sm:rounded-br-sm bg-no-repeat bg-cover bg-center"
                style={{backgroundImage:`url("/printer.jpg")`}}>
                <div className="flex items-center justify-center w-full h-full bg-black/50 rounded-md">
                  <button
                    className="px-3 py-2 bg-white rounded-md text-black flex hover:bg-[#de49eb] hover:text-white"
                    >
                      <Printer/><span className="ml-2">Printing Shop</span>
                    </button>
                </div>
              </div>
          </div>


        <div className="flex flex-wrap gap-6 mb-6">
          <button onClick={() => createRoom()} className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:scale-105 transition-transform">
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
        <RoomsView
  ownedRooms={useAuthStore((s) => s.ownedRooms)}
  roomInvites={useAuthStore((s) => s.roomInvites)}
/>

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




          {joinForm && (
          <JoinForm setJoin={setJoin} />
        )}
        </div>
  
    </div>
  );
}
