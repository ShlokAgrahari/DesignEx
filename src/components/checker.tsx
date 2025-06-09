"use client";

import { useOthers, useStatus } from "@liveblocks/react";

export function Checker() {

  const others = useOthers();
  const count = others.length;
  return (
    <div className="text-sm text-gray-700 z-10">
      <div className="h-[500px] w-3/5 bg-amber-50">
        
      </div>
    </div>
  );
}