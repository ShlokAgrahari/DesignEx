import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import React, { FormEvent, useState } from 'react'

interface JoinFormProps {
  setJoin: (value: boolean) => void;
}


const JoinForm : React.FC<JoinFormProps> = ({setJoin}) => {
    const [teamId, setTeamId] = useState("");
    const user = useAuthStore((state) => state.user);

    const handleJoin = async (e: FormEvent) => {
        e.preventDefault();
        if (!teamId) return alert("Please provide team ID");
    
        try {
            const res = await axios.post("/api/joinTeam", { teamId, user });
            console.log("Joined team", res.data);
            setTeamId("");
            setJoin(false);
        } catch (error: any) {
            if (error.response?.status === 409) {
                alert(error.response.data.message);
                setTeamId("");
                return;
            }
            console.log("Join error", error);
        }
    };


    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Join a Team
            </h2>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Team ID"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => setJoin(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                >
                    Join
                </button>
                </div>
            </form>
            </div>
          </div>
  )
}

export default JoinForm