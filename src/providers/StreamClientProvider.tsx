"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/ui/Loader";
import {StreamVideo, StreamVideoClient} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

  
const apiKey = "agrqaxj4guaj";

  
export const StreamVideoProvider = ({children}:{children:ReactNode}) => {
    const [videoClient,setvideoClient] = useState<StreamVideoClient>();
    const user = useAuthStore((state)=>state.user);
    console.log("stream user ",user);

    useEffect(()=>{
        if(!user?.id){
            return;
        }
        if(!apiKey){
            throw new Error("API key is missing");
        }
        const client = StreamVideoClient.getOrCreateInstance({
            apiKey,
            user:{
                id:user?.id,
                name:user?.email || user?.id,
                image:'https://plus.unsplash.com/premium_photo-1739786995646-480d5cfd83dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHVzZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D'
            },
            tokenProvider:tokenProvider,
        });
        setvideoClient(client);
    },[user])
    

    if(!videoClient){
        return <Loader/>
    }
    return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
};