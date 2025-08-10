"use client";
import { CursorMode, CursorState } from "@/types/types";
import CursorChat from "./CursorChat";
import html2canvas from 'html2canvas';
import { useCanRedo, useCanUndo, useHistory, useMutation, useMyPresence, useOthers, useSelf, useStorage } from "@liveblocks/react";
import { colorToCss, findIntersectionLayersWithRectangle, penPointsToPathPayer, pointerEventToCanvasPoint, resizeBounds } from "@/helper/util";
import LayerComponent from "./LayerComponent";
import {
  Camera,
  CanvasMode,
  EllipseLayer,
  Layer,
  LayerType,
  Point,
  RectangleLayer,
  TextLayer,
  Side,
  CanvasState,
  XYWH,
} from "@/types/types";
import { useLoading } from "@/context/LoadingContext";
import { nanoid } from "nanoid";
import { LiveObject, User } from "@liveblocks/client";
import { useEffect, useState, useCallback } from "react";
import ToolsBar from "../toolsbar/ToolsBar";
import Path from "./Path";
import { useRoom } from "@liveblocks/react";
import SelectionBox from "./SelectionBox";
import useDeleteLayers from "@/hooks/useDeleteLayers";
import SelectionTools from "./SelectionTools";
import Sidebars from "../sidebars/Sidebars";
import MultiplayerGuides from "./MultiplayerGuides";
import LiveCursors from "./LiveCursors";



const MAX_LAYERS = 100;

export default function Canvas({
  roomName,
  roomId,
  othersWithAccessToRoom,
}: {
  roomName: string;
  roomId: string;
  othersWithAccessToRoom: User[];
}) {
    const room = useRoom();
  const others = useOthers();
  const userCount = others.length;
  const roomColor = useStorage((root) => root.roomColor);
  const layerIds = useStorage((root) => root.layerIds);
  const layers = useStorage((root) => root.layers); // Needed to check if storage is ready
  const pencilDraft=useSelf((me)=>me.presence.pencilDraft)
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [canvasState, setState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [leftIsMinimized, setLeftIsMinimized] = useState(false);
  const deleteLayers = useDeleteLayers();
  const presence=useMyPresence();
  const storageReady = !!(layerIds && layers);
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  console.log(presence[0].selection);
  const [cursorState, setCursorState] = useState<CursorState>({
  mode: CursorMode.Hidden,
});
const { setLoading } = useLoading();

   const [{ cursor }, setMyPresence] = useMyPresence() as any;



  const selectAllLayers = useMutation(
    ({ setMyPresence }) => {
      if (layerIds) {
        setMyPresence({ selection: [...layerIds] }, { addToHistory: true });
      }
    },
    [layerIds],
  );

  useEffect(()=>{
    function onKeyDown(e:KeyboardEvent){
      const activeElement=document.activeElement;
      const isInputField=  activeElement && (activeElement.tagName==="INPUT" || activeElement.tagName==="TEXTAREA");

      if(isInputField)return;

      switch(e.key){
        case "Backspace":
          deleteLayers();
          break;
        case "z":
          if(e.ctrlKey || e.metaKey){
            if(e.shiftKey){
              history.redo();
            }else{
              history.undo();
            }
          }
          break;
        case "a":
          if(e.ctrlKey || e.metaKey){
            selectAllLayers();
            break;
          }
      }
    }

    document.addEventListener("keydown",onKeyDown)

    return ()=>{
      document.removeEventListener("keydown",onKeyDown)
    }
  },[])





const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history],
  );




  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId],
          },
          { addToHistory: true },
        );
      }

      if (e.nativeEvent.button === 2) {
        setState({ mode: CanvasMode.RightClick });
      } else {
        const point = pointerEventToCanvasPoint(e, camera);
        setState({ mode: CanvasMode.Translating, current: point });
      }
    },
    [camera, canvasState.mode, history],
  );



  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Ellipse | LayerType.Path | LayerType.Rectangle | LayerType.Text,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");

      if (liveLayers.size >= MAX_LAYERS) return;

      const layerId = nanoid();
      let layer: LiveObject<Layer> | null = null;

      if (layerType === LayerType.Rectangle) {
        layer = new LiveObject<RectangleLayer>({
          type: LayerType.Rectangle,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      } else if (layerType === LayerType.Ellipse) {
        layer = new LiveObject<EllipseLayer>({
          type: LayerType.Ellipse,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      } else if (layerType === LayerType.Text) {
        layer = new LiveObject<TextLayer>({
          type: LayerType.Text,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fontSize: 16,
          text: "Text",
          fontWeight: 200,
          fontFamily: "Arial",
          stroke: { r: 217, g: 217, b: 217 },
          fill: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      }

      if (layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
        setState({mode:CanvasMode.None});
      }
    },
    []
  );
  
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: { r: 217, g: 217, b: 217 },
      });
    },
    [],
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft === null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode],
  );
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
      zoom: camera.zoom,
    }));
  }, []);
