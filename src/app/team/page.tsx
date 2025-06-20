"use client"
import JoinForm from '@/components/Navbar/JoinForm';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Navbar/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function teamPage(){

    const [expanded,setExpanded] = useState(true);
    const [joinForm, setJoin] = useState(false);
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(()=>{
        const getTeams = async()=>{
            const result = await axios.get(`/api/getTeamList?userId=${userId}`);
            const TeamData = result.data;
            if(!TeamData){
                console.log("error while getting team");
            }
            console.log(TeamData.data);
            setTeams(TeamData.data);
        }
        getTeams();
    },[])

    return(
        <div className='flex h-screen w-screen overflow-hidden font-[Poppins] bg-gray-100'>
            <Sidebar expanded={expanded} setExpanded={setExpanded} setJoin={setJoin} activeLabel='Teams'/>
            <div className={`flex-1 flex flex-col p-2 sm:p-6 overflow-y-auto scrollbar-hide overflow-auto ${expanded?"bg-white/30 backdrop-blur-lg blur-sm sm:blur-none":""}`}>
                <Navbar/>
                {teams.length === 0 ? (
                    <div className='flex items-center justify-center mt-8'>
                        <h1 className='text-2xl text-black'>You have not joined any team yet</h1>
                    </div>
                ):
                (
                <div className='flex flex-col  pt-3'>
                    <div className='w-full flex items-center justify-center mb-3 md:mt-5'>
                        <h1 className='font-bold text-xl sm:text-2xl md:text-3xl '>Your Teams are here</h1>
                    </div>
                    {teams.map((team)=> (
                    <div key={team.teamId} className="bg-white rounded-lg shadow-lg max-w-[320px] mx-auto">
                        <div className='max-h-[150px] w-full overflow-hidden rounded-t-lg'>
                            <img className='object-contain h-full w-full rounded-t-lg' src='/TeamImage.png' />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                            <div className="mb-4 sm:mb-0">
                                <h2 className="text-lg font-bold text-gray-800">Team Name: {team.teamName}</h2>
                                <p className="text-gray-600">Project: {team.projectName}</p>
                            </div>

                            <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                                view
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                {joinForm && (<JoinForm setJoin={setJoin} />)}
            </div>
        </div>
    );
}