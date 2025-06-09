"use client";

import { RoomWrapper } from "@/components/RoomWrapper";
import { useParams } from "next/navigation";
import { useStatus } from "@liveblocks/react";
import { Checker } from "@/components/checker";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import { useRef } from "react";
import * as fabric from 'fabric';



export default function WorkPage() {
    const params = useParams();
    const teamId = params.teamid;
    const canvaRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const isDrawing = useRef(false);
    


    if(!teamId){
        return( <h1>not found</h1>);
    }
    return (
        <RoomWrapper roomId={teamId.toString()}>
            <main className="flex flex-col h-screen overflow-hidden">
                <Navbar/>
                <section className="flex flex-row h-full">
                    <LeftSideBar/>
                    <Live/>
                    <RightSideBar/>
                </section> 
            </main>
        </RoomWrapper>
    );
}