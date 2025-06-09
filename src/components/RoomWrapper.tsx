"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function RoomWrapper({
    children,
    roomId,
}: {
    children: ReactNode;
    roomId: string;
}) {
    const authUrl = `/api/liveblock-auth?roomId=${encodeURIComponent(roomId)}`;
    return (
    <LiveblocksProvider authEndpoint={authUrl}>
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
