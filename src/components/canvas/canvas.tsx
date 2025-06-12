import { CanvasMouseDown, CanvasMouseMove, CanvasMouseUp, CanvasObjectModified, CanvasObjectScaling, CanvasPathCreated, CanvasSelectionCreated, RenderCanvas } from "@/types/types";
import fabric, { FabricObject } from "fabric";
import { createSpecificShape } from "./shape";
import { v4 as uuid4 } from "uuid";
import { defaultNavElement } from "@/constants";
import { kMaxLength } from "buffer";

export const initializeFabric = ({fabricRef,canvasRef}:{fabricRef:React.RefObject<fabric.Canvas | null>;canvasRef: React.RefObject<HTMLCanvasElement | null>;}) =>{
    const element = document.getElementById("canvas");

    if(!canvasRef.current){
        return null;
    }
    const canvas = new fabric.Canvas(canvasRef.current,{
        width:element?.clientWidth,
        height:element?.clientHeight,
    });

    fabricRef.current = canvas;
    return canvas;
};


export const handleCanvasMouseDown = ({
    options,canvas,selectedShapeRef,isDrawing,shapeRef
}:CanvasMouseDown)=>{
    const pointer = canvas.getScenePoint(options.e);
    const target = canvas.findTarget(options.e);

    canvas.isDrawingMode= false;

    if(selectedShapeRef.current === "freeform"){
        isDrawing.current = true;
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = 5;
        }
        return;
    }

    canvas.isDrawingMode = false;

    if(target && (target.type === selectedShapeRef.current || target.type === "activeSelection")){
        isDrawing.current = false;
        canvas.setActiveObject(target);
        target.setCoords();
    }
    else{
        isDrawing.current = true;
        shapeRef.current = createSpecificShape(
            selectedShapeRef.current,
            pointer as any
        );
        if(shapeRef.current){
            canvas.add(shapeRef.current);
        }
    }
}   


export const handleCanvasMouseMove = ({
    options,canvas,isDrawing,selectedShapeRef,shapeRef,syncShapeInStorage
}:CanvasMouseMove) =>{
    if(!isDrawing){
        return;
    }

    if(selectedShapeRef.current === "freeform") return;
    canvas.isDrawingMode = false;

    const pointer = canvas.getScenePoint(options.e);

    switch (selectedShapeRef?.current) {
        case "rectangle":
            shapeRef.current?.set({
                width:pointer.x - (shapeRef.current?.left || 0),
                height:pointer.y - (shapeRef.current?.top || 0),
            });
            break;
        case "circle":
            shapeRef.current?.set({
                radius:Math.abs(pointer.x - (shapeRef.current?.left || 0)/2),
            });
            break;
        case "triangle":
            shapeRef.current?.set({
                width:pointer.x - (shapeRef.current?.left || 0),
                height:pointer.y - (shapeRef.current?.top || 0),
            });
            break;
        case "line":
            shapeRef.current?.set({
                x2:pointer.x,
                y2:pointer.y,
            });
            break;
        case "image":
            shapeRef.current?.set({
                width:pointer.x - (shapeRef.current?.left || 0),
                height:pointer.y - (shapeRef.current?.top || 0),
            });
            break;
        default:
            break;
        
    }

    canvas.renderAll();
    if(shapeRef.current?.objectId){
        syncShapeInStorage(shapeRef.current);
    }
}


export const handleCanvasMouseUp = ({
    canvas,isDrawing,shapeRef,activeObjectRef,selectedShapeRef,syncShapeInStorage,setActiveElement
}:CanvasMouseUp) =>{
    isDrawing.current = false;
    if(selectedShapeRef.current === "freeform"){
        return;
    }

    syncShapeInStorage(shapeRef.current);
    shapeRef.current = null;
    selectedShapeRef.current = null;
    activeObjectRef.current = null;

    if(!canvas.isDrawingMode){
        setTimeout(() => {
            setActiveElement(defaultNavElement);
        }, 700);
    }
}

export const handleCanvasObjectModified = ({
    options,syncShapeInStorage
}:CanvasObjectModified)=>{
    const target = options.target;
    if(!target){
        return ;
    }

    if(target?.type == "activeSelection"){
        target.forEachObject((obj:FabricObject) => {
        syncShapeInStorage(obj);
  });
    }
    else{
        syncShapeInStorage(target);
    }
}

