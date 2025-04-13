"use client";


import React, { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: session } = useSession();
  const[joinForm,setJoin]=useState(false);
  const[teamId,setTeamId]=useState("")
  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");


  useEffect(() => {
    if (session?.user?.name && session?.user?.email) {
      useAuthStore.getState().setUser({
        id: "",
        name: session.user.name || "Guest",
        email: session.user.email || "No Email",
      });
    }
  }, [session]);


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!teamName || !projectName) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const res = await axios.post("/api/createTeam", {
        teamName,
        projectName,
        user,
      });
  
      
      setShowForm(false);
      setTeamName("");
      setProjectName("");
    } catch (error: any) {
      console.error(error);
      
    }
  };
  
  const handleJoin=async (e:FormEvent)=>{
    e.preventDefault();

    if(!teamId){
      alert("Please provide team ID");
      return;
    }

    try {
      const res=await axios.post("/api/joinTeam",{teamId,user})
      console.log(res);
      console.log("Successfully joined team",res.data)
      setTeamId("");
      setJoin(false);
    } catch (error:any) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message); // "User is already a member of the team"
        setTeamId("");
        return;
      }
      console.log("Error in joining",error);
    }
  }


  return (
    <div className="flex h-screen w-screen font-[Poppins]">
      {/* Sidebar */}
      <div className="bg-purple-200 h-full w-[15%] p-4 flex flex-col items-center shadow-lg">
        <div className="bg-purple-500 h-[6vh] w-[6vh] flex items-center justify-center text-white font-bold rounded-lg mb-6">
          Logo
        </div>
        <nav className="flex flex-col gap-4 w-full">
          {["Home", "Templates", "My Designs", "My Teams", "Apps"].map(
            (item) => (
              <button
                key={item}
                className="bg-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-300 transition-all duration-300"
              >
                {item}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-purple-100 h-full w-[85%] flex flex-col px-[2vw] py-[1vw] items-center text-gray-900 text-2xl font-bold scrollbar-hide">
        {/* Top Bar */}

        <div className="bg-gradient-to-r from-purple-300 to-purple-400 h-20 w-full flex items-center justify-between px-6 shadow-lg rounded-xl scrollbar-hide">

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
        <div className="bg-white h-[90vh] p-[1vw] w-full mt-2 rounded-lg shadow-lg overflow-y-auto overflow-x-hidden scrollbar-hide">



          <div className="bg-purple-400 h-[30vh] flex items-center justify-center text-white text-2xl font-semibold rounded-lg shadow-md">
            Carousel
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">

            <button
              className="bg-gradient-to-r from-pink-300 to-purple-400 text-white border-none rounded-2xl h-[10vh] px-6 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
            >
              Create a Design
            </button>
            <button
              className="bg-gradient-to-r from-pink-300 to-purple-400 text-white border-none rounded-2xl h-[10vh] px-6 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
              onClick={() => setShowForm(true)}
            >
              Create a Team
            </button>
            <button
              className="bg-gradient-to-r from-pink-300 to-purple-400 text-white border-none rounded-2xl h-[10vh] px-6 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
              onClick={()=>setJoin(true)}
            >
              Join a Team
            </button>

          </div>
          {joinForm && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
      <h2 className="text-xl font-bold mb-4">Join a Team</h2>
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

          {/* Team Form Modal/Box */}
          {showForm && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">

              <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Create a New Team</h2>
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
          <h1 className="mt-6 text-gray-800 text-xl font-semibold">
            Recent Work
          </h1>
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
                  <p className="text-sm text-gray-600">Edited: {["2 hours ago", "5 hours ago", "Yesterday", "3 days ago"][num - 1]}</p>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
