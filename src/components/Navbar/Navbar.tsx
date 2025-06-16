import React, { useState } from 'react'
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import { toast } from "react-hot-toast";
import {useRouter} from 'next/navigation';
import { signOut } from 'next-auth/react';

const Navbar = () => {
   const router = useRouter();

  const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        router.push("/login");
      } catch (error: any) {
        console.error("Logout error:", error.message);
        toast.error("Logout failed.");
      }
  };




  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="bg-white/50 backdrop-blur-md shadow-lg rounded-xs px-1 sm:px-2 md:px-4 py-1 flex items-center justify-between mb-4">
        <div className='hidden sm:flex items-center w-[40%] border rounded-xs shadow-sm px-3 py-2 bg-white'>
            <Search/>
            <input
            type="text"
            placeholder="Search..."
            className="px-4 w-full outline-none  text-sm bg-white"
            />
        </div>
        <div className="sm:hidden flex items-center w-full">
        {!showSearch ? (
          <button onClick={() => setShowSearch(true)} className='ml-2'>
            <Search className="text-gray-700 w-6 h-6" />
          </button>
        ) : (
          <div className="flex  bg-white border-b px-2 py-2 w-full items-center rounded-sm transition-all duration-200 ease">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 outline-none text-sm bg-white w-full"
            />
            <button onClick={() => setShowSearch(false)} className="ml-2 text-sm text-gray-600"><X/></button>
          </div>
        )}
        </div>
          
        <div className={`flex overflow-hidden min-w-fit shrink-0 whitespace-nowrap gap-2 ${showSearch?"hidden":""}`}>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-sm hover:bg-purple-600 transition font-semibold"
              onClick={handleLogout}>
               Log Out
            </button>
        </div>
    </div>
  )
}

export default Navbar