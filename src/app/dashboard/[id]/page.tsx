import { Room } from "@/components/liveblocks/Room";
import Canvas from "@/components/canvas/Canvas";
type ParamsType = { id: string };

export default async function Page({ params }: { params: ParamsType }) {
  const { id } =await params;

  return (
    <Room roomId={`room:${id}`}>
      {/* Add your actual content here */}
      <Canvas/>
      {/* <div>Welcome to Room: {id}</div> */}
      
    </Room>
  );
}
