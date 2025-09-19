import connectToDatabase from "@/lib/mongodb";
import Election from "@/models/Election";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const elections = await Election.find({});
    return new Response(JSON.stringify(elections), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { title, description, startTime, endTime } = await request.json();
    const election = new Election({ title, description, startTime, endTime });
    await election.save();
    return new Response(JSON.stringify(election), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
