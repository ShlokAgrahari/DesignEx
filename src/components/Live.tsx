import React from 'react'
import LiveCursor from './Cursor/LiveCursor'
import { useMyPresence, useOthers } from '@liveblocks/react';

const Live = () => {
    const others = useOthers();
    const [{cursor},updateMyPresence] = useMyPresence() as any;
    return (
        <div 
            onPointerMove={(event) => {
            updateMyPresence({
                cursor: {
                    x: Math.round(event.clientX),
                    y: Math.round(event.clientY),
                },
            });
            }}
            onPointerLeave={() =>
                updateMyPresence({
                    cursor: null,
                })
            }
            className='h-full w-full bg-amber-100'
        >
            <canvas/>
            <LiveCursor others = {others} />
        </div>
    )
}

export default Live