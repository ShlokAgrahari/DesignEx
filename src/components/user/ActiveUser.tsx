import { useOthers, useSelf } from "@liveblocks/react";
import { Avatar } from "./Avatar";
import { useMemo } from "react";

const ActiveUser = () => {
  const users = useOthers();
  const currentUser = useSelf();
  console.log(currentUser);
  const hasMoreUsers = users.length > 3;

  const memoized = useMemo(()=>{
    return(
        <main className="flex h-full w-full select-none place-content-center place-items-center">
            <div className="flex pl-3">
                {currentUser && (
                    <div className="relative ml-8 first:ml-0">
                        <Avatar name="You" />
                    </div>
                )}

                {users.slice(0, 3).map(({ connectionId, info }) => {
                return (
                    <div className="-ml-3">
                        <Avatar key={connectionId} name={info.name} />
                    </div>
                );
            })}

            {hasMoreUsers && <div className="w-[56px] h-[56px] flex justify-center items-center text-white bg-slate-400 border-4 rounded-full border-white">+{users.length - 3}</div>}

            
            </div>
        </main>
    )
  },[users.length])

  return memoized;
}

export default ActiveUser;