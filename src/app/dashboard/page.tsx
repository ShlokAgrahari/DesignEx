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

export default function Dashboard() {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);
   
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
      <Sidebar expanded={expanded} setExpanded={setExpanded} setJoin={setJoin}/>
     
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
