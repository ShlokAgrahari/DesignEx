"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import axios from "axios";
import { useSession } from "next-auth/react";
import moment from "moment";
import { FaPaperclip } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ChatBox({ chatId }: { chatId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [teamName,setTeamName]=useState("");
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
const fetchTeam = async () => {
  try {
    const response = await axios.get("/api/get-team", {
              params: { team_id: chatId },
            });
            const result = response.data;
            console.log("result from get-team:", result); 
            console.log(result.team?.teamName);
    setTeamName(result.team?.teamName); 
  } catch (error) {
    console.error("Error fetching team:", error);
  }
};

  useEffect(() => {
    if (status !== "authenticated" || !chatId) return;
    console.log("team is",chatId);
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${chatId}`);
      setMessages(res.data);
    };
    fetchTeam();
    fetchMessages();

    const channel = pusherClient.subscribe(chatId);
    channel.bind("new-message", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId, status]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
  if (!newMessage.trim() && !imageFile) return;

  const formData = new FormData();
  console.log(formData);
  formData.append("receiverId", chatId);
  if (newMessage) formData.append("content", newMessage);
  if (imageFile){
    console.log(imageFile);
formData.append("image", imageFile);
  } 

  try {
    const res = await axios.post("/api/messages/send", formData);

    if (res.data?.message) {
      // Add message instantly
      setMessages((prev) => [...prev, res.data.message]);
    }

    
    setNewMessage("");
setImageFile(null);
setImagePreview(null); // 👈 this line resets the preview

  } catch (err) {
    console.error("Send error:", err);
  }
};

  const deleteMessage = async (id: string) => {
    try {
      await axios.post("/api/messages/delete", { messageId: id });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (status === "loading")
    return <div className="text-white">Loading chat...</div>;

  return (
    <div className="flex flex-col h-screen border border-black rounded-md overflow-hidden bg-[#e5ddd5]">
      <div className="bg-[#075e54] text-white px-6 py-2 text-lg font-semibold">
        {teamName}
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.map((msg, idx) => {
          const isOwn = msg.senderId === session?.user?.id;
          const isImage = msg.imageUrl;

          return (
            <div
              key={idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className="relative group max-w-[75%]">
                <div
                  className={`p-3 rounded-lg text-sm whitespace-pre-line break-words ${
                    isOwn
                      ? "bg-[#dcf8c6] text-black rounded-br-none"
                      : "bg-white text-black rounded-bl-none"
                  } shadow-md`}
                >
                  {!isOwn && msg.senderName && (
                    <p className="text-xs text-gray-500 mb-1 font-semibold">
                      {msg.senderName}
                    </p>
                  )}
                  {isImage && (
                    <img
                      src={msg.imageUrl}
                      alt="sent image"
                      className="mb-2 max-w-xs rounded"
                    />
                  )}
                  {msg.content && <p className="mb-5">{msg.content}</p>}
                  <span className="text-[10px] text-gray-500 absolute bottom-1 right-2">
                    {moment(msg.timestamp).format("h:mm A")}
                  </span>
                </div>

                {isOwn && isImage && (
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="absolute top-1 right-1 hidden group-hover:block text-xs text-red-600"
                    title="Delete"
                  >
                    ✖
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>
{imagePreview && (
  <div className="px-4 pb-2 inline-block">
    <div className="flex justify-start">
      <div className="relative w-fit border rounded-lg shadow-md bg-white">
        <img
          src={imagePreview}
          alt="Selected preview"
          className="rounded-lg max-h-48 object-cover"
        />
        <button
          onClick={() => {
            setImageFile(null);
            setImagePreview(null);
          }}
          className="absolute top-1 right-1 bg-white bg-opacity-90 text-red-500 rounded-full p-1 hover:bg-opacity-100 transition"
          title="Remove image"
        >
          ✖
        </button>
      </div>
    </div>
  </div>
)}

      <div className="bg-white px-4 py-3 flex gap-2 items-center border-t border-gray-300">
        <label
          htmlFor="image-upload"
          className="cursor-pointer text-green-600 hover:text-green-800"
        >
          <FaPaperclip size={20} />
        </label>
        


        <input
  id="image-upload"
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  }}
  className="hidden"
/>

        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
