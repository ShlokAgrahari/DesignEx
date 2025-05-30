"use client";

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React from 'react'
import { Button } from './button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
    const router = useRouter();
    const call = useCall();
    const {useLocalParticipant} = useCallStateHooks();
    const localParticipant = useLocalParticipant();

  
    if(!call){
        return null;
    }
    return (
        <Button onClick={async()=>{
            await call.endCall();
            router.replace("/dashboard");
        }} className='bg-red-500 text-white'>
            End call for everyone
        </Button>
    )
}

export default EndCallButton