const insertPath = useMutation(({ storage, self, setMyPresence }) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (
      pencilDraft === null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(
        penPointsToPathPayer(pencilDraft, { r: 217, g: 217, b: 217 }),
      ),
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);
    setMyPresence({ pencilDraft: null });
    setState({ mode: CanvasMode.Pencil });
  }, []);
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState],
  );


  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
    // Ignore if typing in an input or textarea
    if (
      (e.target as HTMLElement)?.tagName === "INPUT" ||
      (e.target as HTMLElement)?.tagName === "TEXTAREA"
    ) {
      return;
    }
  }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        console.log("chat triggered");
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
        console.log("done");
      } else if (e.key === "Escape") {
        setMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } 
    };

    // const onKeyDown = (e: KeyboardEvent) => {
    //   if (e.key === "/") {
    //     e.preventDefault();
    //   }
    // };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setMyPresence,setCursorState]);

  // Listen to mouse events to change the cursor state
  



  const onPointerDown = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Dragging) {
        setState({ mode: CanvasMode.Dragging, origin: point });
        return;
      }

      if (canvasState.mode === CanvasMode.Inserting) return;

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setState, startDrawing],
  );
const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get("layers");

      if (self.presence.selection.length > 0) {
        const layer = liveLayers.get(self.presence.selection[0]!);
        if (layer) {
          layer.update(bounds);
        }
      }

      // Update layers to set the new width and height of the layer
    },
    [canvasState],
  );

const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);


  
  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);

const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      if (layerIds) {
        const layers = storage.get("layers").toImmutable();
        setState({
          mode: CanvasMode.SelectionNet,
          origin,
          current,
        });
        const ids = findIntersectionLayersWithRectangle(
          layerIds,
          layers,
          origin,
          current,
        );
        setMyPresence({ selection: ids });
      }
    },
    [layerIds],
  );


   const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
    setCursorState({mode:CursorMode.Hidden})
  }, []);

  const onPointerMove=useMutation(
    ({setMyPresence},e:React.PointerEvent)=>{
        const point=pointerEventToCanvasPoint(e,camera);

         if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(point, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(point, canvasState.origin);
      } else if (
        canvasState.mode === CanvasMode.Dragging &&
        canvasState.origin !== null
      ) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;

        setCamera((camera) => ({
          x: e.clientX-e.currentTarget.getBoundingClientRect().x,
          y: e.clientY - e.currentTarget.getBoundingClientRect().y,
          zoom: camera.zoom,
        }));
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(point);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(point, e);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(point);
      }
      setMyPresence({cursor:point});
    },
    [
      camera,
      canvasState,
      translateSelectedLayers,
      continueDrawing,
      resizeSelectedLayer,
      updateSelectionNet,
      startMultiSelection,
      storageReady
    ],
  )


  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      if (canvasState.mode === CanvasMode.RightClick) return;

      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else if (canvasState.mode === CanvasMode.Dragging) {
        setState({ mode: CanvasMode.Dragging, origin: null });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else {
        setState({ mode: CanvasMode.None });
      }
      history.resume();
    },
    [canvasState, setState, insertLayer, unselectLayers, history],
  );


  useEffect(() => {
    if (!room || !storageReady) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [room, storageReady, setLoading]);

  if (!room || !storageReady) {
    // Optionally also return null or skeleton while loading
    return null;
  }

  return (
    
    <div className="flex h-screen w-full">
      {/* <div>There are {userCount} other user(s) online</div>; */}
      <main className="fixed left-0 right-0 h-screen overflow-y-auto">
      {cursor && (
        <CursorChat
        cursor={cursor}
        cursorState={cursorState}
        setCursorState={setCursorState}
        updateMyPresence={setMyPresence}/>
      )}


<LiveCursors />


        {/* <div>There are {userCount} other user(s) online</div>; */}
        <div
          style={{
            backgroundColor: roomColor ? colorToCss(roomColor) : "#1e1e1e",
          }}
          className="h-full w-full touch-none"
        >
          <SelectionTools camera={camera} canvasMode={canvasState.mode}/>
          <div id="canvas-capture" className="w-full h-full">
            <svg onWheel={onWheel} onPointerUp={onPointerUp}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="w-full h-full">
            <g  style={{transform:`translate(${camera.x}px,${camera.y}px) scale(${camera.zoom})`}}>
              {layerIds?.map((layerId) => (
                <LayerComponent key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown} />
              ))}
              <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown}/>
              <MultiplayerGuides/>
              {pencilDraft !== null && pencilDraft.length > 0 && (
                <Path
                  x={0}
                  y={0}
                  opacity={100}
                  fill={colorToCss({ r: 217, g: 217, b: 217 })}
                  points={pencilDraft}
                />
              )}
            </g>
          </svg>
          </div>
          
        </div>
      </main>
      <ToolsBar canvasState={canvasState}
        setCanvasState={(newState) => setState(newState)}
        zoomIn={() => {
          setCamera((camera) => ({ ...camera, zoom: camera.zoom + 0.1 }));
        }}
        zoomOut={() => {
          setCamera((camera) => ({ ...camera, zoom: camera.zoom - 0.1 }));
        }}
        canZoomIn={camera.zoom < 2}
        canZoomOut={camera.zoom > 0.5}
        redo={() => history.redo()}
        undo={() => history.undo()}
        canRedo={canRedo}
        canUndo={canUndo}/>
       


        <Sidebars roomName={roomName}
        roomId={roomId}
        othersWithAccessToRoom={othersWithAccessToRoom} leftIsMinimized={leftIsMinimized} setLeftIsMinimized={setLeftIsMinimized}/>
        
    </div>
  );
}
