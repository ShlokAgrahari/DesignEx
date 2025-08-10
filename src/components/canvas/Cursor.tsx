// Cursor.tsx
import { memo } from "react";
import CursorSVG from "../../../public/CursorSVG";

type CursorProps = {
  x: number;
  y: number;
  color: string;
  message?: string;
};

const Cursor = ({ x, y, color, message }: CursorProps) => {
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
      {message && (
        <div
          className="absolute left-2 top-5 px-4 py-2"
          style={{
            backgroundColor: color,
            borderRadius: 20,
          }}
        >
          <p className="whitespace-nowrap text-sm leading-relaxed text-white">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(Cursor);
