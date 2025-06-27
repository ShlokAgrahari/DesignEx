import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import { toast } from "react-hot-toast";
import {useRouter} from 'next/navigation';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const Navbar = () => {
  const router = useRouter();
  const [search,setSearch] = useState("");
  const [resultData,setResultData] = useState<Array<{ title: string }>>([]);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        router.push("/login");
      } catch (error: any) {
        console.error("Logout error:", error.message);
        toast.error("Logout failed.");
      }
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim().length > 0) {
        fetchData(search);
      } else {
        setResultData([]); 
      }
    }, 400); 

    return () => clearTimeout(delayDebounce); 
  }, [search]);


  const fetchData = async(query:string)=>{
      try {
        const result = await axios.get(`/api/search?user=${userId}&search=${query}`);
        const data = result.data;
        const roomdata = data.Roomdata;
        setResultData(roomdata);
        console.log("data is",resultData);
      } catch (error) {
        console.log("search error is ",error);
      }
  };



  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="bg-white/50 backdrop-blur-md shadow-lg z-10 rounded-xs px-1 sm:px-2 md:px-4 py-1 flex items-center justify-between mb-4">
        <div className='hidden sm:flex items-center w-[40%] border rounded-xs shadow-sm px-3 py-2 bg-white'>
            <Search/>
            <input
            type="text"
            placeholder="Search..."
            className="px-4 w-full outline-none  text-sm bg-white"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
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
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-white w-full"
            />
            <button onClick={() => setShowSearch(false)} className="ml-2 text-sm text-gray-600"><X/></button>
          </div>
        )}
        </div>
        <div className='absolute top-full mt-1 max-h-64 overflow-y-auto w-full sm:w-[39%] bg-white rounded-md '>
          {resultData.length>0 ? (resultData.map((room,index)=>(
            <div key={index} className='px-3 py-2 hover:bg-gray-200 '> {room.title}</div>
          ))):""}
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