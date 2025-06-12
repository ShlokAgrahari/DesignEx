import fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import {CustomFabricObject} from "@/types/types"


export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    }
  );
};


export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  });
};



export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "Tap to Type");

    default:
      return null;
  }
};