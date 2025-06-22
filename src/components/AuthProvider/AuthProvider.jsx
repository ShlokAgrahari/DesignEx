"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

function AuthSync() {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      user?.id !== session.user.id
    ) {
      setUser({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session?.user?.id, user?.id, status, setUser]);

  return null;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
