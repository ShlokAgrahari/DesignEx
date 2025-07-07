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
import { Video, MessageSquareMore } from "lucide-react";

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
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const client = useStreamVideoClient();
  const [callDetails, setcallDetails] = useState<Call>();
  const [TeamData, setTeamData] = useState<Team | null>(null);
  const [isLeader, setisLeader] = useState(false);

  const [projectImage, setProjectImage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("projectImage") ||
        "/images/project-illustration.svg"
      );
    }
    return "/images/project-illustration.svg";
  });

  const [isCustomImage, setIsCustomImage] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("projectImage") !== null;
    }
    return false;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProjectImage(result);
        setIsCustomImage(true);
        localStorage.setItem("projectImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProjectImage("/images/project-illustration.svg");
    setIsCustomImage(false);
    localStorage.removeItem("projectImage");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/api/get-team", {
          params: { team_id: teamId },
        });
        const result = response.data;

        if (result.success && result.team) {
          setTeamData(result.team);
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
        data: { starts_at: new Date().toISOString() },
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
      if (!status) toast.dark("No Meeting exists now");
      else router.replace(`/meeting/${meetingId}`);
    } catch (error) {
      console.log("❌ joining meeting error is", error);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={true}
        theme="dark"
        transition={Zoom}
      />

      <div className="flex-1 flex flex-col font-[Poppins] px-4 sm:px-8 py-6 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-zinc-800 shadow-xl p-6 mb-6">
          <div className="flex flex-col text-left space-y-1">
            <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
              Team: {TeamData?.teamName || "Team Name"}
            </h1>
            <p className="text-md text-zinc-300">
              Leader: {TeamData?.leaderName || "Leader"}
            </p>
            <p className="text-md text-zinc-400">
              Team Code: {TeamData?.teamId || "Code"}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-4">
            <button
              onClick={() => router.push(`/teamchat/${teamId}`)}
              className="px-6 py-3 text-md font-bold rounded-xl shadow-md bg-gradient-to-r from-slate-800 to-gray-100 text-white hover:opacity-90 transition-all"
            >
              <div className="flex items-center gap-2">
                <MessageSquareMore className="h-5 w-5" />
                <span>Open Chat</span>
              </div>
            </button>

            <button
              onClick={isLeader ? createPersonalMeeting : joinMeeting}
              className="px-6 py-3 text-md font-bold rounded-xl shadow-md bg-gradient-to-r from-gray-100 to-slate-800 text-white hover:opacity-90 transition-all"
            >
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <span>{isLeader ? "Start VC" : "Join VC"}</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="flex-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md transition-all hover:scale-[1.01]">
            <div className="w-full h-64 sm:h-72 md:h-80 relative rounded-xl overflow-hidden mb-4">
              <img
                src={projectImage}
                alt="Project Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {isLeader && (
              <div className="flex justify-center gap-4 mb-4">
                <label className="bg-gradient-to-r from-slate-800 to-gray-100 text-white text-sm font-bold px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-all text-center">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {isCustomImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="bg-gradient-to-r from-gray-100 to-slate-800 text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-80 transition-all"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}
            <p className="text-center text-xl font-bold text-white">
              {TeamData?.projectName || "Project Title"}
            </p>
          </div>

          <div className="flex-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col items-center hover:scale-[1.01] transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">Team Members</h2>
            <ul className="space-y-3 w-full">
              {TeamData?.members.length ? (
                TeamData.members.map((member) => (
                  <li
                    key={member.id}
                    className="w-full bg-gradient-to-r from-fuchsia-800 to-violet-900 rounded-lg px-4 py-3 text-white text-md shadow-md hover:scale-[1.01] transition-all border border-zinc-700"
                  >
                    👤 {member.name}
                  </li>
                ))
              ) : (
                <li className="text-zinc-400">No members</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
