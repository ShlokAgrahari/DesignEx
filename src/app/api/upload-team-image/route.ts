import { connect } from "@/dbConfig/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import Team from "@/models/team";
import { v4 as uuid } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  await connect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File;
  const teamId = formData.get("teamId") as string;

  if (!file || !teamId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mime = file.type;
    const dataUri = `data:${mime};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "team-projects",
      public_id: `${uuid()}-${file.name}`,
    });
    console.log("image linnk is",result.secure_url)
    // update image in Team model
    const updatedTeam = await Team.findOneAndUpdate(
      { _id:teamId },
      { $set: { projectImage: result.secure_url } },
      { new: true }
    );

    return NextResponse.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
