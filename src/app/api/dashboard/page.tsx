// // app/dashboard/page.tsx (or wherever your dashboard route is)

// import { getUserRooms } from "@/lib/getRooms";
// import Dashboard from "@/app/dashboard/page"
// import { getServerSession } from "next-auth";
// import { cookies } from "next/headers";


// export default async function DashboardPage() {
//   const cookieStore = cookies();
//       const userCookie = (await cookieStore).get("user")?.value;
  
//       if (!userCookie) {
//           throw new Error("User not logged in (cookie missing)");
//       }
  
//       const user = JSON.parse(userCookie);
//       console.log(user);
//       if(!user?.id){
//           throw new Error("user not logged in");
//       }

//   const { ownedRooms, roomInvites } = await getUserRooms(user.id);

//   return (
//     <Dashboard
//       user={{
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         ownedRooms,
//         roomInvites,
//       }}
//     />
//   );
// }
