"use client";
import { CallControls, StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import  MeetingRoom  from '@/components/MeetingRoom';
import React, { use, useState } from 'react'
import MeetingSetup from '@/components/MeetingSetup';
import  {useGetCallById}  from '@/hooks/useGetCallById';
import Loader from '@/components/ui/Loader';
import { useAuthStore } from '@/store/useAuthStore';

const meeting = ({params}:{params:Promise<{id:string}>}) => {
  const user = useAuthStore((state)=>state.user);
  const { id } = use(params);
  const [isSetupComplete,setisSetupComplete] = useState(false);

  const {call ,isCallLoading} = useGetCallById(id);

  if(!call || isCallLoading) {
    return <Loader/>
  }

  return (
    <main>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete?(
            <MeetingSetup setisSetupComplete={setisSetupComplete}/>
          ):(
            <MeetingRoom/>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default meeting;