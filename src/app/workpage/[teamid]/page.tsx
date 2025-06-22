"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetCallById } from "@/hooks/useGetCallById";
import axios from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { StreamVideoProvider } from "@/providers/StreamClientProvider";

// -------------- TEAM INTERFACES ----------------
type Member = {
  id: string;
  name: string;
  _id: string;
};

type Team = {
  _id: string;
  teamId: string;
  teamName: string;
  projectName: string;
  roomId: string;
  leaderId: string;
  leaderName: string;
  isActive: boolean;
  members: Member[];
};

export default function WorkPage() {
  return (
    <StreamVideoProvider>
      <InnerWorkPage />
    </StreamVideoProvider>
  );
}

function InnerWorkPage() {
  const params = useParams();
  const teamId = params.teamid?.toString();
  console.log("team id is ", teamId);

  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const client = useStreamVideoClient();
  const [callDetails, setcallDetails] = useState<Call>();
  const [TeamData, setTeamData] = useState<Team | null>(null);
  const [isLeader, setisLeader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/api/get-team", {
          params: { team_id: teamId },
        });
        const result = response.data;
        console.log("result from get-team:", result);

        if (result.success && result.team) {
          setTeamData((prev: Team | null) => {
            if (JSON.stringify(prev) !== JSON.stringify(result.team)) {
              return result.team;
            }
            return prev;
          });

          if (result.team.leaderId === user?.id) {
            setisLeader(true);
          }
        }
      } catch (error) {
        console.log("❌ error while getting team data", error);
      }
    };

    if (teamId && user?.id) getData();
  }, [teamId, user?.id]);

  const meetingId = teamId;
  const { call } = useGetCallById(meetingId!);

  const createPersonalMeeting = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);
    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }
    router.replace(`/meeting/${meetingId}?personal=true`);
  };

  const joinMeeting = async () => {
    if (!client || !meetingId) return;

    try {
      const response = await axios.get("/api/meeting-status", {
        params: { team_id: teamId },
      });

      const status = response.data.activeStatus;
      if (!status) {
        toast.dark("No Meeting exists now");
      } else {
        router.replace(`/meeting/${meetingId}`);
      }
    } catch (error) {
      console.log("❌ joining meeting error is", error);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-60 bg-[#111] flex flex-col items-center py-6 border-r border-white">
        <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-lg font-bold mb-10">
          logo
        </div>
        <nav className="flex flex-col space-y-6 text-lg font-light">
          <a href="#">home</a>
          <a href="#">templates</a>
          <a href="#">my designs</a>
          <a href="#">my teams</a>
          <a href="#">apps</a>
        </nav>
        <button
          className="mt-10 border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
          onClick={() => router.push(`/teamchat/${teamId}`)}
        >
          Open Chat
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        transition={Zoom}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white pb-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {TeamData?.teamName || "Team Name"}
            </h1>
            <p className="text-sm text-gray-300">
              {TeamData?.leaderName || "Leader"}
            </p>
            <p className="text-sm text-gray-300">
              {TeamData?.teamId || "Code"}
            </p>
          </div>
          <button
            className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            onClick={isLeader ? createPersonalMeeting : joinMeeting}
          >
            {isLeader ? "Start VC" : "Join VC"}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 gap-6 border border-white p-6 rounded">
          {/* Participants Box */}
          <div className="flex-1 border border-white p-4 rounded">
            <h2 className="text-lg font-medium mb-4">Participants</h2>
            <ul className="space-y-2">
              {TeamData?.members.length ? (
                TeamData.members.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))
              ) : (
                <li>No members</li>
              )}
            </ul>
          </div>

          {/* Project Box */}
          <div className="flex-1 border border-white p-4 rounded flex flex-col items-center">
            <div className="w-full h-48 bg-gray-700 mb-4 flex items-center justify-center rounded">
              project pic
            </div>
            <p className="text-center">
              {TeamData?.projectName || "Project Title"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
