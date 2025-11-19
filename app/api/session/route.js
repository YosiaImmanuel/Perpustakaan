import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log("SESSION:", session); // ⬅ Debug

  if (!session) {
    return Response.json({ user: null }, { status: 200 });
  }

  return Response.json({ user: session.user }, { status: 200 });
}
