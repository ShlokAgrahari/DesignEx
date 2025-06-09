"use client";

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React from 'react'
import { Button } from './button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const EndCallButton = ({team_id}:{team_id:string}) => {
    const router = useRouter();
    const call = useCall();
    const {useLocalParticipant} = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    
    

    if(!call){
        return null;
    }

    // const endMeet = async()=>{
    //     try {
    //         await call?.endCall();
    //         const response = await axios.post("/api/setMeeting",{
    //             team_id:team_id
    //         });
    //         router.replace("/dashboard");
    //     } catch (error) {
    //         console.log("error while ending call");
    //     }
    // }

    return (
        <Button onClick={async () => {
        await call?.endCall();
        await axios.post("/api/setMeeting", { team_id });
        router.replace("/dashboard")}} className='bg-red-500 text-white'>
            End call for everyone
        </Button>
    )
}

export default EndCallButton