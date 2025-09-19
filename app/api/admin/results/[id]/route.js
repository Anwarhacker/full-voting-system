import connectToDatabase from "@/lib/mongodb";
import Vote from "@/models/Vote";
import Candidate from "@/models/Candidate";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { id } = await params;

    const votes = await Vote.find({ electionId: id }).populate("candidateId");
    const candidates = await Candidate.find({ electionId: id });

    const results = candidates.map((candidate) => {
      const voteCount = votes.filter(
        (vote) => vote.candidateId._id.toString() === candidate._id.toString()
      ).length;
      return {
        name: candidate.name,
        party: candidate.party,
        votes: voteCount,
      };
    });

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
