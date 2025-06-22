"use client";

import { useParams, useRouter } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function TeamChatPage() {
  const { teamid } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setCanRender(true);
    }
  }, [status, router]);

  if (status === "loading" || !canRender) return <div>Loading chat...</div>;

  return (
    <div className="h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold mb-4">Team Chat Room</h1>
      <ChatBox chatId={teamid as string} />
    </div>
  );
}
