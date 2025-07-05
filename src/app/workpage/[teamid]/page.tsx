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
import Sidebar from "@/components/Navbar/Sidebar";
import { Video ,MessageSquareMore} from 'lucide-react';

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

  // -------------------------------------------------------




  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">

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
      <div className="flex-1 flex flex-col font-[Poppins]">
        {/* Header */}
        <div className="flex flext-wrap xs:justify-between overflow-hidden flex-shrink items-center border-b border-black  bg-linear-to-t from-zinc-900 to-zinc-950 md:p-10 p-4 mb-4 w-full">
          <div className="flex-1 xs:flex-col max-w-[250px]">
            <h1 className="text-sm xs:text-md md:text-xl font-semibold text-white">
              Team : {TeamData?.teamName || "Team Name"}
            </h1>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-200 ">
              Leader Name : {TeamData?.leaderName || "Leader"}
            </p>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-200 ">
              Team Code : {TeamData?.teamId || "Code"}
            </p>
          </div>
          <div className=" flex-1 xs:flex-0" >
            <div className="flex flex-row p-2 ">
            <button
              className="bg-linear-to-bl from-violet-500 to-fuchsia-500 px-2 sm:px-4 py-2 rounded-full text-white  whitespace-nowrap sm:rounded text-sm sm:text-lg  hover:opacity-90 transition mr-2 font-semibold"
              onClick={() => router.push(`/teamchat/${teamId}`)}
            >
              <span className="hidden sm:inline">Open Chat </span><MessageSquareMore className="inline sm:hidden"/>
            </button>
  
            <button
              className="bg-linear-to-bl from-violet-500 to-fuchsia-500  px-2 sm:px-4 py-2  whitespace-nowrap rounded-full text-white sm:rounded text-sm sm:text-lg hover:opacity-90 transition font-semibold"
              onClick={isLeader ? createPersonalMeeting : joinMeeting}
            >
              <span className="hidden sm:inline">{isLeader ? "Start VC" : "Join VC"}</span> <Video className="inline sm:hidden"/>
            </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-10 rounded-lg">
          {/* Participants Box */}
          <div className="flex-1 border border-black bg-zinc-900 p-4 rounded-lg">
            <div className="w-full h-48 bg-gray-800 mb-4 flex items-center justify-center rounded">
              project pic
            </div>
            <p className="text-center">
              {TeamData?.projectName || "Project Title"}
            </p>
          </div>

          {/* Project Box */}
          <div className="flex-1 bg-zinc-900 p-4 rounded-lg flex flex-col items-center w-full">
            <h2 className="text-sm sm:text-lg md:text-xl mb-4 mt-4 w-full text-center font-bold">Team Members</h2>
            <ul className="space-y-2 w-full px-4">
              {TeamData?.members.length ? (
                TeamData.members.map((member) => (
                  <div className="w-full bg-linear-to-t from-zinc-900 to-zinc-950 p-2 px-4 rounded-md border border-black transition-all hover:transform hover:translate-y-[-4px] ease-in">
                    <li key={member.id} className="w-full">Username :  {member.name}</li>
                  </div>
                ))
              ) : (
                <li>No members</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