export const handlePathCreated = ({
    options,syncShapeInStorage
}:CanvasPathCreated)=>{
    const path = options.path;
    if(!path ){
        return;
    }

    path.set({
        objectId:uuid4(),
    })
    syncShapeInStorage(path);
}



export const handleCanvasObjectMoving = ({
    options,
}:{options: fabric.TEvent<MouseEvent> & { target: fabric.Object };})=>{
    const target = options.target as fabric.Object;
    const canvas = target.canvas as fabric.Canvas;

    target.setCoords();

    if(target && target.left){
        target.left = Math.max(0,Math.min(target.left,(canvas.width || 0)-(target.getScaledWidth() || target.width || 0)));
    }

    if(target && target.top){
        target.top = Math.max(0,Math.min(target.top,(canvas.height || 0)-(target.getScaledHeight()||target.height ||0)));
    }


}

export const handleCanvasSelectionCreated = ({
    options,isEditingRef,setElementAttributes
}:CanvasSelectionCreated)=>{
    if(isEditingRef.current){
        return;
    }

    if(!options?.selected){
        return;
    }

    const selectedElement = options?.selected[0] as fabric.Object;
    if(selectedElement && options.selected.length === 1){
        const scaledWidth = selectedElement?.scaleX? selectedElement.width !* selectedElement?.scaleX: selectedElement?.width;
        const scaledHeight = selectedElement?.scaleY? selectedElement.height! * selectedElement?.scaleY :selectedElement?.height;

        setElementAttributes({
            width:scaledWidth?.toFixed(0).toString() || "",
            height:scaledHeight?.toFixed(0).toString() || "",
            fill:selectedElement?.fill?.toString() || "",
            stroke:selectedElement?.stroke?.toString() || "",
            //@ts-ignore
            fontSize:selectedElement?.fontSize || "",
            //@ts-ignore
            fontFamily:selectedElement?.fontFamily || "",
            //@ts-ignore
            fontWeight:selectedElement?.fontWeight || "",
        });
    }
}


export const handleCanvasObjectScaling = ({
    options,setElementAttributes,
}:CanvasObjectScaling)=>{

    const selectedElement = options.target;
    const scaledWidth = selectedElement?.scaleX
    ? selectedElement?.width! * selectedElement?.scaleX
    : selectedElement?.width;

    const scaledHeight = selectedElement?.scaleY
    ? selectedElement?.height! * selectedElement?.scaleY
    : selectedElement?.height;


    setElementAttributes((prev: any)=>({
        ...prev,
        width:scaledWidth?.toFixed(0).toString() || "",
        height:scaledHeight?.toFixed(0).toString() || "",
    }));
}






export const renderCanvas = async ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvas) => {

  fabricRef.current?.clear();

  for (const [objectId, objectData] of canvasObjects) {
    const enlivenedObjects = await fabric.util.enlivenObjects([objectData]);

    enlivenedObjects.forEach((enlivenedObj) => {
      if ('set' in enlivenedObj && 'left' in enlivenedObj && 'top' in enlivenedObj) {
        const fabricObj = enlivenedObj as fabric.Object;

       
        if (activeObjectRef.current?.objectId === objectId) {
          fabricRef.current?.setActiveObject(fabricObj);
        }

        fabricRef.current?.add(fabricObj);
      }
    });
  }

  fabricRef.current?.renderAll();
};


export const handleResize = ({
    canvas
}:{canvas:fabric.Canvas | null})=>{
    const canvasElement = document.getElementById("canvas");
    if(!canvasElement){
        return ;
    }

    if(!canvas){
        return;
    }
    canvas.setDimensions({
        width:canvasElement.clientWidth,
        height:canvasElement.clientHeight,
    })
}


export const handleCanvasZoom = ({
    options,canvas
}:{options:fabric.TEvent & { e: WheelEvent };
    canvas:fabric.Canvas;})=>{


        const delta = options.e.deltaY;
        let zoom = canvas.getZoom();
        const minZoom = 0.2;
        const maxZoom = 1;
        const zoomStep = 0.001;

        zoom = Math.min(Math.max(minZoom,zoom+delta*zoomStep),maxZoom);
        const zoomPoint = new fabric.Point(options.e.offsetX, options.e.offsetY);
        canvas.zoomToPoint(zoomPoint, zoom);


        options.e.preventDefault();
        options.e.stopPropagation();
}