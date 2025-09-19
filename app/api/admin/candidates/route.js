import connectToDatabase from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
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
    const candidates = await Candidate.find({}).populate("electionId");
    return new Response(JSON.stringify(candidates), { status: 200 });
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
    const { electionId, name, photo, party } = await request.json();
    const candidate = new Candidate({ electionId, name, photo, party });
    await candidate.save();
    return new Response(JSON.stringify(candidate), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
