"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Room from "@/models/room";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useMemo, useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { updateRoomTitle,deleteRoom } from "@/actions/rooms";
export default function RoomsView({
  ownedRooms,
  roomInvites,
}: {
  ownedRooms: any[];
  roomInvites: any[];
}){
  const [localOwnedRooms, setLocalOwnedRooms] = useState(ownedRooms);
const [localRoomInvites, setLocalRoomInvites] = useState(roomInvites);

   const [viewMode,setViewMode]=useState("owns");
   const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const outerDivRef = useRef<HTMLDivElement>(null);
  const PASTEL_COLORS = [
  "rgb(255, 182, 193)", // pink
  "rgb(176, 224, 230)", // powder blue
  "rgb(221, 160, 221)", // plum
  "rgb(188, 143, 143)", // rosy brown
  "rgb(152, 251, 152)", // pale green
  "rgb(238, 232, 170)", // pale goldenrod
  "rgb(230, 230, 250)", // lavender
  "rgb(255, 218, 185)", // peach
];


  
console.log("rooms view",roomInvites)
  const filteredRooms = useMemo(() => {
  if (viewMode === "owns") {
    return localOwnedRooms;
  } else if (viewMode === "shared") {
    return localRoomInvites;
  }
  return [];
}, [viewMode, localOwnedRooms, localRoomInvites]);


  const roomColors = useMemo(() => {
  return filteredRooms
    .filter((room): room is { _id: string } => !!room?._id)
    .map((room, index) => ({
      id: room._id,
      color: PASTEL_COLORS[index % PASTEL_COLORS.length],
    }));
}, [filteredRooms]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        outerDivRef.current &&
        !outerDivRef.current.contains(e.target as Node)
      ) {
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTitleUpdate = (roomId: string, newTitle: string) => {
  if (viewMode === "owns") {
    setLocalOwnedRooms(prevRooms =>
      prevRooms.map(room =>
        room._id === roomId ? { ...room, title: newTitle } : room
      )
    );
  }
};
useEffect(() => {
  setLocalOwnedRooms(ownedRooms);
}, [ownedRooms]);

useEffect(() => {
  setLocalRoomInvites(roomInvites);
}, [roomInvites]);

  console.log("owned rooms are",ownedRooms);
  console.log("shared rooms are",filteredRooms);
   console.log(filteredRooms,viewMode,ownedRooms);
    return (
  <div  ref={outerDivRef} className="flex flex-col gap-5">
    <div className="flex gap-1">
      <ViewModeButton
        onSelect={() => setViewMode("owns")}
        active={viewMode === "owns"}
        text="My project"
      />
      <ViewModeButton
        onSelect={() => setViewMode("shared")}
        active={viewMode === "shared"}
        text="Shared files"
      />
    </div>
   
   <div className="flex flex-wrap gap-4">
    {filteredRooms.map((room) => {
  const roomData = room;

  if (!roomData || !roomData._id) return null;

  const roomColor =
    roomColors.find((rc) => rc.id === roomData._id)?.color ?? PASTEL_COLORS[0];

  return (
    <SingleRoom
      key={roomData._id}
      id={roomData._id}
      title={roomData.title}
      description={`Created ${
        roomData.createdAt?.toDate?.().toDateString?.() ??
        new Date(roomData.createdAt).toDateString?.() ??
        "Unknown"
      }`}
      color={roomColor}
      selected={selected === roomData._id}
      select={() => setSelected(roomData._id)}
      navigateTo={() => router.push("/dashboard/" + roomData._id)}
      canEdit={viewMode === "owns"}
      mode={viewMode}
      onTitleUpdate={handleTitleUpdate}
    />
  );
})}

   </div>


  </div>
);

    
}

function SingleRoom({
  id,
  title,
  description,
  color,
  selected,
  select,
  navigateTo,
  canEdit,
  mode,
  onTitleUpdate
}: {
  id: string;
  title: string;
  description: string;
  color: string;
  selected: boolean;
  select: () => void;
  navigateTo: () => void;
  canEdit: boolean;
  mode:string;
  onTitleUpdate: (id: string, newTitle: string) => void;

}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsEditing(false);
      await updateRoomTitle(editedTitle, id);
      onTitleUpdate(id, editedTitle); // update in UI
    }
  };

  const handleBlur = async () => {
    setIsEditing(false);
    await updateRoomTitle(editedTitle, id);
    onTitleUpdate(id, editedTitle); // update in UI
  };

  const confirmDelete = async () => {
    await deleteRoom(id);
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && selected && !isEditing && mode==="owns") {
        e.preventDefault();
        setShowConfirmationModal(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, id, isEditing]);

  return (
    <div className="flex flex-col gap-0.5">
      <div
        onDoubleClick={navigateTo}
        onClick={select}
        style={{ backgroundColor: color }}
        className={`flex h-56 w-96 cursor-pointer items-center justify-center rounded-md ${selected ? "border-2 border-blue-500" : "border border-[#e8e8e8]"}`}
      >
        <p className="text-md select-none font-medium">{title}</p>
      </div>
      {isEditing  ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus
          className="w-full"
        />
      ) : (
        <div>
          <p
          onClick={() => setIsEditing(true)}
          className="mt-2 select-none text-[13px] font-medium"
        >
          {title}
        </p>
        
        </div>
        
      )}
      <p className="select-none text-[10px] text-gray-400">{description}</p>
      <ConfirmModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this room?"
      />
    </div>
  );
}


function ViewModeButton({
  onSelect,
  active,
  text,
}: {
  onSelect: () => void;
  active: boolean;
  text: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`select-none rounded-md p-1 px-2 text-[11px] hover:bg-gray-100 ${active ? "bg-gray-100" : ""}`}
    >
      {text}
    </button>
  );
}