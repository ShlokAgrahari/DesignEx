"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetCallById } from "@/hooks/useGetCallById";
import axios from "axios";
import toast from "react-hot-toast";


export default function WorkPage() {

  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const client = useStreamVideoClient();
  const [value,setvalue] = useState({
    Datetime:new Date(),
    description:"",
    link:""
  })
  const [callDetails,setcallDetails] = useState<Call>()

  const createMeeting = async()=>{
    if(!client || !user){
        return;
    }
    try {
        const id = crypto.randomUUID();
        const call = client.call("default",id);

        if(!call){
            throw new Error("falied to create meeting");
        }

        const startAt = value.Datetime.toISOString() || new Date(Date.now()).toISOString();
        const description = value.description || "instant meeting";

        await call.getOrCreate({
            data:{
                starts_at:startAt,
                custom:{
                    description
                }
            }
        });

        setcallDetails(call);
        if(!value.description){
            router.replace(`/meeting/${call.id}`);
        }
    } catch (error) {
        console.log("meeting error ",error);
    }
}



////------------------ create personal meeting room, code ------------------

const meetingId = "67d5130283de1702784edbe6";
const {call} = useGetCallById(meetingId!);
const createPersonalMeeting = async()=>{
  if(!client || !user){
    return;
  }
  const newcall = client.call('default',meetingId!);
  if(!call){
    await newcall.getOrCreate({
      data:{
        starts_at:new Date().toISOString(),
      }
    })
  }
  router.replace(`/meeting/${meetingId}?personal=true`)
}


// -----------------function to join meeing --------------




 const meetId = "67d5130283de1702784edbe6";
 const emailId = "ayushverma225305@gmail.com";

 const joinMeeting = async()=>{
     if(!client || !meetId){
         return;
     }
     try {
         const response = await axios.get("/api/meeting-status", {
             params: {
               email: emailId,
             },
         });
         const result = response.data;
         const status = result.activeStatus;
         if(!status){
             toast("No Meeting exists now");
         }
         else{
             router.replace(`/meeting/${meetId}`);
         }
     } catch (error) {
         console.log("joining meeting error is",error);
     }       
 }




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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white pb-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold">Team Name</h1>
            <p className="text-sm text-gray-300">team leader</p>
            <p className="text-sm text-gray-300">team code</p>
          </div>
          <button className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition" onClick={createPersonalMeeting}>
            VC join/start
          </button>
          <button className="text-white bg-amber-950 p-4 " onClick={createMeeting}>Create Meeting</button>
          <button className="text-white bg-amber-950 p-4" onClick={joinMeeting}>Join meeting</button>
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
