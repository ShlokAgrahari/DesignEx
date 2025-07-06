import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [resultData, setResultData] = useState<Array<{ title: string }>>([]);
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

  const fetchData = async (query: string) => {
    try {
      const result = await axios.get(
        `/api/search?user=${userId}&search=${query}`
      );
      const data = result.data;
      const roomdata = data.Roomdata;
      setResultData(roomdata);
      console.log("data is", resultData);
    } catch (error) {
      console.log("search error is ", error);
    }
  };

  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-gray-800 backdrop-blur-lg shadow-xl rounded-md px-4 py-3 flex items-center justify-between relative z-20 border border-gray-700 mb-5 ">
      {/* Desktop Search */}
      <div className="hidden sm:flex items-center w-[40%] border border-gray-600 rounded-md shadow-inner px-3 py-2 bg-gray-950/80">
        <Search className="text-gray-300" />
        <input
          type="text"
          placeholder="Search your designs..."
          className="px-3 w-full outline-none text-sm bg-transparent text-white placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mobile Search Toggle */}
      <div className="sm:hidden flex items-center w-full">
        {!showSearch ? (
          <button onClick={() => setShowSearch(true)} className="ml-2">
            <Search className="text-white w-6 h-6" />
          </button>
        ) : (
          <div className="flex items-center bg-white px-3 py-2 w-full rounded-md shadow-lg transition-all duration-200">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-white text-black"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="ml-2 text-gray-600"
            >
              <X />
            </button>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {resultData.length > 0 && (
        <div className="absolute top-full left-0 sm:left-4 mt-2 max-h-60 overflow-y-auto w-full sm:w-[39%] bg-white rounded-md shadow-lg z-30 border border-gray-300">
          {resultData.map((room, index) => (
            <div
              key={index}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {room.title}
            </div>
          ))}
        </div>
      )}

      {/* Logout Button */}
      <div className={`flex gap-2 min-w-fit ${showSearch ? "hidden" : ""}`}>
         <button
          className="bg-gradient-to-tr from-red-600 to-orange-600 text-white px-4 py-2 rounded-md hover:brightness-110 transition font-semibold shadow-md"  
          onClick={() => router.replace("/team")}
        >
          Teams
        </button>
        <button
          className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:brightness-110 transition font-semibold shadow-md"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
