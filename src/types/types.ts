import { BaseUserMeta ,User} from "@liveblocks/client";
import fabric from "fabric";




export type Presence = any;

export type LiveCursorProps = {
  others:readonly User<Presence,BaseUserMeta>[];
}


export type CanvasMouseDown = {
  options:fabric.TEvent;
  canvas:fabric.Canvas;
  selectedShapeRef:any;
  isDrawing: React.RefObject<boolean>;
  shapeRef: React.RefObject<fabric.Object | null>;
}


export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}


export type CanvasMouseMove = {
  options: fabric.TEvent;
  canvas: fabric.Canvas;
  isDrawing: React.RefObject<boolean>;
  selectedShapeRef: any;
  shapeRef: any;
  syncShapeInStorage: (shape: fabric.Object) => void;
};


export type CanvasMouseUp = {
  canvas: fabric.Canvas;
  isDrawing: React.RefObject<boolean>;
  shapeRef: any;
  activeObjectRef: React.RefObject<fabric.Object | null>;
  selectedShapeRef: any;
  syncShapeInStorage: (shape: fabric.Object) => void;
  setActiveElement: any;
};


export type CanvasObjectModified = {
  options: (fabric.TEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  syncShapeInStorage: (shape: fabric.Object) => void;
}

export type CanvasPathCreated = {
  options: (fabric.TEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  syncShapeInStorage:(shape:fabric.Object)=>void;
}

export type Attributes = {
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};

export type CanvasSelectionCreated = {
  options: (fabric.TEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  isEditingRef: React.RefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
}


export type CanvasObjectScaling = {
  options: (fabric.TEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};


export type RenderCanvas = {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasObjects: any;
  activeObjectRef: any;
}

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
}

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  stroke: Color;
  opacity: number;
  cornerRadius?: number;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  stroke: Color;
  opacity: number;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  stroke: Color;
  opacity: number;
  points: number[][];
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  fill: Color;
  stroke: Color;
  opacity: number;
};

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer;

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.RightClick;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Dragging;
      origin: Point | null;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text;
    }
  | {
      mode: CanvasMode.Pencil;
    }
  | {
      mode: CanvasMode.Resizing;
      initialBounds: XYWH;
      corner: Side;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    };

export enum CanvasMode {
  None,
  Dragging,
  Inserting,
  Pencil,
  Resizing,
  Translating,
  SelectionNet,
  Pressing,
  RightClick,
}