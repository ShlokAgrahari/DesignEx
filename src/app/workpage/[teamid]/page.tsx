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


export default function WorkPage(){
  return (<StreamVideoProvider>
    <InnerWorkPage/>
  </StreamVideoProvider>)
}

function InnerWorkPage() {
  const params = useParams();
  const teamId = params.teamid;
  console.log("team id is ", teamId);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const client = useStreamVideoClient();
  const [value, setvalue] = useState({
    Datetime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setcallDetails] = useState<Call>();
  const [TeamData, setTeamData] = useState(null);
  const [isLeader, setisLeader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/api/get-team", {
          params: {
            team_id: teamId,
          },
        });
        const result = response.data;
        console.log(result.data);
        if (result.success) {
          setTeamData(result.data);
          const Data = result.data;
          if (Data.leaderId == user?.id) {
            setisLeader(true);
          }
        }
      } catch (error) {
        console.log("error while getting team data");
      }
    };
    getData();
  }, []);

  const meetingId = teamId?.toString();
  const { call } = useGetCallById(meetingId!);

  const createPersonalMeeting = async () => {
    if (!client || !user) {
      return;
    }
    const newcall = client.call("default", meetingId!);
    if (!call) {
      await newcall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }
    router.replace(`/meeting/${meetingId}?personal=true`);
  };

  const joinMeeting = async () => {
    if (!client || !meetingId) {
      return;
    }
    try {
      const response = await axios.get("/api/meeting-status", {
        params: {
          team_id: teamId,
        },
      });
      const result = response.data;
      console.log(result);
      const status = result.activeStatus;
      if (!status) {
        console.log("no meeting");
        toast.dark("No Meeting exists now");
      } else {
        router.replace(`/meeting/${meetingId}`);
      }
    } catch (error) {
      console.log("joining meeting error is", error);
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
            <h1 className="text-xl font-semibold">Team Name</h1>
            <p className="text-sm text-gray-300">team leader</p>
            <p className="text-sm text-gray-300">team code</p>
          </div>
          <button
            className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            onClick={isLeader ? createPersonalMeeting : joinMeeting}
          >
            {isLeader ? "Start VC" : "join VC"}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 gap-6 border border-white p-6 rounded">
          {/* Participants Box */}
          <div className="flex-1 border border-white p-4 rounded">
            <h2 className="text-lg font-medium mb-4">participants-</h2>
            <ul className="space-y-2">
              <li>__________</li>
              <li>__________</li>
            </ul>
          </div>

          {/* Project Box */}
          <div className="flex-1 border border-white p-4 rounded flex flex-col items-center">
            <div className="w-full h-48 bg-gray-700 mb-4 flex items-center justify-center rounded">
              project pic
            </div>
            <p className="text-center">project title</p>
          </div>
        </div>
      </div>
    </div>

  );
}

function async() {
  throw new Error("Function not implemented.");
}
