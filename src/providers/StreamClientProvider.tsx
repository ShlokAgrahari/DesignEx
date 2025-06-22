"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/ui/Loader";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useRef, useState } from "react";

const apiKey = "agrqaxj4guaj";

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false); // ✅ prevents repeated execution

  useEffect(() => {
    console.log("✅ Zustand user before init:", user);

    const initClient = async () => {

      if (!user?.id) {
        console.log("Waiting for user...");
        return ({children});
      }
      console.log("Auth user in StreamVideoProvider:", user);

      console.log("user from Zustand", user);

      if (!user?.id || initialized.current) return;


      initialized.current = true; // ✅ only once
      try {
        const client = StreamVideoClient.getOrCreateInstance({
          apiKey,
          user: {
            id: user.id,
            name: user.email || user.id,
            image:
              "https://plus.unsplash.com/premium_photo-1739786995646-480d5cfd83dc?w=600&auto=format&fit=crop&q=60",
          },
          tokenProvider,
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Failed to init StreamVideoClient:", error);
      } finally {
        setLoading(false);
      }
    };

    initClient();
  }, [user?.id]); // ✅ only runs when user.id is available

  if (loading || !videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
