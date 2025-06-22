"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/ui/Loader";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = "agrqaxj4guaj"; // Consider using NEXT_PUBLIC_STREAM_API_KEY

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const initClient = async () => {
      if (!user?.id) {
        console.log("Waiting for user...");
        return ({children});
      }
      console.log("Auth user in StreamVideoProvider:", user);

      try {
        const client = StreamVideoClient.getOrCreateInstance({
          apiKey,
          user: {
            id: user.id,
            name: user.email || user.id,
            image:
              "https://plus.unsplash.com/premium_photo-1739786995646-480d5cfd83dc?w=600&auto=format&fit=crop&q=60",
          },
          tokenProvider: tokenProvider,
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Failed to init StreamVideoClient:", error);
      } finally {
        setLoading(false);
      }
    };

    initClient();
  }, [user]);

  if (loading || !videoClient) {
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
