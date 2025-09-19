import connectToDatabase from "@/lib/mongodb";
import Election from "@/models/Election";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const now = new Date();
    const elections = await Election.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
    });
    return new Response(JSON.stringify(elections), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
