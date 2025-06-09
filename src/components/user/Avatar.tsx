import React from "react";




const IMAGE_SIZE = 48;

export function Avatar({name }: {name: string }) {

  return (
    
  <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-4 border-white bg-gray-400 -ml-3 group">
    <img
      src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
      width={30}
      height={30}
      alt={name}
      className="w-full h-full rounded-full"
    />
    <span className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black rounded px-2 py-1 whitespace-nowrap z-10">
      {name}
    </span>
  </div>
);


}