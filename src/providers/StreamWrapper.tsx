"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { StreamVideoProvider } from "@/providers/StreamClientProvider";
import Loader from "@/components/ui/Loader";

export default function StreamWrapper({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user?.id) {
    return <Loader />;
  }

  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}
