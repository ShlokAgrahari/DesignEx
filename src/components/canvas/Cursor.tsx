// Cursor.tsx
import { memo } from "react";
import { useOther } from "@liveblocks/react/suspense";
import CursorSVG from "../../../public/CursorSVG";
import { connectionIdToColor } from "@/helper/util";

type CursorProps = {
  connectionId: number;
};

const Cursor = ({ connectionId }: CursorProps) => {
  const presence = useOther(connectionId, (user) => user.presence);

  if (!presence?.cursor) return null;

  const { x, y } = presence.cursor;
  const color = connectionIdToColor(connectionId);

  return (
    <div
      className="pointer-events-none absolute left-0 top-0"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      {/* Cursor SVG */}
      <CursorSVG color={color} />

      {/* Optional message */}
      {presence.message && (
        <div
          className="absolute left-2 top-5 px-4 py-2"
          style={{
            backgroundColor: color,
            borderRadius: 20,
          }}
        >
          <p className="whitespace-nowrap text-sm leading-relaxed text-white">
            {presence.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(Cursor);
