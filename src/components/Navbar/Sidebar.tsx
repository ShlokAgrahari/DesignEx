import React, { useState } from 'react'
import {
  Home,
  Users,
  Brush,
  UserPlus,
  Handshake,
  LayoutGrid,
} from 'lucide-react';
import { ChevronFirst, ChevronLast } from 'lucide-react';

const sidebarItems = [
  { label: 'Home', icon: Home },
  { label: 'Teams', icon: Users },
  { label: 'Designs', icon: LayoutGrid },
  { label: 'CreateTea', icon: UserPlus },
  { label: 'JoinTeam', icon: Handshake },
  { label: 'NewDesign', icon: Brush },
];

interface SidebarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setJoin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar:React.FC<SidebarProps> = ({expanded,setExpanded,setJoin}) => {

  return (
    <div className={`relative bg-white h-full shadow-[6px_0_12px_0_rgba(0,0,0,0.15)]  ${
        expanded ? "w-[15%] min-w-[150px] p-2 lg:p-3 xl:p-5 " : "sm:w-[70px] w-[65px] p-2 "
        } transition-all duration-200 ease-linear flex flex-col items-center fixed md:relative
        `}>
        <button 
          onClick={()=>{setExpanded(!expanded)}} 
          className="absolute top-4 xl:right-6 md:right-3 right-2 text-gray-600 hover:text-black transition-transform p-2 z-10">
            {expanded?(<ChevronFirst className="w-5 h-5" />):(<ChevronLast className='w-5 h-5'/>)}
        </button>
        
        <div className="relative w-full flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="DesignEx Logo"
            className={`${expanded?"w-16 h-16 md:w-20 md:h-20 border-4 border-black mt-5 ":"w-10 h-10 border-2 border-black mt-16"}  rounded-full shadow-2xl  hover:scale-110 transition-transform duration-300`}
          />
        </div>
        <nav className={`flex flex-col gap-4 w-full ${expanded?"px-2":"px-0"} `}>
          {sidebarItems.map(
            ({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={()=>{
                  if(label === "JoinTeam"){setJoin(true);}
                }}
                className={`bg-[#de49eb] text-white font-semibold ${expanded?"px-2 py-2":"px-2 py-2 rounded-xs"} shadow-lg flex items-center justify-center text-center 
                shadow-purple-500/50 hover:bg-purple-500 hover:border-2 transition-transform duration-300 ease-in-out hover:-translate-y-1`}
              >
                <Icon className="w-5 h-5 font-bold" strokeWidth={2.5} />
                {expanded && <span className='ml-1 transition-all duration-200 ease-linear'>{label}</span> }
              </button>
            )
          )}

        </nav>
      </div>

  )
}

export default Sidebar