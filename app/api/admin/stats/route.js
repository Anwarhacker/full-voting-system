import connectToDatabase from "@/lib/mongodb";
import Election from "@/models/Election";
import Candidate from "@/models/Candidate";
import Voter from "@/models/Voter";
import Vote from "@/models/Vote";
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

    const elections = await Election.countDocuments();
    const candidates = await Candidate.countDocuments();
    const voters = await Voter.countDocuments();
    const votes = await Vote.countDocuments();

    return new Response(
      JSON.stringify({ elections, candidates, voters, votes }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
