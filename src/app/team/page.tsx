"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import JoinForm from "@/components/Navbar/JoinForm";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Navbar/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";

export default function TeamPage() {
  const [expanded, setExpanded] = useState(true);
  const [joinForm, setJoin] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    const getTeams = async () => {
      try {
        const result = await axios.get(`/api/getTeamList?userId=${userId}`);
        const teamData = result.data;
        setTeams(teamData.data || []);
      } catch (err) {
        console.error("Error fetching team list:", err);
      }
    };

    getTeams();
  }, [userId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-[Poppins] bg-gray-100">
      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
        setJoin={setJoin}
        activeLabel="Teams"
      />

      <div
        className={`flex-1 flex flex-col p-2 sm:p-6 overflow-y-auto scrollbar-hide ${
          expanded ? "bg-white/30 backdrop-blur-lg blur-sm sm:blur-none" : ""
        }`}
      >
        <Navbar />

        {teams.length === 0 ? (
          <div className="flex items-center justify-center mt-8">
            <h1 className="text-2xl text-black">
              You have not joined any team yet
            </h1>
          </div>
        ) : (
          <div className="flex flex-col pt-3">
            <div className="w-full flex items-center justify-center mb-3 md:mt-5">
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
                Your Teams
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {teams.map((team) => (
                <div
                  key={team.teamId}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="h-[150px] w-full">
                    <img
                      className="object-center h-full w-full"
                      src="/TeamImage.png"
                      alt="Team"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                    <div className="mb-4 sm:mb-0">
                      <h2 className="text-lg font-bold text-gray-800">
                        Team: {team.teamName}
                      </h2>
                      <p className="text-gray-600">
                        Project: {team.projectName}
                      </p>
                    </div>

                    <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {joinForm && <JoinForm setJoin={setJoin} />}
      </div>
    </div>
  );
}
