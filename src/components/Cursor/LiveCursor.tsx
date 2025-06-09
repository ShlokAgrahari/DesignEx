import { LiveCursorProps } from '@/types/types'
import React from 'react'
import Cursor from './Cursor';
import { COLORS } from '@/constants';

const LiveCursor = ({others}:LiveCursorProps) => {
  return (
    <>
        {others.map(({connectionId,presence})=>{
            if(presence.cursor === null){
                return null;
            }
            return (
                <Cursor
                    key={connectionId}
                    colors = {COLORS[Number(connectionId)% COLORS.length]}
                    x = {presence.cursor.x}
                    y = {presence.cursor.y}    
                />
            )
        })
        }
    </>
  )
}

export default LiveCursor