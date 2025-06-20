"use client";

import { useParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";

export default function TeamChatPage() {
  const { teamid } = useParams();

  return (
    <div className="h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold mb-4">Team Chat Room</h1>
      <ChatBox chatId={teamid as string} />
    </div>
  );
}
