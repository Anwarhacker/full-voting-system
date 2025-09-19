import connectToDatabase from "@/lib/mongodb";
import Election from "@/models/Election";
import Candidate from "@/models/Candidate";
import Voter from "@/models/Voter";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { id } = await params;

    const election = await Election.findById(id);
    if (!election) {
      return new Response(JSON.stringify({ error: "Election not found" }), {
        status: 404,
      });
    }

    const candidates = await Candidate.find({ electionId: id });

    const voter = await Voter.findById(user.id);
    const hasVoted = voter.hasVoted.get(id) || false;

    return new Response(JSON.stringify({ election, candidates, hasVoted }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
