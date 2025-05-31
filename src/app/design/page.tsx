"use client";

import { useRef, useState } from "react";
import { Room } from "../Room";
import { CollaborativeApp } from "../CollaborativeApp";
import Live from "@/components/liveblocks/Live";
import Navbar from "@/components/liveblocks/Navbar";
import { ActiveElement } from "@/types/types"; // adjust the path as needed

export default function Page() {
  const [activeElement, setActiveElement] = useState<ActiveElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element);
  };

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <Room>
      <CollaborativeApp />
      <Navbar
        activeElement={activeElement}
        imageInputRef={imageInputRef}
        handleImageUpload={handleImageUpload}
        handleActiveElement={handleActiveElement}
      />
      <Live />
    </Room>
  );
}
