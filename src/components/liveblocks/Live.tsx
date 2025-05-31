"use client";

import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useMyPresence, useOthers } from "@liveblocks/react";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/types";
import CursorChat from "./cursor/CursorChat";
import FlyingReaction from "./reaction/FlyingReaction";
import ReactionSelector from "./reaction/ReactionButton";
import { useBroadcastEvent } from "@liveblocks/react";
import useInterval from "@/hooks/useInterval";
import { useEventListener } from "@liveblocks/react";
const Live = () => {
  const others = useOthers(); // Collects data of others in the room
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
 const broadcast = useBroadcastEvent();

  // store the reactions created on mouse click
  const [reactions, setReactions] = useState<Reaction[]>([]);
 const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
 

  // track the state of the cursor (hidden, chat, reaction, reaction selector)
  

  const setReaction = useCallback((reaction: string, x: number, y: number) => {
  updateMyPresence({
    cursor: { x, y },
  });

  setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: true });

  // Immediately trigger a reaction to show without delay
  setReactions((reactions) =>
    reactions.concat([
      {
        point: { x, y },
        value: reaction,
        timestamp: Date.now(),
      },
    ])
  );

  broadcast({ type: "reaction", x, y, value: reaction });

  // Reset after 5s to allow another reaction
  setTimeout(() => {
    setCursorState({ mode: CursorMode.Hidden });
  }, 5000);
}, [broadcast, updateMyPresence]);


  // Remove reactions that are not visible anymore (every 1 sec)
  

 // Broadcast the reaction to other users (every 100ms)
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      // concat all the reactions created on mouse click
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );

      // Broadcast the reaction to other users
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });
 

  // 🧠 Effect to listen to keyboard events
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  // 🖱️ Pointer move handler
  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();

      if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({
          cursor: { x, y },
        });
      }
    },
    [cursor, cursorState.mode, updateMyPresence]
  );

  // 🖱️ Pointer leave handler
  const handlePointerLeave = useCallback(() => {
    setCursorState({ mode: CursorMode.Hidden });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, [updateMyPresence]);

  // 🖱️ Pointer down handler
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({
        cursor: { x, y },
      });

      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, updateMyPresence]
  );

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      className="h-[100vh] w-full flex justify-center items-center text-center border-2 border-green-400"
    >
      <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1>
      {/* Render the reactions */}
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {/* If cursor is in reaction selector mode, show the reaction selector */}
        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector
  setReaction={(reaction, x, y) => {
    setReaction(reaction, x, y);
  }}
/>

        )}
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
