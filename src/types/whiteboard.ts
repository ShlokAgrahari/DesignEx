export interface WhiteboardElement {
  id: string;
  type: "freedraw" | "text" | "shape" | "image";
  position: { x: number; y: number };
  size?: { width: number; height: number };
  points?: { x: number; y: number }[];
  text?: string;
  src?: string; 
  color?: string;
}
